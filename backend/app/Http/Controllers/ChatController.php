<?php

namespace App\Http\Controllers;

use App\Services\OllamaService;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    protected $ollama;

    public function __construct(OllamaService $ollama)
    {
        $this->ollama = $ollama;
    }

    public function ask(Request $request)
    {

        $promp = $request->get('text', '');

        return $this->ollama->chat($promp);
    }
}
