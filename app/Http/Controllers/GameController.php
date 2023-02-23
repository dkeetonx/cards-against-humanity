<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\GameRoom;
use App\Models\User;
use JavaScript;

class GameController extends Controller
{
    public function home(Request $request, $code = null)
    {
        $gr = GameRoom::where('room_code', $code)->first();

        JavaScript::put([ 'user' => Auth::user(), 'game_room' => $gr ]);
        return view('welcome');
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
            if ($gr->has_waiting_room)
            {
                $user->status = "waiting";
            }
            else
            {
                $user->status = "watching";
            }
            $user->save();
        }

        $user->save();
        Auth::login($user, true);

        return ['user' => $user, 'game_room' => $gr ];
    }
}
