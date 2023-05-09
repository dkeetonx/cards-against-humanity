<?php

namespace App\Listeners;

use App\Events\UserJoinedGame;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Log;

class HandleUserJoinedGame
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
     * @param  \App\Events\UserJoinedGame  $event
     * @return void
     */
    public function handle(UserJoinedGame $event)
    {
        //
        $user = $event->user;

        if  ($user->gameRoom->has_waiting_room && $user->gameRoom->owner_id != $user->id)
        {
            $user->playing_status = "waiting";
        }
        else {
            if ($user->gameRoom->progress == "prestart")
            {
                $user->playing_status = "playing";
            }
            else {
                $user->playing_status = "spectating";
            }
        }
        $user->save();
    }
}
