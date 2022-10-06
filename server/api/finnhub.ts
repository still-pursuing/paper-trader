import axios from 'axios';

import { finnHubToken } from '../src/config';

const BASE_FINNHUB_API_URL = 'https://finnhub.io/api/v1/quote';

export class Finnhub {

  static async request(ticker: string, method = "GET") {
    const url = `${BASE_FINNHUB_API_URL}?symbol=${ticker}&token=${finnHubToken}`;

    const response = (await axios({ method, url })).data;
    return response;
  }

  static async getStockQuote(ticker: string) {
    const res = await this.request(ticker);
    return res;
  }
}