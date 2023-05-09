<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserQuestionCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_room_id',
        'question_card_id',
        'user_id',
        'status'
    ];

    public function gameRoom() : BelongsTo
    {
        return $this->belongsTo(\App\Models\GameRoom::class);
    }

    public function card() : BelongsTo
    {
        return $this->belongsTo(\App\Models\QuestionCard::class, 'question_card_id');
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public static function boot()
    {
        parent::boot();

        self::created(function($uqc)
        {
            event(new \App\Events\UserQuestionCardDrawn($uqc));
            return true;
        });

        self::updated(function($uqc)
        {
            $trashed = false;
            if ($uqc->wasChanged('status'))
            {
                $oldStatus = $uqc->getOriginal()['status'];
                $uqc->syncOriginalAttribute('status');
                $uqc->syncChanges();

                switch($uqc->status)
                {
                    case 'in_hand':
                        event(new \App\Events\UserQuestionCardDrawn($uqc));
                        break;
                    case 'in_play':
                        event(new \App\Events\UserQuestionCardPlayed($uqc));
                        break;
                    case 'in_trash':
                        $trashed = true;
                        break;
                }
            }
            if ($uqc->wasChanged('revealed'))
            {
                $uqc->syncOriginalAttribute('revealed');
                $uqc->syncChanges();

                if ($uqc->revealed)
                {
                    event(new \App\Events\UserQuestionCardRevealed($uqc));
                }
            }

            event(new \App\Events\UserQuestionCardChanged($uqc));
            if ($trashed)
                event(new \App\Events\UserQuestionCardTrashed($uqc));
    
            return true;
        });

        self::deleted(function($uqc)
        {
            event(new \App\Events\UserQuestionCardRecycled($uqc));
            return true;
        });
    }
}
