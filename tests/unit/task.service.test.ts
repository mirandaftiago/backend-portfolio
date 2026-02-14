// tests/unit/task.service.test.ts

import { TaskService } from '../../src/services/task.service';
import { taskRepository } from '../../src/repositories/task.repository';
import { NotFoundError } from '../../src/errors/app-errors';
import { Task } from '@prisma/client';

// Mock the repository module — all methods become jest.fn()
jest.mock('../../src/repositories/task.repository');

describe('TaskService', () => {
  let service: TaskService;

  // Sample task that the mock repository will return
  const mockTask: Task = {
    id: 'task-1',
    title: 'Test task',
    description: 'A test task',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: null,
    userId: 'user-1',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    completedAt: null,
  };

  beforeEach(() => {
    service = new TaskService();
    // clearMocks is true in config, so mocks reset automatically
  });

  // ─── createTask ─────────────────────────────────────────────
  describe('createTask', () => {
    it('should create a task and return a DTO', async () => {
      (taskRepository.create as jest.Mock).mockResolvedValue(mockTask);

      const result = await service.createTask('user-1', {
        title: 'Test task',
        description: 'A test task',
      });

      expect(taskRepository.create).toHaveBeenCalledWith({
        title: 'Test task',
        description: 'A test task',
        userId: 'user-1',
      });
      expect(result).toEqual({
        id: 'task-1',
        title: 'Test task',
        description: 'A test task',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: null,
        userId: 'user-1',
        createdAt: mockTask.createdAt,
        updatedAt: mockTask.updatedAt,
        completedAt: null,
      });
    });
  });

  // ─── getTaskById ────────────────────────────────────────────
  describe('getTaskById', () => {
    it('should return a task when found', async () => {
      (taskRepository.findById as jest.Mock).mockResolvedValue(mockTask);

      const result = await service.getTaskById('user-1', 'task-1');

      expect(taskRepository.findById).toHaveBeenCalledWith('task-1', 'user-1');
      expect(result.id).toBe('task-1');
      expect(result.title).toBe('Test task');
    });

    it('should throw NotFoundError when task does not exist', async () => {
      (taskRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.getTaskById('user-1', 'nonexistent')).rejects.toThrow(NotFoundError);
      await expect(service.getTaskById('user-1', 'nonexistent')).rejects.toThrow('Task not found');
    });
  });

  // ─── updateTask ─────────────────────────────────────────────
  describe('updateTask', () => {
    it('should update a task when it exists', async () => {
      const updatedTask = { ...mockTask, title: 'Updated title' };
      (taskRepository.findById as jest.Mock).mockResolvedValue(mockTask);
      (taskRepository.update as jest.Mock).mockResolvedValue(updatedTask);

      const result = await service.updateTask('user-1', 'task-1', {
        title: 'Updated title',
      });

      expect(taskRepository.findById).toHaveBeenCalledWith('task-1', 'user-1');
      expect(taskRepository.update).toHaveBeenCalled();
      expect(result.title).toBe('Updated title');
    });

    it('should throw NotFoundError when task does not exist', async () => {
      (taskRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateTask('user-1', 'nonexistent', { title: 'New' }),
      ).rejects.toThrow(NotFoundError);

      expect(taskRepository.update).not.toHaveBeenCalled();
    });

    it('should set completedAt when status changes to COMPLETED', async () => {
      (taskRepository.findById as jest.Mock).mockResolvedValue(mockTask);
      (taskRepository.update as jest.Mock).mockResolvedValue({
        ...mockTask,
        status: 'COMPLETED',
        completedAt: new Date(),
      });

      await service.updateTask('user-1', 'task-1', { status: 'COMPLETED' });

      const updateCall = (taskRepository.update as jest.Mock).mock.calls[0];
      const updateData = updateCall[2]; // third argument is the data
      expect(updateData.completedAt).toBeInstanceOf(Date);
      expect(updateData.status).toBe('COMPLETED');
    });

    it('should clear completedAt when status changes away from COMPLETED', async () => {
      const completedTask = { ...mockTask, status: 'COMPLETED' as const, completedAt: new Date() };
      (taskRepository.findById as jest.Mock).mockResolvedValue(completedTask);
      (taskRepository.update as jest.Mock).mockResolvedValue({
        ...completedTask,
        status: 'IN_PROGRESS',
        completedAt: null,
      });

      await service.updateTask('user-1', 'task-1', { status: 'IN_PROGRESS' });

      const updateCall = (taskRepository.update as jest.Mock).mock.calls[0];
      const updateData = updateCall[2];
      expect(updateData.completedAt).toBeNull();
    });
  });

  // ─── deleteTask ─────────────────────────────────────────────
  describe('deleteTask', () => {
    it('should delete a task when it exists', async () => {
      (taskRepository.findById as jest.Mock).mockResolvedValue(mockTask);
      (taskRepository.delete as jest.Mock).mockResolvedValue(undefined);

      await service.deleteTask('user-1', 'task-1');

      expect(taskRepository.delete).toHaveBeenCalledWith('task-1', 'user-1');
    });

    it('should throw NotFoundError when task does not exist', async () => {
      (taskRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteTask('user-1', 'nonexistent')).rejects.toThrow(NotFoundError);

      expect(taskRepository.delete).not.toHaveBeenCalled();
    });
  });

  // ─── getTaskStats ───────────────────────────────────────────
  describe('getTaskStats', () => {
    it('should return task statistics', async () => {
      (taskRepository.countByUser as jest.Mock).mockResolvedValue(10);
      (taskRepository.countByUserAndStatus as jest.Mock)
        .mockResolvedValueOnce(4)   // TODO
        .mockResolvedValueOnce(3)   // IN_PROGRESS
        .mockResolvedValueOnce(2);  // COMPLETED
      (taskRepository.countOverdueByUser as jest.Mock).mockResolvedValue(1);

      const result = await service.getTaskStats('user-1');

      expect(result).toEqual({
        total: 10,
        todo: 4,
        inProgress: 3,
        completed: 2,
        overdue: 1,
      });
    });
  });

  // ─── getTasks ───────────────────────────────────────────────
  describe('getTasks', () => {
    it('should return paginated tasks for regular user', async () => {
      (taskRepository.findAllByUser as jest.Mock).mockResolvedValue({
        tasks: [mockTask],
        total: 1,
      });

      const result = await service.getTasks('user-1', 'USER', {});

      expect(taskRepository.findAllByUser).toHaveBeenCalledWith(
        'user-1',     // regular user → passes userId
        expect.any(Object),
        expect.any(Object),
      );
      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    it('should pass undefined userId for ADMIN role', async () => {
      (taskRepository.findAllByUser as jest.Mock).mockResolvedValue({
        tasks: [mockTask],
        total: 1,
      });

      await service.getTasks('admin-1', 'ADMIN', {});

      expect(taskRepository.findAllByUser).toHaveBeenCalledWith(
        undefined,    // ADMIN → no user filter
        expect.any(Object),
        expect.any(Object),
      );
    });

    it('should calculate totalPages correctly', async () => {
      (taskRepository.findAllByUser as jest.Mock).mockResolvedValue({
        tasks: [],
        total: 25,
      });

      const result = await service.getTasks('user-1', 'USER', { pageSize: 10 });

      expect(result.pagination.totalPages).toBe(3); // ceil(25/10)
    });
  });
});
