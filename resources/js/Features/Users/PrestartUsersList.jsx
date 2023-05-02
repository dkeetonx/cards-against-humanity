import React from 'react';
import { useDispatch } from 'react-redux';
import { selectAllUsers } from './usersSlice';
import UserList from './UserList';


export default function PrestartUsersList() {
    return (
        <UserList
            selector={selectAllUsers}
            sorter={(a,b) => b.points - a.points}
            columns={{ playing_status: "Status", points: "P", name: "Name" }}
        />
    );
}