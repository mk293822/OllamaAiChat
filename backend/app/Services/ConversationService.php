<?php

namespace App\Services;

use App\Models\Conversation;

class ConversationService
{

    public function createCoversation($id)
    {
        return Conversation::create([
            'title' => 'Conversation test',
            'user_id' => $id,
        ]);
    }
}
