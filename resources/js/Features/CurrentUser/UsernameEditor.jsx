import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {
    selectCurrentUserName,
    updateCurrentUser,
} from './currentUserSlice';
import TextInput from '../../Components/TextInput';

export default function UserNameEditor() {
    const userName = useSelector(selectCurrentUserName);
    const [nameError, setNameError] = useState(null);

    const [nameBox, setNameBox] = useState(userName);

    useEffect(() => {
        setNameBox(userName);
    },[userName]);

    const dispatch = useDispatch();

    async function handleNameSubmit(event) {
        event.preventDefault();
        console.log("submitted");

        try {
            setNameError(null);
            await dispatch(updateCurrentUser({name: nameBox})).unwrap();
        } catch (error) {
            if (error.errors) {
                console.log(error.errors);
                if (error.errors["name"]) {
                    setNameError(error.errors["name"][0]);
                }
            }
            else {
                throw error;
            }
            console.log('Failed to update name');
        } finally {

        }
    }

    return (
        <form className="" onSubmit={handleNameSubmit}>
            <TextInput name="name_box" value={nameBox} label="Change Your Name"
                className=""
                maxLength="32"
                tooltipText={nameError}
                tooltipExtraClasses="tooltip-warning tooltip-bottom"
                inputExtraClasses={`w-full pr-14 ${nameError && "input-warning"}`}
                onChange={(event) => { setNameBox(event.target.value); setNameError(null) }}>
                <button className="absolute btn btn-xs btn-secondary mt-3 top-1 right-1 w-10 h-10 ">U</button>
            </TextInput>
        </form>
    );
}