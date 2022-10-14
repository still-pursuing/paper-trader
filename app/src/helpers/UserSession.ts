import PaperTraderApi from "./PaperTraderApi";
import {v4 as uuidv4} from "uuid";
import { CsrfStateError } from "../errors/errors";

class UserSession {
	static storedCsrfStateString = localStorage.getItem('csrfStateString') ?? undefined;

	/** Generate a random string using UUID and store in localStorage if needed */
	static storeCsrfStateString() {
		if (!this.storedCsrfStateString) {
			localStorage.setItem('csrfStateString', uuidv4());
		}
	};
	
	/** Make a request to Discord to get user data */
	static async login(searchParams: URLSearchParams) {
			if (this.storedCsrfStateString !== searchParams.get('state')) {
				throw new CsrfStateError();
			}

			const discordOAuthCode = searchParams.get('code');

			if (discordOAuthCode) {
				const token = await PaperTraderApi.getDiscordUser(discordOAuthCode);
				localStorage.setItem('userToken', token);
				return token;
			} 
	};
}

export default UserSession;