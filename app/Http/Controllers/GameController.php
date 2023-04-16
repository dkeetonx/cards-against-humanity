<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\GameRoom;
use App\Models\User;

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

    public function name(Request $request)
    {
        $request->validate([
            'name' => 'required|min:2|max:32'
        ]);

        $user = Auth::user();

        if(!$user)
        {
            $user = new User;
        }

        $user->name = $request->get('name');
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
        }
        else
        {
            $user->leaveGameRoom();
        }

        $gr = GameRoom::where('room_code', $request->room_code)->first();
        $user->name = $request->get('name');

        $user->game_room_id = $gr->id;

        if ($user->playing_status == "nothing")
        {
            if  ($gr->has_waiting_room)
            {
                $user->playing_status = "waiting";
            }
            else
            {
                $user->playing_status = "spectating";
            }
        }

        $user->save();


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
        return $user->gameRoom;
    }

    public function create(Request $request)
    {
        $this->name($request);
        $request->validate([
            "max_player_count" => 'integer|between:2,32',
            "has_waiting_room" => 'boolean',
            "two_question_cards" => 'boolean',
            "allow_hand_redraw" => 'boolean',
            "question_card_timer" => 'integer|between:2,32',
            "answer_card_timer" => 'integer|between:2,32',
            "winning_score" => 'integer',
        ]);

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

        $gameRoom = GameRoom::create($request->all());
        $gameRoom->room_code = $code;
        $gameRoom->owner_id = $user->id;
        $gameRoom->progress = "pregame";
        $gameRoom->save();

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
            if ($targetUser->gameRoom->progress == "pregame")
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
}
