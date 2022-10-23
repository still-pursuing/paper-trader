import 'dotenv/config';

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-dev';

export const port = process.env.PORT ?? 8080;

export const clientId = process.env.CLIENT_ID;
export const clientSecret = process.env.CLIENT_SECRET;
export const finnHubToken = process.env.FINNHUB_API_TOKEN;

export const BASE_DISCORD_API_URL = 'https://discord.com/api';

export const INITIAL_FUNDS = 10000;

// Use dev database, testing database, or via env var, production database
export function getDatabaseUri() {
  return (process.env.NODE_ENV === 'test')
    ? 'paper_trader_test'
    : process.env.DATABASE_URL || 'paper_trader';
}

export const REDIRECT_URI = process.env.NODE_ENV === 'production'
  ? 'https://paper-trader-182a4.web.app/login'
  : 'http://localhost:3000/login';
