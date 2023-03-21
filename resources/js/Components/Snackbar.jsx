import React, { useState, useEffect, useContext, useRef } from 'react'
import { Routes, Route, useParams, useNavigate, useNavigationType, } from 'react-router-dom';

import TextInput from '../Components/TextInput';
import Alert from '../Components/Alert';
import { UserContext, GameRoomContext } from '../Components/AppHooks';

export default function Snackbar(props) {

    return (
        <div className="toast toast-start absolute">
            <div className="alert alert-info">
                <span>New message arrived</span>
            </div>
            <div className="alert alert-warning">
                <span>New message arrived</span>
            </div>
            <div className="alert alert-info">
                <span>New message arrived</span>
            </div>
        </div>
    );
}
