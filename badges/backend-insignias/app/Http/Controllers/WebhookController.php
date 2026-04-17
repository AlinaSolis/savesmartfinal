<?php

namespace App\Http\Controllers;

use App\Models\DashboardStat;
use App\Services\BadgeService;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    public function handleNewTransaction(Request $request, BadgeService $badgeService)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer',
            'monto'   => 'required|numeric|min:0.01',
            'tipo'    => 'required|in:ingreso,gasto',
        ]);

        $userId = $validated['user_id'];
        $monto  = $validated['monto'];
        $tipo   = $validated['tipo'];

        $stat = DashboardStat::firstOrCreate(
            ['user_id' => $userId],
            ['balance_total' => 0, 'ingresos_mes' => 0, 'gastos_mes' => 0]
        );

        if ($tipo === 'ingreso') {
            $stat->balance_total += $monto;
            $stat->ingresos_mes  += $monto;
        } else {
            $stat->balance_total -= $monto;
            $stat->gastos_mes    += $monto;
        }
        $stat->save();

        $badgeService->evaluate($userId, $stat->ingresos_mes);

        return response()->json([
            'message' => 'Estadísticas e insignias actualizadas.'
        ], 200);
    }
}
