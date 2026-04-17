<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->query('user_id');

        $query = Transaction::with('category')->orderBy('created_at', 'desc');

        if ($userId) {
            $query->where('user_id', $userId);
        }

        $transactions = $query->get();

        $formatted = $transactions->map(function($t) {
            return [
                'id'       => $t->id,
                'title'    => $t->description ?: ($t->category ? $t->category->name : 'Transacción'),
                'category' => $t->category ? $t->category->name : 'General',
                'amount'   => $t->type === 'gasto' ? -(float)$t->amount : (float)$t->amount,
                'date'     => Carbon::parse($t->created_at)->translatedFormat('d M Y'),
            ];
        });

        return response()->json($formatted);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id'     => 'required|integer',
            'amount'      => 'required|numeric',
            'type'        => 'required|in:income,expense',
            'description' => 'nullable|string',
            'category'    => 'required|string',
            'date'        => 'required|date',
        ]);

        $category = Category::where('name', $data['category'])->first();

        $transaction = Transaction::create([
            'user_id'     => $data['user_id'],
            'amount'      => $data['amount'],
            'type'        => $data['type'] === 'income' ? 'ingreso' : 'gasto',
            'description' => $data['description'] ?? null,
            'category_id' => $category ? $category->id : null,
            'created_at'  => Carbon::parse($data['date'])->toDateTimeString(),
        ]);

        // Notificar al microservicio de insignias
        try {
            Http::post('http://127.0.0.1:8009/api/internal/webhook/transaction', [
                'user_id' => $data['user_id'],
                'monto'   => $data['amount'],
                'tipo'    => $data['type'] === 'income' ? 'ingreso' : 'gasto',
            ]);
        } catch (\Exception $e) {
            // El fallo en las insignias no debe bloquear la transacción
        }

        return response()->json($transaction, 201);
    }
}