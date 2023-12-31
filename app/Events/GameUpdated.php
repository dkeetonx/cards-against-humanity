<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class GameUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    private $game;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($game)
    {
        //
        $this->game = $game;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('App.Models.GameRoom.'.$this->game->id);
    }

    public function broadcastWith() : array
    {
        $gr = $this->game->attributesToArray();
        if ($gr['deadline_at'])
        {
            $gr['deadline_in'] = Carbon::now()->diffInMilliseconds($this->game->deadline_at, false);
        }
        else {
            $gr['deadline_in'] = 0;
        }
        return $gr;
    }
}
