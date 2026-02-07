// src/types/express.types.ts

/**
 * Custom type definitions for Express responses
 */

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
}

export interface ErrorResponse {
  error: {
    message: string;
    status: number;
    timestamp: string;
  };
}