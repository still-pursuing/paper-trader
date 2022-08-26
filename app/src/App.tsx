import { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Pane } from 'evergreen-ui'

import { NotFound } from './pages/NotFound'
import Login from './pages/Login'
import Navbar from './components/Navbar';
import { Splash } from './pages/Splash'
import DiscordRedirect from './pages/Login/DiscordRedirect'

// const LOCAL_STORAGE_TOKEN_KEY = "token";

function App() {
    const [csrfToken, setCsrfToken] = useState('');

    // note: don't override token on redirect so we can compare returned state string to validate

    useEffect(function generateRandomString() {
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
    }, [])

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