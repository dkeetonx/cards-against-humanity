import React, { useState, useEffect, useRef } from 'react'
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
    selectAnimateTimers,
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
    const animate = useSelector(selectAnimateTimers);
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
        else if (isQuestioner
            && gameProgress === "revealing_winner") {
            setBtnEnabled(true);
        }
        else {
            setBtnEnabled(false);
        }
    }, [gameProgress, playingStatus, currentUserReady, currentUserVoted, elapsed]);

    const daysElRef = useRef(null);
    const hoursElRef = useRef(null);
    const minutesElRef = useRef(null);
    const secondsElRef = useRef(null);

    useEffect(() => {
        const getTime = () => {
            const timeRemaining = deadline - Date.now();

            if (timeRemaining > 0) {
                if (elapsed) {
                    setElapsed(false);
                }

                if (daysElRef.current) {
                    const v = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

                    if (animate) {
                        daysElRef.current.style.setProperty('--value', v);
                    }
                    else {
                        daysElRef.current.innerText = zeroPad(v, 2);
                    }
                }
                if (hoursElRef.current) {
                    const v = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);

                    if (animate) {
                    hoursElRef.current.style.setProperty('--value', v);
                    }
                    else {
                        hoursElRef.current.innerText = zeroPad(v, 2);
                    }
                }
                if (minutesElRef.current) {
                    const v = Math.floor((timeRemaining / 1000 / 60) % 60);

                    if (animate ) {
                    minutesElRef.current.style.setProperty('--value', v);
                    }
                    else {
                        minutesElRef.current.innerText = zeroPad(v, 2);
                    }
                }
                if (secondsElRef.current) {
                    const v = Math.floor((timeRemaining / 1000) % 60);
                    if (animate) {
                    secondsElRef.current.style.setProperty('--value', v);
                    }
                    else {
                        secondsElRef.current.innerText = zeroPad(v, 2);
                    }
                }
            }
            else if (!elapsed) {
                onDeadline && onDeadline();
                setElapsed(true);
            }
        };
        getTime();

        const interval = setInterval(getTime, 1000);

        return () => clearInterval(interval);
    }, [deadline, playingStatus, currentUserReady, animate]);


    useEffect(() => {
        if (elapsed && isQuestioner && gameProgress === "revealing_winner") {
            handleButtonClicked();
        }    
    }, [gameProgress, elapsed, isQuestioner, dispatch]);

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

    const groupLook = "w-14 sm:w-20 sm:p-2 border border-neutral-content rounded-btn text-sm sm:text-lg"
    return (
        <div className="flex flex-row bg-base-200 rounded-btn">
            <Share className={`flex items-center justify-center rounded-r-none ${groupLook}`} />
            <div className={`flex items-center justify-center border-x-0 rounded-none ${groupLook}`}>
                <span className={`${animate ? "countdown" :""} font-mono text-sm sm:text-xl`}>
                    <span ref={minutesElRef}>00</span>:
                    <span ref={secondsElRef}>00</span>
                </span>

            </div>
            <button
                className={`btn btn-primary btn-sm sm:btn-md rounded-l-none normal-case ${groupLook} ${!btnEnabled ? "btn-disabled" : "animate-none"} ${processing ? "loading" : ""}`}
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