<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OllamaService
{
    public function chat($prompt)
    {

        try {
            $response = new StreamedResponse(function () use ($prompt) {
                $messages = session('chat_history', []);

                $messages[] = ['role' => 'user', 'content' => $prompt];

                $serviceResponse = Http::withHeaders([
                    'Content-Type' => 'application/json',
                ])->withOptions([
                    'stream' => true,
                ])->post('http://localhost:11434/api/chat', [
                    'model' => 'gemma3:1b',
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
                $messages[] = ['role' => 'assistant', 'content' => $assistantReply];
                session(['chat_history' => $messages]);
                Log::info(['mes' => session('chat_history')]);
            });

            $response->headers->set('Content-Type', 'text/event-stream');
            return $response;
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}
