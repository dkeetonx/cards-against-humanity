<?php

namespace App\Listeners;

use App\Events\UserQuestionCardPlayed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleUserQuestionCardPlayed
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
     * @param  \App\Events\UserQuestionCardPlayed  $event
     * @return void
     */
    public function handle(UserQuestionCardPlayed $event)
    {
        //
    }
}
