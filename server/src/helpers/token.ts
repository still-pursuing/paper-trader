import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config';

/** return signed JWT from user data. */

export function createToken(user: string) {

    const payload = {
        username: user
    };

    return jwt.sign(payload, JWT_SECRET_KEY);
}
