<?php

namespace App\Listeners;

use App\Events\UserAnswerCardPlayed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleUserAnswerCardPlayed
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
     * @param  \App\Events\UserAnswerCardPlayed  $event
     * @return void
     */
    public function handle(UserAnswerCardPlayed $event)
    {
        //
    }
}
