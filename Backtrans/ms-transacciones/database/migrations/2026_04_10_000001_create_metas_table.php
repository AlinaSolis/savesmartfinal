<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('metas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('nombre');
            $table->string('emoji')->default('🎯');
            $table->string('descripcion')->nullable();
            $table->decimal('objetivo', 12, 2);
            $table->decimal('ahorrado', 12, 2)->default(0);
            $table->string('color')->default('#22d3ee');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('metas');
    }
};
