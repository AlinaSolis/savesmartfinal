<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnalisisFinanciero extends Model
{
    protected $table = 'analisis_financiero';

    protected $fillable = [
        'user_id',
        'total_ingresos',
        'total_gastos',
        'balance',
        'tasa_ahorro',
        'uso_presupuesto',
        'consistencia',
        'nivel_riesgo',
        'puntuacion_salud',
    ];

    // Relacion: un analisis tiene muchos consejos
    public function consejos()
    {
        return $this->hasMany(ConsejoIa::class, 'analisis_id');
    }
}