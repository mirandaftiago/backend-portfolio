// src/services/task.service.ts

import { CreateTaskDTO, UpdateTaskDTO, QueryTasksDTO } from '../schemas/task.schema';
import { TaskResponseDTO, PaginatedTasksDTO, UpdateTaskData, TaskStatsDTO } from '../dtos/task.dto';
import { taskRepository } from '../repositories/task.repository';
import { cacheService } from './cache.service';
import { NotFoundError } from '../errors/app-errors';
import { Role, Task } from '@prisma/client';
import crypto from 'crypto';

// Cache TTLs (in seconds)
const TASK_TTL = 600; // 10 minutes
const TASK_LIST_TTL = 300; // 5 minutes
const STATS_TTL = 300; // 5 minutes

/**
 * Task service - handles business logic
 */
export class TaskService {
  /**
   * Generate a cache key for task list queries
   * Hashes the query params so different filters get different cache entries
   */
  private getTaskListCacheKey(userId: string, query: QueryTasksDTO): string {
    const hash = crypto.createHash('md5').update(JSON.stringify(query)).digest('hex');
    return `tasks:${userId}:${hash}`;
  }

  /**
   * Invalidate all task-related caches for a user
   */
  private async invalidateUserTaskCache(userId: string): Promise<void> {
    await cacheService.delByPattern(`tasks:${userId}:*`);
    await cacheService.del(`taskStats:${userId}`);
  }

  /**
   * Create new task
   */
  async createTask(userId: string, data: CreateTaskDTO): Promise<TaskResponseDTO> {
    const task = await taskRepository.create({
      ...data,
      userId,
    });

    // Invalidate list and stats caches
    await this.invalidateUserTaskCache(userId);

    return this.toTaskResponseDTO(task);
  }

  /**
   * Get all tasks for user with filters and pagination
   */
  async getTasks(userId: string, role: Role, query: QueryTasksDTO): Promise<PaginatedTasksDTO> {
    const effectiveUserId = role === 'ADMIN' ? undefined : userId;
    const cacheKey = this.getTaskListCacheKey(effectiveUserId || 'admin', query);

    // Check cache
    const cached = await cacheService.get<PaginatedTasksDTO>(cacheKey);
    if (cached) return cached;

    const {
      page = 1,
      pageSize = 10,
      status,
      priority,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      dueDateFrom,
      dueDateTo,
      overdue,
    } = query;

    const filters = {
      status,
      priority,
      search,
      dueDateFrom,
      dueDateTo,
      overdue,
    };

    const pagination = {
      page,
      pageSize,
      sortBy,
      sortOrder,
    };

    const { tasks, total } = await taskRepository.findAllByUser(
      effectiveUserId,
      filters,
      pagination,
    );

    const totalPages = Math.ceil(total / pageSize);

    const result: PaginatedTasksDTO = {
      data: tasks.map(this.toTaskResponseDTO),
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };

    // Store in cache
    await cacheService.set(cacheKey, result, TASK_LIST_TTL);

    return result;
  }

  /**
   * Get task by ID
   */
  async getTaskById(userId: string, taskId: string): Promise<TaskResponseDTO> {
    const cacheKey = `task:${taskId}`;

    // Check cache
    const cached = await cacheService.get<TaskResponseDTO>(cacheKey);
    if (cached) return cached;

    const task = await taskRepository.findById(taskId, userId);

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    const result = this.toTaskResponseDTO(task);

    // Store in cache
    await cacheService.set(cacheKey, result, TASK_TTL);

    return result;
  }

  /**
   * Update task
   */
  async updateTask(userId: string, taskId: string, data: UpdateTaskDTO): Promise<TaskResponseDTO> {
    // Check if task exists and user owns it
    const existingTask = await taskRepository.findById(taskId, userId);
    if (!existingTask) {
      throw new NotFoundError('Task not found');
    }

    // Clean data - remove undefined fields
    const updateData: UpdateTaskData = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
    if (data.status !== undefined) {
      if (data.status === 'COMPLETED') {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }
    }

    const updatedTask = await taskRepository.update(taskId, userId, updateData);

    // Invalidate caches
    await cacheService.del(`task:${taskId}`);
    await this.invalidateUserTaskCache(userId);

    return this.toTaskResponseDTO(updatedTask);
  }

  /**
   * Delete task
   */
  async deleteTask(userId: string, taskId: string): Promise<void> {
    // Check if task exists and user owns it
    const existingTask = await taskRepository.findById(taskId, userId);
    if (!existingTask) {
      throw new NotFoundError('Task not found');
    }

    await taskRepository.delete(taskId, userId);

    // Invalidate caches
    await cacheService.del(`task:${taskId}`);
    await this.invalidateUserTaskCache(userId);
  }

  /**
   * Get task statistics for user
   */
  async getTaskStats(userId: string): Promise<TaskStatsDTO> {
    const cacheKey = `taskStats:${userId}`;

    // Check cache
    const cached = await cacheService.get<TaskStatsDTO>(cacheKey);
    if (cached) return cached;

    const total = await taskRepository.countByUser(userId);
    const todo = await taskRepository.countByUserAndStatus(userId, 'TODO');
    const inProgress = await taskRepository.countByUserAndStatus(userId, 'IN_PROGRESS');
    const completed = await taskRepository.countByUserAndStatus(userId, 'COMPLETED');
    const overdue = await taskRepository.countOverdueByUser(userId);

    const result: TaskStatsDTO = {
      total,
      todo,
      inProgress,
      completed,
      overdue,
    };

    // Store in cache
    await cacheService.set(cacheKey, result, STATS_TTL);

    return result;
  }

  /**
   * Transform Task model to TaskResponseDTO
   */
  private toTaskResponseDTO(task: Task): TaskResponseDTO {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      userId: task.userId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      completedAt: task.completedAt,
    };
  }
}

// Export singleton instance
export const taskService = new TaskService();
