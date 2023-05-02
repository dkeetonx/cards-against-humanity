import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    selectGameDeadline,
    selectGameProgress,
    selectGameOwnerId,
    startGame,
    voteSkip,
    nextRound,
} from './gameSlice';
import {
    selectCurrentUserId,
    selectPlayingStatus,
    selectCurrentUserReady,
    selectCurrentUserVoted,
} from '../CurrentUser/currentUserSlice';

import Share from './Share';

const SKIP = {
    text: "Skip",
    submit: voteSkip,
};
const START = {
    text: "Start",
    submit: startGame,
}
const NEXT = {
    text: "Next",
    submit: nextRound,
}

export default function Countdown({ className, isQuestioner, onDeadline }) {
    const gameProgress = useSelector(selectGameProgress);
    const deadline = useSelector(selectGameDeadline);
    const playingStatus = useSelector(selectPlayingStatus);
    const currentUserId = useSelector(selectCurrentUserId);
    const currentUserReady = useSelector(selectCurrentUserReady);
    const currentUserVoted = useSelector(selectCurrentUserVoted);
    const isOwner = useSelector(selectGameOwnerId) === currentUserId;
    const dispatch = useDispatch();


    const [elapsed, setElapsed] = useState(true);
    const [btnEnabled, setBtnEnabled] = useState(false);
    useEffect(() => {
        if (gameProgress == "prestart" && isOwner) {
            setBtnEnabled(true);
        }
        else if (playingStatus === "playing"
            && currentUserReady
            && !currentUserVoted
            && elapsed) {
            setBtnEnabled(true);
        }
        else if (playingStatus === "playing"
            && currentUserReady
            && !currentUserVoted
            && gameProgress === "revealing_winner") {
            setBtnEnabled(true);
        }
        else {
            setBtnEnabled(false);
        }
    }, [gameProgress, playingStatus, currentUserReady, currentUserVoted, elapsed]);

    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const getTime = () => {
            const timeRemaining = deadline - Date.now();

            if (timeRemaining > 0) {
                setElapsed(false);
                setDays(Math.floor(timeRemaining / (1000 * 60 * 60 * 24)));
                setHours(Math.floor((timeRemaining / (1000 * 60 * 60)) % 24));
                setMinutes(Math.floor((timeRemaining / 1000 / 60) % 60));
                setSeconds(Math.floor((timeRemaining / 1000) % 60));
            }
            else {
                onDeadline && onDeadline();
                setElapsed(true);
            }
        };
        getTime();

        const interval = setInterval(getTime, 1000);

        return () => clearInterval(interval);
    }, [deadline, playingStatus, currentUserReady]);

    const [btnData, setBtnData] = useState(SKIP);
    useEffect(() => {
        switch (gameProgress) {
            case "prestart":
                setBtnData(START);
                break;
            case "choosing_qcard":
                setBtnData(SKIP);
                break;
            case "answering":
                setBtnData(SKIP);
                break;
            case "picking_winner":
                setBtnData(SKIP);
                break;
            case "revealing_winner":
                if (isQuestioner) {
                    setBtnData(NEXT);
                    setBtnEnabled(true);
                }
                else {
                    setBtnData(SKIP);
                }
                break;
            default:
                setBtnData(SKIP);
                break;
        }
    }, [gameProgress, isQuestioner]);

    const [processing, setProcessing] = useState(false);
    async function handleButtonClicked() {

        setProcessing(true);
        try {
            await dispatch(btnData.submit()).unwrap();
        }
        catch (error) {
            console.log(error);
        }
        setProcessing(false);
    }

    function zeroPad(num, numZeros) {
        var n = Math.abs(num);
        var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
        var zeroString = Math.pow(10, zeros).toString().substr(1);
        if (num < 0) {
            zeroString = '-' + zeroString;
        }

        return zeroString + n;
    }

    const groupLook = "w-20 p-2 border border-neutral-content rounded-btn "
    return (
        <div className="flex flex-row bg-base-200  rounded-btn">
            <Share className={`flex items-center justify-center text-lg rounded-r-none ${groupLook}`} />
            <div className={`flex items-center justify-center border-x-0 rounded-none ${groupLook}`}>
                <p className="font-mono text-xl">
                    <span>{zeroPad(minutes, 2)}</span>:
                    <span>{zeroPad(seconds, 2)}</span>
                </p>
                {/*
                <span className="countdown font-mono text-xl">
                    <span style={{ "--value": minutes }}></span>:
                    <span style={{ "--value": seconds }}></span>
                </span>
                */}
            </div>
            <button
                className={`btn btn-primary rounded-l-none normal-case text-lg ${groupLook} ${!btnEnabled ? "btn-disabled" : "animate-none"} ${processing ? "loading" : ""}`}
                onClick={handleButtonClicked}
            >
                {processing ?
                    ""
                    :
                    (currentUserVoted ?
                        "Voted"
                        :
                        btnData.text
                    )
                }
            </button>
        </div>
    );
}