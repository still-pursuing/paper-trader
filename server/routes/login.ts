import axios from 'axios';
import { Router } from 'express'

import {
	clientId,
	clientSecret,
	REDIRECT_URI
} from '../src/config';

import { createToken } from '../helpers/token';
import { BadRequestError } from '../src/errors';

interface DiscordOAuthTokenResponseData {
	token_type: string
	access_token: string
}

interface DiscordUserData {
	username: string
	discriminator: string
}

export const router = Router();

/** GET / => { token }
 *
 * Returns JWT token which can be used to authenticate further requests
 * or an error if requests to Discord OAuth API fail
 *
 * Authorization required: none
 */

router.get('/', async (req, res, next) => {
	const { code } = req.query;

	if (!code) return next(new BadRequestError());

	let oauthTokenData: DiscordOAuthTokenResponseData;

	try {
		const params = new URLSearchParams({
			client_id: clientId,
			client_secret: clientSecret,
			code: code.toString(),
			grant_type: 'authorization_code',
			redirect_uri: REDIRECT_URI,
			scope: 'identify'
		});

		oauthTokenData = (await axios({
			method: 'POST',
			url: 'https://discord.com/api/oauth2/token',
			data: params,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
		})).data;
	} catch (error) {
		const { data } = error.response.config;
		error.response.config.data =
			`client_id=REDACTED&client_secret=REDACTED&${data.substring(data.indexOf("grant_type"))}`;

		error.response.message = error.response.data.error_description;
		return next(error.response);
	}

	try {
		const userResult: DiscordUserData = (await axios({
			method: 'GET',
			url: 'https://discord.com/api/users/@me',
			headers: {
				authorization: `${oauthTokenData.token_type} ${oauthTokenData.access_token}`,
			}
		})).data;

		const { username, discriminator } = userResult;

		const token = createToken(`${username}${discriminator}`);
		return res.json({ token });
	} catch (error) {

		error.response.config.headers.authorization = "Bearer REDACTED";
		error.response.request._header = "REDACTED";

		error.response.message = error.response.data.message;
		return next(error.response);
	}

})