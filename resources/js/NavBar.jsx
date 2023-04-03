import React from 'react'
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import ThemeChanger from './Components/ThemeChanger'
import UsernameEditor from './Features/CurrentUser/UsernameEditor';
import { selectCurrentUserName } from './Features/CurrentUser/currentUserSlice';

import { setShowLeaveModal } from './Features/Overlays/overlaysSlice';

export default function NavBar(props) {

    const userName = useSelector(selectCurrentUserName);
    const dispatch = useDispatch();

    return (
        <div className="navbar bg-neutral text-neutral-content px-0">
            <div className="flex-1"><Link to={`/`}>
                <button className="btn btn-ghost normal-case px-2 sm:pl-2 sm:pr-4" onClick={() => "" }>
                    <svg className="h-8 w-8 fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path></svg>
                    <span className="hidden sm:inline sm:text-xl">Home</span>
                </button></Link>
            </div>

            <div className="flex-none">
                <ThemeChanger />
            </div>

            <div className="flex-none">
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost normal-case flex overflow-hidden">
                        <span className="w-32 truncate text-right">{userName}</span>
                        <svg className="h-8 w-8 fill-current hidden sm:block" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
                    </label>

                    <ul tabIndex={0} className="dropdown-content bg-base-200 text-base-content shadow mt-3 p-2 rounded-box w-72 overflow-hidden">
                        <li>
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
