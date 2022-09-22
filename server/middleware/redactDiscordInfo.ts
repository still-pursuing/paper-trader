import express from 'express';
import { ExpressError } from '../src/errors';


export function redactDiscordInfo(err: ExpressError, req: express.Request, res: express.Response, next: express.NextFunction) {
    const { headers, url, data } = err.config;

    if (process.env.NODE_ENV !== "production") {
        if (url === 'https://discord.com/api/oauth2/token') {
            const redactedData = "client_id=REDACTED&client_secret=REDACTED&" + `${data.substring(data.indexOf("grant_type"))}`;

            err.config.data = redactedData;
        }
        if (url === 'https://discord.com/api/users/@me') {
            const redactAuthToken = headers.authorization.split(" ")[0];

            err.config.headers.authorization = redactAuthToken + " REDACTED";
            err.request._header = "REDACTED"
        }
    }
    next(err);
}