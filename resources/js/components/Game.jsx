import React, { useState, useEffect } from 'react'
import { Routes, Route,  useParams } from 'react-router-dom';
import { useUser, useGameRoom } from './AppHooks';

import TextInput from './TextInput';
import Alert from './Alert';
import JoinDialog from './JoinDialog';
import WaitingRoom from './WaitingRoom';

function Game() {
    let { roomCode } = useParams();
    let [ waiting, setWaiting ] = useState(false);

    function joined(data) {
        console.log("joined");
        console.log(data);

        window.setUser(data.user);
        window.setGameRoom(data.game_room);
    };

    if (!window.game_room ||
        (window.game_room && window.game_room.room_code != roomCode)
        || 1) {
        return (
            <div className="flex grow flex-col items-center justify-around">
                <JoinDialog onJoin={ joined } />
                <div></div>
                <div></div>
            </div>
        );
    }
    else {
        return ("");
    }
}

export default Game;