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
        Schema::create('user_answer_cards', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('game_room_id');
            $table->integer('answer_card_id');
            $table->integer('user_id');
            $table->enum('status', ['in_hand', 'in_play', 'in_trash']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_answer_cards');
    }
};
