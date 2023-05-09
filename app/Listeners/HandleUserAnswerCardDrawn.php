<?php

namespace App\Listeners;

use App\Events\UserAnswerCardDrawn;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleUserAnswerCardDrawn
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
     * @param  \App\Events\UserAnswerCardDrawn  $event
     * @return void
     */
    public function handle(UserAnswerCardDrawn $event)
    {
        //
    }
}
