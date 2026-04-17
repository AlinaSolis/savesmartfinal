<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // Sign Up (Imagen 2: Create Account)
    public function signUp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fullName' => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'name'     => $request->fullName, // Mapeamos fullName a name
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user'    => $user
        ], 201);
    }

    // Sign In (Imagen 1: Welcome Back)
    public function signIn(Request $request)
{
    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    // Generar token
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Welcome back to SaveSmart!',
        'user'    => $user,
        'token'   => $token  // <- agregar esto
    ], 200);
}
}
