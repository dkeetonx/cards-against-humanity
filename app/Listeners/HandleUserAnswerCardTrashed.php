<?php

namespace App\Listeners;

use App\Events\UserAnswerCardTrashed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleUserAnswerCardTrashed
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
     * @param  \App\Events\UserAnswerCardTrashed  $event
     * @return void
     */
    public function handle(UserAnswerCardTrashed $event)
    {
        //
    }
}
