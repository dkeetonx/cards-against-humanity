import './bootstrap';
import '../css/app.css';

import ReactDOM from 'react-dom/client';
import React, { useEffect } from 'react';
import {
    Outlet,
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import store from './store';

import {
    selectCurrentUserId,
    fetchCurrentUser,
    selectCurrentUserCanFetch,
    selectCurrentUserGameId,
} from './Features/CurrentUser/currentUserSlice';
import { fetchGame, selectGameId } from './Features/Game/gameSlice';

import { Provider, useSelector, useDispatch } from 'react-redux'

import JoinDialog from './Features/CurrentUser/JoinDialog';
import Game from './Features/Game/Game';
import Create from './Features/Game/Create';
import ErrorPage from './ErrorPage';
import NavBar from './NavBar';
import Footer from './Footer';
import LeaveModal from './Features/Game/LeaveModal';
import Snackbar from './Features/Overlays/Snackbar';


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
                path: "/join/:urlRoomCode?",
                element: <JoinDialog />,
            },
            {
                path: "/create",
                element: <Create />,
            }
        ],
    },
]);

function Home(props) {
    const userGameId = useSelector(selectCurrentUserGameId);
    const currentUserCanFetch = useSelector(selectCurrentUserCanFetch)

    const dispatch = useDispatch();

    useEffect(() => {
        if (currentUserCanFetch) {
            dispatch(fetchCurrentUser()).unwrap();
        }
    }, [dispatch])


    useEffect(() => {
        if (userGameId !== null) {
            dispatch(fetchGame()).unwrap();
        }
    }, [userGameId, dispatch]);

    console.log("home");

    return (
        <>
            <NavBar />
            <div className="relative container mx-auto flex flex-grow">
                <Outlet />
                <Snackbar />
            </div>
            {/*<Footer />*/}
            <LeaveModal />
        </>
    );
}

function start() {
    return (
        <React.StrictMode>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById('app')).render(start());
