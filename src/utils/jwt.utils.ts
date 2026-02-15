// src/utils/jwt.utils.ts

import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JWTPayload, DecodedJWT } from '../dtos/auth.dto';

// Ensure secrets are defined
const JWT_SECRET = env.JWT_SECRET;
const JWT_REFRESH_SECRET = env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = env.JWT_REFRESH_EXPIRES_IN;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT secrets are not defined in environment variables');
}

/**
 * Generate access token (short-lived)
 */
export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

/**
 * Generate refresh token (long-lived)
 */
export const generateRefreshToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions);
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): DecodedJWT => {
  return jwt.verify(token, JWT_SECRET as jwt.Secret) as DecodedJWT;
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): DecodedJWT => {
  return jwt.verify(token, JWT_REFRESH_SECRET as jwt.Secret) as DecodedJWT;
};

/**
 * Get token expiration date
 */
export const getTokenExpirationDate = (expiresIn: string): Date => {
  const now = new Date();
  const match = expiresIn.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error('Invalid expiration format');
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      now.setSeconds(now.getSeconds() + value);
      break;
    case 'm':
      now.setMinutes(now.getMinutes() + value);
      break;
    case 'h':
      now.setHours(now.getHours() + value);
      break;
    case 'd':
      now.setDate(now.getDate() + value);
      break;
  }

  return now;
};
