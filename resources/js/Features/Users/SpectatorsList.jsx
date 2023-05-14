import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectAllSpectating,
} from './usersSlice';
import {
    updateCurrentUser,
    selectPlayingStatus,
} from '../CurrentUser/currentUserSlice';
import UserList from './UserList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faGamepad,
    faGlasses,
    faCheck,
} from '@fortawesome/free-solid-svg-icons';

export default function PlayersList() {
    const dispatch = useDispatch();
    const playingStatus = useSelector(selectPlayingStatus);

    return (
        <div className="dropdown dropdown-start">
            <label tabIndex={0} className="btn btn-xs sm:btn-sm btn-outline p-1 px-3 rounded-l-none">
                <FontAwesomeIcon icon={faGlasses} />
            </label>
            <div className="dropdown-content menu shadow -right-24 w-64 rounded-b-box bg-base-300">
                <UserList
                    selector={selectAllSpectating}
                    initialDisplay="none"
                    columns={{ name: "Spectators" }}
                    className="w-full overflow-auto"
                />
                <div className="flex flex-row w-full justify-end bg-base-200 rounded-b-box p-2">
                    <button
                        className={`btn btn-sm btn-primary ${playingStatus === "spectating" ? "btn-disabled":""}`}
                        onClick={() => dispatch(updateCurrentUser({ playing_status: "spectating" }))}
                    >
                        Spectate
                    </button>
                </div>
            </div>
        </div>
    );
}