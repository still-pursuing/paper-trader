import 'dotenv/config';

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const port = process.env.PORT ?? 8080;

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

const REDIRECT_URI = process.env.NODE_ENV === "production"
    ? "https://paper-trader-182a4.web.app/login"
    : "http://localhost:3000/login";

export {
    SECRET_KEY,
    port,
    clientId,
    clientSecret,
    REDIRECT_URI
};