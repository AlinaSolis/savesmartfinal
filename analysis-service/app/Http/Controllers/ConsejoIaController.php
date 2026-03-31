<?php

namespace App\Http\Controllers;

use App\Models\ConsejoIa;
use Illuminate\Http\Request;

class ConsejoIaController extends Controller
{
    // GET /api/consejos/{user_id}
    // Devuelve todos los consejos del usuario
    public function index($user_id)
    {
        $consejos = ConsejoIa::where('user_id', $user_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($consejos);
    }

    // POST /api/consejos
    // Guarda un consejo generado por IA
    public function store(Request $request)
    {
        $request->validate([
            'user_id'     => 'required|integer',
            'analisis_id' => 'required|integer',
            'tipo'        => 'required|in:logro,alerta,consejo,meta',
            'titulo'      => 'required|string',
            'descripcion' => 'required|string',
        ]);

        $consejo = ConsejoIa::create($request->all());

        return response()->json($consejo, 201);
    }
}