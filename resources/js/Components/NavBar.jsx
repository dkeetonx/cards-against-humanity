import React, { useState, useEffect, useContext } from 'react'
import {
    Outlet,
    Link,
    useParams,
    useLoaderData,
} from "react-router-dom";
import ThemeChanger from './ThemeChanger'
import TextInput from './TextInput';
import { UserContext } from './AppHooks';

export default function NavBar(props) {

    const user = useContext(UserContext);
    const [nameBox, setNameBox] = useState(user != null ? user.name : "");
    const [formRequest, setFormRequest] = useState({ errors: {}, processing: false });

    useEffect(() => {
        setNameBox(user != null ? user.name : "");
    },[user]);

    function handleNameSubmit(event) {
        event.preventDefault();
        console.log("submitted");
        setFormRequest({errors: {}, processing: true});

        window.axios.post('/api/name', {
            name: nameBox
        })
            .then((response) => {
                try {
                    setFormRequest({errors: {}, processing: false});
                    App.setUser(response.data.user);
                } catch (e) {
                    console.log(e);
                }
            })
            .catch((error) => {
                if (error.response) {
                    setFormRequest({
                        errors: error.response.data.errors,
                        processing: false,
                    });
                    console.log(error.response.data);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    throw error;
                }
            });
    }

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
                        <span className="w-32 truncate text-right">{user.name}</span>
                        <svg className="h-8 w-8 fill-current hidden sm:block" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
                    </label>

                    <ul tabIndex={0} className="dropdown-content bg-base-200 text-base-content shadow mt-3 p-2 rounded-box w-72 overflow-hidden">
                        <li>
                            <form className="" onSubmit={handleNameSubmit}>
                                <TextInput name="name_box" value={nameBox} label="Change Your Name"
                                    className=""
                                    maxLength="32"
                                    onChange={(event) => setNameBox(event.target.value)}>
                                    U
                                </TextInput>
                            </form>
                        </li>
                        <li className="divider mt-4 pt-4 mb-0"></li>
                        <li className="flex justify-end">
                            <label htmlFor="leave-modal" className="btn btn-link text-base-content">Leave Game</label>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    );
}
