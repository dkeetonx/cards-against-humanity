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
        'blank_card_rate',
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
        $questioner = $this->questioner();
        $questionerId = $questioner ? $questioner->id : 0;
        $questionerTurnIndex = $questioner ? $questioner->turn_index : 0;

        $next = $this->players()
                ->orderBy('turn_index', 'asc')
                ->orderBy('id', 'asc')
                ->where('id', '<>', $questionerId)
                ->where('turn_index', '>=', $questionerTurnIndex);

        if (config('app.env') != 'local')
        {
            $next->where('connected', '=', true);
        }

        if ($next->count() < 1)
        {
            Log::debug("nextTurnPlayer rolling over");
            $next = $this->players()
                    ->orderBy('turn_index', 'asc')
                    ->orderBy('id', 'asc');

            if (config('app.env') != 'local')
            {
                $next->where('connected', '=', true);
            }
        }
        return $next->first();
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
                Log::debug("not skipping because player {$player->name} did not vote");
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
            $this->progress = $this->skipProgress();
            $this->save();
        }
    }

    public function countReady()
    {
        Log::debug("countReady() called");
        $progress = true;
        foreach ($this->players as $player)
        {
            if (!$player->ready)
            {
                Log::debug("blocking progress because player({$player->id}) was not ready");
                if ($this->current_questioner == $player->id)
                {
                    Log::debug("current_questioner({$player->id}) was not ready");
                }
                $progress = false;
                break;
            }
        }
        if ($progress)
        {
            $this->progress = $this->nextProgress();
            $this->save();
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
                continue;
            }

            $player->ready = $this->progressPlayerReadyState();
            if ($save)
                $player->save();
        }
    }

    public function setPlayersPowerups($save = false)
    {
        foreach ($this->players as $player)
        {
            if ($this->allow_hand_redraw)
            {
                $player->has_free_redraw = true;
            }
            else {
                $player->has_free_redraw = false;
            }

            if ($save)
                $player->save();
        }
    }

    public function saveAllUsers()
    {
        foreach ($this->players as $player)
        {
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

    public function trashCardsInHand()
    {
        foreach ($this->userAnswerCards->where('status', '=', 'in_hand') as $uac)
        {
            Log::debug("trashing acard {$uac->id}");
            $uac->status = 'in_trash';
            $uac->save();
        }
        foreach ($this->userQuestionCards->where('status', '=', 'in_hand') as $uqc)
        {
            Log::debug("trashing qcard {$uqc->id}");
            $uqc->status = "in_trash";
            $uqc->save();
        }
    }

    public function checkForWinner()
    {
        $endGame = null;
        foreach ($this->players as $player)
        {
            if ($this->winning_score > 0 && $player->points >= $this->winning_score)
            {
                Log::debug("winning player found");
                $endGame = $player;
            }
        }
        return $endGame;
    }
    public function skipProgress()
    {
        Log::debug("skipProgress from {$this->progress}");
        switch ($this->progress)
        {
            case "prestart":
                return "choosing_qcard";
            case "choosing_qcard":
                return "revealing_winner";
            case "answering":
                return "picking_winner";
            case "picking_winner":
                return "revealing_winner";
            case "revealing_winner":
                return "choosing_qcard";
        }
    }

    public function nextProgress()
    {
        Log::debug("nextProgress from {$this->progress}");
        switch ($this->progress)
        {
            case "prestart":
                return "choosing_qcard";
            case "choosing_qcard":
                return "answering";
            case "answering":
                return "picking_winner";
            case "picking_winner":
                return "revealing_winner";
            case "revealing_winner":
                return "choosing_qcard";
        }
        Log::debug("to {$this->progress}");
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

        self::updated(function($gameRoom)
        {
            if ($gameRoom->wasChanged('progress'))
            {
                $gameRoom->syncOriginalAttribute('progress');
                $gameRoom->syncChanges();

                $gameRoom->{$gameRoom->progress}();
                event(new \App\Events\GameProgressed($gameRoom));
            }

            if ($gameRoom->wasChanged('current_questioner'))
            {
                $oldQuestionerId = $gameRoom->getOriginal('current_questioner');

                $gameRoom->syncOriginalAttribute('current_questioner');
                $gameRoom->syncChanges();

                event(new \App\Events\GameQuestionerChanged($gameRoom));

                if (!$gameRoom->current_questioner)
                {
                    event(new \App\Events\GameQuestionerStoppedPlaying($gameRoom));
                }
            }

            if ($gameRoom->wasChanged('owner_id'))
            {
                $oldOwnerId = $gameRoom->getOriginal('owner_id');

                $gameRoom->syncOriginalAttribute('owner_id');
                $gameRoom->syncChanges();

                event(new \App\Events\GameOwnerChanged($gameRoom));
            }

            return true;
        });
    }

    public function prestart()
    {
        Log::debug("updated to prestart");
        $this->trashCardsInPlay();
        $this->trashCardsInHand();
        $this->setPlayersNotVoted();
        $this->setPlayersDefaultReady();
        $this->setPlayersPowerups();
        $this->user_question_card_id = null;
        $this->deadline_at = Carbon::now()->addMinutes(10);

        $this->saveAllUsers();
        $this->saveAllCards();
        $this->save();
    }

    public function choosing_qcard()
    {
        Log::debug("updated to choosing_qcard");

        $playerCount = $this->players->count();
        if ($playerCount < 2)//3)
        {
            Log::debug("Only found {$playerCount} players, setting progress to prestart");
            $this->progress = 'prestart';
            $this->save();
            return;
        }
        $winner = $this->checkForWinner();
        if ($winner)
        {
            event(new \App\Events\UserWonGame($winner));
            Log::debug("setting game to prestart");
            $this->progress = "prestart";
            $this->save();
            return;
        }

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
            $this->progress = $this->nextProgress();
            $this->save();
            return;
        }
        else {
            $this->deadline_at = Carbon::now()->addMinutes($this->question_card_timer);
        }
        $this->saveAllUsers();
        $this->saveAllCards();
        $this->save();
    }

    public function answering()
    {
        if ($this->current_questioner === null)
        {
            Log::debug("answering: Skipping to next because current_questioner was not set");
            $this->progress = $this->nextProgress();
            return;
        }

        $this->setPlayersNotVoted();
        $this->setPlayersDefaultReady();
        $this->questioner()->ready = $this->progressQuestionerReadyState();
        $this->questioner()->voted = false;
        $this->deadline_at = Carbon::now()->addMinutes($this->answer_card_timer);

        $this->saveAllUsers();
        $this->saveAllCards();
        $this->save();
    }

    public function picking_winner()
    {
        if ($this->current_questioner === null)
        {
            Log::debug("picking_winner: Skipping to next because current_questioner was not set");
            $this->progress = $this->nextProgress();
            $this->save();
            return;
        }

        $answerCount = $this->userAnswerCards->where('status','=','in_play')->count();
        if ($answerCount < 1)
        {
            Log::debug("picking_winner: Skipping to next because not enough cards in play {$answerCount}");
            $this->progress = $this->nextProgress();
            $this->save();
            return;
        }
        else {
            Log::debug("picking_winner: answer cards in play = {$answerCount}");
        }

        $this->setPlayersNotVoted();
        $this->setPlayersDefaultReady();
        $this->questioner()->ready = $this->progressQuestionerReadyState();
        $this->questioner()->voted = false;
        $this->deadline_at = Carbon::now()->addMinutes($this->answer_card_timer);

        $this->saveAllUsers();
        $this->saveAllCards();
        $this->save();
    }

    public function revealing_winner()
    {
        if ($this->current_questioner === null)
        {
            Log::debug("revealing_winner: Skipping to next because current_questioner was not set");
            $this->progress = $this->nextProgress();
            $this->save();
            return;
        }

        Log::debug("revaling_winner");
        if (!$this->winning_group_id)
        {
            Log::debug("Skipping to next because winning_group_id was not set");
            $this->progress = $this->nextProgress();
            $this->save();
            return;
        }
        else {
            Log::debug("winning_group_id was not null");

            $this->setPlayersNotVoted();
            $this->setPlayersDefaultReady();
            $this->questioner()->ready = $this->progressQuestionerReadyState();
            $this->questioner()->voted = false;
            $this->questioner()->save();

            foreach ($this->players as $player)
            {
                if ($player->id == $this->winning_group_id)
                {
                    Log::debug("giving points to {$player->name}");
                    $player->points = $player->points + 1;
                }
            }
        }
        $this->deadline_at = Carbon::now()->addSeconds(5);
        $this->saveAllUsers();
        $this->saveAllCards();
        $this->save();
    }
}
