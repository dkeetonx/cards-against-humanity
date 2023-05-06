<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Log;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'game_room_id',
        'status',
        'turn_index',
        'connected',
        'has_free_redraw',
        'points',
        'playing_status',
        'voted',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $dispatchesEvents = [
        'updated' => \App\Events\UserUpdated::class,
    ];

    public function gameRoom() : BelongsTo
    {
        return $this->belongsTo(GameRoom::class);
    }

    public function userACards() : HasMany
    {
        return $this->hasMany(\App\Models\UserAnswerCard::class)
            ->where('game_room_id', '=', $this->game_room_id);
    }

    public function userQCards() : HasMany
    {
        return $this->hasMany(\App\Models\UserQuestionCard::class)
            ->where('game_room_id', '=', $this->game_room_id);
    }

    public function qCardsInHand()
    {
        return $this->userQCards()->where('status', 'in_hand')->count();
    }

    public function aCardsInHand()

    {
        return $this->userACards()->where('status', 'in_hand')->count();
    }

    public function leaveGameroom($save = false)
    {
        event(new \App\Events\UserLeftGame($this));
        $this->game_room_id = null;
        $this->turn_index = 0;
        $this->has_free_redraw = false;
        $this->points = 0;
        $this->playing_status = "waiting";
        $this->ready = false;
        $this->voted = false;
        if ($save)
        {
            $this->save();
        }
        return true;
    }

    public function drawQuestionCards($drawCount)
    {
        $drawnCount = 0;

        $deckCardCount = $this->gameRoom->qCardCount();

        for ($i = 0; $i < $drawCount; $i++)
        {
            $usedCards = $this->gameRoom->userQuestionCards;

            $maxLoops = 2000;
            $drawnCard = null;
            do {
                $count = 0;
                $index = rand(1, $deckCardCount);

                foreach ($this->gameRoom->gameDeckPacks as $deck)
                {
                    if ($deck->pack->q_count >= $index)
                    {
                        $drawnCard = $deck->pack->questionCards[$index - 1];
                        break;
                    }
                    $index = $index - $deck->pack->q_count;
                }


                $maxLoops--;
                if ($maxLoops < 1)
                {
                    goto out;
                }
            } while (!$drawnCard ||
                     $usedCards->filter(fn($c) => $c->question_card_id === $drawnCard->id)->count() > 0);

            $uqc = new \App\Models\UserQuestionCard;
            $uqc->game_room_id = $this->gameRoom->id;
            $uqc->question_card_id = $drawnCard->id;
            $uqc->user_id = $this->id;
            $uqc->status = "in_hand";
            $uqc->save();
            $this->refresh();
            $drawnCount++;
        }
out:
        return $drawnCount;
    }

    public function drawAnswerCards($drawCount)
    {
        $drawnCount = 0;
        $deckCardCount = $this->gameRoom->aCardCount();

        for ($i = 0; $i < $drawCount; $i++)
        {
            $usedCards = $this->gameRoom->userAnswerCards;

            $maxLoops = 2000;
            $drawnCard = null;
            do {
                $count = 0;
                $index = rand(1, $deckCardCount);

                foreach ($this->gameRoom->gameDeckPacks as $deck)
                {
                    if ($deck->pack->a_count >= $index)
                    {
                        $drawnCard = $deck->pack->answerCards[$index - 1];
                        break;
                    }
                    $index = $index - $deck->pack->a_count;
                }


                $maxLoops--;
                if ($maxLoops < 1)
                {
                    goto out;
                }
            } while (!$drawnCard ||
                     $usedCards->filter(fn($c) => $c->answer_card_id === $drawnCard->id)->count() > 0);

            $uqc = new \App\Models\UserAnswerCard;
            $uqc->game_room_id = $this->gameRoom->id;
            $uqc->answer_card_id = $drawnCard->id;
            $uqc->user_id = $this->id;
            $uqc->status = "in_hand";
            $uqc->save();
            //$this->refresh();

            $drawnCount++;
        }

out:
        return $drawnCount;
    }

    public function dealQuestioner()
    {
        $drawCount = $this->gameRoom->qCardDrawCount() - $this->qCardsInHand();
        $drawnCount = $this->drawQuestionCards($drawCount);
        if ($drawnCount < $drawCount)
        {
            $this->gameRoom->reshuffleQCards();
            $this->drawQuestionCards($drawCount - $drawnCount);
        }
    }

    public function dealUserIn()
    {
        $drawCount = $this->gameRoom->aCardDrawCount() - $this->aCardsInHand();
        $drawnCount = $this->drawAnswerCards($drawCount);
        if ($drawnCount < $drawCount)
        {
            $this->gameRoom->reshuffleACards();
            $this->drawAnswerCards($drawCount - $drawnCount);
        }
    }

    public function dealUserOut()
    {
        foreach ($this->userQCards as $uqc)
        {
            $uqc->status = "in_trash";
            $uqc->save();
        }
        foreach ($this->userACards as $uac)
        {
            $uac->status = "in_trash";
            $uac->save();
        }
    }

    public static function boot()
    {
        parent::boot();

        self::updating(function($user)
        {
            if (!$user->original['game_room_id'])
            {
                return true;
            }

            if ($user->original['game_room_id'] !== $user->game_room_id)
            {
                $newGameRoomId = $user->game_room_id;
                $user->game_room_id = $user->original['game_room_id'];
                $user->dealUserOut();
                if ($user->gameRoom->current_questioner == $user->id)
                {
                    $user->gameRoom->current_questioner = null;
                    $user->gameRoom->skipGame();
                    $user->gameRoom->save();
                }
                $user->game_room_id = $newGameRoomId;
                $user->points = 0;

                $user->load('gameRoom');
                if ($user->gameRoom && $user->gameRoom->lastTurnPlayer())
                {
                    Log::debug("player updated to {$user->playing_status}, setting points and turn");
                    $user->turn_index = $user->gameRoom->lastTurnPlayer()->turn_index + 1;
                }
            }

            if ($user->gameRoom)
            {
                if (!$user->original['playing_status']
                    ||
                    $user->original['playing_status'] !== $user->playing_status)
                {
                    Log::debug("playing status changed");
                    if ($user->playing_status === "playing")
                    {
                        Log::debug("player updated to {$user->playing_status}, setting points and turn");
                        $user->load('gameRoom');
                        $user->points = 0;
                        $user->turn_index = $user->gameRoom->lastTurnPlayer()->turn_index + 1;

                        $user->dealUserIn();
                        $user->ready = $user->gameRoom->progressPlayerReadyState();
                    }
                    else {
                        if ($user->gameRoom->current_questioner == $user->id)
                        {
                            $user->gameRoom->current_questioner = null;
                            $user->gameRoom->skipGame();
                            $user->gameRoom->save();
                        }
                    }
                }
                else 
                {
                    Log::debug("playing status did not change");
                }
            }
            else {
                Log::debug("no game room");
                $user->turn_index = 0;
                $user->voted = false;
            }

            Log::debug($user->playing_status);
            return true;
        });

        self::updated(function($user)
        {
            if ($user->gameRoom && $user->voted && $user->gameRoom !== "prestart")
            {
                Log::debug("user->gameRoom->countVotes()");
                $user->gameRoom->countVotes();
                $user->gameRoom->save();
            }
            Log::debug("user updated");
            Log::debug($user->playing_status);
            return true;
        });
    }
}
