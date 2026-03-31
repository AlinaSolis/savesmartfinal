<?php

namespace App\Http\Controllers;

use App\Models\AlertaGasto;
use Illuminate\Http\Request;

class AlertaGastoController extends Controller
{
    // GET /api/alertas/{user_id}
    public function index($user_id)
    {
        $alertas = AlertaGasto::where('user_id', $user_id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($alertas);
    }

    // POST /api/alertas
    public function store(Request $request)
    {
        $request->validate([
            'user_id'           => 'required|integer',
            'categoria'         => 'required|string',
            'porcentaje_exceso' => 'required|numeric',
            'mensaje'           => 'required|string',
        ]);

        $alerta = AlertaGasto::create($request->all());

        return response()->json($alerta, 201);
    }
}