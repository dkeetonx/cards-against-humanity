import React, { useState, useEffect, useContext, useRef } from 'react'
import { Routes, Route, useParams, useNavigate, useNavigationType, } from 'react-router-dom';

import TextInput from '../Components/TextInput';
import Alert from '../Components/Alert';
import { UserContext, GameRoomContext } from '../Components/AppHooks';

export default function JoinDialog(props) {
    const navigate = useNavigate();

    const user = useContext(UserContext);
    const gameRoom = useContext(GameRoomContext);

    const { wantRoomCode } = useParams();
    const [roomCode, setRoomCode] = useState(wantRoomCode);

    const [name, setName] = useState(user != null ? user.name : "");
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setName(user != null ? user.name : "");
    }, [user]);

    useEffect(() => {
        if (gameRoom.id && gameRoom.room_code == roomCode) {
            navigate(`/play/${roomCode}`, { replace: true });
        }
        return () => {
            console.log("JoinDialog unmounting");
        }
    }, [roomCode, gameRoom]);

    function handleSubmit(event) {
        event.preventDefault();
        console.log("submitted");
        setProcessing(true);

        window.axios.post('/api/join', {
            room_code: roomCode,
            name: name,
        })
            .then((response) => {
                try {
                    setErrors({});
                    setProcessing(false);
                    props.onJoin(response.data);
                } catch (e) {
                    console.log(e);
                }
            })
            .catch((error) => {

                if (error.response) {
                    setErrors(error.response.data.errors);
                    setProcessing(false);
                    console.log(error.response.data);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    throw error;
                }
            });
    }


    return (
        <div className="flex grow flex-col items-center justify-around">
            <div className="card bg-base-300 text-base-content shadow">
                <div className="card-body">
                    {Object.keys(errors).map((field) =>
                        <Alert text={errors[field]} key={field} />
                    )}
                    <h2 className="card-title">Join a Game</h2>
                    <form onSubmit={handleSubmit} className="">
                        <TextInput id="room_code" name="room_code" value={roomCode}
                            label="Room Code" maxLength="4" className="mb-2" uppercase={true}
                            onChange={(event) => setRoomCode(event.target.value)} />

                        <TextInput id="name" name="name" value={name} label="Nickname"
                            className="mb-2" maxLength="32"
                            onChange={(event) => setName(event.target.value)} />

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
