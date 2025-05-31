<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

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

        $token = $user->createToken('auth_token')->plainTextToken;

        Auth::login($user);

        return response()->json(['message' => 'Registered Successfully'])->withCookie(
            cookie('auth_token', $token, 60 * 24, null, null, true, true, false, "Strict")
        );
    }

    public function login(LoginRequest $request)
    {
        $request->authenticate();

        $token = Auth::user()->createToken('auth_token')->plainTextToken;

        return response()->json(['message' => 'Logged In Successfully'])->withCookie(
            cookie('auth_token', $token, 60 * 24, null, null, true, true, false, "Strict")
        );
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out'])->withCookie(
            Cookie::forget('auth_token')
        );
    }
}
