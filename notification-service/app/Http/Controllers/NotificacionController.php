<?php

namespace App\Http\Controllers;

use App\Models\Notificacion;
use Illuminate\Http\Request;

class NotificacionController extends Controller
{
    // GET /api/notificaciones/{user_id}
    // Devuelve todas las notificaciones del usuario
    public function index($user_id)
    {
        $notificaciones = Notificacion::where('user_id', $user_id)
            ->orderBy('created_at', 'desc')
            ->get();

        $no_leidas = $notificaciones->where('leida', false)->count();

        return response()->json([
            'notificaciones' => $notificaciones,
            'total_no_leidas' => $no_leidas
        ]);
    }

    // POST /api/notificaciones
    // Crea una notificación
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer',
            'tipo'    => 'required|in:logro,alerta,meta,recordatorio,racha,analisis',
            'titulo'  => 'required|string',
            'mensaje' => 'required|string',
        ]);

        $notificacion = Notificacion::create($request->all());

        return response()->json($notificacion, 201);
    }

    // PATCH /api/notificaciones/{id}/leer
    // Marca una notificación como leída
    public function marcarLeida($id)
    {
        $notificacion = Notificacion::findOrFail($id);
        $notificacion->update(['leida' => true]);

        return response()->json(['mensaje' => 'Notificación marcada como leída']);
    }

    // PATCH /api/notificaciones/{user_id}/leer-todas
    // Marca todas como leídas
    public function marcarTodasLeidas($user_id)
    {
        Notificacion::where('user_id', $user_id)
            ->where('leida', false)
            ->update(['leida' => true]);

        return response()->json(['mensaje' => 'Todas las notificaciones marcadas como leídas']);
    }

    // DELETE /api/notificaciones/{user_id}/limpiar
public function limpiar($user_id)
{
    $eliminadas = Notificacion::where('user_id', $user_id)->delete();
    
    return response()->json([
        'mensaje' => 'Notificaciones eliminadas correctamente',
        'eliminadas' => $eliminadas
    ]);
}

// DELETE /api/notificaciones/{id}
public function eliminar($id)
{
    $notificacion = Notificacion::find($id);
    
    if (!$notificacion) {
        return response()->json([
            'mensaje' => 'Notificación no encontrada'
        ], 404);
    }
    
    $notificacion->delete();
    
    return response()->json([
        'mensaje' => 'Notificación eliminada correctamente'
    ]);
}
}