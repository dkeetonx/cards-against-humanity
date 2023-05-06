import React from 'react';
import { useDispatch } from 'react-redux';
import { selectAllUsers } from './usersSlice';
import UserList from './UserList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard as pointsIcon } from '@fortawesome/free-regular-svg-icons'


export default function PrestartUsersList() {
    return (
        <UserList
            selector={selectAllUsers}
            sorter={(a,b) => b.points - a.points}
            columns={{ playing_status: "", points: <FontAwesomeIcon icon={pointsIcon} />, name: "Name" }}
        />
    );
}