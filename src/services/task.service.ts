// src/services/task.service.ts

import { CreateTaskDTO, UpdateTaskDTO, QueryTasksDTO } from '../schemas/task.schema';
import { TaskResponseDTO, PaginatedTasksDTO } from '../dtos/task.dto';
import { taskRepository } from '../repositories/task.repository';
import { NotFoundError } from '../errors/app-errors';
import { Task } from '@prisma/client';

/**
 * Task service - handles business logic
 */
export class TaskService {
  /**
   * Create new task
   */
  async createTask(userId: string, data: CreateTaskDTO): Promise<TaskResponseDTO> {
    const task = await taskRepository.create({
      ...data,
      userId,
    });

    return this.toTaskResponseDTO(task);
  }

  /**
   * Get all tasks for user with filters and pagination
   */
  async getTasks(userId: string, query: QueryTasksDTO): Promise<PaginatedTasksDTO> {
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
    } = query;

    const filters = {
      status,
      priority,
      search,
      dueDateFrom,
      dueDateTo,
    };

    const pagination = {
      page,
      pageSize,
      sortBy,
      sortOrder,
    };

    const { tasks, total } = await taskRepository.findAllByUser(
      userId,
      filters,
      pagination
    );

    const totalPages = Math.ceil(total / pageSize);

    return {
      data: tasks.map(this.toTaskResponseDTO),
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get task by ID
   */
  async getTaskById(userId: string, taskId: string): Promise<TaskResponseDTO> {
    const task = await taskRepository.findById(taskId, userId);

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return this.toTaskResponseDTO(task);
  }

  /**
   * Update task
   */
  async updateTask(
    userId: string,
    taskId: string,
    data: UpdateTaskDTO
  ): Promise<TaskResponseDTO> {
    // Check if task exists and user owns it
    const existingTask = await taskRepository.findById(taskId, userId);
    if (!existingTask) {
      throw new NotFoundError('Task not found');
    }

    // Clean data - remove undefined fields
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;

    const updatedTask = await taskRepository.update(taskId, userId, updateData);

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
  }

  /**
   * Get task statistics for user
   */
  async getTaskStats(userId: string): Promise<any> {
    const total = await taskRepository.countByUser(userId);
    const todo = await taskRepository.countByUserAndStatus(userId, 'TODO');
    const inProgress = await taskRepository.countByUserAndStatus(userId, 'IN_PROGRESS');
    const completed = await taskRepository.countByUserAndStatus(userId, 'COMPLETED');

    return {
      total,
      todo,
      inProgress,
      completed,
    };
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
    };
  }
}

// Export singleton instance
export const taskService = new TaskService();
