<?php

namespace App\Listeners;

use App\Events\UserStoppedPlaying;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleUserStoppedPlaying
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
     * @param  \App\Events\UserStoppedPlaying  $event
     * @return void
     */
    public function handle(UserStoppedPlaying $event)
    {
        //
        $user = $event->user;
        $gameRoom = $event->gameRoom;

        if ($gameRoom->current_questioner == $user->id)
        {
            $gameRoom->current_questioner = null;
        }
        $gameRoom->countReady();
        $gameRoom->save();
    }
}
