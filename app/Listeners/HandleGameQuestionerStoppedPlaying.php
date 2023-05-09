<?php

namespace App\Listeners;

use App\Events\GameQuestionerStoppedPlaying;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleGameQuestionerStoppedPlaying
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\GameQuestionerStoppedPlaying  $event
     * @return void
     */
    public function handle(GameQuestionerStoppedPlaying $event)
    {
        //
        $gameRoom = $event->gameRoom;

        $gameRoom->progress = $gameRoom->skipProgress();
        $gameRoom->save();
    }
}
