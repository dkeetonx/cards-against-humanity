<?php

namespace App\Listeners;

use App\Events\UserDisconnected;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Log;

class HandleUserDisconnected
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
     * @param  \App\Events\UserDisconnected  $event
     * @return void
     */
    public function handle(UserDisconnected $event)
    {
        //
        $user = $event->user;

        Log::debug("user disconnected, going to spectator");
        if ($user->playing_status == "playing")
        {
            $user->playing_status = 'spectating';
            $user->save();
        }

        if ($user->gameRoom && $user->gameRoom->owner_id == $user->id)
        {
            $user->gameRoom->owner_id = null;
            $user->gameRoom->save();
        }
    }
}
