<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    if ((int) $user->id === (int) $id)
    {
        return [ 'id' => $user->id, 'name' => $user->name ];
    }
    return null;
});

Broadcast::channel('App.Models.GameRoom.{id}', function ($user, $id) {
    return true;
});

Broadcast::channel('WaitingRoom.{id}', function ($user, $id) {
    return [ 'id' => $user->id, 'name' => $user->name ];
});
