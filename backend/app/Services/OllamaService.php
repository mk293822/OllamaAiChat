<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OllamaService
{
    public function chat($prompt)
    {
        try{
            $response = new StreamedResponse(function () use ($prompt) {
            // Making the request to the external service
            $serviceResponse = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->withOptions([
                'stream' => true,  // Enable streaming
            ])->post('http://localhost:11434/api/chat', [
                'model' => 'gemma3:1b',
                'messages'=> [
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'stream' => true,
            ]);

            $body = $serviceResponse->getBody();
            while (!$body->eof()) {
                $chunk = $body->read(512);  // Read in chunks

                // Split lines and decode
                foreach (explode("\n", $chunk) as $line) {
                    $line = trim($line);
                    if (!$line) continue;

                    $json = json_decode($line, true);

                    // Ollama streaming sends partial chunks with 'message'
                    if (isset($json['message']['content'])) {
                        echo $json['message']['content'];
                        ob_flush();
                        flush();
                    }
                }
            }
        });
    } catch (\Exception $e) {
        // Optional: log error or exit cleanly
        echo "\n\n[Server stopped: {$e->getMessage()}]";
    }


        // Set appropriate headers for streaming
        $response->headers->set('Content-Type', 'text/plain');
        $response->headers->set('Cache-Control', 'no-cache');

        return $response;
    }

}
