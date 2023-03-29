import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setShowLeaveModal } from './modalsSlice.jsx';

function RejoinGame() {
    const dispatch = useDispatch();

    return (
        <div className="flex flex-col sm:flex-row items-end sm:items-baseline">
            <p className="pb-2 sm:pb-0 text-sm">Your game is still running!</p>
            <div className="">
                <button className="btn btn-xs btn-ghost"
                    onClick={() => dispatch(setShowLeaveModal(true))}>
                    Leave
                </button>
                <button className="btn btn-sm btn-accent">Join</button>
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