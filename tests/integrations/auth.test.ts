// tests/integrations/auth.test.ts

import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/database';
import bcrypt from 'bcrypt';
import { generateTestToken } from '../helpers/auth.helper';

// Mock the database module
jest.mock('../../src/config/database', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('Auth Endpoints', () => {
  const mockUser = {
    id: 'user-123',
    username: 'johndoe',
    email: 'john@example.com',
    password: '$2b$10$hashedpassword',
    role: 'USER',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  // ─── POST /api/auth/register ────────────────────────────────
  describe('POST /api/auth/register', () => {
    const validBody = {
      username: 'johndoe',
      email: 'john@example.com',
      password: 'Password123',
    };

    it('should register a user with valid data', async () => {
      (prisma.user.count as jest.Mock)
        .mockResolvedValueOnce(0)   // emailExists → false
        .mockResolvedValueOnce(0);  // usernameExists → false
      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashedpassword');
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(validBody);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data.username).toBe('johndoe');
      expect(response.body.data.email).toBe('john@example.com');
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return 409 when email already exists', async () => {
      (prisma.user.count as jest.Mock)
        .mockResolvedValueOnce(1);  // emailExists → true

      const response = await request(app)
        .post('/api/auth/register')
        .send(validBody);

      expect(response.status).toBe(409);
      expect(response.body.error.message).toBe('Email already registered');
    });

    it('should return 409 when username already exists', async () => {
      (prisma.user.count as jest.Mock)
        .mockResolvedValueOnce(0)   // emailExists → false
        .mockResolvedValueOnce(1);  // usernameExists → true

      const response = await request(app)
        .post('/api/auth/register')
        .send(validBody);

      expect(response.status).toBe(409);
      expect(response.body.error.message).toBe('Username already taken');
    });

    it('should return 400 with invalid password (no uppercase)', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...validBody, password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Validation failed');
    });

    it('should return 400 with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'john@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Validation failed');
    });
  });

  // ─── POST /api/auth/login ──────────────────────────────────
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (prisma.refreshToken.create as jest.Mock).mockResolvedValue({
        id: 'rt-1',
        token: 'refresh-token',
        userId: mockUser.id,
        expiresAt: new Date('2026-02-01'),
        createdAt: new Date(),
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'john@example.com', password: 'Password123' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.user.email).toBe('john@example.com');
      expect(response.body.data.user).not.toHaveProperty('password');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should return 401 with wrong password', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'john@example.com', password: 'WrongPass123' });

      expect(response.status).toBe(401);
      expect(response.body.error.message).toBe('Invalid credentials');
    });

    it('should return 401 with non-existent email', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'Password123' });

      expect(response.status).toBe(401);
      expect(response.body.error.message).toBe('Invalid credentials');
    });

    it('should return 400 with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'not-an-email', password: 'Password123' });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Validation failed');
    });
  });

  // ─── POST /api/auth/refresh ─────────────────────────────────
  describe('POST /api/auth/refresh', () => {
    it('should return 400 when no refresh token provided', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Refresh token is required');
    });

    it('should return 401 with invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(401);
      expect(response.body.error.message).toBe('Invalid refresh token');
    });
  });

  // ─── POST /api/auth/logout ──────────────────────────────────
  describe('POST /api/auth/logout', () => {
    it('should return 400 when no refresh token provided', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Refresh token is required');
    });

    it('should return 401 when token not found in DB', async () => {
      (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken: 'nonexistent-token' });

      expect(response.status).toBe(401);
      expect(response.body.error.message).toBe(
        'Refresh token not found or already invalidated',
      );
    });

    it('should logout successfully with valid token', async () => {
      (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue({
        id: 'rt-1',
        token: 'valid-token',
        userId: 'user-123',
        expiresAt: new Date('2026-12-31'),
        createdAt: new Date(),
      });
      (prisma.refreshToken.delete as jest.Mock).mockResolvedValue({});

      const response = await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken: 'valid-token' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logout successful');
    });
  });

  // ─── GET /api/auth/me ───────────────────────────────────────
  describe('GET /api/auth/me', () => {
    it('should return user profile with valid token', async () => {
      const token = generateTestToken('user-123');

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Profile retrieved successfully');
      expect(response.body.data.userId).toBe('user-123');
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });
});
