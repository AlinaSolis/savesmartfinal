<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    // Aquí ponemos EXACTAMENTE las columnas que existen en tu base de datos
    protected $fillable = [
        'user_id',
        'amount',
        'type',
        'description',
        'category_id',
        'created_at',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /* Como no tienes 'user_id' en tu tabla por el momento, 
    es mejor comentar esta relación para que no cause errores. 
    Cuando agregues el login en el futuro, la descomentas.
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    */
}