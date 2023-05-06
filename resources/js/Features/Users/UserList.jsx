import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    selectAllUsers,
    playingStatusIcon,
    readyStatusIcon,
} from './usersSlice';
import Avatar from '../../Components/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faClipboard
} from '@fortawesome/free-regular-svg-icons';

import {
    faCrown,
    faCheckToSlot,
} from '@fortawesome/free-solid-svg-icons';
import {
    selectCurrentQuestionerId,
} from '../Game/gameSlice';

import Username from '../../Components/Username';

export default function UserList(props) {
    const {
        className = "flex flex-col w-64 sm:w-96 overflow-auto rounded-lg",
        displayAvatar = false,
        selector = selectAllUsers,
        sorter = (a, b) => a.id - b.id,
        columns = { round_status: "", points: <FontAwesomeIcon icon={faClipboard} />, name: "Name" }
    } = props;

    const dispatch = useDispatch();
    const users = useSelector(selector);
    const currentQuestionerId = useSelector(selectCurrentQuestionerId);

    const [sortedUsers, setSortedUsers] = useState([]);
    useEffect(() => {
        setSortedUsers(users.sort(sorter));
    }, [users, sorter]);

    return (
        <div className={className}>
            <table className="table w-full">
                <thead className=" ">
                    <tr className="">
                        {"round_status" in columns &&
                            <th className="bg-base-300">
                                {columns.round_status}
                            </th>
                        }
                        {"points" in columns &&
                            <th className="bg-base-300 text-lg text-center">{columns.points}</th>
                        }
                        {"playing_status" in columns &&
                            <th className="bg-base-300">{columns.playing_status}</th>
                        }
                        {"name" in columns &&
                            <th className="bg-base-300">{columns.name}</th>
                        }
                    </tr>
                </thead>
                <tbody className="bg-base-200">
                    {sortedUsers.length < 1 &&
                        <tr><td className="bg-base-200 italic">None</td></tr>
                    }
                    {sortedUsers.map((user) => (
                        <tr key={user.id} className="">
                            {"round_status" in columns &&
                                <th className="p-2 bg-base-200 text-lg text-center leading-5">
                                    {(user.id === currentQuestionerId ?
                                        <FontAwesomeIcon icon={faCrown} />
                                        :
                                        (user.voted ?
                                            <FontAwesomeIcon icon={faCheckToSlot} />
                                            :
                                            <FontAwesomeIcon icon={readyStatusIcon(user.ready)} />
                                        )
                                    )}
                                </th>
                            }
                            {"points" in columns &&
                                <td className="py-1 bg-base-200 text-center">{user.points}</td>
                            }
                            {"playing_status" in columns &&
                                <td className="bg-base-200 text-lg text-center uppercase">
                                    <FontAwesomeIcon icon={playingStatusIcon(user.playing_status)} />
                                </td>
                            }
                            {"name" in columns &&
                                <td className="py-1 text-sm text-start bg-base-200">
                                    {displayAvatar &&
                                        <Avatar user={user} className="w-10 text-sm mr-4" />
                                    }
                                    <Username user={user} />
                                </td>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
            {props.children}

        </div>
    );
}