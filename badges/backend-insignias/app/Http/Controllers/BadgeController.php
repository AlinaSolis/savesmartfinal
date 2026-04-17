<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BadgeController extends Controller
{
    public function index()
    {
        $badges = Badge::all();
        return response()->json($badges, 200);
    }

    public function userBadges(Request $request)
    {
        $userId = $request->query('user_id');

        if (!$userId) {
            return response()->json([], 200);
        }

        $badges = DB::table('usuario_insignias')
            ->join('insignias', 'usuario_insignias.insignia_id', '=', 'insignias.id')
            ->where('usuario_insignias.user_id', $userId)
            ->where('usuario_insignias.completada', 1)
            ->select('insignias.titulo', 'insignias.descripcion', 'usuario_insignias.fecha_desbloqueo')
            ->get();

        return response()->json($badges, 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'description'     => 'nullable|string',
            'icon'            => 'nullable|string',
            'required_points' => 'required|integer',
        ]);

        $badge = Badge::create($validated);

        return response()->json([
            'message' => 'Insignia creada con éxito',
            'data'    => $badge
        ], 201);
    }

    public function show($id)
    {
        $badge = Badge::find($id);

        if (!$badge) {
            return response()->json(['message' => 'Insignia no encontrada'], 404);
        }

        return response()->json($badge, 200);
    }

    public function update(Request $request, string $id) {}

    public function destroy(string $id) {}
}
