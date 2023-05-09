<?php

namespace App\Listeners;

use App\Events\GameQuestionerChanged;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleGameQuestionerChanged
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
     * @param  \App\Events\GameQuestionerChanged  $event
     * @return void
     */
    public function handle(GameQuestionerChanged $event)
    {
        //
    }
}
