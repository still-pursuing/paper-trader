import { useEffect, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Pane } from 'evergreen-ui'
import { decodeToken } from "react-jwt";

import { NotFound } from './pages/NotFound'
import Login from './pages/Login'
import Navbar from './components/Navbar';
import { Splash } from './pages/Splash'
import DiscordRedirect from './pages/Login/DiscordRedirect'
import PaperTraderApi from './Api'
import UserContext from "./UserContext";


/**
 * Props:
 * - None
 * 
 * State:
 * - None
 * 
 * Events:
 * - None
 * 
 * App --> NavBar, Routes
 */

function App() {
    const [token, setToken] = useState(localStorage.getItem('userToken'));
    const [needsRedirect, setNeedsRedirect] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    /** 
      * Stores string generated from PaperTraderApi in localStorage to
      * use for Discord OAUth CSRF prevention when component mounts if there
      * no token
      */
    useEffect(function storeCsrfTokenOnMount() {
        if (localStorage['stateString'] === undefined) {
            const randomString = PaperTraderApi.generateRandomString();
            localStorage.setItem('stateString', randomString);
        }

        async function getCurrentUser() {
            if (token !== null) {
                try {
                    let decodedToken = decodeToken(token);
                    console.log('decoded', decodedToken);
                    let jsonToken = JSON.stringify(decodedToken);
                    let parsed = JSON.parse(jsonToken);
                    if (parsed !== null) {
                        const username = parsed.username
                        PaperTraderApi.token = token;
                        let resultUser = await PaperTraderApi.getCurrentUser(username)
                        console.log({ resultUser })
                        setCurrentUser(resultUser);
                        setNeedsRedirect(false);
                    } else {
                        throw new Error('Invalid username');
                    }
                } catch (err) {
                    console.error("Can't load user", err);
                }
            }
        }
        getCurrentUser();
        console.log('In App effect')
    }, [token]);

    console.log({ currentUser });

    if (needsRedirect) {
        return <Navigate replace to="/" />
    }

    return (
        <UserContext.Provider value={currentUser}>
            <Pane padding={16}>
                <Navbar></Navbar>
                <Routes>
                    <Route path="/" element={<Splash />} />
                    <Route path="home" element={<Splash />} />
                    <Route path="login" element={<Login />}>
                        <Route path="discord-redirect" element={<DiscordRedirect />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Pane>
        </UserContext.Provider>
    )
}

export default App;