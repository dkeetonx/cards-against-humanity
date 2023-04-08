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
        Schema::table('users', function (Blueprint $table) {
            //
            $table->boolean('playing')->default(false);
            $table->boolean('connected')->default(false);
            $table->boolean('has_free_redraw')->default(false);
            $table->integer('points')->default(0);
            $table->renameColumn('game_room_status', 'status');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            //
            $table->dropColumn('playing');
            $table->dropColumn('connected');
            $table->dropColumn('has_free_redraw');
            $table->dropColumn('points');
            $table->renameColumn('status', 'game_room_status');
        });
    }
};
