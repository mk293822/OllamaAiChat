<?php

namespace App\Services;

use App\Models\Conversation;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ConversationService
{

    public function createCoversation($id, string $prompt = "")
    {
        try {
            // set the titile accroing to user's first prompt content with ollama
            $titleResponse = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post('http://localhost:11434/api/chat', [
                'model' => 'gemma3:1b',
                'messages' => [
                    ['role' => 'user', 'content' => "Give a short title for this prompt: '$prompt'"]
                ],
                'stream' => false,
            ]);

            // 🔹 Extract the title
            $ollamaResponse = $titleResponse->json();
            $title = $ollamaResponse['message']['content'] ?? 'New Conversation';

            return Conversation::create([
                'title' => $title,
                'user_id' => $id
            ]);
        } catch (\Exception $e) {
            Log::error('Conversation creation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Conversation creation failed'], 500);
        }
    }
}
