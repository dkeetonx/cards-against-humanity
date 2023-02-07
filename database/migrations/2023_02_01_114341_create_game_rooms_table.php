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
        Schema::create('game_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('room_code', 4);
            $table->integer('max_player_count')->nullable();
            $table->boolean('has_wating_room')->default(true);
            $table->boolean('two_question_cards')->default(true);
            $table->boolean('allow_hand_redraw')->default(true);
            $table->integer('question_card_timer')->nullable();
            $table->integer('answer_card_timer')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('game_rooms');
    }
};
