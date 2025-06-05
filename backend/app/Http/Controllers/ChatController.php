<?php

namespace App\Http\Controllers;

use App\Http\Resources\ConversationResource;
use App\Models\Conversation;
use App\Services\ConversationService;
use App\Services\MessageService;
use App\Services\OllamaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    protected $ollama;
    protected $conversationService;
    protected $messageService;

    public function __construct(OllamaService $ollama, ConversationService $conversation, MessageService $message)
    {
        $this->ollama = $ollama;
        $this->conversationService = $conversation;
        $this->messageService = $message;
    }

    public function ask(Request $request, string|null $conversation_id)
    {
        $request->validate([
            'text' => ['string', 'required'],
        ]);

        if ($request->user() && $request->user()->id !== Auth::id()) {
            abort(403);
        }

        $prompt = $request->get('text', '');

        if (!$conversation_id || $conversation_id === "null") {
            $conversation_id = $this->conversationService->createConversation($request->user()->id, $prompt)->id;
        }

        // Call your OllamaService to get the streamed response
        return $this->ollama->chat($prompt, $conversation_id, $request);
    }


    public function getMessages(Request $request, $conversation_id = null)
    {
        $conversations = $this->conversationService->getConversationsByDate($request);

        return response()->json([
            'conversations' => $conversations,
            'messages' => (is_string($conversation_id) && $conversation_id !== "" && $conversation_id !== "null")
                ? $this->messageService->getMessages($conversation_id, $request)
                : null,
        ]);
    }

    public function deleteConversation($conversation_id)
    {
        $this->conversationService->deleteConversation($conversation_id);

        return response()->json(['success' => 'Conversation Deleted Successfully']);
    }

    public function archiveConversation($conversation_id)
    {
        $conversation = Conversation::findOrFail($conversation_id);

        $conversation->archived = !$conversation->archived;
        $conversation->save();

        return response()->json(['conversation' => $conversation]);
    }
}
