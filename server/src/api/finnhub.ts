import axios from 'axios';

import { finnHubToken } from '../config';

const BASE_FINNHUB_API_URL = 'https://finnhub.io/api/v1/quote';

interface FinnhubQuote {
  c: number // current price of the stock symbol provided
}

export class Finnhub {

  /** Axios request builder */
  static async request(ticker: string, method = "GET") {
    const url = `${BASE_FINNHUB_API_URL}?symbol=${ticker}&token=${finnHubToken}`;

    const response = (await axios({ method, url })).data;
    return response;
  }

  // Individual Finnhub API routes

  /** Get a stock quote based on ticker input */
  static async getStockQuote(ticker: string): Promise<FinnhubQuote> {
    return this.request(ticker)
  }
}