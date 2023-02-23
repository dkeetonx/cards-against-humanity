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
            $table->integer("player_count")->default(0);
            $table->integer("current_questioner")->nullable();
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
            $table->dropColumn("player_count");
            $table->dropColumn("current_questioner");
        });
    }
};
