<?php

namespace App\Http\Controllers;

use App\Http\Resources\ConversationResource;
use App\Models\Conversation;
use App\Services\ConversationService;
use Illuminate\Http\Request;

class ConversationController extends Controller
{

    protected $conversationService;

    public function __construct(ConversationService $conversationService)
    {
      $this->conversationService = $conversationService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $conversations = $this->conversationService->getConversationsByDate($request);
        $archivedConversations = $this->conversationService->getConversationsByDate($request, true);

        return response()->json([
            'conversations'=> $conversations,
            'archivedConversations' => $archivedConversations
        ]);
    }

    public function getConversation(Request $request, $conversation_id){
        $conversation = Conversation::findOrFail($conversation_id);

        return response()->json([
            'conversation' => (new ConversationResource($conversation))->toArray($request),
        ]);
    }


    public function archive(Request $request, $conversation_id)
    {
        $conversation = Conversation::findOrFail($conversation_id);

        $conversation->archived = !$conversation->archived;
        $conversation->save();

        return response()->json(['conversation' => (new ConversationResource($conversation))->toArray($request)]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($conversation_id)
    {
        $this->conversationService->deleteConversation($conversation_id);

        return response()->json(['success' => 'Conversation Deleted Successfully']);
    }
}
