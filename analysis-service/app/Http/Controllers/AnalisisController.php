<?php

namespace App\Http\Controllers;

use App\Models\AnalisisFinanciero;
use App\Models\AnalisisHistorial;
use App\Models\ConsejoIa;
use App\Services\OpenAIService;
use Illuminate\Http\Request;

class AnalisisController extends Controller
{
    private $openAI;

    public function __construct()
    {
        $this->openAI = new OpenAIService();
    }

    // Calcula el nivel de color segun puntuacion
    private function getNivelColor($puntuacion)
    {
        if ($puntuacion >= 85) return 'excelente';
        if ($puntuacion >= 70) return 'bueno';
        if ($puntuacion >= 50) return 'regular';
        return 'critico';
    }

    // GET /api/analisis/{user_id}
    public function show($user_id)
    {
        $analisis = AnalisisFinanciero::where('user_id', $user_id)
            ->with('consejos')
            ->first();

        if (!$analisis) {
            return response()->json([
                'mensaje' => 'No hay analisis disponible'
            ], 404);
        }

        // Agregar nivel_color calculado
        $analisis->nivel_color = $this->getNivelColor($analisis->puntuacion_salud);

        return response()->json($analisis);
    }

    // POST /api/analisis
    public function store(Request $request)
    {
        $request->validate([
            'user_id'        => 'required|integer',
            'total_ingresos' => 'required|numeric',
            'total_gastos'   => 'required|numeric',
        ]);

        // 1. Calcular metricas
        $balance         = $request->total_ingresos - $request->total_gastos;
        $tasa_ahorro     = $request->total_ingresos > 0
            ? (($balance / $request->total_ingresos) * 100) : 0;
        $uso_presupuesto = $request->total_ingresos > 0
            ? (($request->total_gastos / $request->total_ingresos) * 100) : 0;

        $puntuacion = 100 - ($uso_presupuesto * 0.5) + ($tasa_ahorro * 0.3);
        $puntuacion = max(0, min(100, $puntuacion));

        $nivel_riesgo = 'bajo';
        if ($uso_presupuesto > 90) $nivel_riesgo = 'alto';
        elseif ($uso_presupuesto > 70) $nivel_riesgo = 'medio';

        $nivel_color_nuevo = $this->getNivelColor(round($puntuacion, 2));

        // 2. Buscar analisis anterior del usuario
        $analisis_anterior = AnalisisFinanciero::where('user_id', $request->user_id)->first();
        $nivel_color_anterior = $analisis_anterior
            ? $this->getNivelColor($analisis_anterior->puntuacion_salud)
            : null;

        // 3. Guardar snapshot en historial
        $periodo_mes = now()->format('Y-m');
        AnalisisHistorial::updateOrCreate(
            [
                'user_id'    => $request->user_id,
                'periodo_mes'=> $periodo_mes,
            ],
            [
                'total_ingresos'  => $request->total_ingresos,
                'total_gastos'    => $request->total_gastos,
                'balance'         => $balance,
                'tasa_ahorro'     => round($tasa_ahorro, 2),
                'uso_presupuesto' => round($uso_presupuesto, 2),
                'consistencia'    => $request->consistencia ?? 0,
                'nivel_riesgo'    => $nivel_riesgo,
                'puntuacion_salud'=> round($puntuacion, 2),
            ]
        );

        // 4. Upsert en analisis_financiero (un registro por usuario)
        $analisis = AnalisisFinanciero::updateOrCreate(
            ['user_id' => $request->user_id],
            [
                'total_ingresos'  => $request->total_ingresos,
                'total_gastos'    => $request->total_gastos,
                'balance'         => $balance,
                'tasa_ahorro'     => round($tasa_ahorro, 2),
                'uso_presupuesto' => round($uso_presupuesto, 2),
                'consistencia'    => $request->consistencia ?? 0,
                'nivel_riesgo'    => $nivel_riesgo,
                'puntuacion_salud'=> round($puntuacion, 2),
            ]
        );

        // 5. Solo genera consejos y notificacion si cambio de nivel
        $cambio_nivel = $nivel_color_anterior !== $nivel_color_nuevo;

        if ($cambio_nivel) {
            // Borrar consejos anteriores
            ConsejoIa::where('user_id', $request->user_id)->delete();

            // Generar nuevos consejos con IA
            try {
                $resultado = $this->openAI->generarConsejos([
                    'total_ingresos'  => $request->total_ingresos,
                    'total_gastos'    => $request->total_gastos,
                    'balance'         => $balance,
                    'tasa_ahorro'     => round($tasa_ahorro, 2),
                    'uso_presupuesto' => round($uso_presupuesto, 2),
                    'consistencia'    => $request->consistencia ?? 0,
                    'nivel_riesgo'    => $nivel_riesgo,
                    'puntuacion_salud'=> round($puntuacion, 2),
                ]);

                if (!empty($resultado['consejos'])) {
                    foreach ($resultado['consejos'] as $consejo) {
                        ConsejoIa::create([
                            'user_id'     => $request->user_id,
                            'analisis_id' => $analisis->id,
                            'tipo'        => $consejo['tipo'],
                            'titulo'      => $consejo['titulo'],
                            'descripcion' => $consejo['descripcion'],
                        ]);
                    }
                }
            } catch (\Exception $e) {
                \Log::error('Error Gemini AI: ' . $e->getMessage());
            }

            // Generar notificacion de cambio de nivel
            try {
                $titulo_noti  = '';
                $mensaje_noti = '';
                $tipo_noti    = 'analisis';

                if ($nivel_color_nuevo === 'critico') {
                    $titulo_noti  = 'Salud Financiera Critica';
                    $mensaje_noti = "Tu puntuacion bajo a " . round($puntuacion, 0) . "/100. Revisa tus recomendaciones urgente.";
                    $tipo_noti    = 'alerta';
                } elseif ($nivel_color_nuevo === 'regular') {
                    $titulo_noti  = 'Salud Financiera Regular';
                    $mensaje_noti = "Tu puntuacion es " . round($puntuacion, 0) . "/100. Tienes consejos para mejorar.";
                    $tipo_noti    = 'analisis';
                } elseif ($nivel_color_nuevo === 'bueno') {
                    $titulo_noti  = 'Buena Salud Financiera';
                    $mensaje_noti = "Tu puntuacion subio a " . round($puntuacion, 0) . "/100. ¡Vas por buen camino!";
                    $tipo_noti    = 'logro';
                } else {
                    $titulo_noti  = 'Excelente Salud Financiera';
                    $mensaje_noti = "Tu puntuacion es " . round($puntuacion, 0) . "/100. ¡Sigue asi!";
                    $tipo_noti    = 'logro';
                }

                $client = new \GuzzleHttp\Client();
                $client->post('http://127.0.0.1:8004/api/notificaciones', [
                    'json' => [
                        'user_id' => $request->user_id,
                        'tipo'    => $tipo_noti,
                        'titulo'  => $titulo_noti,
                        'mensaje' => $mensaje_noti,
                    ]
                ]);
            } catch (\Exception $e) {
                \Log::error('Error al crear notificacion: ' . $e->getMessage());
            }
        }

        // Retornar analisis con consejos y nivel_color calculado
        $analisis->nivel_color = $nivel_color_nuevo;
        return response()->json(
            $analisis->load('consejos'),
            201
        );
    }

    // GET /api/historial/{user_id}
public function historial($user_id)
{
    $historial = AnalisisHistorial::where('user_id', $user_id)
        ->orderBy('periodo_mes', 'asc')
        ->get()
        ->map(function ($item) {
            $item->nivel_color = $this->getNivelColor($item->puntuacion_salud);
            return $item;
        });

    return response()->json([
        'historial' => $historial,
        'total'     => $historial->count(),
    ]);
}
}
//cambios
//- Quitó periodo_mes del request
//- Upsert en lugar de create (un registro por usuario)
//- Guarda snapshot en analisis_historial automaticamente
//- Gemini AI solo se llama si cambia de nivel
//- Notificacion solo se dispara si cambia de nivel
//- nivel_color se calcula y se devuelve sin guardarse en BD