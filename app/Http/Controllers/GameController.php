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

        if (!$user->game_room_id || $user->game_room_id != $gr->id)
        {
            $user->game_room_id = $gr->id;
            $user->game_room_status = "nothing";
            $user->save();
        }

        if ($user->game_room_status == "nothing")
        {
            if  ($gr->has_waiting_room)
            {
                $user->game_room_status = "waiting";
            }
            else
            {
                $user->game_room_status = "watching";
            }
        }

        $user->save();
        Auth::login($user, true);

        return ['user' => $user, 'game_room' => $gr ];
    }

    public function data(Request $request)
    {
        $user = Auth::user();
        return $user->gameRoom;
    }
}
