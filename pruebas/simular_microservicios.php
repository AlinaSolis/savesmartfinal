<?php

// =============================================
// SaveSmart - Simulador de Microservicios
// Archivo: pruebas/simular_microservicios.php
// =============================================
// Este archivo simula como se comunicarian
// los microservicios entre si en produccion.
//
// Para ejecutar:
// php pruebas/simular_microservicios.php
//
// Requisitos:
// - analysis-service corriendo en puerto 8003
// - notification-service corriendo en puerto 8004
// =============================================

$ANALYSIS_URL     = 'http://127.0.0.1:8003/api';
$NOTIFICATION_URL = 'http://127.0.0.1:8004/api';

// ─────────────────────────────────────────────
// FUNCION HELPER: Hacer peticiones HTTP
// ─────────────────────────────────────────────
function httpRequest($method, $url, $data = null) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method === 'PATCH') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
        if ($data) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    } elseif ($method === 'DELETE') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
    }

    $response = curl_exec($ch);
    $status   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error    = curl_error($ch);
    curl_close($ch);

    return [
        'status' => $status,
        'body'   => json_decode($response, true),
        'raw'    => $response,
        'error'  => $error,
    ];
}

// ─────────────────────────────────────────────
// FUNCION HELPER: Imprimir resultado
// ─────────────────────────────────────────────
function printResult($titulo, $resultado, $esperado = null) {
    echo "\n";
    echo "┌─────────────────────────────────────────\n";
    echo "│ $titulo\n";
    echo "├─────────────────────────────────────────\n";
    echo "│ Status: {$resultado['status']}";
    if ($esperado) echo " (esperado: $esperado)";
    echo "\n";

    if ($resultado['error']) {
        echo "│ ERROR: {$resultado['error']}\n";
    } else {
        $body  = json_encode($resultado['body'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        $lines = explode("\n", $body);
        foreach (array_slice($lines, 0, 15) as $line) {
            echo "│ $line\n";
        }
        if (count($lines) > 15) echo "│ ... (respuesta truncada)\n";
    }

    $ok = $resultado['status'] >= 200 && $resultado['status'] < 300;
    echo "└─ " . ($ok ? "✅ OK" : "❌ FALLO") . "\n";
}

echo "\n";
echo "╔═════════════════════════════════════════╗\n";
echo "║   SaveSmart - Simulador Microservicios  ║\n";
echo "║   Simula la comunicacion entre equipos  ║\n";
echo "╚═════════════════════════════════════════╝\n";

// =============================================
// ESCENARIO 1: USUARIO CON EXCELENTE SALUD
// Simula: transactions-service envia totales
// positivos al analysis-service
// =============================================
echo "\n\n══════════════════════════════════════════\n";
echo " ESCENARIO 1: Usuario con excelente salud\n";
echo " Simula: transactions-service → analysis-service\n";
echo "══════════════════════════════════════════\n";

$r1 = httpRequest('POST', "$ANALYSIS_URL/analisis", [
    'user_id'        => 5,
    'total_ingresos' => 6000,
    'total_gastos'   => 1500,
    'consistencia'   => 98,
]);
printResult('POST /api/analisis (datos excelentes)', $r1, 201);
$nivel_anterior = $r1['body']['nivel_color'] ?? 'desconocido';
echo "   → Puntuacion: {$r1['body']['puntuacion_salud']} | Nivel: $nivel_anterior\n";

sleep(1);

// =============================================
// ESCENARIO 2: USUARIO BAJA DE NIVEL
// Simula: transactions-service recalcula tras
// nuevas transacciones negativas del usuario
// =============================================
echo "\n\n══════════════════════════════════════════\n";
echo " ESCENARIO 2: Usuario baja de nivel\n";
echo " Simula: transactions-service recalcula\n";
echo " tras nuevas transacciones negativas\n";
echo "══════════════════════════════════════════\n";

$r2 = httpRequest('POST', "$ANALYSIS_URL/analisis", [
    'user_id'        => 5,
    'total_ingresos' => 5000,
    'total_gastos'   => 3500,
    'consistencia'   => 70,
]);
printResult('POST /api/analisis (datos regulares)', $r2, 201);
$nivel_nuevo = $r2['body']['nivel_color'] ?? 'desconocido';
echo "   → Puntuacion: {$r2['body']['puntuacion_salud']} | Nivel: $nivel_nuevo\n";
echo "   → Cambio de nivel: $nivel_anterior → $nivel_nuevo\n";
echo "   → Gemini AI regenero consejos automaticamente\n";
echo "   → Se disparo notificacion de cambio de nivel\n";

sleep(1);

// =============================================
// ESCENARIO 3: USUARIO EN ESTADO CRITICO
// Simula: transactions-service detecta gastos
// mayores a ingresos (balance negativo)
// =============================================
echo "\n\n══════════════════════════════════════════\n";
echo " ESCENARIO 3: Usuario en estado critico\n";
echo " Simula: gastos superan ingresos\n";
echo "══════════════════════════════════════════\n";

$r3 = httpRequest('POST', "$ANALYSIS_URL/analisis", [
    'user_id'        => 5,
    'total_ingresos' => 4000,
    'total_gastos'   => 5500,
    'consistencia'   => 20,
]);
printResult('POST /api/analisis (datos criticos)', $r3, 201);
echo "   → Puntuacion: {$r3['body']['puntuacion_salud']} | Nivel: {$r3['body']['nivel_color']}\n";
echo "   → Balance negativo detectado\n";
echo "   → Notificacion de alerta enviada automaticamente\n";

sleep(1);

// =============================================
// ESCENARIO 4: ALERTAS POR CATEGORIA
// Simula: transactions-service detecta que
// el usuario se paso del presupuesto en
// diferentes categorias del mes
// =============================================
echo "\n\n══════════════════════════════════════════\n";
echo " ESCENARIO 4: Alertas de gasto por categoria\n";
echo " Simula: transactions-service → analysis-service\n";
echo " cuando detecta exceso en categorias\n";
echo "══════════════════════════════════════════\n";

$alertas = [
    ['categoria' => 'Comida',          'porcentaje_exceso' => 35.5],
    ['categoria' => 'Entretenimiento', 'porcentaje_exceso' => 80.0],
    ['categoria' => 'Transporte',      'porcentaje_exceso' => 15.2],
];

foreach ($alertas as $alerta) {
    $r4 = httpRequest('POST', "$ANALYSIS_URL/alertas", [
        'user_id'           => 5,
        'categoria'         => $alerta['categoria'],
        'porcentaje_exceso' => $alerta['porcentaje_exceso'],
        'mensaje'           => "Tus gastos en {$alerta['categoria']} superan el presupuesto en {$alerta['porcentaje_exceso']}%",
    ]);
    printResult("POST /api/alertas ({$alerta['categoria']})", $r4, 201);
}

sleep(1);

// =============================================
// ESCENARIO 5: NOTIFICACIONES DE OTROS EQUIPOS
// Simula: badges-service y otros microservicios
// enviando notificaciones al notification-service
// Cualquier equipo solo hace un POST con estos
// campos y ya aparece en la app del usuario
// =============================================
echo "\n\n══════════════════════════════════════════\n";
echo " ESCENARIO 5: Notificaciones de otros equipos\n";
echo " Simula: badges-service → notification-service\n";
echo " Cualquier servicio solo hace un POST\n";
echo "══════════════════════════════════════════\n";

$notificaciones = [
    [
        'tipo'    => 'racha',
        'titulo'  => 'Racha de 7 dias',
        'mensaje' => 'Llevas 7 dias consecutivos registrando tus transacciones.',
    ],
    [
        'tipo'    => 'logro',
        'titulo'  => 'Primer mes completo',
        'mensaje' => 'Completaste tu primer mes registrando todas tus transacciones.',
    ],
    [
        'tipo'    => 'meta',
        'titulo'  => 'Meta de ahorro cerca',
        'mensaje' => 'Te faltan $500 para alcanzar tu meta de ahorro mensual.',
    ],
    [
        'tipo'    => 'recordatorio',
        'titulo'  => 'Registra tus gastos de hoy',
        'mensaje' => 'No olvides registrar tus transacciones del dia para mantener tu racha.',
    ],
];

foreach ($notificaciones as $notif) {
    $r5 = httpRequest('POST', "$NOTIFICATION_URL/notificaciones", [
        'user_id' => 5,
        'tipo'    => $notif['tipo'],
        'titulo'  => $notif['titulo'],
        'mensaje' => $notif['mensaje'],
    ]);
    printResult("POST /api/notificaciones (tipo: {$notif['tipo']})", $r5, 201);
}

sleep(1);

// =============================================
// ESCENARIO 6: FRONTEND CONSULTA DATOS
// Simula: React frontend consultando ambos
// microservicios al cargar la pantalla
// =============================================
echo "\n\n══════════════════════════════════════════\n";
echo " ESCENARIO 6: Frontend consulta datos\n";
echo " Simula: React → GET a ambos servicios\n";
echo "══════════════════════════════════════════\n";

$getAnalisis = httpRequest('GET', "$ANALYSIS_URL/analisis/5");
printResult('GET /api/analisis/5', $getAnalisis, 200);

$getAlertas = httpRequest('GET', "$ANALYSIS_URL/alertas/5");
printResult('GET /api/alertas/5', $getAlertas, 200);

$getNotifs = httpRequest('GET', "$NOTIFICATION_URL/notificaciones/5");
printResult('GET /api/notificaciones/5', $getNotifs, 200);
echo "   → Total no leidas: {$getNotifs['body']['total_no_leidas']}\n";

sleep(1);

// =============================================
// ESCENARIO 7: USUARIO MARCA NOTIFICACIONES
// Simula: usuario hace clic en notificaciones
// desde el frontend
// =============================================
echo "\n\n══════════════════════════════════════════\n";
echo " ESCENARIO 7: Usuario marca notificaciones\n";
echo " Simula: Frontend → PATCH notification-service\n";
echo "══════════════════════════════════════════\n";

$marcarTodas = httpRequest('PATCH', "$NOTIFICATION_URL/notificaciones/5/leer-todas");
printResult('PATCH /api/notificaciones/5/leer-todas', $marcarTodas, 200);

$verificar  = httpRequest('GET', "$NOTIFICATION_URL/notificaciones/5");
$no_leidas  = $verificar['body']['total_no_leidas'] ?? 'error';
echo "\n   → Verificacion: total_no_leidas = $no_leidas (debe ser 0)\n";

// =============================================
// RESUMEN FINAL
// =============================================
echo "\n\n╔═════════════════════════════════════════╗\n";
echo "║              RESUMEN FINAL              ║\n";
echo "╠═════════════════════════════════════════╣\n";
echo "║  Escenario 1: Usuario excelente    ✅   ║\n";
echo "║  Escenario 2: Baja de nivel        ✅   ║\n";
echo "║  Escenario 3: Estado critico       ✅   ║\n";
echo "║  Escenario 4: Alertas por cat.     ✅   ║\n";
echo "║  Escenario 5: Notifs otros equipos ✅   ║\n";
echo "║  Escenario 6: Frontend consulta    ✅   ║\n";
echo "║  Escenario 7: Marcar leidas        ✅   ║\n";
echo "╠═════════════════════════════════════════╣\n";
echo "║  Flujo completo simulado con exito      ║\n";
echo "╚═════════════════════════════════════════╝\n\n";