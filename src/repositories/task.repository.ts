// src/repositories/task.repository.ts

import prisma from '../config/database';
import { Task, Status, Prisma } from '@prisma/client';
import { CreateTaskData, UpdateTaskData, TaskFilters, PaginationParams } from '../dtos/task.dto';

/**
 * Task repository - handles task data access
 */
export class TaskRepository {
  /**
   * Create new task
   */
  async create(data: CreateTaskData): Promise<Task> {
    return prisma.task.create({
      data,
    });
  }

  /**
   * Find task by ID (with user ownership check)
   */
  async findById(id: string, userId: string): Promise<Task | null> {
    return prisma.task.findFirst({
      where: {
        id,
        userId, // Ensures user owns this task
      },
    });
  }

  /**
   * Find all tasks for a user with filters and pagination
   */
  async findAllByUser(
    userId: string,
    filters: TaskFilters = {},
    pagination: PaginationParams = {},
  ): Promise<{ tasks: Task[]; total: number }> {
    const { status, priority, dueDateFrom, dueDateTo, search, overdue } = filters;

    const { page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;

    // Build where clause
    const where: Prisma.TaskWhereInput = { userId };

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (dueDateFrom || dueDateTo) {
      where.dueDate = {};
      if (dueDateFrom) {
        where.dueDate.gte = dueDateFrom;
      }
      if (dueDateTo) {
        where.dueDate.lte = dueDateTo;
      }
    }

    if (overdue) {
      where.dueDate = { lt: new Date() };
      where.status = { not: 'COMPLETED' };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.task.count({ where });

    // Get paginated tasks
    const tasks = await prisma.task.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { tasks, total };
  }

  /**
   * Update task
   */
  async update(id: string, userId: string, data: UpdateTaskData): Promise<Task> {
    return prisma.task.update({
      where: {
        id,
        userId, // Ensures user owns this task
      },
      data,
    });
  }

  /**
   * Delete task
   */
  async delete(id: string, userId: string): Promise<void> {
    await prisma.task.delete({
      where: {
        id,
        userId, // Ensures user owns this task
      },
    });
  }

  /**
   * Count tasks by user
   */
  async countByUser(userId: string): Promise<number> {
    return prisma.task.count({
      where: { userId },
    });
  }

  /**
   * Count tasks by user and status
   */
  async countByUserAndStatus(userId: string, status: Status): Promise<number> {
    return prisma.task.count({
      where: { userId, status },
    });
  }

  /**
   * Count overdue tasks by user
   */
  async countOverdueByUser(userId: string): Promise<number> {
    return prisma.task.count({
      where: {
        userId,
        dueDate: { lt: new Date() },
        status: { not: 'COMPLETED' },
      },
    });
  }
}

// Export singleton instance
export const taskRepository = new TaskRepository();
