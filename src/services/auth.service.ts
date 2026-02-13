// src/services/auth.service.ts

import bcrypt from 'bcrypt';
import { RegisterDTO, LoginDTO } from '../schemas/auth.schema';
import { UserResponseDTO } from '../dtos/user.dto';
import { LoginResponseDTO, RefreshResponseDTO, JWTPayload } from '../dtos/auth.dto';
import { userRepository } from '../repositories/user.repository';
import { refreshTokenRepository } from '../repositories/refresh-token.repository';
import { ConflictError, UnauthorizedError } from '../errors/app-errors';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getTokenExpirationDate,
} from '../utils/jwt.utils';

const SALT_ROUNDS = 10;
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Authentication service - handles business logic
 */
export class AuthService {
  /**
   * Register new user
   */
  async register(data: RegisterDTO): Promise<UserResponseDTO> {
    // Check if email already exists
    const emailExists = await userRepository.emailExists(data.email);
    if (emailExists) {
      throw new ConflictError('Email already registered');
    }

    // Check if username already exists
    const usernameExists = await userRepository.usernameExists(data.username);
    if (usernameExists) {
      throw new ConflictError('Username already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Create user
    const user = await userRepository.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
    });

    // Transform to DTO (exclude password!)
    return this.toUserResponseDTO(user);
  }

  /**
   * Login user
   */
  async login(data: LoginDTO): Promise<LoginResponseDTO> {
    // Find user by email
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate tokens
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token to database
    const expiresAt = getTokenExpirationDate(REFRESH_TOKEN_EXPIRES_IN);
    await refreshTokenRepository.create(user.id, refreshToken, expiresAt);

    // Return response
    return {
      user: this.toUserResponseDTO(user),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token
   */
  async refresh(token: string): Promise<RefreshResponseDTO> {
    // Verify refresh token
    let decoded: JWTPayload;
    try {
      decoded = verifyRefreshToken(token);
    } catch (_error) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Check if token exists in database
    const storedToken = await refreshTokenRepository.findByToken(token);
    if (!storedToken) {
      throw new UnauthorizedError('Refresh token not found');
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      await refreshTokenRepository.delete(token);
      throw new UnauthorizedError('Refresh token expired');
    }

    // Generate new tokens
    const payload: JWTPayload = {
      userId: decoded.userId,
      email: decoded.email,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    // Delete old refresh token and save new one (token rotation)
    await refreshTokenRepository.delete(token);
    const expiresAt = getTokenExpirationDate(REFRESH_TOKEN_EXPIRES_IN);
    await refreshTokenRepository.create(decoded.userId, newRefreshToken, expiresAt);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout user (invalidate refresh token)
   */
  async logout(token: string): Promise<void> {
    // Check if token exists
    const storedToken = await refreshTokenRepository.findByToken(token);
    if (!storedToken) {
      throw new UnauthorizedError('Refresh token not found or already invalidated');
    }

    // Delete refresh token
    await refreshTokenRepository.delete(token);
  }

  /**
   * Transform User model to UserResponseDTO
   */
  private toUserResponseDTO(user: any): UserResponseDTO {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

// Export singleton instance
export const authService = new AuthService();
