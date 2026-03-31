<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnalisisHistorial extends Model
{
    protected $table = 'analisis_historial';

    public $timestamps = false; // solo tiene created_at, no updated_at

    protected $fillable = [
        'user_id',
        'periodo_mes',
        'total_ingresos',
        'total_gastos',
        'balance',
        'tasa_ahorro',  
        'uso_presupuesto',
        'consistencia',
        'nivel_riesgo',
        'puntuacion_salud',
    ];
}
