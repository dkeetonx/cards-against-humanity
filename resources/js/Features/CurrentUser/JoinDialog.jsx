import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

import TextInput from '../../Components/TextInput';

import { useSelector, useDispatch } from 'react-redux';
import {
    selectCurrentUserName,
    joinGame,
} from './currentUserSlice';

import {
    selectGameId,
    selectGameFetchStatus,
    selectGameCode,
    canUpdate,
} from '../Game/gameSlice';

export default function JoinDialog(props) {

    const userName = useSelector(selectCurrentUserName);
    const gameId = useSelector(selectGameId);
    const gameCode = useSelector(selectGameCode);
    const gameFetchStatus = useSelector(selectGameFetchStatus);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [codeError, setCodeError] = useState(null);
    const [nameError, setNameError] = useState(null);

    const { urlRoomCode } = useParams();
    const [codeBox, setCodeBox] = useState(urlRoomCode);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    const [nameBox, setNameBox] = useState(userName);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        setNameBox(userName);
        setNameError(null);
    }, [userName]);

    useEffect(() => {
        if (shouldRedirect) {
            setShouldRedirect(false);
            navigate(`/play/${gameCode}`);
        }
    }, [gameId, dispatch]);

    async function handleSubmit(event) {
        event.preventDefault();
        console.log("JoinDialog Submitted");

        if (canUpdate(gameFetchStatus)) {
            setProcessing(true);
            try {
                const response = await dispatch(joinGame({
                    room_code: codeBox, 
                    name: nameBox,
                })).unwrap();
                setShouldRedirect(true);

            } catch (error) {
                if (error.errors) {
                    console.log(error.errors);
                    if (error.errors["room_code"]) {
                        setCodeError(error.errors["room_code"][0]);
                    }
                    if (error.errors["name"]) {
                        setNameError(error.errors["name"][0]);
                    }
                } else {
                    throw error;
                }

            } finally {
                setProcessing(false);
            }
        }
    }

    return (
        <div className="grow flex flex-col items-center justify-around">
            <div className="card bg-base-300 text-base-content shadow">
                <div className="card-body">
                    <h2 className="card-title">Join a Game</h2>
                    <form onSubmit={handleSubmit} className="">
                        <TextInput id="room_code" name="room_code" value={codeBox}
                            label="Room Code" maxLength="4" className="mb-2" uppercase={true}
                            tooltipText={codeError}
                            tooltipExtraClasses="tooltip-top tooltip-warning"
                            inputExtraClasses={"uppercase " + (codeError && "input-warning border-2 border-dashed")}
                            onChange={(event) => { setCodeBox(event.target.value); setCodeError(null) }} />

                        <TextInput id="name" name="name" value={nameBox} label="Nickname"
                            className="mb-2" maxLength="32"
                            tooltipText={nameError}
                            tooltipExtraClasses="tooltip-top tooltip-warning"
                            inputExtraClasses={(nameError && "input-warning border-2")}
                            onChange={(event) => { setNameBox(event.target.value); setNameError(null) }} />

                        <div className="card-actions justify-end">
                            <button type="submit" name="join"
                                className={`btn btn-primary w-20 ${(processing && "loading")}`} >
                                {processing ? "" : "Join"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div></div><div></div>
        </div>
    );
}
