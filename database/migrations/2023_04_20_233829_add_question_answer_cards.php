<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use \App\Models\Pack;
use \App\Models\QuestionCard;
use \App\Models\AnswerCard;

return new class extends Migration
{
    private $migrationId = 420;
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('question_cards', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->text('text');
            $table->integer('pick');
            $table->integer('pack_id')->nullable();
            $table->integer('migration_id')->nullable();
            $table->integer('user_id')->nullable();
        });

        Schema::create('answer_cards', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->text('text');
            $table->integer('pack_id')->nullable();
            $table->integer('migration_id')->nullable();
            $table->integer('user_id')->nullable();
        });

        $data = json_decode(
            file_get_contents(config('filesystems')['disks']['local']['root'].'/data/cah-cards-full.json'),
            true
        );
        foreach ($data as $pack_data) {
            $pack_data['migration_id'] = $this->migrationId;
            $pack = Pack::create($pack_data);

            foreach ($pack_data['black'] as $questionCard)
            {
                $questionCard['pack_id'] = $pack->id;
                $questionCard['migration_id'] = $this->migrationId;
                QuestionCard::create($questionCard);
                $pack->q_count++;
            }

            foreach ($pack_data['white'] as $answerCard)
            {
                $answerCard['pack_id'] = $pack->id;
                $answerCard['migration_id'] = $this->migrationId;
                AnswerCard::create($answerCard);
                $pack->a_count++;
            }
            $pack->save();
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('question_cards');
        Schema::dropIfExists('answer_cards');

        DB::table('packs')->where('migration_id', '=', $this->migrationId)->delete();
    }
};
