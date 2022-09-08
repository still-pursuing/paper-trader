import 'dotenv/config';

export const JWT_SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

export const port = process.env.PORT ?? 8080;

export const clientId = process.env.CLIENT_ID;
export const clientSecret = process.env.CLIENT_SECRET;

export const REDIRECT_URI = process.env.NODE_ENV === "production"
    ? "https://paper-trader-182a4.web.app/login"
    : "http://localhost:3000/login";
