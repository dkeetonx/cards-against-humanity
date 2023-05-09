<?php

namespace App\Listeners;

use App\Events\UserBecameReady;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleUserBecameReady
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
     * @param  \App\Events\UserBecameReady  $event
     * @return void
     */
    public function handle(UserBecameReady $event)
    {
        //
    }
}
