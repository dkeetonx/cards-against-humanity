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

    public function leaveGameRoom($save = false)
    {
        $wasCurrentQuestioner = false;
        $gameRoom = $this->gameRoom;
        if ($this->gameRoom && $this->gameRoom->current_questioner == $this->id)
        {
            $wasCurrenQuestioner = true;
            $gameRoom = $this->gameRoom;
        }
        foreach ($this->userQCards as $uqc)
        {
            $uqc->status = "in_trash";
            $uqc->save();
        }

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

        if ($wasCurrentQuestioner)
        {
            $gameRoom->current_questioner = null;
            $gameRoom->progressGame();
            $gameRoom->save();
        }
        if ($gameRoom)
        {
            event(new \App\Events\UserLeftGame($this, $gameRoom->id));
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

            Log::debug("drawing cards. blank_card_rate = {$this->gameRoom->blank_card_rate}");

            $drawBlankCard = false;

            if ($this->gameRoom->blank_card_rate > 0)
            {
                $drawBlankCard = rand(1, floor(100/$this->gameRoom->blank_card_rate)) == 1;
            }

            $drawnCard = null;

            if ($drawBlankCard)
            {
                Log::debug("drawBlankCard triggered");
                $drawnCard = new AnswerCard;
                $drawnCard->id = null;
            }
            else {
                $maxLoops = 2000;
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
            }

            $uac = new \App\Models\UserAnswerCard;
            $uac->game_room_id = $this->gameRoom->id;
            $uac->answer_card_id = $drawnCard->id;
            $uac->user_id = $this->id;
            $uac->status = "in_hand";
            $uac->save();
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

        self::updated(function($user)
        {
            $original = $user->getOriginal();
            if ($user->wasChanged('game_room_id') &&
                array_key_exists('game_room_id', $original) && 
                $original['game_room_id'])
            {
                $gameRoom = GameRoom::find($original['game_room_id']);

                $newGameRoomId = $user->game_room_id;

                $user->game_room_id = $gameRoom->id;

                $user->dealUserOut();

                if ($gameRoom->current_questioner == $user->id)
                {
                    $gameRoom->current_questioner = null;
                    $gameRoom->skipGame();
                    $gameRoom->save();
                }
                $user->game_room_id = $newGameRoomId;
                $user->points = 0;

                $user->load('gameRoom');
                if ($user->gameRoom && $user->gameRoom->lastTurnPlayer())
                {
                    Log::debug("player updated to {$user->playing_status}, setting points and turn");
                    $user->turn_index = $user->gameRoom->lastTurnPlayer()->turn_index + 1;
                }
                $user->saveQuietly();
            }

            if ($user->gameRoom)
            {
                if ($user->voted && $user->gameRoom !== "prestart")
                {
                    Log::debug("user->gameRoom->countVotes()");
                    $user->gameRoom->countVotes();
                    $user->gameRoom->save();
                }

                if ($user->wasChanged('connected'))
                {
                    if (!$user->connected && $user->gameRoom)
                    {
                        Log::debug("user disconnected, going to spectator");
                        if ($user->playing_status == "playing")
                        {
                            $user->playing_status = 'spectating';
                            $user->saveQuietly();
                        }
                    }
                }
        
                if ($user->wasChanged('playing_status'))
                {
                    Log::debug("playing status changed");
                    if ($user->playing_status === "playing")
                    {
                        Log::debug("player updated to {$user->playing_status}, setting points and turn");
                        $user->load('gameRoom');
                        $user->points = 0;
                        $user->turn_index = $user->gameRoom->lastTurnPlayer()->turn_index + 1;

                        $user->dealUserIn();
                        if ($user->gameRoom->current_questioner === $user->id)
                        {
                            $user->ready = $user->gameRoom->progressQuestionerReadyState();
                        }
                        else {
                            $user->ready = $user->gameRoom->progressPlayerReadyState();
                        }
                        $user->saveQuietly();
                    }
                    else {
                        if ($user->gameRoom->current_questioner == $user->id)
                        {
                            $user->gameRoom->current_questioner = null;
                            $user->gameRoom->skipGame();
                            $user->gameRoom->save();
                        }
                        else {
                            $user->gameRoom->countReady();
                            $user->gameRoom->save();
                        }
                    }
                }
            }
            else {
                $user->turn_index = 0;
                $user->voted = false;
                $user->saveQuietly();
            }



            if ($user->wasChanged('playing_status'))
            {
                if ($user->playingStatus == "spectating"
                    && $user->gameRoom
                    && $user->gameRoom->current_questioner === $user->id)
                {
                    Log::debug("questioner became spectator");
                    foreach ($this->userQCards as $uqc)
                    {
                        $uqc->status = "in_trash";
                        $uqc->save();
                    }
                    $this->current_questioner = null;
                    $this->gameRoom->progressGame();
                    $this->save();
                }
            }


            Log::debug("user updated");
            return true;
        });
    }
}
