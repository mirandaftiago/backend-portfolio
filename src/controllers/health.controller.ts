// src/controllers/health.controller.ts

import { env } from '../config/env';
import { Request, Response } from 'express';
import { HealthResponse } from '../types/express.types';

/**
 * Health check endpoint controller
 * Returns API health status
 */
export const healthCheck = (_req: Request, res: Response<HealthResponse>): void => {
  const healthData: HealthResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV || 'development',
  };

  res.status(200).json(healthData);
};
