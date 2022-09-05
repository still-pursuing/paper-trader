import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../src/config';
import express from 'express';


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */
function authenticateJWT(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    } catch (err) {
        return next();
    }
}

function ensureCorrectUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const user = res.locals.user;
        if (!(user && (user.username === req.params.username))) {
            throw new Error();
        }
        return next();
    } catch (err) {
        return next(err);
    }
}
export {
    authenticateJWT,
    ensureCorrectUser,
};