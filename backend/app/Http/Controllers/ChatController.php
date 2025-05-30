<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Services\OllamaService;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    protected $ollama;

    public function __construct(OllamaService $ollama)
    {
        $this->ollama = $ollama;
    }

    public function createCoversation(Request $request)
    {
        $conversation = Conversation::create([
            'title' => 'Conversation Test',
            'user_id' => $request->user->id,
        ]);

        return response()->json(['conversation' => $conversation]);
    }

    public function ask(Request $request)
    {

        $promp = $request->get('text', '');

        return $this->ollama->chat($promp);
    }
}
