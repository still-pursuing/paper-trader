import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../src/config';

/** return signed JWT from user data. */

function createToken(user: string) {

    const payload = {
        username: user
    };

    return jwt.sign(payload, SECRET_KEY);
}

export default createToken;
