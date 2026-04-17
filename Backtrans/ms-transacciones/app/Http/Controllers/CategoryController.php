<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // GET /api/categories?user_id=X  →  solo categorías del usuario
    public function index(Request $request)
    {
        $userId = $request->query('user_id');

        if (!$userId) {
            return response()->json([]);
        }

        $categories = Category::where('user_id', $userId)->get();

        return response()->json($categories);
    }

    // POST /api/categories
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'             => 'required|string|max:50',
            'type'             => 'required|in:ingreso,gasto',
            'icon_identifier'  => 'nullable|string|max:50',
            'is_custom'        => 'boolean',
            'user_id'          => 'nullable|integer',   // sin FK constraint
        ]);

        $data['is_custom'] = $data['is_custom'] ?? false;

        $category = Category::create($data);

        return response()->json($category, 201);
    }

    // GET /api/categories/user/{id}
    public function byUser($userId)
    {
        $categories = Category::where('user_id', $userId)->get();
        return response()->json($categories);
    }
}