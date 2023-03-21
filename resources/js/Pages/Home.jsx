import React, { useState, useEffect } from 'react'
import {
    Outlet,
    Link,
    useParams,
    useLoaderData,
} from "react-router-dom";

import TextInput from '../Components/TextInput';
import Alert from '../Components/Alert';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import LeaveModal from '../Components/LeaveModal';
import Snackbar from '../Components/Snackbar';
import {
    UserContext,
    useUser,
    GameRoomContext,
    useGameRoom,
} from '../Components/AppHooks';

export default function Home(props) {

    const user = useUser();

    const gameRoom = useGameRoom();
    console.log("home");

    return (
        <UserContext.Provider value={user}>
            <GameRoomContext.Provider value={gameRoom}>
                <NavBar />
                <div className="relative container mx-auto flex flex-grow">
                    <Outlet />
                    <Snackbar />
                </div>
                <LeaveModal />
                <Footer />
            </GameRoomContext.Provider>
        </UserContext.Provider>
    );
}
