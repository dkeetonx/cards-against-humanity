<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use \App\Events\ModelEvent;
use Log;

class LogModelEvent
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
    public function handle(ModelEvent $event)
    {
        //
        $eventClass = get_class($event);
        Log::debug("Event Fired: {$eventClass} id({$event->model->id})");
    }
}
