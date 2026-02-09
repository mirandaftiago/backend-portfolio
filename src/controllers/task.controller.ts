// src/controllers/task.controller.ts

import { Request, Response, NextFunction } from 'express';
import { createTaskSchema, updateTaskSchema, queryTasksSchema } from '../schemas/task.schema';
import { taskService } from '../services/task.service';
import { ValidationError } from '../errors/app-errors';

/**
 * Create new task
 * @route POST /api/tasks
 * @access Protected
 */
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ValidationError('User not authenticated');
    }

    // Validate request body
    const result = createTaskSchema.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError('Validation failed', result.error.issues);
    }

    // Create task
    const task = await taskService.createTask(userId, result.data);

    res.status(201).json({
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all tasks for current user
 * @route GET /api/tasks
 * @access Protected
 */
export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ValidationError('User not authenticated');
    }

    // Validate query parameters
    const result = queryTasksSchema.safeParse(req.query);
    if (!result.success) {
      throw new ValidationError('Validation failed', result.error.issues);
    }

    // Get tasks
    const tasks = await taskService.getTasks(userId, result.data);

    res.status(200).json({
      message: 'Tasks retrieved successfully',
      ...tasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get task by ID
 * @route GET /api/tasks/:id
 * @access Protected
 */
export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ValidationError('User not authenticated');
    }

    const { id } = req.params;

    // Validate id is string
    if (typeof id !== 'string') {
      throw new ValidationError('Invalid task ID');
    }

    // Get task
    const task = await taskService.getTaskById(userId, id);

    res.status(200).json({
      message: 'Task retrieved successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update task
 * @route PATCH /api/tasks/:id
 * @access Protected
 */
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ValidationError('User not authenticated');
    }

    const { id } = req.params;

    // Validate id is string
    if (typeof id !== 'string') {
      throw new ValidationError('Invalid task ID');
    }

    // Validate request body
    const result = updateTaskSchema.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError('Validation failed', result.error.issues);
    }

    // Update task
    const task = await taskService.updateTask(userId, id, result.data);

    res.status(200).json({
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete task
 * @route DELETE /api/tasks/:id
 * @access Protected
 */
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ValidationError('User not authenticated');
    }

    const { id } = req.params;

    // Validate id is string
    if (typeof id !== 'string') {
      throw new ValidationError('Invalid task ID');
    }

    // Delete task
    await taskService.deleteTask(userId, id);

    res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get task statistics
 * @route GET /api/tasks/stats
 * @access Protected
 */
export const getTaskStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ValidationError('User not authenticated');
    }

    // Get stats
    const stats = await taskService.getTaskStats(userId);

    res.status(200).json({
      message: 'Task statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
