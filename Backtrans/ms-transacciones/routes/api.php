<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\MetaController;

// La ruta específica PRIMERO
Route::get('/categories/user/{id}', [CategoryController::class, 'byUser']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);

Route::get('/transactions', [TransactionController::class, 'index']);
Route::post('/transactions', [TransactionController::class, 'store']);

// Metas de ahorro
Route::get('/metas', [MetaController::class, 'index']);
Route::post('/metas', [MetaController::class, 'store']);
Route::put('/metas/{id}', [MetaController::class, 'update']);
Route::delete('/metas/{id}', [MetaController::class, 'destroy']);
