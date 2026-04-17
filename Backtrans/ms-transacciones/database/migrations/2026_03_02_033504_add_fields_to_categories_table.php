<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::table('categories', function (Blueprint $table) {
        $table->string('icon_identifier', 50)->nullable()->after('name');
        $table->boolean('is_custom')->default(false)->after('icon_identifier');
        $table->foreignId('user_id')
              ->nullable()
              ->constrained('users')
              ->nullOnDelete()
              ->after('is_custom');
    });
}

public function down(): void
{
    Schema::table('categories', function (Blueprint $table) {
        $table->dropForeign(['user_id']);
        $table->dropColumn(['icon_identifier', 'is_custom', 'user_id']);
    });
}
};
