import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectAllPlaying,
} from './usersSlice';
import {
    updateCurrentUser,
    selectPlayingStatus
} from '../CurrentUser/currentUserSlice';
import UserList from './UserList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard as pointsIcon } from '@fortawesome/free-regular-svg-icons'
import { faGamepad } from '@fortawesome/free-solid-svg-icons';

export default function PlayersList() {
    const dispatch = useDispatch();
    const playingStatus = useSelector(selectPlayingStatus);

    return (
        <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-sm btn-outline p-1 px-3 rounded-r-none">
                <FontAwesomeIcon icon={faGamepad} />
            </label>
            <div className="dropdown-content menu shadow -left-24 flex flex-col w-64 rounded-b-box bg-base-300">
                <UserList
                    selector={selectAllPlaying}
                    className="w-full overflow-auto"
                    columns={{ round_status: "", points: <FontAwesomeIcon icon={pointsIcon} />, name: "Players" }}
                />
                <div className="flex flex-row flex-grow justify-start bg-base-200 p-2 rounded-b-box">
                    <button
                        className={`btn btn-sm btn-primary ${playingStatus === "playing" ? "btn-disabled":""}`}
                        onClick={() => dispatch(updateCurrentUser({ playing_status: "playing" }))}
                    >
                        Play
                    </button>
                </div>
            </div>
        </div>
    );
}