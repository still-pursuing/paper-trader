import { describe, expect, test } from '@jest/globals';
import jwt from 'jsonwebtoken';

import { createToken } from '../helpers/token';

describe('create a JWT', () => {
  test('signs token', () => {
    expect(createToken({ id: '123' })).not.toBe({ id: '123' });
    expect(typeof createToken({ id: '123' })).toBe('string');
    expect(jwt.decode(createToken({ id: '123' }))).toEqual(
      expect.objectContaining({ id: '123' })
    );
  });
});
