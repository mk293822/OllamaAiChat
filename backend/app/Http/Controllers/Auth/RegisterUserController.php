<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class RegisterUserController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        $token = Auth::login($user);

        return response()->json([
            'message' => 'Registered Successfully',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function login(LoginRequest $request)
    {
        $token = Auth::attempt($request->only('email', 'password'));

        if (!$token) {
            return response()->json(['message' => 'Unauthroized'], 401);
        }

        $user = Auth::user();

        return response()->json([
            'message' => 'Logged In Successfully',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json(['message' => 'Logged out']);
    }

    public function refresh()
    {
        return response()->json([
            'message' => 'Refreshed Successfully',
            'token' => Auth::refresh(),
        ]);
    }
}
