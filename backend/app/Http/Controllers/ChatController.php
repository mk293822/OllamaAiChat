<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Services\ConversationService;
use App\Services\OllamaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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
            try {
                $conversation = Conversation::create([
                    'title' => 'Test Conversation',
                    'user_id' => 1
                ]);
                $conversation_id = $conversation->id;
            } catch (\Exception $e) {
                Log::error('Conversation creation failed: ' . $e->getMessage());
                return response()->json(['error' => 'Conversation creation failed'], 500);
            }
        }

        Log::info('mes', ['mes' => $conversation_id]);

        // Call your OllamaService to get the streamed response
        return $this->ollama->chat($prompt, $conversation_id);
    }
}
