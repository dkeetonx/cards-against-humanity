import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import {
    selectGameCode,
    selectGameId,
} from './gameSlice';
import { setShowRejoin } from '../Overlays/overlaysSlice';

export default function Game() {
    const gameId = useSelector(selectGameId);
    const gameCode = useSelector(selectGameCode);
    const { urlRoomCode } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (gameCode !== urlRoomCode) {
            dispatch(setShowRejoin(false));
        }
    }, [gameId, dispatch]);

    return ("");
}
