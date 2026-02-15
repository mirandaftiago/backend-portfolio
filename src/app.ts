// src/app.ts

import 'dotenv/config';
import express, { Application } from 'express';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import taskShareRoutes from './routes/task-share.routes';
import attachmentRoutes from './routes/attachment.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { globalLimiter, authLimiter, apiLimiter } from './middleware/rate-limit.middleware';

// Initialize Express app
const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiters (skip in test environment)
const isTest = process.env.NODE_ENV === 'test';
if (!isTest) {
  app.use(globalLimiter);
}

// Routes
app.use(healthRoutes);
app.use('/api/auth', ...(isTest ? [] : [authLimiter]), authRoutes);
app.use('/api/tasks', ...(isTest ? [] : [apiLimiter]), taskRoutes);
app.use('/api', ...(isTest ? [] : [apiLimiter]), taskShareRoutes);
app.use('/api', attachmentRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;
