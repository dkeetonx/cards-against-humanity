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
import Snackbar from './Features/Overlays/Snackbar';
import Spectating from './Features/Overlays/Spectating';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
                loader: () => document.title = "Home - Cards Against Humanity Online",
            },
            {
                path: "/play/:playCode",
                element: <Game />,
                loader: () => document.title = "Game - Cards Against Humanity Online",
            },
            {
                path: "/join/:urlRoomCode?",
                element: <JoinDialog />,
                loader: () => document.title = "Join - Cards Against Humanity Online",
            },
            {
                path: "/create",
                element: <Create />,
                loader: () => document.title = "Create - Cards Against Humanity Online",
            }
        ],
    },
]);

function Layout(props) {
    const userGameId = useSelector(selectCurrentUserGameId);
    const currentUserCanFetch = useSelector(selectCurrentUserCanFetch)
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
    }, [userGameId, dispatch]);

    useEffect(() => {
        if (gameId) {
            dispatch(fetchUsers(gameId)).unwrap();
        }
    }, [gameId, dispatch]);

    return (
        <>
            <NavBar />
            <div className="relative container mx-auto pt-16 flex flex-col bg-base-100 h-full overflow-clip">
                <Outlet />
            </div>
            <Snackbar />
            {/*<Footer />*/}
            <LeaveModal />
            <Spectating />
        </>
    );
}

function start() {
    return (
        <Provider store={store}>
            <React.StrictMode>
                <RouterProvider router={router} />
            </React.StrictMode>
        </Provider>
    );
}

ReactDOM.createRoot(document.getElementById('app')).render(start());
