import { useState, useEffect, useCallback } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Pane } from 'evergreen-ui'

import { NotFound } from './pages/NotFound'
import Login from './pages/Login'
import Navbar from './components/Navbar';
import { Splash } from './pages/Splash'
import DiscordRedirect from './pages/Login/DiscordRedirect'

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
    * Generate a random string and store in local storage to 
    * use for Discord OAUth CSRF prevention whenever csrfToken is changed
    */
    const memoizedRandomString = useCallback(
        function generateRandomString() {
            if (localStorage['token'] === undefined) {
                let randomString = '';
                const randomNumber = Math.floor(Math.random() * 10);

                for (let i = 0; i < 20 + randomNumber; i++) {
                    randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
                }

                localStorage.setItem('token', randomString);
                setCsrfToken(randomString);
                console.log('inside effect:', csrfToken)
            }
        }, [csrfToken]
    );

    /** 
     * Call memoizedRandomString which is memoized generateRandomString 
     * to prevent infinite rendering 
     */
    useEffect(function generateRandomString() {
        memoizedRandomString()
    }, [memoizedRandomString]);

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