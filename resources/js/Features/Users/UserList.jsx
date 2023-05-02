import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectAllUsers } from './usersSlice';
import Avatar from '../../Components/Avatar';

export default function UserList(props) {
    const {
        className = "flex flex-col w-64 sm:w-96 overflow-auto rounded-lg",
        displayAvatar = false,
        selector = selectAllUsers,
        sorter = (a,b) => a.id - b.id,
        columns = { round_status: "", points: "Points", name: "Name" }
    } = props;

    const dispatch = useDispatch();
    const users = useSelector(selector);

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
                            <th className="grid p-0 h-12 rounded-r-none justify-items-stretch bg-base-300">
                            </th>
                        }
                        {"points" in columns &&
                            <th className="bg-base-300">{columns.points}</th>
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
                                <th className="p-2 bg-base-200 text-center leading-5">
                                    x
                                </th>
                            }
                            {"points" in columns &&
                                <td className="py-1 bg-base-200">{user.points}</td>
                            }
                            {"playing_status" in columns &&
                                <td className="bg-base-200 text-xs uppercase">
                                    {user.playing_status}
                                </td>
                            }
                            {"name" in columns &&
                                <td className="py-1 text-sm bg-base-200">
                                    {displayAvatar &&
                                        <Avatar user={user} className="w-10 text-sm mr-4" />
                                    }
                                    {user.name}
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