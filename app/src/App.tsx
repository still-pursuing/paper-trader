import { useCallback, useEffect, useState } from 'react'
import { Route, Routes, useSearchParams } from 'react-router-dom'
import { Pane } from 'evergreen-ui'

import { NotFound } from './pages/NotFound'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Navbar from './components/Navbar';
import { Splash } from './pages/Splash'
import UserContext from "./UserContext";
import UserSession from "./helpers/UserSession";

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
	const [currentUser, setCurrentUser] = useState<UserData | undefined>(undefined);
	const [searchParams] = useSearchParams();
	console.debug("App", { token, currentUser, searchParams });

	/** 
	  * Stores string generated from PaperTraderApi in localStorage to
	  * use for Discord OAUth CSRF prevention when component mounts and updates 
	  * currentUser state if there token changes from default/previous value
	  */
	useEffect(() => {
		async function storeCsrfStringAndLoadUser() {
			// don't need to wrap these in a useCallback?
			UserSession.storeCsrfStateString();
			setCurrentUser(await UserSession.getCurrentUser(token));
		}
		storeCsrfStringAndLoadUser();
	}, [token]);

	/** Handles site-wide login.
	 *
	 *  Logs in a user and sets localStorage with token
	 */
	const handleLogin = useCallback(async () => {
		setToken(await UserSession.login(searchParams));
	}, [searchParams]);

	/** Handles site-wide logout.
	 *
	 *  Logouts a user, removing them from the application context and
	 *  clears localStorage of the userToken
	 */
	const handleLogout = () => {
		setToken(null);
		setCurrentUser(undefined);
		localStorage.removeItem('userToken');
	}

	return (
		<UserContext.Provider value={currentUser}>
			<Pane padding={16}>
				<Navbar handleLogout={handleLogout} ></Navbar>
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