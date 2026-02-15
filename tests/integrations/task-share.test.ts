// tests/integrations/task-share.test.ts

import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/database';
import { generateTestToken } from '../helpers/auth.helper';

// Mock the database module
jest.mock('../../src/config/database', () => ({
  __esModule: true,
  default: {
    task: {
      findFirst: jest.fn(),
    },
    taskShare: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}));

describe('Task Share Endpoints', () => {
  const ownerId = 'a0000000-0000-4000-a000-000000000001';
  const recipientId = 'b0000000-0000-4000-b000-000000000002';
  const taskId = 'task-1';
  const token = generateTestToken(ownerId);

  const mockTask = {
    id: taskId,
    title: 'Shared task',
    description: 'A task to share',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: null,
    userId: ownerId,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    completedAt: null,
  };

  const mockShare = {
    id: 'share-1',
    taskId,
    sharedWith: recipientId,
    permission: 'READ',
    createdAt: new Date('2026-01-01'),
  };

  const mockRecipient = {
    id: recipientId,
    username: 'recipient',
    email: 'recipient@test.com',
    password: '$2b$10$hashed',
    role: 'USER',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  // ─── POST /api/tasks/:id/shares ─────────────────────────────
  describe('POST /api/tasks/:id/shares', () => {
    it('should share a task with valid data', async () => {
      (prisma.task.findFirst as jest.Mock).mockResolvedValue(mockTask);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockRecipient);
      (prisma.taskShare.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.taskShare.create as jest.Mock).mockResolvedValue(mockShare);

      const response = await request(app)
        .post(`/api/tasks/${taskId}/shares`)
        .set('Authorization', `Bearer ${token}`)
        .send({ sharedWith: recipientId, permission: 'READ' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Task shared successfully');
      expect(response.body.data.sharedWith).toBe(recipientId);
    });

    it('should return 403 when sharing with yourself', async () => {
      (prisma.task.findFirst as jest.Mock).mockResolvedValue(mockTask);

      const response = await request(app)
        .post(`/api/tasks/${taskId}/shares`)
        .set('Authorization', `Bearer ${token}`)
        .send({ sharedWith: ownerId, permission: 'READ' });

      expect(response.status).toBe(403);
      expect(response.body.error.message).toBe('Cannot share task with yourself');
    });

    it('should return 404 when task not found', async () => {
      (prisma.task.findFirst as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post(`/api/tasks/${taskId}/shares`)
        .set('Authorization', `Bearer ${token}`)
        .send({ sharedWith: recipientId, permission: 'READ' });

      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('Task not found or access denied');
    });

    it('should return 409 when task already shared with user', async () => {
      (prisma.task.findFirst as jest.Mock).mockResolvedValue(mockTask);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockRecipient);
      (prisma.taskShare.findUnique as jest.Mock).mockResolvedValue(mockShare);

      const response = await request(app)
        .post(`/api/tasks/${taskId}/shares`)
        .set('Authorization', `Bearer ${token}`)
        .send({ sharedWith: recipientId, permission: 'READ' });

      expect(response.status).toBe(409);
      expect(response.body.error.message).toBe('Task already shared with this user');
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .post(`/api/tasks/${taskId}/shares`)
        .send({ sharedWith: recipientId, permission: 'READ' });

      expect(response.status).toBe(401);
    });
  });

  // ─── GET /api/tasks/:id/shares ──────────────────────────────
  describe('GET /api/tasks/:id/shares', () => {
    it('should return shared users for a task', async () => {
      (prisma.task.findFirst as jest.Mock).mockResolvedValue(mockTask);
      (prisma.taskShare.findMany as jest.Mock).mockResolvedValue([mockShare]);

      const response = await request(app)
        .get(`/api/tasks/${taskId}/shares`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Shared users retrieved successfully');
      expect(response.body.data).toHaveLength(1);
    });

    it('should return 404 when task not found', async () => {
      (prisma.task.findFirst as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/api/tasks/nonexistent/shares')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  // ─── GET /api/shared-tasks ──────────────────────────────────
  describe('GET /api/shared-tasks', () => {
    it('should return tasks shared with the user', async () => {
      const recipientToken = generateTestToken(recipientId);
      (prisma.taskShare.findMany as jest.Mock).mockResolvedValue([mockShare]);

      const response = await request(app)
        .get('/api/shared-tasks')
        .set('Authorization', `Bearer ${recipientToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Shared tasks retrieved successfully');
      expect(response.body.data).toHaveLength(1);
    });
  });

  // ─── PATCH /api/tasks/:id/shares/:sharedWith ────────────────
  describe('PATCH /api/tasks/:id/shares/:sharedWith', () => {
    it('should update share permission', async () => {
      const updatedShare = { ...mockShare, permission: 'WRITE' };
      (prisma.task.findFirst as jest.Mock).mockResolvedValue(mockTask);
      (prisma.taskShare.findUnique as jest.Mock).mockResolvedValue(mockShare);
      (prisma.taskShare.update as jest.Mock).mockResolvedValue(updatedShare);

      const response = await request(app)
        .patch(`/api/tasks/${taskId}/shares/${recipientId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ permission: 'WRITE' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Permission updated successfully');
      expect(response.body.data.permission).toBe('WRITE');
    });

    it('should return 404 when share not found', async () => {
      (prisma.task.findFirst as jest.Mock).mockResolvedValue(mockTask);
      (prisma.taskShare.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .patch(`/api/tasks/${taskId}/shares/${recipientId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ permission: 'WRITE' });

      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('Share not found');
    });
  });

  // ─── DELETE /api/tasks/:id/shares/:sharedWith ───────────────
  describe('DELETE /api/tasks/:id/shares/:sharedWith', () => {
    it('should revoke a share', async () => {
      (prisma.task.findFirst as jest.Mock).mockResolvedValue(mockTask);
      (prisma.taskShare.findUnique as jest.Mock).mockResolvedValue(mockShare);
      (prisma.taskShare.delete as jest.Mock).mockResolvedValue(mockShare);

      const response = await request(app)
        .delete(`/api/tasks/${taskId}/shares/${recipientId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Share revoked successfully');
    });

    it('should return 404 when share not found', async () => {
      (prisma.task.findFirst as jest.Mock).mockResolvedValue(mockTask);
      (prisma.taskShare.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .delete(`/api/tasks/${taskId}/shares/${recipientId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('Share not found');
    });
  });
});
