<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GameRoom;
use App\Models\User;

class GameController extends Controller
{
    //
    public function join(Request $request)
    {
        $request->validate([
            'room_code' => 'bail|required|size:4|exists:game_rooms,room_code',
            'name' => 'required|min:2|max:32'
        ]);

        $user = User::find($request->session()->get('user_id'));

        if(!$user)
        {
            $user = new User;
        }
        $user->name = $request->get('name');
        $user->save();

        $request->session()->put('user_id', $user->id);
        $request->session()->put('name', $user->name);
        $gr = GameRoom::where('room_code', $request->room_code)->first();

        return ['user_id' => $user->id, 'game_room' => $gr ];
    }
}
