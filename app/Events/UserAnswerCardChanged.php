<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserAnswerCardChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    private $userAnswerCard;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($userAnswerCard)
    {
        //
        $this->userAnswerCard = $userAnswerCard;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('App.Models.GameRoom.'.$this->userAnswerCard->game_room_id);
    }

    public function broadcastWith() : array
    {
        if ($this->userAnswerCard->revealed)
        {
            $this->userAnswerCard->card;
        }
        return $this->userAnswerCard->toArray();
    }
}
