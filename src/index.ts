// src/index.ts

import 'dotenv/config';
import express, { Application } from 'express';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

// Initialize Express app
const app: Application = express();

// Configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('🚀 Server started successfully!');
  console.log(`📡 Environment: ${NODE_ENV}`);
  console.log(`🔗 Server running on: http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   POST http://localhost:${PORT}/api/auth/refresh`);
  console.log(`   POST http://localhost:${PORT}/api/auth/logout`);
  console.log(`   GET  http://localhost:${PORT}/api/auth/me (protected)`);
  console.log(`📝 Task endpoints (all protected):`);
  console.log(`   POST   http://localhost:${PORT}/api/tasks`);
  console.log(`   GET    http://localhost:${PORT}/api/tasks`);
  console.log(`   GET    http://localhost:${PORT}/api/tasks/stats`);
  console.log(`   GET    http://localhost:${PORT}/api/tasks/:id`);
  console.log(`   PATCH  http://localhost:${PORT}/api/tasks/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/tasks/:id`);
});
