<?php

namespace App\Listeners;

use App\Events\GameOwnerChanged;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandleGameOwnerChanged
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
     * @param  \App\Events\GameOwnerChanged  $event
     * @return void
     */
    public function handle(GameOwnerChanged $event)
    {
        //
        $gameRoom = $event->gameRoom;

        if (!$gameRoom->owner_id)
        {
            $next = $gameRoom->users()->orderBy('turn_index', 'asc');
            if (config('app.env') != 'local')
            {
                $next->where('connected', '=', true);
            }
            $nextOldestUser = $next->first();
            if ($nextOldestUser)
            {
                $gameRoom->owner_id = $nextOldestUser->id;
                $gameRoom->save();
            }
        }
    }
}
