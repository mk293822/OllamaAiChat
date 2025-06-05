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

    public function chat($prompt, $conversation_id, $request)
    {
        try {
            return new StreamedResponse(function () use ($prompt, $conversation_id, $request) {
                $this->createMessage($conversation_id, MessageRoleEnum::User, $prompt);
                $messages = $this->getMessages($conversation_id, $request);

                $serviceResponse = Http::withHeaders([
                    'Content-Type' => 'application/json',
                ])->withOptions([
                    'stream' => true,
                ])->post('http://localhost:11434/api/chat', [
                    'model' => env('OLLAMA_MODAL'),
                    'messages' => $messages,
                    'stream' => true,
                ]);

                $body = $serviceResponse->getBody();
                $assistantReply = '';

                while (!$body->eof()) {
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

                // Save the complete assistant message once at the end
                $this->createMessage($conversation_id, MessageRoleEnum::Assistant, $assistantReply);
            }, 200, [
                'Content-Type' => 'text/event-stream',
                'X-Convo-Id'   => $conversation_id,
                'Cache-Control' => 'no-cache'
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getMessages($conversation_id, $request)
    {
        try {
            $conversation = Conversation::findOrFail($conversation_id);

            if ($conversation) {
                return MessageResource::collection($conversation->messages)->toArray($request);
            }
            return [];
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    protected function createMessage($conversation_id, $role, $content)
    {
        try {
            DB::beginTransaction();

            if ($conversation_id) {
                Message::create([
                    'conversation_id' => $conversation_id,
                    'role' => $role,
                    'content' => $content
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
