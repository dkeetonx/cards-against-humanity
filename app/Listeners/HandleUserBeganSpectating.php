<?php

namespace App\Listeners;

use App\Events\UserBeganSpectating;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleUserBeganSpectating
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
     * @param  \App\Events\UserBeganSpectating  $event
     * @return void
     */
    public function handle(UserBeganSpectating $event)
    {
        //
    }
}
