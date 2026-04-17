<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BadgeController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\WebhookController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/internal/webhook/transaction', [WebhookController::class, 'handleNewTransaction']);

Route::get('/dashboard', [DashboardController::class, 'index']);
Route::get('/user/badges', [BadgeController::class, 'userBadges']);

//Rutas generales 
Route::apiResource('badges', BadgeController::class);
Route::apiResource('transactions', TransactionController::class);
