import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setShowLeaveModal } from './overlaysSlice.jsx';
import { selectGameCode } from '../Game/gameSlice'

function RejoinGame() {
    const dispatch = useDispatch();
    const gameCode = useSelector(selectGameCode);

    return (
        <div className="flex flex-col sm:flex-row items-end sm:items-baseline">
            <p className="pb-2 sm:pb-0 text-sm">Your game is still running!</p>
            <div className="">
                <button className="btn btn-xs btn-ghost"
                    onClick={() => dispatch(setShowLeaveModal(true))}>
                    Leave
                </button>
                <Link className="btn btn-sm btn-accent" to={`/play/${gameCode}`}>Join</Link>
            </div>
        </div>
    );
}
export default {
    id: "RejoinGame",
    priority: 1,
    extraClasses: "alert-info",
    component: RejoinGame,
}