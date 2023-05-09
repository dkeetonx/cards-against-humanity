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
        'ready',
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

    public function userACards($game_room_id = null) : HasMany
    {
        if ($game_room_id) {
            return $this->hasMany(\App\Models\UserAnswerCard::class)
                ->where('game_room_id', '=', $game_room_id);
        }
        else {
            return $this->hasMany(\App\Models\UserAnswerCard::class)
            ->where('game_room_id', '=', $this->game_room_id);
        }
    }

    public function userQCards($game_room_id = null) : HasMany
    {
        if ($game_room_id) {
            return $this->hasMany(\App\Models\UserQuestionCard::class)
                ->where('game_room_id', '=', $game_room_id);
        }
        else {
            return $this->hasMany(\App\Models\UserQuestionCard::class)
                ->where('game_room_id', '=', $this->game_room_id);
        }
    }

    public function qCardsInHand()
    {
        return $this->userQCards()->where('status', 'in_hand')->count();
    }

    public function aCardsInHand()

    {
        return $this->userACards()->where('status', 'in_hand')->count();
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
            if ($user->wasChanged('game_room_id'))
            {
                $wasInGameRoom = GameRoom::find($user->getOriginal('game_room_id', null));

                // Set game_room_id back to unchanged
                $user->syncOriginalAttribute('game_room_id');
                $user->syncChanges();

                if ($wasInGameRoom)
                {
                    event(new \App\Events\UserLeftGame($user, $wasInGameRoom));
                    event(new \App\Events\UserStoppedPlaying($user, $wasInGameRoom));
                }

                if ($user->gameRoom)
                {
                    event(new \App\Events\UserJoinedGame($user));
                    if (!$user->wasChanged('playing_status'))
                    {
                        switch($user->playing_status) {
                            case "waiting":
                                event(new \App\Events\UserBeganWaiting($user));
                                break;
                            case "spectating":
                                event(new \App\Events\UserBeganSpectating($user));
                                break;
                            case "playing":
                                event(new \App\Events\UserBeganPlaying($user));
                                break;
                        }
                    }
                }
            }

            if ($user->gameRoom)
            {
                if ($user->wasChanged('voted'))
                {
                    // Set voted back to unchanged
                    $user->syncOriginalAttribute('voted');
                    $user->syncChanges();

                    if ($user->voted)
                    {
                        event(new \App\Events\UserVoted($user));
                    }
                }

                if ($user->wasChanged('ready'))
                {
                    // Set ready back to unchanged
                    $user->syncOriginalAttribute('ready');
                    $user->syncChanges();

                    if ($user->ready)
                    {
                        event(new \App\Events\UserBecameReady($user));
                    }
                    else {
                        event(new \App\Events\UserBecameUnready($user));
                    }
                }

                if ($user->wasChanged('connected'))
                {
                    // Set voted back to unchanged
                    $user->syncOriginalAttribute('connected');
                    $user->syncChanges();

                    if ($user->connected)
                    {
                        event(new \App\Events\UserConnected($user));
                    }
                    else {
                        event(new \App\Events\UserDisconnected($user));
                    }
                }
        
                if ($user->wasChanged('playing_status'))
                {
                    $wasPlayingStatus = $user->getOriginal('playing_status');

                    // Set playing_status back to unchanged
                    $user->syncOriginalAttribute('playing_status');
                    $user->syncChanges();

                    switch($user->playing_status) {
                        case "waiting":
                            event(new \App\Events\UserBeganWaiting($user));
                            break;
                        case "spectating":
                            event(new \App\Events\UserBeganSpectating($user));
                            break;
                        case "playing":
                            event(new \App\Events\UserBeganPlaying($user));
                            break;
                    }

                    if ($wasPlayingStatus == "playing")
                    {
                        event(new \App\Events\UserStoppedPlaying($user, $user->gameRoom));
                    }
                }
            }

            return true;
        });
    }
}
