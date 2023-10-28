<?php

namespace App\Listeners;

use App\Events\UserConnected;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Database\Eloquent\Builder;
use Log;

class HandleUserConnected
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
     * @param  \App\Events\UserConnected  $event
     * @return void
     */
    public function handle(UserConnected $event)
    {
        //
        $user = $event->user;
        if ($user->gameRoom)
        {
            /*
             * Something may have happened to the web server or websocket provider
             * in cases where nobody is the owner, we'll just make the first connected
             * user into the owner
             */
            if (!$user->gameRoom->owner_id)
            {
                $user->gameRoom->owner_id = $user->id;
                $user->gameRoom->save();
            }
        }

        if ($user->gameRoom)
        {
            Log::debug("User connected so, Broadcasting GameUpdated event");
            event(new \App\Events\GameUpdated($user->gameRoom));

            foreach ($user->gameRoom->users as $peer)
            {
                Log::debug("User ($user->id} connected, Broadcasting user: {$peer->id}");
                event(new \App\Events\UserUpdated($peer));
            }

            $questionCards = $user->gameRoom->userQuestionCards()
                ->where(function (Builder $query) {
                    $query->where('status', '=', 'in_play')
                          ->orWhere('status', '=', 'in_hand');
                })
                ->get();

            foreach ($questionCards as $uqc)
            {
                event(new \App\Events\UserQuestionCardChanged($uqc));
            }

            $answerCards = $user->userACards()
                ->where(function (Builder $query) {
                    $query->where('status', '=', 'in_play')
                          ->orWhere('status', '=', 'in_hand');
                })
                ->get();

            foreach ($answerCards as $uac)
            {
                event(new \App\Events\UserAnswerCardChanged($uac));
            }
        }
    }
}
