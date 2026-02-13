// src/middleware/error.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-errors';

interface ErrorResponse {
  error: {
    message: string;
    status: number;
    timestamp: string;
    errors?: any;
  };
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
): void => {
  // Log error
  console.error('Error:', err.message);
  if (!(err instanceof AppError)) {
    console.error('Stack:', err.stack);
  }

  // Handle AppError (known errors)
  if (err instanceof AppError) {
    const errorResponse: ErrorResponse = {
      error: {
        message: err.message,
        status: err.statusCode,
        timestamp: new Date().toISOString(),
        ...(err instanceof Error && 'errors' in err && { errors: (err as any).errors }),
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
export const notFoundHandler = (
  req: Request,
  res: Response<ErrorResponse>
): void => {
  const errorResponse: ErrorResponse = {
    error: {
      message: `Route ${req.method} ${req.url} not found`,
      status: 404,
      timestamp: new Date().toISOString(),
    },
  };

  res.status(404).json(errorResponse);
};