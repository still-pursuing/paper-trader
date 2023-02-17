import axios from 'axios';

import { BACKEND_BASE_URL } from '../config';
import { Activity } from '../interfaces/activity';
import { Holdings } from '../interfaces/holdings';

interface TransactionResult {
  price: number;
  qty: number;
  total: number;
  balance: number;
}

interface Profile {
  username: string;
  balance: string;
}

interface User {
  userProfile: Profile;
  userHoldings: Holdings[];
  totalHoldingsValue: string;
  totalUserValue: string;
}

export default class PaperTraderApi {
  static token: string;

  /** Axios request builder */
  static async request(endpoint: string, data?: any, method = 'GET') {
    const url = `${BACKEND_BASE_URL}/${endpoint}`;
    let headers = { Authorization: `Bearer ${PaperTraderApi.token}` };

    const response = (await axios({ method, url, data, headers })).data;
    return response;
  }

  /**
   * Makes a request to server with Discord OAuth authorization code input
   *
   * Returns a JWT
   */
  static async getDiscordUser(code: string): Promise<string> {
    const res = (await this.request(`login?code=${code}`)).token;

    return res;
  }

  /**
   * Makes a request to server with JWT token from localStorage
   *
   * Returns:
   *  {userProfile, userHoldings}
   */
  static async getUser(): Promise<User> {
    const res = await this.request('user');

    return res;
  }

  /**
   * Makes a request to server with stock ticker and quantity to buy a stock
   */
  static async buyStock(
    ticker: string,
    quantity: number
  ): Promise<TransactionResult> {
    const transactionDetails = { ticker, quantity };
    const res = await this.request('stock/buy', transactionDetails, 'POST');

    return res;
  }

  /**
   * Makes a request to server with stock ticker and quantity to buy a stock
   *
   */
  static async sellStock(
    ticker: string,
    quantity: number
  ): Promise<TransactionResult> {
    const transactionDetails = { ticker, quantity };
    const res = await this.request('stock/sell', transactionDetails, 'POST');

    return res;
  }

  /**
   * Makes a request to server with stock ticker to get a price
   */
  static async getStockPrice(ticker: string): Promise<number> {
    const res = (await this.request(`stock/search?ticker=${ticker}`)).price;

    return res;
  }

  /**
   * Makes a request to server to obtain recent transaction activity
   */
  static async getHomeFeed(): Promise<Activity[] | undefined> {
    const res = this.request('');

    return res;
  }
}
