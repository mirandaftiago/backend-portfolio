// src/config/redis.ts

import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 3) {
      console.error('Redis: Could not connect after 3 retries');
      return null; // Stop retrying
    }
    return Math.min(times * 200, 2000); // Retry with increasing delay
  },
});

redis.on('connect', () => {
  console.log('🔴 Redis connected');
});

redis.on('error', (err) => {
  console.error('Redis error:', err.message);
});

export default redis;
