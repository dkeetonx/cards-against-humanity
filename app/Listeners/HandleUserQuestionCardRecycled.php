<?php

namespace App\Listeners;

use App\Events\UserQuestionCardRecycled;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleUserQuestionCardRecycled
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
     * @param  \App\Events\UserQuestionCardRecycled  $event
     * @return void
     */
    public function handle(UserQuestionCardRecycled $event)
    {
        //
    }
}
