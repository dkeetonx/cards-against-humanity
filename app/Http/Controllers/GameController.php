<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\GameRoom;
use App\Models\GameDeckPack;
use App\Models\User;
use App\Models\Pack;
use App\Models\UserQuestionCard;
use App\Models\UserAnswerCard;
use App\Models\AnswerCard;

use Log;

class GameController extends Controller
{
    public function user(Request $request)
    {
        return Auth::user();
    }

    public function home(Request $request, $code = null)
    {
        $user = Auth::user();
        $gr = null;

        if ($user)
        {
            $gr = $user->gameRoom;
        }
        return view('welcome');
    }

    public function updateUser(Request $request)
    {
        $user = Auth::user();

        if ($user)
        {
            $request->validate([
                'name' => 'min:2|max:32'
            ]);
        }
        else {
            $request->validate([
                'name' => 'required|min:2|max:32'
            ]);
        }

        if(!$user)
        {
            $user = new User;
        }
        $user->fill($request->all());
        $user->save();

        Auth::login($user, true);

        return $user;
    }
    //
    public function join(Request $request)
    {
        $request->validate([
            'room_code' => 'bail|required|size:4|exists:game_rooms,room_code',
            'name' => 'required|min:2|max:32'
        ]);

        $user = Auth::user();

        if(!$user)
        {
            $user = new User;
            $user->name = $request->get('name');
        }
        
        $gr = GameRoom::where('room_code', $request->room_code)->first();


        if ($user->game_room_id === $gr->id)
        {
            return $user;
        }
        else
        {
            $user->leaveGameRoom();
        }

        $user->game_room_id = $gr->id;

        if  ($gr->has_waiting_room)
        {
            $user->playing_status = "waiting";
        }
        else {
            if ($gr->progress == "prestart")
            {
                $user->playing_status = "playing";
            }
            else {
                $user->playing_status = "spectating";
            }
        }

        $user->has_free_redraw = $gr->allow_hand_redraw;
        $user->save();
        Auth::login($user, true);

        return $user;
    }

    public function leave(Request $request)
    {
        $user = Auth::user();
        $user->leaveGameRoom(true);
        return $user;
    }

    public function data(Request $request)
    {
        $user = Auth::user();
        $gr = $user->gameRoom;
        if ($gr->deadline_at)
        {
            $gr['deadline_in'] = Carbon::now()->diffInMilliSeconds($gr->deadline_at, false);
        }
        else {
            $gr['deadline_in'] = 0;
        }
        return $gr;
    }

    public function create(Request $request)
    {
        $this->updateUser($request);
        $request->validate([
            "max_player_count" => 'integer|between:2,32',
            "has_waiting_room" => 'boolean',
            "two_question_cards" => 'boolean',
            "allow_hand_redraw" => 'boolean',
            "question_card_timer" => 'integer|between:1,32',
            "answer_card_timer" => 'integer|between:1,32',
            "winning_score" => 'integer',
            "blank_card_rate" => 'integer',
        ]);
        // Do some $request->packs validation here. like minimum card counts

        $user = Auth::user();
        $user->leaveGameRoom();

        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $retries = 0;
        do {
            $code = "";
            for ($i = 0; $i < 4; $i++)
            {
                $index = rand(0, strlen($chars) - 1);
                $code .= $chars[$index];
            }
        } while (GameRoom::where('room_code', $code)->count() > 0 && $retries++ < 10);

        $request->merge([
            'room_code' => $code,
            'owner_id' => $user->id,
            'progress' => 'prestart',
        ]);
        $gameRoom = GameRoom::create($request->all());

        foreach ($request->packs as $pack)
        {
            $gdp = new GameDeckPack;
            $gdp->pack_id = $pack['id'];
            $gdp->game_room_id = $gameRoom->id;
            $gdp->save();
        }

        $user->game_room_id = $gameRoom->id;
        $user->playing_status = "playing";
        $user->save();

        return $gameRoom;
    }

    public function users(Request $request)
    {
        $user = Auth::user();
        if ($user && $user->gameRoom)
        {
            $users = User::where('game_room_id', '=', $user->game_room_id)->get();
            return $users;
        }
        else {
            return [];
        }
    }

    public function admit(Request $request)
    {
        $request->validate([
            'id' => 'bail|required|exists:users,id',
        ]);

        $user = Auth::user();
        $targetUser = User::find($request->id);

        if ($targetUser->game_room_id === $user->game_room_id
            &&
            $targetUser->playing_status == "waiting")
        {
            if ($targetUser->gameRoom->progress == "prestart")
            {
                $targetUser->playing_status = "playing";
            }
            else {
                $targetUser->playing_status = "spectating";
            }
            $targetUser->save();
        }
        return [];
    }

    public function deny(Request $request)
    {
        $request->validate([
            'id' => 'bail|required|exists:users,id',
        ]);

        $user = Auth::user();
        $targetUser = User::find($request->id);

        if ($targetUser->game_room_id === $user->game_room_id
            &&
            $targetUser->playing_status == "waiting")
        {
            $targetUser->leaveGameRoom(true);
        }
        return [];
    }

    public function start(Request $request)
    {
        $user = Auth::user();
        
        if (!$user || !$user->gameRoom)
        {
            return [];
        }

        foreach ($user->gameRoom->users as $user)
        {
            $user->points = 0;
            $user->save();
        }

        $user->gameRoom->progressGame();
        $user->gameRoom->save();
        return [];
    }

    public function vote(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->gameRoom)
        {
            return [];
        }

        if ($user->gameRoom->deadline_at < Carbon::now())
        {
            $user->voted = true;
            $user->save();
        }
        else {
            return ["vote faled" => ""];
        }

        return [];
    }

    public function next(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->gameRoom)
        {
            return [];
        }

        if ($user->id !== $user->gameRoom->questioner()->id)
        {
            return [];
        }

        $user->gameRoom->progressGame();
        $user->gameRoom->save();

        return $user->gameRoom->toArray();
    }

    public function packs(Request $request)
    {
        return  Pack::all();
    }

    public function qcards(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->gameRoom)
        {
            return [];
        }

        switch ($user->gameRoom->progress)
        {
            case "prestart":
                return [];
                break;
            case "choosing_qcard":
                if (!$user->gameRoom->questioner())
                {
                    return [];
                }

                if ($user->id === $user->gameRoom->questioner()->id)
                {
                    return $user->userQCards()
                        ->where('status', '=', 'in_hand')
                        ->where('user_id', '=', $user->gameRoom->questioner()->id)
                        ->with('card')
                        ->get();
                }
                else {
                    return $user->gameRoom->userQuestionCards()
                        ->where('status', '=', 'in_hand')
                        ->where('user_id', '=', $user->gameRoom->questioner()->id)
                        ->with('card')
                        ->get();
                }
                break;

            case "picking_winner":
            case "answering":
            case "revealing_winner":
                    return $user->gameRoom->userQuestionCards()
                        ->where('status', '=', 'in_play')
                        ->with('card')
                        ->get();
                break;
        }
    }
    public function acards(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->gameRoom)
        {
            return [];
        }

        switch ($user->gameRoom->progress)
        {
            case "prestart":
                return [];
                break;
            case "choosing_qcard":
            case "answering":
                if ($user->gameRoom->questioner() && $user->id === $user->gameRoom->questioner()->id)
                {
                    return [];
                }
                else if ($user->playing_status === "spectating")
                {
                    return [];
                }
                else {
                    return $user->userACards()
                        ->where('status', '=', 'in_hand')
                        ->with('card')
                        ->get();
                }
                break;

            case "picking_winner":
            case "revealing_winner":
                    return $user->gameRoom->userAnswerCards()
                        ->where('status', '=', 'in_play')
                        ->with('card')
                        ->get();
                break;
        }
    }

    public function question(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->gameRoom)
        {
            return [];
        }

        if ($user->gameRoom->current_questioner !== $user->id)
        {
            return [];
        }


        $uqc = UserQuestionCard::find($request->user_question_card_id);
        $uqc->status = "in_play";
        $uqc->save();

        foreach ($user->userQCards->where('status', '=', 'in_hand') as $otherUqc)
        {
            $otherUqc->status = "in_trash";
            $otherUqc->save();
        }

        $user->ready = true;
        $user->save();

        $user->gameRoom->user_question_card_id = $request->user_question_card_id;
        $user->gameRoom->answer_count = $uqc->card->pick;
        $user->gameRoom->progressGame();
        $user->gameRoom->save();

        return [];
    }

    public function answer(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'blanks' => 'array',
            'answers' => 'required|array',
        ]);

        if (!$user || !$user->gameRoom)
        {
            return [];
        }

        $customAnswerCards = [];
        if ($request->blanks)
        {
            foreach ($request->blanks as $blank)
            {
                Log::debug("custom blank card: {$blank['text']}");
                $customAnswerCards[$blank['user_answer_card_id']] = $blank;
            }
        }

        $uacs = [];
        foreach ($request->answers as $id => $order)
        {
            $uac = UserAnswerCard::find($id);

            if ($uac->user_id === $user->id)
            {
                if (!$uac->card_id && array_key_exists($uac->id, $customAnswerCards))
                {
                    $newCard = AnswerCard::create($customAnswerCards[$uac->id]);
                    $newCard->save();
                    $uac->answer_card_id = $newCard->id;
                }

                $uac->order = $order;
                $uac->status = "in_play";
                $uac->revealed = false;
                $uac->save();
                $uac->card;
                $uacs[] = $uac;
            }
        }
        $user->ready = true;
        $user->save();

        $user->gameRoom->countReady();
        $user->gameRoom->save();

        return $uacs;
    }

    public function reveal(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->gameRoom)
        {
            return [];
        }
        if ($user->gameRoom->questioner()->id !== $user->id)
        {
            return [];
        }

        $uac = UserAnswerCard::find($request->user_answer_card_id);
        $uac->revealed = true;
        $uac->save();

        return [];
    }

    public function winner(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->gameRoom)
        {
            return [];
        }

        $user->gameRoom->winning_group_id = $request->winning_group_id;
        $user->gameRoom->progressGame();
        $user->gameRoom->save();

        return $user->gameRoom;
    }

    public function redraw(Request $request)
    {
        $user = Auth::user();

        if (!$user || !$user->gameRoom)
        {
            return response([ "errors" => ["redraw" => "You must be in a game room."] ], 403);
        }

        if (!$user->has_free_redraw)
        {
            return response([ "errors" => ["redraw" => "You can't redraw your hand."] ], 405);
        }

        $user->has_free_redraw = false;
        $user->dealUserOut();
        $user->dealUserIn();
        $user->save();

        return $this->acards($request);
    }

    public function presence(Request $request)
    {
        foreach ($request->events as $event)
        {
            if (!array_key_exists('user_id', $event))
            {
                return [];
            }
            if (!array_key_exists('name', $event))
            {
                return [];
            }

            $user = User::find($event['user_id']);
            switch ($event['name'])
            {
                case "member_added":
                    if (!$user) return;
                    Log::debug(" member_added: {$user->id}");
                    $user->connected = true;
                    $user->save();
                    return [];

                case "member_removed":
                    if (!$user) return;
                    Log::debug(" member_removed: {$user->id}");
                    $user->connected = false;
                    $user->save();
                    return [];

                default:
                    //ignored
            }
            Log::debug("event: ".json_encode($event));
        }
        return [];
    }
}
