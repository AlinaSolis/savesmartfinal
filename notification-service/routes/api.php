<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificacionController;

Route::get('/notificaciones/{user_id}', [NotificacionController::class, 'index']);
Route::post('/notificaciones', [NotificacionController::class, 'store']);
Route::patch('/notificaciones/{id}/leer', [NotificacionController::class, 'marcarLeida']);
Route::patch('/notificaciones/{user_id}/leer-todas', [NotificacionController::class, 'marcarTodasLeidas']);
Route::delete('/notificaciones/{user_id}/limpiar', [NotificacionController::class, 'limpiar']);
Route::delete('/notificaciones/{id}', [NotificacionController::class, 'eliminar']);