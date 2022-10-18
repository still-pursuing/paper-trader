import { useCallback, useEffect, useState } from 'react'
import { Route, Routes, useSearchParams } from 'react-router-dom'
import { Alert, Pane } from 'evergreen-ui'

import { NotFound } from './pages/NotFound'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Navbar from './components/Navbar';
import { Splash } from './pages/Splash'
import UserContext from "./UserContext";
import UserSession from "./helpers/UserSession";
import PaperTraderApi from './helpers/PaperTraderApi'

/**
 * Props:
 * - None
 * 
 * State:
 * - userToken: string returned from the server/local storage
 * - currentUser: { username }
 * 
 * Events:
 * - None
 * 
 * App --> NavBar, Routes
 */

function App() {
	const [userToken, setUserToken] = useState<string | undefined>(localStorage.getItem('userToken') ?? undefined);
	const [currentUser, setCurrentUser] = useState<string | undefined>(undefined);
	const [errors, setErrors] = useState<string | undefined>(undefined)
	const [searchParams] = useSearchParams();

	/** 
		* Stores string generated from PaperTraderApi in localStorage to
		* use for Discord OAUth CSRF prevention when component mounts and updates 
		* currentUser state if there userToken changes from default/previous value
		*/
	useEffect(() => {
		async function storeCsrfStringAndLoadUser() {
			UserSession.storeCsrfStateString();
			if (userToken) {
				try {
					PaperTraderApi.token = userToken;
					setCurrentUser(userToken);
				} catch (error) {
					localStorage.removeItem('userToken');
					setErrors("Please try logging in again.");
				}
			}
		}
		storeCsrfStringAndLoadUser();
	}, [userToken]);

	/** Handles site-wide login.
	 *
	 *  Logs in a user and sets localStorage with userToken
	 */
	const handleLogin = useCallback(async () => {
		setUserToken(await UserSession.login(searchParams));
	}, [searchParams]);

	/** Handles site-wide logout.
	 *
	 *  Logouts a user, removing them from the application context and
	 *  clears localStorage of the userToken
	 */
	const handleLogout = () => {
		setUserToken(undefined);
		setCurrentUser(undefined);
		localStorage.removeItem('userToken');
	}

	return (
		<UserContext.Provider value={currentUser}>
			<Pane padding={16}>
				<Navbar handleLogout={handleLogout} />
				{errors &&
					<Alert intent="danger" title="Something went wrong.">
						{errors}
					</Alert>}
				<Routes>
					<Route path="/" element={<Splash />} />
					<Route path="home" element={<Splash />} />
					<Route path="login" element={<Login handleLogin={handleLogin} />} />
					<Route path="profile" element={<Profile handleLogout={handleLogout} />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Pane>
		</UserContext.Provider>
	)
}

export default App;