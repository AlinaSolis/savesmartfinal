<?php

$API = 'http://127.0.0.1:8003/api';

$meses = [
    ["periodo_mes" => "2025-01", "total_ingresos" => 3500, "total_gastos" => 4200, "consistencia" => 15],
    ["periodo_mes" => "2025-02", "total_ingresos" => 3500, "total_gastos" => 3800, "consistencia" => 30],
    ["periodo_mes" => "2025-03", "total_ingresos" => 4000, "total_gastos" => 3500, "consistencia" => 45],
    ["periodo_mes" => "2025-04", "total_ingresos" => 4000, "total_gastos" => 3200, "consistencia" => 55],
    ["periodo_mes" => "2025-05", "total_ingresos" => 4500, "total_gastos" => 3300, "consistencia" => 60],
    ["periodo_mes" => "2025-06", "total_ingresos" => 4500, "total_gastos" => 3000, "consistencia" => 70],
    ["periodo_mes" => "2025-07", "total_ingresos" => 5000, "total_gastos" => 3200, "consistencia" => 75],
    ["periodo_mes" => "2025-08", "total_ingresos" => 5000, "total_gastos" => 2800, "consistencia" => 80],
    ["periodo_mes" => "2025-09", "total_ingresos" => 5000, "total_gastos" => 2500, "consistencia" => 85],
    ["periodo_mes" => "2025-10", "total_ingresos" => 5500, "total_gastos" => 2500, "consistencia" => 88],
    ["periodo_mes" => "2025-11", "total_ingresos" => 5500, "total_gastos" => 4800, "consistencia" => 70],
    ["periodo_mes" => "2025-12", "total_ingresos" => 5500, "total_gastos" => 5200, "consistencia" => 60],
    ["periodo_mes" => "2026-01", "total_ingresos" => 5000, "total_gastos" => 3800, "consistencia" => 65],
    ["periodo_mes" => "2026-02", "total_ingresos" => 5000, "total_gastos" => 3200, "consistencia" => 72],
    ["periodo_mes" => "2026-03", "total_ingresos" => 5500, "total_gastos" => 2800, "consistencia" => 80],
    ["periodo_mes" => "2026-04", "total_ingresos" => 5500, "total_gastos" => 2500, "consistencia" => 85],
    ["periodo_mes" => "2026-05", "total_ingresos" => 6000, "total_gastos" => 2200, "consistencia" => 90],
    ["periodo_mes" => "2026-06", "total_ingresos" => 6000, "total_gastos" => 2000, "consistencia" => 93],
    ["periodo_mes" => "2026-07", "total_ingresos" => 6500, "total_gastos" => 1800, "consistencia" => 95],
    ["periodo_mes" => "2026-08", "total_ingresos" => 6500, "total_gastos" => 1500, "consistencia" => 97],
    ["periodo_mes" => "2026-09", "total_ingresos" => 7000, "total_gastos" => 1400, "consistencia" => 98],
    ["periodo_mes" => "2026-10", "total_ingresos" => 7000, "total_gastos" => 1200, "consistencia" => 98],
    ["periodo_mes" => "2026-11", "total_ingresos" => 7500, "total_gastos" => 1100, "consistencia" => 99],
    ["periodo_mes" => "2026-12", "total_ingresos" => 8000, "total_gastos" => 1000, "consistencia" => 100],
];

foreach ($meses as $mes) {
    $data = array_merge(['user_id' => 99], $mes);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "$API/analisis");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = json_decode(curl_exec($ch), true);
    $status   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    echo "{$mes['periodo_mes']} → puntuacion: {$response['puntuacion_salud']} | nivel: {$response['nivel_color']} | status: $status\n";
}

echo "\n✅ 24 meses generados correctamente\n";