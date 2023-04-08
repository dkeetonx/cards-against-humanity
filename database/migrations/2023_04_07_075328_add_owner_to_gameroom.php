<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('game_rooms', function (Blueprint $table) {
            //
            $table->integer('owner_id')->nullable();
            $table->string('progress', 32)->default('idle');
            $table->integer('winner_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('game_rooms', function (Blueprint $table) {
            //
            $table->dropColumn('owner_id');
            $table->dropColumn('progress');
            $table->dropColumn('winner_id');
        });
    }
};
