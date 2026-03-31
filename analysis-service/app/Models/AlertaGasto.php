<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AlertaGasto extends Model
{
    protected $table = 'alertas_gasto';

    protected $fillable = [
        'user_id',
        'categoria',
        'porcentaje_exceso',
        'mensaje',
    ];
}