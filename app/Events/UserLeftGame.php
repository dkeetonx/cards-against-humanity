<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Log;

class UserLeftGame implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;
    public $gameRoom;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($user, $gameRoom)
    {
        //
        $this->user = $user;
        $this->gameRoom = $gameRoom;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('App.Models.GameRoom.'.$this->gameRoom->id);
    }

    public function broadcastWith() : array
    {
        return $this->user->attributesToArray();
    }
}
