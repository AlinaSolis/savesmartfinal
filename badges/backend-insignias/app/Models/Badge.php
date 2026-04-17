<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    use HasFactory;

    protected $table = 'insignias';

    public $timestamps = false;

    protected $fillable = [
        'key_name',
        'titulo',
        'descripcion',
        'meta_valor',
        'icono_url',
    ];
}