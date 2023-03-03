import './bootstrap';
import '../css/app.css';

import ReactDOM from 'react-dom/client';
import React, { useState } from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
    useParams,
    defer,
} from "react-router-dom";

import Game from './components/Game';
import Home from './components/Home';
import Create from './components/Create';
import ErrorPage from './components/ErrorPage';


window.game_room = {
    id: null,
    room_code: "",
}
window.gameRoomChangedEvent = new Event("window.game_room:changed");
window.setGameRoom = (room_data) => {
    window.game_room = room_data;
    console.log("setGameRoom");
    window.dispatchEvent(window.gameRoomChangedEvent);
}


const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/join/:roomCode?",
                element: <Game />,
            },
            {
                path: "/create",
                element: <Create />,
            }
        ],
    },
]);


ReactDOM.createRoot(document.getElementById('app')).render(
    //<React.StrictMode>
        <RouterProvider router={router} />
    //</React.StrictMode>
);
