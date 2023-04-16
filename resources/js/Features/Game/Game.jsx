import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import {
    selectGameCode,
    selectGameId,
    selectGameDeadline,
    selectGameStoreStatus,
} from './gameSlice';
import { setShowRejoin } from '../Overlays/overlaysSlice';
import {
    selectCurrentUser,
    selectPlayingStatus,
} from '../CurrentUser/currentUserSlice';

import Countdown from './CountDown';

export default function Game() {
    const gameId = useSelector(selectGameId);
    const gameCode = useSelector(selectGameCode);
    const gameStoreStatus = useSelector(selectGameStoreStatus);
    const { playCode } = useParams();
    const deadline = useSelector(selectGameDeadline);
    const currentUser = useSelector(selectCurrentUser);
    const playingStatus = useSelector(selectPlayingStatus);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setShowRejoin(false));

    }, [gameId, dispatch]);

    useEffect(() => {
        if (gameStoreStatus !== 'prestart' && playCode !== gameCode)
        {
            console.log(`navigating: gameCode = ${gameCode}, gameId = ${gameId}`);
            navigate(`/join/${playCode}`);
        }
    }, [gameStoreStatus, gameCode, navigate]);


    return (
        <div className="flex flex-col flex-grow">
            <div className="flex flex-row justify-center">
                { playingStatus === "waiting" ?
                "waiting"
                :

                <Countdown deadline={deadline + 120 * 1000} />
            }
            </div>
        </div>
    );
}
