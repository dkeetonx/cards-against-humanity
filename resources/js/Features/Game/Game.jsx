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
import {
    selectAllUsers,
    selectAllWaiting,
    selectAllPlaying,
    selectAllSpectating
} from '../Users/usersSlice';
import PlayersList from '../Users/PlayersList';
import SpectatorsList from '../Users/SpectatorsList';

export default function Game() {
    const [wrap, setWrap] = useState(false);

    const gameId = useSelector(selectGameId);
    const gameCode = useSelector(selectGameCode);
    const gameStoreStatus = useSelector(selectGameStoreStatus);
    const { playCode } = useParams();
    const deadline = useSelector(selectGameDeadline);
    const playingStatus = useSelector(selectPlayingStatus);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setShowRejoin(false));

    }, [gameId, dispatch]);

    useEffect(() => {
        if (gameStoreStatus !== 'prestart' && playCode !== gameCode) {
            console.log(`navigating: gameCode = ${gameCode}, gameId = ${gameId}`);
            navigate(`/join/${playCode}`);
        }
    }, [gameStoreStatus, gameCode, navigate]);

    if (playingStatus === "waiting") {
        return <div className="flex flex-col flex-grow">
            <div className="flex flex-row justify-center">
                <p>Waiting to be admitted to <span className="font-bold">{playCode}</span></p>
            </div>
        </div>
    }

    return (
        <>
            <div className="flex flex-col w-full h-full">
                <div className="w-full flex flex-row justify-center">
                    <Countdown deadline={deadline + 120 * 1000} />
                </div>
                <div className="flex flex-col h-full p-2">
                    <div className="h-54 shrink-0 flex flex-row overflow-x-auto overflow-y-clip">
                        <div className="card bg-black text-white text-sm shrink-0 w-36 h-52 p-2 m-1">
                            <p>Card _____ here. asdfasd</p>
                        </div>
                        <div className="card bg-black text-white text-sm shrink-0 w-36 h-52 p-2 m-1">
                            <p>Card _____ here. asdfasd</p>
                        </div>
                        <div className="w-20 shrink-0 self-end"></div>
                    </div>

                    <div className="flex flex-row items-center">
                        <input type="checkbox"
                            className="toggle m-1"
                            checked={!wrap}
                            onChange={() => setWrap(!wrap)}
                        />
                        <div className="">
                            <p>Select A Card</p>
                        </div>
                    </div>

                    <div className={wrap ?
                        "flex flex-rows flex-wrap w-full overflow-y-auto justify-start h-54"
                        :
                        "flex flex-rows w-full overflow-auto justify-start h-54"
                    }>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => (
                            <div className="card shadow border border-black bg-white text-black text-sm shrink-0 w-36 h-52 p-2 m-1">
                                <p>The persecution of Buddhists by the American-backed government of South Vietnam.</p>
                            </div>
                        ))}
                        <div className="w-56 h-32 shrink-0 self-end"></div>
                    </div>
                </div>
            </div>
            <PlayersList />
            <SpectatorsList />
        </>
    );
}
