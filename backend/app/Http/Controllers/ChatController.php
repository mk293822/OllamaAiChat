<?php

namespace App\Http\Controllers;

use App\Services\ConversationService;
use App\Services\OllamaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    protected $ollama;
    protected $conversationService;

    public function __construct(OllamaService $ollama, ConversationService $conversation)
    {
        $this->ollama = $ollama;
        $this->conversationService = $conversation;
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
            $conversation_id = $this->conversationService->createCoversation(1)->id;
        }

        // Call your OllamaService to get the streamed response
        return $this->ollama->chat($prompt, $conversation_id, $request);
    }


    public function getMessages(Request $request, $conversation_id)
    {
        return response()->json(['messages' => $this->ollama->getMessages($conversation_id, $request)]);
    }
}
