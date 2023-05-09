<?php

namespace App\Listeners;

use App\Events\GameProgressed;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleGameProgressed
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
     * @param  \App\Events\GameProgressed  $event
     * @return void
     */
    public function handle(GameProgressed $event)
    {
        //
    }
}
