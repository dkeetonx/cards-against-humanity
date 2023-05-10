import React from 'react'
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import ThemeChanger from './Components/ThemeChanger';
import Avatar from './Components/Avatar';
import UsernameEditor from './Features/CurrentUser/UsernameEditor';
import Toggle from './Components/Toggle';
import {
    selectCurrentUser,
    selectAnimateTimers,
    setAnimateTimers,
} from './Features/CurrentUser/currentUserSlice';

import { setShowLeaveModal } from './Features/Overlays/overlaysSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faChevronDown,
} from '@fortawesome/free-solid-svg-icons';

export default function NavBar(props) {

    const user = useSelector(selectCurrentUser);
    const animateTimers = useSelector(selectAnimateTimers);
    const dispatch = useDispatch();

    return (
        <div className="absolute top-0 left-0 z-40 navbar bg-neutral text-neutral-content overflow-x-clip p-0">
            <div className="flex-shrink">
                <Link to="/" className="btn btn-ghost normal-case px-2">
                    <FontAwesomeIcon className="font-bold text-xl px-2" icon={faArrowLeft} />
                </Link>
            </div>
            <div className="flex-1">
                <p className="font-mono text-left text-xs sm:text-lg">cardsagainst.xyz</p>
            </div>
            <div className="flex-none">
                <ThemeChanger className="dropdown-end" />
            </div>

            <div className="flex-shrink pr-2">
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost p-0 rounded-full flex flex-row items-center justify-end">
                        <Avatar user={user} className="w-12" />
                        <FontAwesomeIcon icon={faChevronDown} className="text-lg mx-2 hidden sm:block" />
                    </label>

                    <ul tabIndex={0} className="w-64 sm:w-72 dropdown-content bg-base-200 text-base-content shadow mt-3 p-2 rounded-box overflow-hidden">
                        <li className="">
                            <UsernameEditor />
                        </li>
                        <li classname="">
                            <Toggle label="Animate Timers" name="animateTimers"
                                checked={animateTimers}
                                onChange={()=> dispatch(setAnimateTimers(!animateTimers))}
                            />
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
