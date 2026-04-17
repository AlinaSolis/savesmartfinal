<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use App\Models\DashboardStat;
use App\Services\BadgeService; 
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::orderBy('fecha', 'desc')->get();
        return response()->json($transactions, 200);
    }

    public function store(Request $request, BadgeService $badgeService)
    {
        $validated = $request->validate([
            'tipo' => 'required|in:ingreso,gasto',
            'categoria' => 'required|string|max:255',
            'descripcion' => 'required|string|max:255',
            'monto' => 'required|numeric|min:0.01',
            'fecha' => 'required|date',
        ]);

        $validated['user_id'] = 1; 

        $transaction = Transaction::create($validated);

        $user = User::find(1);
        if ($user) {
            $badgeService->evaluate($user);
        }

        $stat = DashboardStat::firstOrCreate(
            ['user_id' => 1], 
            ['balance_total' => 0, 'ingresos_mes' => 0, 'gastos_mes' => 0] 
        );

        if ($transaction->tipo === 'ingreso') {
            $stat->balance_total += $transaction->monto;
            $stat->ingresos_mes += $transaction->monto;
        } else {
            $stat->balance_total -= $transaction->monto;
            $stat->gastos_mes += $transaction->monto;
        }
        
        $stat->save(); 

        return response()->json([
            'message' => 'Movimiento registrado con éxito',
            'data' => $transaction
        ], 201);
    }
}