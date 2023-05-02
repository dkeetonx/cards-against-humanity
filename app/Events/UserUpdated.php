<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    private $user;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($user)
    {
        //
        $this->user = $user;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        $userChannel = new PrivateChannel('App.Models.User.'.$this->user->id);
        if ($this->user->game_room_id)
        {
            return [
                $userChannel,
                new PrivateChannel('App.Models.GameRoom.'.$this->user->game_room_id),
            ];
        }
        else {
            return $userChannel;
        }
    }

    public function broadcastWith() : array
    {
        return $this->user->toArray();
    }
}
