<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnalisisController;
use App\Http\Controllers\ConsejoIaController;
use App\Http\Controllers\AlertaGastoController;

// Análisis financiero
Route::get('/analisis/{user_id}', [AnalisisController::class, 'show']);
Route::post('/analisis', [AnalisisController::class, 'store']);

// Consejos IA
Route::get('/consejos/{user_id}', [ConsejoIaController::class, 'index']);
Route::post('/consejos', [ConsejoIaController::class, 'store']);

// Historial
Route::get('/historial/{user_id}', [AnalisisController::class, 'historial']);