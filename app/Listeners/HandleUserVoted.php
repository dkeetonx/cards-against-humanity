<?php

namespace App\Listeners;

use App\Events\UserVoted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Log;

class HandleUserVoted
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
     * @param  \App\Events\UserVoted  $event
     * @return void
     */
    public function handle(UserVoted $event)
    {
        //
        $user = $event->user;

        if ($user->gameRoom !== "prestart")
        {
            Log::debug("user->gameRoom->countVotes()");
            $user->gameRoom->countVotes();
            $user->gameRoom->save();
        }
    }
}
