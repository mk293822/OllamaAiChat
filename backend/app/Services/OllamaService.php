<?php

namespace App\Services;

use App\Enums\MessageRoleEnum;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OllamaService
{

    protected $messageService;

    public function __construct(MessageService $message)
    {
        $this->messageService = $message;
    }

    public function chat($prompt, $conversation_id, $request)
    {
        ignore_user_abort(true);
        try {
            return new StreamedResponse(function () use ($prompt, $conversation_id, $request) {
                $this->handleChatStream($prompt, $conversation_id, $request);
            }, 200, [
                'Content-Type' => 'text/event-stream',
                'X-Convo-Id'   => $conversation_id,
                'Cache-Control' => 'no-cache'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function handleChatStream($prompt, $conversation_id, $request)
    {
        if (connection_aborted()) return;

        // Create user message
        $this->messageService->createMessage($conversation_id, MessageRoleEnum::User, $prompt);

        // Fetch messages to send to Ollama
        $messages = $this->messageService->getMessages($conversation_id, $request);

        // Send to Ollama
        $serviceResponse = $this->sendChatRequest($messages);

        // Stream assistant response
        $assistantReply = $this->streamAssistantReply($serviceResponse, $conversation_id);

        // Save assistant response
        $this->messageService->createMessage($conversation_id, MessageRoleEnum::Assistant, $assistantReply);
    }


    private function sendChatRequest($messages)
    {
        return Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->withOptions([
            'stream' => true,
        ])->post('http://localhost:11434/api/chat', [
            'model' => env('OLLAMA_MODAL'),
            'messages' => $messages,
            'stream' => true,
        ]);
    }

    private function streamAssistantReply($serviceResponse, $conversation_id)
    {
        $body = $serviceResponse->getBody();
        $assistantReply = '';

        while (!$body->eof()) {
            if (connection_aborted()) {
                break;
            }

            $chunk = $body->read(512);

            foreach (explode("\n", $chunk) as $line) {
                $line = trim($line);
                if (!$line) continue;

                $json = json_decode($line, true);

                if (isset($json['message']['content'])) {
                    $content = $json['message']['content'];
                    $assistantReply .= $content;

                    echo $content;
                    ob_flush();
                    flush();
                }
            }
        }

        return $assistantReply;
    }
}
