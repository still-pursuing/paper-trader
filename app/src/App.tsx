import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Pane } from 'evergreen-ui'

import { NotFound } from './pages/NotFound'
import Login from './pages/Login'
import Navbar from './components/Navbar';
import { Splash } from './pages/Splash'
import DiscordRedirect from './pages/Login/DiscordRedirect'
import PaperTraderApi from './Api'

/**
 * Props:
 * - None
 * 
 * State:
 * - csrfToken: string to append to Discord OAuth URL
 * 
 * Events:
 * - None
 * 
 * App --> NavBar, Routes
 */

function App() {
    const [csrfToken, setCsrfToken] = useState('');

    /** 
    * Stores string generated from PaperTraderApi in localStorage to
    * use for Discord OAUth CSRF prevention whenever csrfToken is changed
    */
    useEffect(function storeCsrfTokenOnChange() {
        if (localStorage['token'] === undefined) {
            const randomString = PaperTraderApi.generateRandomString();
            localStorage.setItem('token', randomString);
            setCsrfToken(randomString);
            console.log('inside effect:', csrfToken)
        }
    }, [csrfToken]);

    return (
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
    )
}

export default App;