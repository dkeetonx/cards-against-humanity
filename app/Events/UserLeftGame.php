<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserLeftGame implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    private $user;
    private $gameRoomId;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($user, $gameRoomId)
    {
        //
        $this->user = $user;
        $this->gameRoomId = $gameRoomId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('App.Models.GameRoom.'.$this->gameRoomId);
    }

    public function broadcastWith() : array
    {
        return $this->user->attributesToArray();
    }
}
