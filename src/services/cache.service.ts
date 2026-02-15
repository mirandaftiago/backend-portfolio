// src/services/cache.service.ts

import redis from '../config/redis';

export class CacheService {
  /**
   * Get cached data by key
   * Returns null if key doesn't exist or Redis is unavailable
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch {
      return null; // Redis failure = cache miss, not app crash
    }
  }

  /**
   * Set data in cache with TTL (in seconds)
   */
  async set(key: string, data: unknown, ttlSeconds: number): Promise<void> {
    try {
      await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
    } catch {
      // Silently fail — caching is not critical
    }
  }

  /**
   * Delete a specific key
   */
  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch {
      // Silently fail
    }
  }

  /**
   * Delete all keys matching a pattern
   * Used to invalidate all cached tasks for a user
   */
  async delByPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch {
      // Silently fail
    }
  }
}

export const cacheService = new CacheService();
