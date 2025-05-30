<?php

namespace App\Models;

use App\Enums\MessageRoleEnum;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable =[
        'conversation_id',
        'role',
        'content',
    ];

    protected $casts = [
        'role' => MessageRoleEnum::class,
    ];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class, 'conversation_id');
    }
}
