import axios from 'axios';

import {
  clientId,
  clientSecret,
  REDIRECT_URI,
  BASE_DISCORD_API_URL
} from '../config';

interface DiscordOAuthTokenResponseData {
  token_type: string;
  access_token: string;
}

interface DiscordUserData {
  id: string;
  username: string;
  discriminator: string;
}

export class Discord {

  /** Axios request builder */
  static async request(endpoint: string, headers: any, data?: URLSearchParams, method = "GET") {
    const url = `${BASE_DISCORD_API_URL}/${endpoint}`;

    const response = (await axios({ method, url, data, headers })).data;
    return response;
  }

  // Individual Discord API routes

  /** Get an access token from Discord OAuth API */
  static async getDiscordToken(authCode: string): Promise<DiscordOAuthTokenResponseData> {
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: authCode,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      scope: 'identify'
    });

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    const res = await this.request('oauth2/token', headers, params, "POST");
    return res;
  }

  /** Get a user object from Discord users API  */
  static async getDiscordUser(tokenType: string, accessToken: string): Promise<DiscordUserData> {
    const headers = { authorization: `${tokenType} ${accessToken}` };

    const res = await this.request('users/@me', headers);
    return res;
  }
}