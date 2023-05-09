<?php

namespace App\Listeners;

use App\Events\UserWonGame;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleUserWonGame
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
     * @param  \App\Events\UserWonGame  $event
     * @return void
     */
    public function handle(UserWonGame $event)
    {
        //
    }
}
