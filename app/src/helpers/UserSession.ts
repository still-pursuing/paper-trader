import PaperTraderApi from "./PaperTraderApi";
import {v4 as uuidv4} from "uuid";
import { StateError } from "../errors/errors";

class UserSession {
	static storedCsrfStateString = localStorage.getItem('csrfStateString') ?? undefined;

	static storeCsrfStateString() {
		if (!this.storedCsrfStateString) {
			localStorage.setItem('csrfStateString', uuidv4());
		}
	};

	static async getCurrentUser(token: string | undefined) {
		if (token !== undefined) {
				PaperTraderApi.token = token;
				let resultUser = await PaperTraderApi.getCurrentUser()
				return resultUser;
				// todo: Change to properly throw an Error?
				// console.error("Can't load user", err);

		}
	};
	
	static async login(searchParams: URLSearchParams) {
			if (this.storedCsrfStateString !== searchParams.get('state')) {
				throw new StateError();
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