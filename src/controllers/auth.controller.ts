// src/controllers/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import { registerSchema } from '../schemas/auth.schema';
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