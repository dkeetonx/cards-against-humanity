import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectGameId, selectGameCode, createGame } from './gameSlice'
import Share from './Share';

export default function Countdown({ deadline, className }) {
    const gameId = useSelector(selectGameId);
    const [canSkip, setCanSkip] = useState(false);

    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const getTime = () => {
            const timeRemaining = deadline - Date.now();

            if (timeRemaining > 0) {
                setDays(Math.floor(timeRemaining / (1000 * 60 * 60 * 24)));
                setHours(Math.floor((timeRemaining / (1000 * 60 * 60)) % 24));
                setMinutes(Math.floor((timeRemaining / 1000 / 60) % 60));
                setSeconds(Math.floor((timeRemaining / 1000) % 60));
                setCanSkip(false);
            }
            else {
                setCanSkip(true);
            }
        };
        getTime();

        const interval = setInterval(getTime, 1000);

        return () => clearInterval(interval);
    }, []);

    const groupLook = "w-20 p-2 border border-neutral-content rounded-btn "
    return (
        <div className="flex flex-row bg-base-200  rounded-btn">
            <Share className={`flex items-center justify-center text-lg rounded-r-none ${groupLook}`} />
            <div className={`flex items-center justify-center border-x-0 rounded-none ${groupLook}`}>
                <span className="countdown font-mono text-xl">
                    <span style={{ "--value": minutes }}></span>:
                    <span style={{ "--value": seconds }}></span>
                </span>
            </div>
            <button className={`btn btn-primary rounded-l-none normal-case text-lg ${groupLook} ${!canSkip ? "btn-disabled" : "animate-none"}`}>
                Skip
            </button>
        </div>
    );
}