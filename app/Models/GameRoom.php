<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;
use Log;

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
        'room_code',
        'deadline_at',
        'user_question_card_id',
        'winner_id',
        'answer_count',
        'winning_group_id',
    ];
    protected $casts = [
        'deadline_at' => 'datetime',
    ];

    protected $dispatchesEvents = [
        'updated' => \App\Events\GameUpdated::class,
    ];

    public function owner() : BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function questioner()
    {
        return $this->players->where('id', '=', $this->current_questioner)->first();
    }

    public function winner() : BelongsTo
    {
        return $this->belongsTo(User::class, 'winner_id');
    }

    public function users() : HasMany
    {
        return $this->hasMany(User::class);
    }

    public function players() : HasMany
    {
        return $this->users()->where('playing_status', '=', 'playing');
    }

    public function gameDeckPacks() : HasMany
    {
        return $this->hasMany(\App\Models\GameDeckPack::class);
    }

    public function userQuestionCards() : HasMany
    {
        return $this->hasMany(\App\Models\UserQuestionCard::class);
    }

    public function userAnswerCards() : HasMany
    {
        return $this->hasMany(\App\Models\UserAnswerCard::class);
    }

    public function winningUser() : BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'winning_group_id');
    }

    public function qCardCount()
    {
        return $this->gameDeckPacks->reduce(fn($sum, $deck) => $sum + $deck->pack->q_count, 0);
    }

    public function qCardDrawCount()
    {
        return $this->two_question_cards ? 2 : 1;
    }


    public function aCardCount()
    {
        return $this->gameDeckPacks->reduce(fn($sum, $deck) => $sum + $deck->pack->a_count, 0);
    }

    public function aCardDrawCount()
    {
        return 10;
    }

    public function nextTurnPlayer()
    {
        $questionerTurnIndex = $this->questioner() ? $this->questioner()->turn_index : 0;

        $next = $this->players()->orderBy('turn_index', 'asc')
            ->where('connected', '=', true)
            ->where('turn_index', '>', $questionerTurnIndex)
            ->first();
        if (!$next)
        {
            Log::debug("nextTurnPlayer rolling over");
            $next = $this->players()->orderBy('turn_index', 'asc')
                ->where('connected', '=', true)
                ->first();
        }
        return $next;
    }

    public function lastTurnPlayer()
    {
        return $this->players()->orderBy('turn_index', 'desc')->first();
    }

    public function reshuffleQCards()
    {
        foreach ($this->userQuestionCards->where('status', '<>', 'in_hand') as $uqc)
        {
            $uqc->delete();
        }
    }
    public function reshuffleACards()
    {
        foreach ($this->userAnswerCards->where('status', '<>', 'in_hand') as $uac)
        {
            $uac->delete();
        }
    }

    public function countVotes()
    {
        Log::debug("countVotes");
        $skip = true;
        foreach ($this->players as $player)
        {
            if ($player->ready && !$player->voted)
            {
                Log::debug("skipping because player {$player->name} did not vote");
                $skip = false;
                break;
            }
        }

        foreach ($this->players as $player)
        {
            if (!$player->ready)
            {
                $player->playing_status = "spectating";
            }
        }

        if ($skip)
        {
            $this->skipGame();
        }
    }

    public function countReady()
    {
        $progress = true;
        foreach ($this->players as $player)
        {
            if (!$player->ready)
            {
                $progress = false;
                break;
            }
        }
        Log::Debug("progress = ".($progress ? "true" : "false"));
        if ($progress)
        {
            $this->progressGame();
        }
    }

    public function setPlayersNotVoted($save = false)
    {
        foreach ($this->players as $player)
        {
            if ($this->questioner() && $this->questioner()->id === $player->id)
                continue;


            $player->voted = false;
            if ($save)
                $player->save();
        }
    }

    public function setPlayersDefaultReady($save = false)
    {
        foreach ($this->players as $player)
        {
            Log::debug("setting player {$player->name} ready");
            if ($this->questioner() && $this->current_questioner === $player->id)
            {
                Log::debug("skipping because they're the questioner");
                continue;
            }

            $player->ready = $this->progressPlayerReadyState();
            if ($save)
                $player->save();
        }
    }

    public function saveAllUsers()
    {
        foreach ($this->players as $player)
        {
            Log::debug($player->points);
            $player->touch();
            $player->save();
        }
    }

    public function saveAllCards()
    {
        foreach ($this->userAnswerCards as $uac)
        {
            $uac->save();
        }

        foreach ($this->userQuestionCards as $uqc)
        {
            $uqc->save();
        }
    }

    public function trashCardsInPlay()
    {
        foreach ($this->userAnswerCards->where('status', '=', 'in_play') as $uac)
        {
            Log::debug("trashing acard {$uac->id}");
            $uac->status = 'in_trash';
            $uac->save();
        }
        foreach ($this->userQuestionCards->where('status', '=', 'in_play') as $uqc)
        {
            Log::debug("trashing qcard {$uqc->id}");
            $uqc->status = "in_trash";
            $uqc->save();
        }
    }

    public function checkForWinner()
    {
        $endGame = false;
        foreach ($this->players as $player)
        {
            if ($this->winning_score > 0 && $player->points >= $this->winning_score)
            {
                Log::debug("winning player found");
                $endGame = true;
            }
        }
        return $endGame;
    }
    public function skipGame($save = false)
    {
        Log::debug("skipGame from {$this->progress}");
        switch ($this->progress)
        {
            case "prestart":
                break;
            case "choosing_qcard":
                $this->progress = "revealing_winner";
                break;
            case "answering":
                $this->progress = "picking_winner";
                break;
            case "picking_winner":
                $this->progress = "revealing_winner";
                break;
            case "revealing_winner":
                if ($this->checkForWinner())
                {
                    Log::debug("setting game to prestart");
                    $this->progress = "prestart";
                }
                else {
                    $this->progress = "choosing_qcard";
                }
                break;
        }

        if ($save)
        {
            $this->save();
        }
    }

    public function progressGame($save = false)
    {
        Log::debug("progressGame from {$this->progress}");
        switch ($this->progress)
        {
            case "prestart":
                $this->progress = "choosing_qcard";
                break;
            case "choosing_qcard":
                $this->progress = "answering";
                break;
            case "answering":
                $this->progress = "picking_winner";
                break;
            case "picking_winner":
                $this->progress = "revealing_winner";
                break;
            case "revealing_winner":
                if ($this->checkForWinner())
                {
                    Log::debug("setting game to prestart");
                    $this->progress = "prestart";
                }
                else {
                    $this->progress = "choosing_qcard";
                }
                break;
        }
        Log::debug("to {$this->progress}");
        if ($save)
        {
            $this->save();
        }
    }

    public function progressPlayerReadyState()
    {
        switch ($this->progress)
        {
            case "prestart":
                return false;
            case "choosing_qcard":
                return true;
            case "answering":
                return false;
            case "picking_winner";
                return true;
            case "revealing_winner";
                return true;
        }
    }
    public function progressQuestionerReadyState()
    {
        switch ($this->progress)
        {
            case "prestart":
                return true;
            case "choosing_qcard":
                return false;
            case "answering":
                return true;
            case "picking_winner";
                return false;
            case "revealing_winner";
                return false;
        }
    }

    public static function boot()
    {
        parent::boot();
        self::updating(function($gameRoom)
        {
            if ($gameRoom->progress === $gameRoom->original['progress'])
            {
                return true;
            }
            $gameRoom->{$gameRoom->progress}();
            return true;
        });

        self::creating(function($gameRoom)
        {
            $gameRoom->prestart();
            return true;
        });

        self::updated(function($gameRoom)
        {
            return true;
        });
    }

    public function prestart()
    {
        Log::debug("updated to prestart");
        $this->trashCardsInPlay();
        $this->setPlayersNotVoted();
        $this->setPlayersDefaultReady();
        $this->user_question_card_id = null;
        $this->deadline_at = Carbon::now()->addMinutes(10);

        $this->owner->ready = true;
        $this->owner->voted = false;
        $this->saveAllUsers();
        $this->saveAllCards();    
    }

    public function choosing_qcard()
    {
        Log::debug("updated to deal");

        Log::debug("setting new questioner");
        $questioner = $this->nextTurnPlayer();
        $this->current_questioner = $questioner->id;
        Log::debug("nextTurnUser() = {$this->current_questioner}");

        $this->trashCardsInPlay(true);
        $this->setPlayersNotVoted();
        $this->setPlayersDefaultReady();

        Log::debug("questioner = ".$this->questioner()->id);
        $this->questioner()->ready = $this->progressQuestionerReadyState();
        $this->questioner()->voted = false;

        $this->winning_group_id = null;
        $this->user_question_card_id = null;
        $this->answer_count = 1;

        foreach ($this->users->where('playing_status', 'playing') as $user)
        {
            if ($questioner->id === $user->id)
            {
                $user->dealQuestioner();
            }
            $user->dealUserIn();
        }

        if (!$this->two_question_cards)
        {
            Log::debug("two_question_cards was not set, setting qcards to in_play");
            foreach ($questioner->userQCards as $uqc)
            {
                if ($uqc->status == "in_hand")
                {
                    Log::debug("setting uqc({$uqc->id}) to in_play");
                    $uqc->status = "in_play";
                    $uqc->save();
                    $this->answer_count = $uqc->card->pick;
                }
            }
            $this->progressGame();
            $this->{$this->progress}();
            return;
        }
        else {
            $this->deadline_at = Carbon::now()->addMinutes($this->question_card_timer);
        }
        $this->saveAllUsers();
        $this->saveAllCards();
    }

    public function answering()
    {
        if ($this->current_questioner === null)
        {
            Log::debug("answering: Skipping to next because current_questioner was not set");
            $this->progressGame();
            $this->{$this->progress}();
            return;
        }

        $this->setPlayersNotVoted();
        $this->setPlayersDefaultReady();
        $this->questioner()->ready = $this->progressQuestionerReadyState();
        $this->questioner()->voted = false;
        $this->deadline_at = Carbon::now()->addMinutes($this->answer_card_timer);

        $this->saveAllUsers();
        $this->saveAllCards();    
    }

    public function picking_winner()
    {
        if ($this->current_questioner === null)
        {
            Log::debug("picking_winner: Skipping to next because current_questioner was not set");
            $this->progressGame();
            $this->{$this->progress}();
            return;
        }

        if ($this->userAnswerCards->where('status','=','in_play')->count() < 1)
        {
            Log::debug("picking_winner: Skipping to next because no cards in_play");
            $this->progressGame();
            $this->{$this->progress}();
            return;
        }

        $this->setPlayersNotVoted();
        $this->setPlayersDefaultReady();
        $this->questioner()->ready = $this->progressQuestionerReadyState();
        $this->questioner()->voted = false;
        $this->deadline_at = Carbon::now()->addMinutes($this->answer_card_timer);

        $this->saveAllUsers();
        $this->saveAllCards();    
    }

    public function revealing_winner()
    {
        if ($this->current_questioner === null)
        {
            Log::debug("revealing_winner: Skipping to next because current_questioner was not set");
            $this->progressGame();
            $this->{$this->progress}();
            return;
        }

        $this->setPlayersNotVoted();
        $this->setPlayersDefaultReady();
        $this->questioner()->ready = $this->progressQuestionerReadyState();
        $this->questioner()->voted = false;
        $this->questioner()->save();

        Log::debug("revaling_winner");
        if (!$this->winning_group_id)
        {
            Log::debug("Skipping to next because winning_group_id was not set");
            $this->progressGame();
            $this->{$this->progress}();
            return;
        }
        else {
            Log::debug("winning_group_id was not null");
            foreach ($this->players as $player)
            {
                if ($player->id == $this->winning_group_id)
                {
                    Log::debug("giving points to {$player->name}");
                    $player->points = $player->points + 1;
                    Log::debug("points");
                }
            }
        }
        $this->deadline_at = Carbon::now()->addSeconds(10);

        $this->saveAllUsers();
        $this->saveAllCards();
    }
}
