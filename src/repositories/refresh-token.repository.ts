// src/repositories/refresh-token.repository.ts

import prisma from '../config/database';
import { RefreshToken } from '@prisma/client';

/**
 * RefreshToken repository - handles refresh token data access
 */
export class RefreshTokenRepository {
  /**
   * Create refresh token
   */
  async create(userId: string, token: string, expiresAt: Date): Promise<RefreshToken> {
    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  /**
   * Find refresh token by token string
   */
  async findByToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  /**
   * Delete refresh token (safe - no error if not found)
   */
  async delete(token: string): Promise<void> {
    try {
      await prisma.refreshToken.delete({
        where: { token },
      });
    } catch (error: any) {
      // Ignore "not found" errors
      if (error.code !== 'P2025') {
        throw error;
      }
    }
  }

  /**
   * Delete all refresh tokens for a user
   */
  async deleteAllByUserId(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  /**
   * Delete expired tokens (cleanup)
   */
  async deleteExpired(): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}

// Export singleton instance
export const refreshTokenRepository = new RefreshTokenRepository();
