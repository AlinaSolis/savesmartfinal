<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuario_insignias', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('insignia_id');
            $table->unsignedInteger('progreso_actual')->default(0);
            $table->boolean('completada')->default(false);
            $table->timestamp('fecha_desbloqueo')->nullable();
            $table->primary(['user_id', 'insignia_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuario_insignias');
    }
};
