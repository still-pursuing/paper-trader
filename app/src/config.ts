export const BACKEND_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://paper-trader.fly.dev'
  : 'http://localhost:8080';

export const DISCORD_REDIRECT_URI = process.env.NODE_ENV === 'production'
  ? 'https://paper-trader-182a4.web.app/login'
  : 'http://localhost:3000/login';

