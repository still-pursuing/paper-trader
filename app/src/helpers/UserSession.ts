import PaperTraderApi from "./PaperTraderApi";
import {v4 as uuidv4} from "uuid";

interface UserData {
	username: string
};

class UserSession {
	static storeCsrf() {
		if (localStorage.getItem('stateString') === null) {
			localStorage.setItem('stateString', uuidv4());
		}
	};

	static async getCurrentUser(token: string | null, setCurrentUser: React.Dispatch<React.SetStateAction<UserData | undefined>>) {
		if (token !== null) {
			try {
				PaperTraderApi.token = token;
				let resultUser = await PaperTraderApi.getCurrentUser()
				setCurrentUser(resultUser);
			} catch (err) {
				// todo: Change to properly throw an Error?
				console.error("Can't load user", err);
			}
		}
	};
	
	static async login(searchParams: URLSearchParams) {
		try {
			if (localStorage.getItem('stateString') !== searchParams.get('state')) {
				throw new Error("Clickjacked!!");
			}

			const discordOAuthCode = searchParams.get('code');

			if (discordOAuthCode) {
				const token = await PaperTraderApi.getDiscordUser(discordOAuthCode);
				localStorage.setItem('userToken', token);
				return token;
			} else {
				throw new Error('Missing Discord OAuth code');
			}
		} catch (err) {
			// todo: Change to properly throw an Error
			console.error(err);
		}
	};
}

export default UserSession;