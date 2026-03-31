<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    protected $table = 'notificaciones';

    protected $fillable = [
        'user_id',
        'tipo',
        'titulo',
        'mensaje',
        'leida',
        'icono_tipo',
    ];

    protected $casts = [
        'leida' => 'boolean',
    ];
}