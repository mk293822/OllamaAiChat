<?php

use App\Http\Controllers\Auth\RegisterUserController;
use App\Http\Controllers\ChatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/ask/{conversation_id}', [ChatController::class, 'ask']);
    Route::post('/destory/{conversation_id}', [ChatController::class, 'deleteConversation']);
    Route::get('/getMessages/{conversation_id}', [ChatController::class, 'getMessages']);
    Route::post('/archiveConversation/{conversation_id}', [ChatController::class, 'archiveConversation']);

    Route::post('/logout', [RegisterUserController::class, 'logout']);
});

Route::post('/register', [RegisterUserController::class, 'register']);
Route::post('/login', [RegisterUserController::class, 'login']);
