// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/app-errors';
import { verifyAccessToken } from '../utils/jwt.utils';
import { DecodedJWT } from '../dtos/auth.dto';

/**
 * Extend Express Request to include user
 */
declare global {
  namespace Express {
    interface Request {
      user?: DecodedJWT;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT access token and attaches user to request
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('No authorization header provided');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Invalid authorization format. Use: Bearer <token>');
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      // JWT verification errors
      next(new UnauthorizedError('Invalid or expired token'));
    }
  }
};
