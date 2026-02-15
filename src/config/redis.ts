// src/config/redis.ts
import { env } from './env';
import Redis from 'ioredis';
import logger from './logger';

const REDIS_URL = env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 3) {
      logger.error('Redis: Could not connect after 3 retries');
      return null; // Stop retrying
    }
    return Math.min(times * 200, 2000); // Retry with increasing delay
  },
});

redis.on('connect', () => {
  logger.info('🔴 Redis connected');
});

redis.on('error', (err) => {
  logger.error({ err }, 'Redis error');
});

export default redis;
