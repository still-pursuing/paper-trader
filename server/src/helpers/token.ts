import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../config';

interface UserId {
  id: string
}

/** return signed JWT from user data. */

export function createToken({ id }: UserId) {

  const payload = {
    id
  };

  return jwt.sign(payload, JWT_SECRET_KEY);
}
