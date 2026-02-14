// tests/helpers/auth.helper.ts

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

export const generateTestToken = (userId: string, role: 'USER' | 'ADMIN' = 'USER') => {
  return jwt.sign(
    { userId, email: `test-${userId}@test.com`, role },
    JWT_SECRET,
    { expiresIn: '15m' },
  );
};