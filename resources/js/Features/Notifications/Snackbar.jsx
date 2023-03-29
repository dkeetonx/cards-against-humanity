import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {
    selectAllNotifications,
    addNotification,
    dismissNotification,
} from './notificationsSlice';
import RejoinGame from './RejoinGame';

import { selectShowRejoin } from './modalsSlice';

export default function Snackbar(props) {

    const notifications = useSelector(selectAllNotifications);
    const showRejoinNotification = useSelector(selectShowRejoin);
    const dispatch = useDispatch();


    let rejoinNotification;

    if (showRejoinNotification) {
        rejoinNotification = (
            <div className={`relative card p-3 ${RejoinGame.extraClasses}`}>
                <RejoinGame.component />
            </div>
        )
    }

    const renderedNotifications = notifications.map(notification => (
        <div className={`relative group card p-3 ${notification.extraClasses}`} key={notification.id}>
            <label className="btn btn-sm btn-circle absolute hidden group-hover:flex -right-2 -top-2"
                onClick={() => dispatch(dismissNotification(notification.id))}>✕</label>
            <notification.component />
        </div>
    ));

    return (
        <div className="toast toast-start absolute">
            {rejoinNotification}
            {renderedNotifications}
        </div>
    );
}
