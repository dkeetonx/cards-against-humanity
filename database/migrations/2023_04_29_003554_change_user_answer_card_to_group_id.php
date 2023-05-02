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
            $table->renameColumn('user_answer_card_id', 'winning_group_id');
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
            $table->renameColumn('winning_group_id', 'user_answer_card_id');
        });
    }
};
