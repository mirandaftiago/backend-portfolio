// src/index.ts

import { env } from './config/env';
import app from './app';
import logger from './config/logger';

// Start server
const server = app.listen(env.PORT, () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, 'Server started successfully');
});

// Graceful shutdown
const shutdown = (signal: string) => {
  logger.info({ signal }, 'Shutdown signal received, closing server...');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });

  // Force exit after 10 seconds if connections don't close
  setTimeout(() => {
    logger.error('Forced shutdown — connections did not close in time');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
