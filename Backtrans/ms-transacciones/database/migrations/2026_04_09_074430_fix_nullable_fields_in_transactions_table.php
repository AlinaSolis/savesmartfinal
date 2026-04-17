<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // category_id puede ser null si no se encuentra la categoria
            $table->foreignId('category_id')->nullable()->change();

            // payment_method no se usa desde el frontend, hacerlo nullable
            $table->string('payment_method')->nullable()->default(null)->change();
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable(false)->change();
            $table->string('payment_method')->nullable(false)->change();
        });
    }
};
