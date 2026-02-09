// src/controllers/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { authService } from '../services/auth.service';
import { ValidationError } from '../errors/app-errors';

/**
 * Register new user
 * @route POST /api/auth/register
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body
    const result = registerSchema.safeParse(req.body);
    
    if (!result.success) {
      throw new ValidationError('Validation failed', result.error.issues);
    }

    // Register user
    const user = await authService.register(result.data);

    // Send response
    res.status(201).json({
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body
    const result = loginSchema.safeParse(req.body);
    
    if (!result.success) {
      throw new ValidationError('Validation failed', result.error.issues);
    }

    // Login user
    const loginData = await authService.login(result.data);

    // Send response
    res.status(200).json({
      message: 'Login successful',
      data: loginData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 * @route POST /api/auth/refresh
 */
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    // Refresh tokens
    const tokens = await authService.refresh(refreshToken);

    // Send response
    res.status(200).json({
      message: 'Token refreshed successfully',
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user
 * @route POST /api/auth/logout
 */
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    // Logout (invalidate refresh token)
    await authService.logout(refreshToken);

    // Send response
    res.status(200).json({
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 * @access Protected
 */
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // User is already attached by authenticate middleware
    const userId = req.user?.userId;

    if (!userId) {
      throw new ValidationError('User not found in request');
    }

    // In a real app, you might fetch fresh user data from database
    // For now, just return what's in the token
    res.status(200).json({
      message: 'Profile retrieved successfully',
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
