import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
    selectAllNotifications,
    addNotification,
    dismissNotification,
} from './notificationsSlice';

import {
    selectShowRejoin,
    setShowRejoin,
    setShowLeaveModal,
} from './overlaysSlice';
import {
    selectGameId,
    selectGameCode,
    selectGameOwnerId,
} from '../Game/gameSlice';
import {
    selectAllWaiting,
    admitWaitingUser,
    denyWaitingUser,
} from '../Users/usersSlice';
import {
    selectCurrentUser,
    selectCurrentUserId,
} from '../CurrentUser/currentUserSlice';

export default function Snackbar(props) {

    const notifications = useSelector(selectAllNotifications);
    const showRejoinNotification = useSelector(selectShowRejoin);
    const dispatch = useDispatch();

    const currentUser = useSelector(selectCurrentUser);
    const currentUserId = useSelector(selectCurrentUserId);
    const gameCode = useSelector(selectGameCode);
    const gameOwnerId = useSelector(selectGameOwnerId);
    const { playCode } = useParams();

    useEffect(() => {
        if (currentUser.game_room_id && gameCode !== playCode) {
            dispatch(setShowRejoin(true));
        }
    }, [gameCode, playCode, dispatch])

    const users = useSelector(selectAllWaiting);

    return (
        <div className="toast toast-start bottom-4">
            {notifications.map(notification => (
                <div className={`relative group card p-3 ${notification.extraClasses}`} key={notification.id}>
                    <label className="btn btn-sm btn-circle absolute hidden group-hover:flex -right-2 -top-2"
                        onClick={() => dispatch(dismissNotification(notification.id))}>✕</label>
                    <notification.component />
                </div>
            ))}
            {gameOwnerId === currentUserId && users.map((user) => (
                <div className="card p-3 alert-info" key={user.id}>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between space-x-1 space-y-1">
                        <p className="">
                            <span className="font-bold underline">{user.name} </span>
                            wants to join.
                        </p>
                        <div className="flex-1 flex justify-end space-x-1">
                            <button className="btn btn-sm" onClick={() => dispatch(denyWaitingUser(user))}>
                                Deny
                            </button>
                            <button className="btn btn-sm btn-primary" onClick={() => dispatch(admitWaitingUser(user))}>
                                Allow
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            {showRejoinNotification &&
                <div className="card p-3 alert-error">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between space-x-1 space-y-1">
                        <p className="font-bold">Your game is still running!</p>
                        <div className="flex-1 flex items-baseline justify-end space-x-1">
                            <button className="btn btn-sm btn-outline text-error-content"
                                onClick={() => dispatch(setShowLeaveModal(true))}>
                                Leave
                            </button>
                            <Link className="btn btn-sm btn-accent w-20" to={`/play/${gameCode}`}>Join</Link>
                        </div>
                    </div>
                </div>
            }

        </div>
    );
}
