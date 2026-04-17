<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dashboard_stats', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->primary();
            $table->decimal('balance_total', 12, 2)->default(0);
            $table->decimal('ingresos_mes', 12, 2)->default(0);
            $table->decimal('gastos_mes', 12, 2)->default(0);
            $table->decimal('ahorro_mes', 12, 2)->default(0);
            $table->string('status_ahorro')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dashboard_stats');
    }
};
