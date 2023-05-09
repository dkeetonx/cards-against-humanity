<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Log;

class LogUserEvent
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
     * @param  \App\Events\Event  $event
     * @return void
     */
    public function handle($event)
    {
        //
        $eventClass = get_class($event);
        Log::debug("Event Fired: {$eventClass} for User({$event->user->id})");
    }
}
