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
        Schema::create('xraypreferences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('xray_category_id');
            $table->string('xray_type');
            $table->decimal('price', 8, 2)->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->foreign('xray_category_id')->references('id')->on('xray_categories');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('xraypreferences');
    }
};
