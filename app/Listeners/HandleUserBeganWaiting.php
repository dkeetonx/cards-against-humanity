<?php

namespace App\Listeners;

use App\Events\UserBeganWaiting;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleUserBeganWaiting
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
     * @param  \App\Events\UserBeganWaiting  $event
     * @return void
     */
    public function handle(UserBeganWaiting $event)
    {
        //
    }
}
