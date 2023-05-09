<?php

namespace App\Listeners;

use App\Events\UserAnswerCardRecycled;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleUserAnswerCardRecycled
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
     * @param  \App\Events\UserAnswerCardRecycled  $event
     * @return void
     */
    public function handle(UserAnswerCardRecycled $event)
    {
        //
    }
}
