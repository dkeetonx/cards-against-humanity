import './bootstrap';
import '../css/app.css';

import ReactDOM from 'react-dom/client';
import React, { useEffect } from 'react';
import {
    Outlet,
    createBrowserRouter,
    RouterProvider,
    useParams,
} from "react-router-dom";
import store from './store';

import {
    selectCurrentUserId,
    fetchCurrentUser,
    selectCurrentUserCanFetch,
    selectCurrentUserGameId,
    selectConnected,
    setConnected,
} from './Features/CurrentUser/currentUserSlice';
import {
    fetchGame,
    selectGameId,
    selectGameCode
} from './Features/Game/gameSlice';
import { fetchUsers } from './Features/Users/usersSlice';

import { Provider, useSelector, useDispatch } from 'react-redux'
import { fetchPacks } from './Features/Cards/packsSlice';

import Home from './Home';
import JoinDialog from './Features/CurrentUser/JoinDialog';
import Game from './Features/Game/Game';
import Create from './Features/Game/Create';
import ErrorPage from './ErrorPage';
import NavBar from './NavBar';
import Footer from './Footer';
import LeaveModal from './Features/Game/LeaveModal';
import RedrawModal from './Features/Game/RedrawModal';
import Snackbar from './Features/Overlays/Snackbar';
import Spectating from './Features/Overlays/Spectating';
import Questioning from './Features/Overlays/Questioning';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
                loader: () => document.title = "Cards Against Humanity Online - Home",
            },
            {
                path: "/play/:playCode",
                element: <Game />,
                loader: () => document.title = "Cards Against Humanity Online - Game",
            },
            {
                path: "/join/:urlRoomCode?",
                element: <JoinDialog />,
                loader: () => document.title = "Cards Against Humanity Online - Join",
            },
            {
                path: "/create",
                element: <Create />,
                loader: () => document.title = "Cards Against Humanity Online - Create",
            }
        ],
    },
]);

function Layout(props) {
    const userGameId = useSelector(selectCurrentUserGameId);
    const currentUserCanFetch = useSelector(selectCurrentUserCanFetch);
    const connected = useSelector(selectConnected);
    const gameId = useSelector(selectGameId);
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentUserCanFetch) {
            dispatch(fetchCurrentUser()).unwrap();
        }
        dispatch(fetchPacks()).unwrap();
    }, [dispatch])


    useEffect(() => {
        if (userGameId !== null) {
            dispatch(fetchGame()).unwrap();
        }
    }, [userGameId, connected, dispatch]);

    useEffect(() => {
        if (gameId) {
            dispatch(fetchUsers(gameId)).unwrap();
        }
    }, [gameId, connected, dispatch]);

    useEffect(() => {
        console.log("hooking pusher connection");
        window.Echo.connector.pusher.connection.bind('unavailable', () => {
            console.log("unavailable: ")
            dispatch(setConnected(false))
        });
        window.Echo.connector.pusher.connection.bind('disconnected', () => {
            alert('disconnected: ');
            dispatch(setConnected(false))
        });
    }, []);

    return (
        <>
            <NavBar />
            <div className="relative container mx-auto pt-16 flex flex-col bg-base-100 min-h-full">
                <Outlet />
            </div>
            <Snackbar />
            {/*<Footer />*/}
            <LeaveModal />
            <RedrawModal />
            <Questioning />
            <Spectating />
        </>
    );
}

function start() {
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
}

ReactDOM.createRoot(document.getElementById('app')).render(start());
