<?php

namespace App\Listeners;

use App\Events\UserQuestionCardTrashed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleUserQuestionCardTrashed
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
     * @param  \App\Events\UserQuestionCardTrashed  $event
     * @return void
     */
    public function handle(UserQuestionCardTrashed $event)
    {
        //
    }
}
