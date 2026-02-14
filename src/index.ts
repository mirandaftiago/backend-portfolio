// src/index.ts

import app from './app';

// Configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

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
