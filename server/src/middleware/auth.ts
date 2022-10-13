import jwt from 'jsonwebtoken';
import express from 'express';

import { JWT_SECRET_KEY } from '../config';
import { UnauthorizedError } from '../errors';

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */
export function authenticateJWT(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(" ")[1];
            const verifiedUser = jwt.verify(token, JWT_SECRET_KEY)
            if (typeof verifiedUser !== 'string') {
                res.locals.user = verifiedUser.user.id;
            }
        } else {
            throw new UnauthorizedError();
        }
        return next();
    } catch (err) {
        return next(err);
    }
}