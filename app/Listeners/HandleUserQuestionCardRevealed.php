<?php

namespace App\Listeners;

use App\Events\UserQuestionCardRevealed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleUserQuestionCardRevealed
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
     * @param  \App\Events\UserQuestionCardRevealed  $event
     * @return void
     */
    public function handle(UserQuestionCardRevealed $event)
    {
        //
    }
}
