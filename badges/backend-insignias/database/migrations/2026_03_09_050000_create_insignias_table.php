<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('insignias', function (Blueprint $table) {
            $table->id();
            $table->string('key_name')->unique();
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->unsignedInteger('meta_valor')->default(1);
            $table->string('icono_url')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('insignias');
    }
};
