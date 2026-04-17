<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DashboardStat extends Model
{
    
    protected $table = 'dashboard_stats';
    protected $primaryKey = 'user_id';

    public $incrementing = false;
    protected $keyType = 'string';

    
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'balance_total',
        'ingresos_mes',
        'gastos_mes',
        'ahorro_mes',
        'status_ahorro',
    ];
}