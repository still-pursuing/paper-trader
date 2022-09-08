import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../src/config';

/** return signed JWT from user data. */

function createToken(user: string) {

    const payload = {
        username: user
    };

    return jwt.sign(payload, JWT_SECRET_KEY);
}

export default createToken;
