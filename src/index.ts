// src/index.ts

import app from './app';
import logger from './config/logger';

// Configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
app.listen(PORT, () => {
  logger.info({ port: PORT, env: NODE_ENV }, 'Server started successfully');
});
