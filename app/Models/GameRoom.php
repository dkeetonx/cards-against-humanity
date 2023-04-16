<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameRoom extends Model
{
    use HasFactory;

    protected $fillable = [
        "max_player_count",
        "has_waiting_room",
        "two_question_cards",
        "allow_hand_redraw",
        "question_card_timer",
        "answer_card_timer",
        "player_count",
        "current_questioner",
        "winning_score",
        "progress",
        "owner_id",
    ];

    protected $dispatchesEvents = [
        'updated' => \App\Events\GameUpdated::class,
    ];

    public function owner() : BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function questioner() : BelongsTo
    {
        return $this->belongsTo(User::class, 'current_questioner');
    }

    public function winner() : BelongsTo
    {
        return $this->belongsTo(User::class, 'winner_id');
    }
}
