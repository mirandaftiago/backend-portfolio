// src/middleware/error.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../errors/app-errors';
import { ZodIssue } from 'zod';
import logger from '../config/logger';

interface ErrorResponse {
  error: {
    message: string;
    status: number;
    timestamp: string;
    errors?: ZodIssue[];
  };
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction,
): void => {
  // Log error
  logger.error({ err, path: _req.path, method: _req.method }, err.message);

  // Handle AppError (known errors)
  if (err instanceof AppError) {
    const errorResponse: ErrorResponse = {
      error: {
        message: err.message,
        status: err.statusCode,
        timestamp: new Date().toISOString(),
        ...(err instanceof ValidationError && err.errors && { errors: err.errors }),
      },
    };

    res.status(err.statusCode).json(errorResponse);
    return;
  }

  // Handle unknown errors
  const errorResponse: ErrorResponse = {
    error: {
      message: 'Internal Server Error',
      status: 500,
      timestamp: new Date().toISOString(),
    },
  };

  res.status(500).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response<ErrorResponse>): void => {
  const errorResponse: ErrorResponse = {
    error: {
      message: `Route ${req.method} ${req.url} not found`,
      status: 404,
      timestamp: new Date().toISOString(),
    },
  };

  res.status(404).json(errorResponse);
};
