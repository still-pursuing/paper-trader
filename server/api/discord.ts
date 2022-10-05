import axios from 'axios';

import {
  clientId,
  clientSecret,
  REDIRECT_URI,
  BASE_DISCORD_API_URL
} from '../src/config';



export class Discord {

  /** Axios request builder */
  static async request(endpoint: string, headers: any, body = {}, method = "GET") {
    const url = `${BASE_DISCORD_API_URL}/${endpoint}`;
    const data = (method === "GET")
      ? undefined
      : body;

    const response = (await axios({ method, url, data, headers })).data
    return response;
  }

  // Individual Discord API routes

  /** Get an access token from Discord OAuth API */
  static async getDiscordToken(authCode: string) {
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: authCode,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      scope: 'identify'
    });

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    const res = await this.request('oauth2/token', headers, params, "POST")
    return res;
  }

  /** Get a user object from Discord users API  */
  static async getDiscordUser(tokenType: string, accessToken: string) {
    const headers = { authorization: `${tokenType} ${accessToken}` };

    const res = await this.request('users/@me', headers);
    return res;
  }
}