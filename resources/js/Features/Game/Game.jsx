import React, { useState, useEffect } from 'react'
import { Routes, Route,  useParams, redirect } from 'react-router-dom';
import {
    selectGameCode,
} from './gameSlice';

import TextInput from '../../Components/TextInput';
import Alert from '../../Components/Alert';
import WaitingRoom from '../../Components/WaitingRoom';

export default function Game() {
    let { roomCode } = useParams();
    let [ waiting, setWaiting ] = useState(false);

    return ("");
}
