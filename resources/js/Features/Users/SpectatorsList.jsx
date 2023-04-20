import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    selectAllUsers,
    selectAllWaiting,
    selectAllPlaying,
    selectAllSpectating,
} from './usersSlice';
import { updateCurrentUser } from '../CurrentUser/currentUserSlice';
import UserList from './UserList';

export default function PlayersList() {
    const [display, setDisplay] = useState(false);
    const dispatch = useDispatch();

    return (
        <div className="absolute left-0 top-0 flex flex-col items-end bg-base-300 rounded-btn rounded-l-none shadow">
            {!display &&
                <button
                    className="my-3 btn btn-xs btn-secondary pl-0 border-l-0 rounded-l-none"
                    onClick={() => setDisplay(!display)}
                >
                    <span className="font-mono">&nbsp;</span>
                </button>
            }
            {display && <>
                <UserList
                    selector={selectAllSpectating}
                    initialDisplay="none"
                    columns={{ name: "Spectators" }}
                    className="relative flex flex-col w-64 overflow-auto"
                >
                    <button
                        className="absolute my-3 mx-2 btn btn-xs btn-secondary top-0 right-0 z-20"
                        onClick={() => setDisplay(!display)}
                    >
                        <span className="">{"<"}</span>
                    </button>
                </UserList>
                <div className="flex flex-row w-full justify-end bg-base-200 rounded-br-box p-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => dispatch(updateCurrentUser({ playing_status: "spectating" }))}
                    >
                        Spectate
                    </button>
                </div>
            </>}
        </div>
    );
}