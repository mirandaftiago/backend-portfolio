// tests/integrations/task.test.ts

import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/config/database';
import { generateTestToken } from '../helpers/auth.helper';

// Mock the database module
jest.mock('../../src/config/database', () => ({
  __esModule: true,
  default: {
    task: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe('Task Endpoints', () => {
  const userId = 'user-123';
  const token = generateTestToken(userId);

  const mockTask = {
    id: 'task-1',
    title: 'Test task',
    description: 'A test task',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: null,
    userId,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    completedAt: null,
  };

  // ─── POST /api/tasks ───────────────────────────────────────
  describe('POST /api/tasks', () => {
    it('should create a task with valid data', async () => {
      (prisma.task.create as jest.Mock).mockResolvedValue(mockTask);

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test task', description: 'A test task' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Task created successfully');
      expect(response.body.data.title).toBe('Test task');
    });

    it('should return 400 with invalid data (missing title)', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'No title' });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Validation failed');
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test task' });

      expect(response.status).toBe(401);
    });
  });

  // ─── GET /api/tasks ────────────────────────────────────────
  describe('GET /api/tasks', () => {
    it('should return paginated tasks', async () => {
      (prisma.task.count as jest.Mock).mockResolvedValue(1);
      (prisma.task.findMany as jest.Mock).mockResolvedValue([mockTask]);

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Tasks retrieved successfully');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination).toBeDefined();
    });
  });

  // ─── GET /api/tasks/:id ────────────────────────────────────
  describe('GET /api/tasks/:id', () => {
    it('should return a task by ID', async () => {
      (prisma.task.findFirst as jest.Mock).mockResolvedValue(mockTask);

      const response = await request(app)
        .get('/api/tasks/task-1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe('task-1');
    });

    it('should return 404 when task not found', async () => {
      (prisma.task.findFirst as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get('/api/tasks/nonexistent')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('Task not found');
    });
  });

  // ─── PATCH /api/tasks/:id ──────────────────────────────────
  describe('PATCH /api/tasks/:id', () => {
    it('should update a task', async () => {
      const updatedTask = { ...mockTask, title: 'Updated' };
      (prisma.task.findFirst as jest.Mock).mockResolvedValue(mockTask);
      (prisma.task.update as jest.Mock).mockResolvedValue(updatedTask);

      const response = await request(app)
        .patch('/api/tasks/task-1')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated' });

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Updated');
    });
  });

  // ─── DELETE /api/tasks/:id ─────────────────────────────────
  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      (prisma.task.findFirst as jest.Mock).mockResolvedValue(mockTask);
      (prisma.task.delete as jest.Mock).mockResolvedValue(mockTask);

      const response = await request(app)
        .delete('/api/tasks/task-1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');
    });
  });
});
