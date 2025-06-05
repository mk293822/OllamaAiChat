<?php

namespace App\Services;

use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Support\Facades\DB;

class MessageService
{
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


    public function createMessage($conversation_id, $role, $content)
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
