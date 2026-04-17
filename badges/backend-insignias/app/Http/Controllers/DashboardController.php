<?php

namespace App\Http\Controllers;

use App\Models\DashboardStat;
use App\Models\Transaction;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {

        $userId = 1;

        $stats = DashboardStat::where('user_id', $userId)->first();

        if (!$stats) {
            $stats = [
                'balance_total' => 0,
                'ingresos_mes' => 0,
                'gastos_mes' => 0,
                'ahorro_mes' => 0
            ];
        }

        $recentTransactions = Transaction::where('user_id', $userId)
                                         ->orderBy('fecha', 'desc')
                                         ->take(5) 
                                         ->get();


        return response()->json([
            'stats' => $stats,
            'recent_transactions' => $recentTransactions
        ], 200);
    }
}