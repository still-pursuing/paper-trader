import axios from 'axios';

import { BACKEND_BASE_URL } from '../config';
import { Activity } from '../interfaces/activity';

interface TransactionResult {
  price: number;
  qty: number;
  total: number;
  balance: number;
}

interface FinnhubQuote {
  c: number; // current price of the stock symbol provided
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
   *  {username, balance}
   */
  static async getUserProfile() {
    const res = (await this.request('profile')).userPortfolio;

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
   * Makes a request to server with stock ticker to get a quote
   */
  static async getStock(ticker: string): Promise<FinnhubQuote> {
    const res = (await this.request(`stock/search?ticker=${ticker}`)).quote;

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
