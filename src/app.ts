// src/app.ts

import 'dotenv/config';
import express, { Application } from 'express';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import taskShareRoutes from './routes/task-share.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { globalLimiter, authLimiter, apiLimiter } from './middleware/rate-limit.middleware';

// Initialize Express app
const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(globalLimiter); // Apply global rate limiter to all routes

// Routes
app.use(healthRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/tasks', apiLimiter, taskRoutes);
app.use('/api', apiLimiter, taskShareRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

export default app;
