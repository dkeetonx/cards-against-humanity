<?php

namespace App\Listeners;

use App\Events\UserBeganPlaying;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Log;

class HandleUserBeganPlaying
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
     * @param  \App\Events\UserBeganPlaying  $event
     * @return void
     */
    public function handle(UserBeganPlaying $event)
    {
        //
        $user = $event->user;

        if ($user->gameRoom->lastTurnPlayer())
        {
            $user->turn_index = $user->gameRoom->lastTurnPlayer()->turn_index + 1;
        }
        else {
            Log::debug("couldn't find turn index, setting random");
            $user->turn_index = rand(0,100);
        }

        $user->points = 0;
        $user->has_free_redraw = $user->gameRoom->allow_hand_redraw;
        $user->voted = false;

        if ($user->gameRoom->current_questioner === $user->id)
        {
            $user->ready = $user->gameRoom->progressQuestionerReadyState();
        }
        else {
            $user->ready = $user->gameRoom->progressPlayerReadyState();
        }

        $user->dealUserIn();
        $user->save();
    }
}
