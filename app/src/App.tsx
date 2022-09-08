import { useCallback, useEffect, useState } from 'react'
import { Route, Routes, useSearchParams } from 'react-router-dom'
import { Pane } from 'evergreen-ui'

import { NotFound } from './pages/NotFound'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Navbar from './components/Navbar';
import { Splash } from './pages/Splash'
import PaperTraderApi from './Api'
import UserContext from "./UserContext";

interface UserData {
	username: string
}

/**
 * Props:
 * - None
 * 
 * State:
 * - token: string returned from the server/local storage
 * - currentUser: { username }
 * 
 * Events:
 * - None
 * 
 * App --> NavBar, Routes
 */

function App() {
	const [token, setToken] = useState(localStorage.getItem('userToken'));
	const [currentUser, setCurrentUser] = useState<UserData | null>(null);
	const [searchParams] = useSearchParams();
	console.debug("App", { token, currentUser, searchParams })

	/** 
	  * Stores string generated from PaperTraderApi in localStorage to
	  * use for Discord OAUth CSRF prevention when component mounts and updates 
	  * currentUser state if there token changes from default/previous value
	  */
	useEffect(function storeCsrfStringAndLoadUser() {
		if (localStorage['stateString'] === undefined) {
			const randomString = PaperTraderApi.generateRandomString();
			localStorage.setItem('stateString', randomString);
		}

		async function getCurrentUser() {
			if (token !== null) {
				try {
					PaperTraderApi.token = token;
					let resultUser = await PaperTraderApi.getCurrentUser()
					setCurrentUser(resultUser);
				} catch (err) {
					console.error("Can't load user", err);
				}
			}
		}
		getCurrentUser();
	}, [token]);

	/** Handles site-wide login.
	 *
	 *  Logs in a user and sets localStorage with token
	 */
	const handleLogin = useCallback(
		async () => {
			try {
				if (localStorage['stateString'] !== searchParams.get('state')) {
					throw new Error("Clickjacked!!");
				}

				const discordOAuthCode = searchParams.get('code');

				if (discordOAuthCode) {
					const token = await PaperTraderApi.getDiscordUser(discordOAuthCode);
					setToken(token);
					localStorage.setItem('userToken', token);
				} else {
					throw new Error('Missing Discord OAuth code');
				}
			} catch (err) {
				console.error(err);
			}
		}, [searchParams],
	);

	return (
		<UserContext.Provider value={currentUser}>
			<Pane padding={16}>
				<Navbar></Navbar>
				<Routes>
					<Route path="/" element={<Splash />} />
					<Route path="home" element={<Splash />} />
					<Route path="login" element={<Login handleLogin={handleLogin} />} />
					<Route path="profile" element={<Profile />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Pane>
		</UserContext.Provider>
	)
}

export default App;