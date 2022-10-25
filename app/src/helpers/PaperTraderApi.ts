import axios from 'axios';

import { BACKEND_BASE_URL } from '../config';

class PaperTraderApi {
  static token: string;
  /** 
   * Makes a request to server with Discord OAuth authorization code input
   * 
   * Returns a JWT
   */
  static async getDiscordUser(code: string): Promise<string> {
    const userToken = (await axios.get(`${BACKEND_BASE_URL}/login?code=${code}`)).data.token;
    return userToken;
  }

  /** 
   * Makes a request to server with JWT token from localStorage
   * 
   * Returns: 
   *  {username, balance}
   */
  static async getUserProfile() {
    const config = {
      headers: {
        'Authorization': `Bearer ${PaperTraderApi.token}`
      }
    };

    const result = (await axios.get(
        `${BACKEND_BASE_URL}/profile`,
        config
      )).data.userPortfolio;
    return result;
  }


  static async buyStock(ticker: string, quantity: number) {
    const config = {
      headers: {
        'Authorization': `Bearer ${PaperTraderApi.token}`
      }
    };

    const result = (await axios.post(
          `${BACKEND_BASE_URL}/stock/buy`, {
            ticker: ticker, 
            quantity: quantity
          },
          config
        )).data
    return result;
  }
}

export default PaperTraderApi;