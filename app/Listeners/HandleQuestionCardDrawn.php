<?php

namespace App\Listeners;

use App\Events\UserQuestionCardDrawn;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleQuestionCardDrawn
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
     * @param  \App\Events\UserQuestionCardDrawn  $event
     * @return void
     */
    public function handle(UserQuestionCardDrawn $event)
    {
        //
    }
}
