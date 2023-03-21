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

import Home from './Pages/Home';
import JoinDialog from './Pages/JoinDialog';
import Game from './Pages/Game';
import Create from './Pages/Create';
import ErrorPage from './Pages/ErrorPage';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/play/:roomCode",
                element: <Game />,
            },
            {
                path: "/join/:wantRoomCode?",
                element: <JoinDialog />,
            },
            {
                path: "/create",
                element: <Create />,
            }
        ],
    },
]);


ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
