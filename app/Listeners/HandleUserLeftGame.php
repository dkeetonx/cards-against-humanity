<?php

namespace App\Listeners;

use App\Events\UserLeftGame;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Log;

class HandleUserLeftGame
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
     * @param  \App\Events\UserLeftGame  $event
     * @return void
     */
    public function handle(UserLeftGame $event)
    {
        //
        $user = $event->user;
        $gameRoom = $event->gameRoom;

        // Deal user out
        foreach ($user->userQCards($gameRoom->id)->get() as $uqc)
        {
            $uqc->status = "in_trash";
            $uqc->save();
        }
        foreach ($user->userACards($gameRoom->id)->get() as $uac)
        {
            $uac->status = "in_trash";
            $uac->save();
        }

        if ($gameRoom->owner_id == $user->id)
        {
            $gameRoom->owner_id = null;
            $gameRoom->save();
        }
    }
}
