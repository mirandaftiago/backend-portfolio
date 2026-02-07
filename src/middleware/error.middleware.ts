// src/middleware/error.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/express.types';

/**
 * Global error handling middleware
 * Catches all errors and returns consistent error response
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response<ErrorResponse>,
  _next: NextFunction
): void => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  const errorResponse: ErrorResponse = {
    error: {
      message: err.message || 'Internal Server Error',
      status: 500,
      timestamp: new Date().toISOString(),
    },
  };

  res.status(500).json(errorResponse);
};

/**
 * 404 Not Found handler
 * Catches requests to undefined routes
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