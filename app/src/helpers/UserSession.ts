import PaperTraderApi from "./Api";

interface UserData {
	username: string
};

class UserSession {
	static storeCsrf() {
		if (localStorage['stateString'] === undefined) {
			const randomString = PaperTraderApi.generateRandomString();
			localStorage.setItem('stateString', randomString);
		}
	};

	static async getCurrentUser(token: string | null, setCurrentUser: React.Dispatch<React.SetStateAction<UserData | null>>) {
		if (token !== null) {
			try {
				PaperTraderApi.token = token;
				let resultUser = await PaperTraderApi.getCurrentUser()
				setCurrentUser(resultUser);
			} catch (err) {
				console.error("Can't load user", err);
			}
		}
	};
	
	static async login(searchParams: URLSearchParams, setToken: React.Dispatch<React.SetStateAction<string | null>>) {
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
	};
}

export default UserSession;