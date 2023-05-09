<?php

namespace App\Listeners;

use App\Events\UserAnswerCardRevealed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleUserAnswerCardRevealed
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
     * @param  \App\Events\UserAnswerCardRevealed  $event
     * @return void
     */
    public function handle(UserAnswerCardRevealed $event)
    {
        //
    }
}
