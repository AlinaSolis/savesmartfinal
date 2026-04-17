<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::table('transactions', function (Blueprint $table) {
        $table->date('transaction_date')->nullable()->after('description');
        $table->string('payment_method')->after('transaction_date');
        $table->enum('status', ['pendiente', 'pagado', 'cancelado'])
              ->default('pendiente')
              ->after('payment_method');
        $table->text('notes')->nullable()->after('status');
    });
}

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn([
                'transaction_date',
                'payment_method',
                'status',
                'notes',
            ]);
        });
    }
};