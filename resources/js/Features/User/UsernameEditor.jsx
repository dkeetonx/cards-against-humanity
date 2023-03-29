import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {
    selectUserName,
    updateUser,
} from './userSlice';
import TextInput from '../../Components/TextInput';

export default function UserNameEditor() {
    const userName = useSelector(selectUserName);
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
            await dispatch(updateUser({name: nameBox})).unwrap();
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
                inputExtraClasses={"pr-14 " + (nameError && "input-warning")}
                onChange={(event) => { setNameBox(event.target.value); setNameError(null) }}>
                <button className="absolute btn btn-secondary mt-3 top-0 right-0 w-12">U</button>
            </TextInput>
        </form>
    );
}