<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAnswerCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_room_id',
        'answer_card_id',
        'pack_id',
        'user_id',
        'status'
    ];

    protected $dispatchesEvents = [
        'updated' => \App\Events\UserAnswerCardChanged::class,
    ];

    public function gameRoom() : BelongsTo
    {
        return $this->belongsTo(\App\Models\GameRoom::class);
    }

    public function card() : BelongsTo
    {
        return $this->belongsTo(\App\Models\AnswerCard::class, 'answer_card_id');
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
