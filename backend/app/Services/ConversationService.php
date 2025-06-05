<?php

namespace App\Services;

use App\Http\Resources\ConversationResource;
use App\Models\Conversation;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ConversationService
{

    public function createConversation($id, $prompt)
    {
        try {
            // Store the conversation with the generated title
            $words = explode(' ', $prompt);
            $title = implode(' ', array_slice($words, 0, 10));

            return Conversation::create([
                'title' => $title,
                'user_id' => $id
            ]);
        } catch (\Exception $e) {
            Log::error('Conversation creation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Conversation creation failed'], 500);
        }
    }

    public function getConversationsByDate($request)
    {
        $conversations = Conversation::where('archived', false)->orderByDesc('created_at')->get();

        $grouped = $conversations->groupBy(function ($conversation) {
            $date = Carbon::parse($conversation->at);
            $group = null;

            if ($date->isToday()) {
                $group = 'Today';
            } elseif ($date->isYesterday()) {
                $group = 'Yesterday';
            } elseif ($date->greaterThanOrEqualTo(Carbon::now()->subDays(7))) {
                $group = 'Previous 7 Days';
            } else {
                $group = 'Older';
            }

            return $group;
        });
        $result = [];

        foreach ($grouped as $group => $items) {
            $result[$group] = ConversationResource::collection($items)->toArray($request);
        }

        return $result;
    }

    public function deleteConversation($id)
    {
        $conversation = Conversation::findOrFail($id);

        try {
            DB::beginTransaction();

            $conversation->messages()->delete();

            $conversation->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Conversation deletion failed: ' . $e->getMessage());
            return response()->json(['error' => 'Conversation deletion failed'], 500);
        }
    }
}
