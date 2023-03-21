import React, { useState, useEffect } from 'react'
import { Routes, Route,  useParams, redirect } from 'react-router-dom';
import { useGameRoom } from '../Components/AppHooks';

import TextInput from '../Components/TextInput';
import Alert from '../Components/Alert';
import WaitingRoom from '../Components/WaitingRoom';

export default function Game() {
    let { roomCode } = useParams();
    let [ waiting, setWaiting ] = useState(false);

    function joined(data) {
        console.log("joined");
        console.log(data);

        App.setUser(data.user);
        App.setGameRoom(data.game_room);
    };
    return ("");
}
