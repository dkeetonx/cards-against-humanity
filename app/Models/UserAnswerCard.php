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

    public static function boot()
    {
        parent::boot();

        self::created(function($uac)
        {
            event(new \App\Events\UserAnswerCardDrawn($uac));
            return true;
        });

        self::updated(function($uac)
        {
            $trashed = false;
            if ($uac->wasChanged('status'))
            {
                $uac->syncOriginalAttribute('status');
                $uac->syncChanges();

                switch($uac->status)
                {
                    case 'in_hand':
                        event(new \App\Events\UserAnswerCardDrawn($uac));
                        break;
                    case 'in_play':
                        event(new \App\Events\UserAnswerCardPlayed($uac));
                        break;
                    case 'in_trash':
                        $trashed = true;
                        break;
                }
            }
            if ($uac->wasChanged('revealed'))
            {
                $uac->syncOriginalAttribute('revealed');
                $uac->syncChanges();

                if ($uac->revealed)
                {
                    event(new \App\Events\UserAnswerCardRevealed($uac));
                }
            }

            event(new \App\Events\UserAnswerCardChanged($uac));
            if ($trashed)
                event(new \App\Events\UserAnswerCardTrashed($uac));

            return true;
        });

        self::deleted(function($uac)
        {
            event(new \App\Events\UserAnswerCardRecycled($uac));
            return true;
        });
    }
}
