import React, { useState, useEffect } from 'react'
import {
    Outlet,
    Link,
    useParams,
    useLoaderData,
} from "react-router-dom";

import TextInput from './TextInput';
import Alert from './Alert';
import NavBar from './NavBar';
import Footer from './Footer';
import LeaveModal from './LeaveModal';
import { UserContext, useUser } from './AppHooks';

function Home(props) {
 
    const user = useUser();
    console.log("home");

    return (
        <UserContext.Provider value={user}>
            <NavBar />
            <div className="container mx-auto flex flex-grow">
                <Outlet />
            </div>
            <LeaveModal />
            <Footer />
        </UserContext.Provider>
    );
}
export default Home;