<?php

use App\Http\Controllers\Auth\RegisterUserController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ConversationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:api'])->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Messags
    Route::post('/ask/{conversation_id}', [ChatController::class, 'ask']);
    Route::get('/getMessages/{conversation_id}', [ChatController::class, 'getMessages']);


    // Conversations
    Route::get('/getConversations', [ConversationController::class, 'index']);
    Route::get('/getConversation/{conversation_id}', [ConversationController::class, 'getConversation']);
    Route::delete('/destory/{conversation_id}', [ConversationController::class, 'destroy']);
    Route::post('/archiveConversation/{conversation_id}', [ConversationController::class, 'archive']);

    Route::post('/logout', [RegisterUserController::class, 'logout']);
});
Route::get('/refresh', [RegisterUserController::class, 'refresh']);

Route::post('/register', [RegisterUserController::class, 'register']);
Route::post('/login', [RegisterUserController::class, 'login']);
