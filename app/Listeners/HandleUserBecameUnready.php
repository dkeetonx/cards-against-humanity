<?php

namespace App\Listeners;

use App\Events\UserBecameUnready;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleUserBecameUnready
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
     * @param  \App\Events\UserBecameUnready  $event
     * @return void
     */
    public function handle(UserBecameUnready $event)
    {
        //
    }
}
