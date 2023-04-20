import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    selectAllUsers,
    selectAllWaiting,
    selectAllPlaying,
    selectAllSpectating
} from './usersSlice';
import { updateCurrentUser } from '../CurrentUser/currentUserSlice';
import UserList from './UserList';

export default function PlayersList() {
    const [display, setDisplay] = useState(false);
    const dispatch = useDispatch();

    return (
        <div className="absolute right-0 top-0 flex flex-col items-start bg-base-300 rounded-btn rounded-r-none shadow">
            <UserList
                selector={selectAllPlaying}
                className={display ?
                    "relative w-64 overflow-auto"
                    :
                    "relative"
                }
                columns={display ?
                    { round_status: "", points: "P", name: "Players" }
                    :
                    { round_status: "" }
                }
            >
                <button
                    className={display ?
                        "absolute my-3 mx-2 btn btn-xs btn-secondary top-0 left-0 z-20"
                        :
                        "absolute my-3 btn btn-xs btn-secondary border-r-0 rounded-r-none top-0 right-0 z-20"
                    }
                    onClick={() => setDisplay(!display)}
                >
                    <span className="">{display ? ">" : " "}</span>
                </button>
            </UserList>

            {display &&
                <div className="flex flex-row w-full justify-start bg-base-200 rounded-bl-box p-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => dispatch(updateCurrentUser({ playing_status: "playing" }))}
                    >
                        Play
                    </button>
                </div>
            }
        </div>

    );
}