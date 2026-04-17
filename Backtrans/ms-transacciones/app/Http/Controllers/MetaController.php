<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MetaController extends Controller
{
    // GET /api/metas?user_id=X
    public function index(Request $request)
    {
        $userId = $request->query('user_id');

        if (!$userId) {
            return response()->json(['error' => 'user_id requerido'], 400);
        }

        $metas = DB::table('metas')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($metas);
    }

    // POST /api/metas
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id'     => 'required|integer',
            'nombre'      => 'required|string|max:255',
            'emoji'       => 'nullable|string|max:10',
            'descripcion' => 'nullable|string|max:500',
            'objetivo'    => 'required|numeric|min:0',
            'ahorrado'    => 'nullable|numeric|min:0',
            'color'       => 'nullable|string|max:20',
        ]);

        $id = DB::table('metas')->insertGetId([
            'user_id'     => $data['user_id'],
            'nombre'      => $data['nombre'],
            'emoji'       => $data['emoji']       ?? '🎯',
            'descripcion' => $data['descripcion'] ?? null,
            'objetivo'    => $data['objetivo'],
            'ahorrado'    => $data['ahorrado']    ?? 0,
            'color'       => $data['color']       ?? '#22d3ee',
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        $meta = DB::table('metas')->find($id);

        return response()->json($meta, 201);
    }

    // PUT /api/metas/{id}
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'user_id'     => 'required|integer',
            'nombre'      => 'required|string|max:255',
            'emoji'       => 'nullable|string|max:10',
            'descripcion' => 'nullable|string|max:500',
            'objetivo'    => 'required|numeric|min:0',
            'ahorrado'    => 'nullable|numeric|min:0',
            'color'       => 'nullable|string|max:20',
        ]);

        $affected = DB::table('metas')
            ->where('id', $id)
            ->where('user_id', $data['user_id'])
            ->update([
                'nombre'      => $data['nombre'],
                'emoji'       => $data['emoji']       ?? '🎯',
                'descripcion' => $data['descripcion'] ?? null,
                'objetivo'    => $data['objetivo'],
                'ahorrado'    => $data['ahorrado']    ?? 0,
                'color'       => $data['color']       ?? '#22d3ee',
                'updated_at'  => now(),
            ]);

        if (!$affected) {
            return response()->json(['error' => 'Meta no encontrada'], 404);
        }

        return response()->json(DB::table('metas')->find($id));
    }

    // DELETE /api/metas/{id}
    public function destroy(Request $request, $id)
    {
        $userId = $request->query('user_id');

        $affected = DB::table('metas')
            ->where('id', $id)
            ->where('user_id', $userId)
            ->delete();

        if (!$affected) {
            return response()->json(['error' => 'Meta no encontrada'], 404);
        }

        return response()->json(['message' => 'Meta eliminada']);
    }
}
