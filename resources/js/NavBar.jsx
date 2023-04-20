import React from 'react'
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import ThemeChanger from './Components/ThemeChanger';
import Avatar from './Components/Avatar';
import UsernameEditor from './Features/CurrentUser/UsernameEditor';
import { selectCurrentUser } from './Features/CurrentUser/currentUserSlice';

import { setShowLeaveModal } from './Features/Overlays/overlaysSlice';

export default function NavBar(props) {

    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch();

    return (
        <div className="navbar bg-neutral text-neutral-content overflow-x-clip p-0">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost normal-case px-1">
                    <svg className="h-8 w-8 fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path></svg>
                    <span className="">Home</span>
                </Link>
            </div>
            <div className="flex-none">
                <ThemeChanger className="dropdown-end" />
            </div>

            <div className="flex-shrink pr-2">
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="flex flex-row items-center justify-end">
                        <Avatar user={user} className="w-12"/>
                        <svg className="h-8 w-8 fill-current hidden sm:block" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
                    </label>

                    <ul tabIndex={0} className="w-64 sm:w-72 dropdown-content bg-base-200 text-base-content shadow mt-3 p-2 rounded-box overflow-hidden">
                        <li className="">
                            <UsernameEditor />
                        </li>
                        <li className="divider mt-4 pt-4 mb-0"></li>
                        <li className="flex justify-end">
                            <button className="btn btn-link text-base-content" onClick={() => dispatch(setShowLeaveModal(true))}>
                                Leave Game
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
