<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'title',
        'archived',
    ];

    public function messages()
    {
        return $this->hasMany(Message::class, 'conversation_id');
    }
}
