import PaperTraderApi from "./PaperTraderApi";
import {v4 as uuidv4} from "uuid";

class UserSession {
	static storedCsrfStateString = localStorage.getItem('csrfStateString') ?? undefined;

	static storeCsrfStateString() {
		if (!this.storedCsrfStateString) {
			localStorage.setItem('csrfStateString', uuidv4());
		}
	};

	static async getCurrentUser(token: string | undefined) {
		if (token !== undefined) {
			try {
				PaperTraderApi.token = token;
				let resultUser = await PaperTraderApi.getCurrentUser()
				return resultUser;
			} catch (err) {
				// todo: Change to properly throw an Error?
				console.error("Can't load user", err);
			}
		}
	};
	
	static async login(searchParams: URLSearchParams) {
		try {
			if (this.storedCsrfStateString !== searchParams.get('state')) {
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