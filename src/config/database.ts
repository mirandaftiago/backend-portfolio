// src/config/database.ts

import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client instance
 * Singleton pattern to avoid multiple instances
 */
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

/**
 * Graceful shutdown - disconnect from database
 */
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
