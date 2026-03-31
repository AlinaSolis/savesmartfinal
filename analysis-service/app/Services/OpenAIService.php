<?php

namespace App\Services;

use Gemini\Laravel\Facades\Gemini; // ← ESTO FALTABA

class OpenAIService
{
    public function generarConsejos(array $datosFinancieros): array
    {
        try {
            $prompt = $this->construirPrompt($datosFinancieros);

            $respuesta = Gemini::generativeModel(model: 'models/gemini-2.5-flash')
                ->generateContent($prompt);

            $contenido = $respuesta->text();
            $contenido = preg_replace('/```json|```/', '', $contenido);
            $contenido = trim($contenido);

            $resultado = json_decode($contenido, true);
            return $resultado ?? $this->consejosSimulados($datosFinancieros);

        } catch (\Exception $e) {
            \Log::error('Error Gemini: ' . $e->getMessage());
            return $this->consejosSimulados($datosFinancieros);
        }
    }

    private function construirPrompt(array $datos): string
    {
        return "Eres un asesor financiero personal. Analiza estos datos y genera exactamente 4 consejos financieros personalizados en español.

DATOS DEL USUARIO:
- Ingresos: \${$datos['total_ingresos']}
- Gastos: \${$datos['total_gastos']}
- Balance: \${$datos['balance']}
- Tasa de ahorro: {$datos['tasa_ahorro']}%
- Uso del presupuesto: {$datos['uso_presupuesto']}%
- Consistencia: {$datos['consistencia']}%
- Nivel de riesgo: {$datos['nivel_riesgo']}
- Puntuación de salud financiera: {$datos['puntuacion_salud']}/100

Responde ÚNICAMENTE con este JSON sin texto adicional ni bloques de código:
{\"consejos\":[{\"tipo\":\"logro\",\"titulo\":\"titulo corto\",\"descripcion\":\"descripcion de 1-2 oraciones\"},{\"tipo\":\"alerta\",\"titulo\":\"titulo corto\",\"descripcion\":\"descripcion de 1-2 oraciones\"},{\"tipo\":\"consejo\",\"titulo\":\"titulo corto\",\"descripcion\":\"descripcion de 1-2 oraciones\"},{\"tipo\":\"meta\",\"titulo\":\"titulo corto\",\"descripcion\":\"descripcion de 1-2 oraciones\"}]}";
    }

    private function consejosSimulados(array $datos): array
    {
        $consejos = [];

        if ($datos['tasa_ahorro'] > 20) {
            $consejos[] = [
                'tipo'        => 'logro',
                'titulo'      => '¡Excelente tasa de ahorro!',
                'descripcion' => "Has ahorrado el {$datos['tasa_ahorro']}% de tus ingresos. ¡Sigue así para alcanzar tus metas!",
            ];
        } else {
            $consejos[] = [
                'tipo'        => 'logro',
                'titulo'      => '¡Vas por buen camino!',
                'descripcion' => 'Cada peso ahorrado cuenta. Intenta incrementar tu ahorro un 5% el próximo mes.',
            ];
        }

        if ($datos['uso_presupuesto'] > 80) {
            $consejos[] = [
                'tipo'        => 'alerta',
                'titulo'      => 'Alerta de Gasto Elevado',
                'descripcion' => "Tus gastos son el {$datos['uso_presupuesto']}% de tus ingresos. Reduce gastos no esenciales.",
            ];
        } else {
            $consejos[] = [
                'tipo'        => 'alerta',
                'titulo'      => 'Gastos bajo control',
                'descripcion' => 'Tus gastos están en rango saludable. ¡Mantén este ritmo!',
            ];
        }

        $consejos[] = [
            'tipo'        => 'consejo',
            'titulo'      => 'Consejo Inteligente',
            'descripcion' => "Con un balance de \${$datos['balance']} podrías invertir el 10% en un fondo de emergencia.",
        ];

        $consejos[] = [
            'tipo'        => 'meta',
            'titulo'      => 'Meta Alcanzable',
            'descripcion' => "A tu ritmo actual en 6 meses tendrás \$" . number_format($datos['balance'] * 6, 2) . " ahorrados.",
        ];

        return ['consejos' => $consejos];
    }
}