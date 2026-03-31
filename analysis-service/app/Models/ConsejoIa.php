<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConsejoIa extends Model
{
    protected $table = 'consejos_ia';

    protected $fillable = [
        'user_id',
        'analisis_id',
        'tipo',
        'titulo',
        'descripcion',
    ];

    // Relación: un consejo pertenece a un análisis
    public function analisis()
    {
        return $this->belongsTo(AnalisisFinanciero::class, 'analisis_id');
    }
}