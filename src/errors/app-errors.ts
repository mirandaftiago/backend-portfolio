// src/errors/app-errors.ts

import { ZodIssue } from 'zod';

/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * 400 - Bad Request
 */

export class ValidationError extends AppError {
  constructor(
    message: string = 'Validation failed',
    public errors?: ZodIssue[],
  ) {
    super(400, message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * 409 - Conflict
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(409, message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * 404 - Not Found
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(404, message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * 401 - Unauthorized
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * 403 - Forbidden
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
