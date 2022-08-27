const port = process.env.PORT ?? 8080;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.NODE_ENV === "production"
    ? "https://paper-trader-182a4.web.app/login/discord-redirect"
    : "http://localhost:3000/login/discord-redirect";

export {
    port,
    clientId,
    clientSecret,
    REDIRECT_URI
};