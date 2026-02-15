// tests/unit/auth.service.test.ts

import { AuthService } from '../../src/services/auth.service';
import { userRepository } from '../../src/repositories/user.repository';
import { refreshTokenRepository } from '../../src/repositories/refresh-token.repository';
import bcrypt from 'bcrypt';
import * as jwtUtils from '../../src/utils/jwt.utils';
import { ConflictError, UnauthorizedError } from '../../src/errors/app-errors';

// Mock dependencies
jest.mock('../../src/repositories/user.repository');
jest.mock('../../src/repositories/refresh-token.repository');
jest.mock('bcrypt');
jest.mock('../../src/utils/jwt.utils');

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: 'user-1',
    username: 'johndoe',
    email: 'john@example.com',
    password: '$2b$10$hashedpassword',
    role: 'USER' as const,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  beforeEach(() => {
    service = new AuthService();
  });

  // ─── register ─────────────────────────────────────────────
  describe('register', () => {
    const registerData = {
      username: 'johndoe',
      email: 'john@example.com',
      password: 'Password123',
    };

    it('should register a user and return DTO without password', async () => {
      (userRepository.emailExists as jest.Mock).mockResolvedValue(false);
      (userRepository.usernameExists as jest.Mock).mockResolvedValue(false);
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashedpassword');
      (userRepository.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.register(registerData);

      expect(userRepository.emailExists).toHaveBeenCalledWith('john@example.com');
      expect(userRepository.usernameExists).toHaveBeenCalledWith('johndoe');
      expect(bcrypt.hash).toHaveBeenCalledWith('Password123', 10);
      expect(result).toEqual({
        id: 'user-1',
        username: 'johndoe',
        email: 'john@example.com',
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw ConflictError when email exists', async () => {
      (userRepository.emailExists as jest.Mock).mockResolvedValue(true);

      await expect(service.register(registerData)).rejects.toThrow(ConflictError);
      await expect(service.register(registerData)).rejects.toThrow('Email already registered');
    });

    it('should throw ConflictError when username exists', async () => {
      (userRepository.emailExists as jest.Mock).mockResolvedValue(false);
      (userRepository.usernameExists as jest.Mock).mockResolvedValue(true);

      await expect(service.register(registerData)).rejects.toThrow(ConflictError);
      await expect(service.register(registerData)).rejects.toThrow('Username already taken');
    });
  });

  // ─── login ────────────────────────────────────────────────
  describe('login', () => {
    const loginData = {
      email: 'john@example.com',
      password: 'Password123',
    };

    it('should login and return user + tokens', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtUtils.generateAccessToken as jest.Mock).mockReturnValue('access-token');
      (jwtUtils.generateRefreshToken as jest.Mock).mockReturnValue('refresh-token');
      (jwtUtils.getTokenExpirationDate as jest.Mock).mockReturnValue(new Date('2026-02-01'));
      (refreshTokenRepository.create as jest.Mock).mockResolvedValue({});

      const result = await service.login(loginData);

      expect(userRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('Password123', '$2b$10$hashedpassword');
      expect(jwtUtils.generateAccessToken).toHaveBeenCalledWith({
        userId: 'user-1',
        email: 'john@example.com',
        role: 'USER',
      });
      expect(refreshTokenRepository.create).toHaveBeenCalled();
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedError when user not found', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(service.login(loginData)).rejects.toThrow(UnauthorizedError);
      await expect(service.login(loginData)).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedError when password is wrong', async () => {
      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginData)).rejects.toThrow(UnauthorizedError);
      await expect(service.login(loginData)).rejects.toThrow('Invalid credentials');
    });
  });

  // ─── refresh ──────────────────────────────────────────────
  describe('refresh', () => {
    it('should rotate tokens on valid refresh', async () => {
      const decoded = { userId: 'user-1', email: 'john@example.com', role: 'USER' };
      (jwtUtils.verifyRefreshToken as jest.Mock).mockReturnValue(decoded);
      (refreshTokenRepository.findByToken as jest.Mock).mockResolvedValue({
        id: 'rt-1',
        token: 'old-refresh-token',
        userId: 'user-1',
        expiresAt: new Date('2026-12-31'), // not expired
        createdAt: new Date(),
      });
      (jwtUtils.generateAccessToken as jest.Mock).mockReturnValue('new-access-token');
      (jwtUtils.generateRefreshToken as jest.Mock).mockReturnValue('new-refresh-token');
      (jwtUtils.getTokenExpirationDate as jest.Mock).mockReturnValue(new Date('2026-02-01'));
      (refreshTokenRepository.delete as jest.Mock).mockResolvedValue(undefined);
      (refreshTokenRepository.create as jest.Mock).mockResolvedValue({});

      const result = await service.refresh('old-refresh-token');

      expect(refreshTokenRepository.delete).toHaveBeenCalledWith('old-refresh-token');
      expect(refreshTokenRepository.create).toHaveBeenCalled();
      expect(result.accessToken).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
    });

    it('should throw UnauthorizedError when token is invalid', async () => {
      (jwtUtils.verifyRefreshToken as jest.Mock).mockImplementation(() => {
        throw new Error('invalid token');
      });

      await expect(service.refresh('bad-token')).rejects.toThrow(UnauthorizedError);
      await expect(service.refresh('bad-token')).rejects.toThrow('Invalid refresh token');
    });

    it('should throw UnauthorizedError when token not in DB', async () => {
      (jwtUtils.verifyRefreshToken as jest.Mock).mockReturnValue({
        userId: 'user-1',
        email: 'john@example.com',
        role: 'USER',
      });
      (refreshTokenRepository.findByToken as jest.Mock).mockResolvedValue(null);

      await expect(service.refresh('missing-token')).rejects.toThrow(UnauthorizedError);
      await expect(service.refresh('missing-token')).rejects.toThrow('Refresh token not found');
    });

    it('should throw UnauthorizedError when token is expired', async () => {
      (jwtUtils.verifyRefreshToken as jest.Mock).mockReturnValue({
        userId: 'user-1',
        email: 'john@example.com',
        role: 'USER',
      });
      (refreshTokenRepository.findByToken as jest.Mock).mockResolvedValue({
        id: 'rt-1',
        token: 'expired-token',
        userId: 'user-1',
        expiresAt: new Date('2020-01-01'), // expired
        createdAt: new Date(),
      });
      (refreshTokenRepository.delete as jest.Mock).mockResolvedValue(undefined);

      await expect(service.refresh('expired-token')).rejects.toThrow(UnauthorizedError);
      await expect(service.refresh('expired-token')).rejects.toThrow('Refresh token expired');
    });
  });

  // ─── logout ───────────────────────────────────────────────
  describe('logout', () => {
    it('should delete token on valid logout', async () => {
      (refreshTokenRepository.findByToken as jest.Mock).mockResolvedValue({
        id: 'rt-1',
        token: 'valid-token',
        userId: 'user-1',
        expiresAt: new Date('2026-12-31'),
        createdAt: new Date(),
      });
      (refreshTokenRepository.delete as jest.Mock).mockResolvedValue(undefined);

      await service.logout('valid-token');

      expect(refreshTokenRepository.delete).toHaveBeenCalledWith('valid-token');
    });

    it('should throw UnauthorizedError when token not found', async () => {
      (refreshTokenRepository.findByToken as jest.Mock).mockResolvedValue(null);

      await expect(service.logout('missing-token')).rejects.toThrow(UnauthorizedError);
      await expect(service.logout('missing-token')).rejects.toThrow(
        'Refresh token not found or already invalidated',
      );
    });
  });
});
