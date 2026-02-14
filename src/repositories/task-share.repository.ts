import { TaskShare, Permission } from '@prisma/client';
import prisma from '../config/database';

/**
 * Task sharing repository - handles task sharing data access
 */

export class TaskShareRepository {
  /**
   * Create new shared task
   */
  async create(taskId: string, sharedWith: string, permission: Permission): Promise<TaskShare> {
    return prisma.taskShare.create({
      data: { taskId, sharedWith, permission },
    });
  }

  /**
   * Find share between a task and a user
   */
  async findByTaskAndUser(taskId: string, sharedWith: string): Promise<TaskShare | null> {
    return prisma.taskShare.findUnique({
      where: { taskId_sharedWith: { taskId, sharedWith } },
    });
  }

  /**
   * Find all who have access to any given task
   */
  async findAllByTask(taskId: string): Promise<TaskShare[]> {
    return prisma.taskShare.findMany({
      where: { taskId },
    });
  }

  /**
   * Find all tasks shared with a user
   */
  async findAllSharedWithUser(userId: string): Promise<TaskShare[]> {
    return prisma.taskShare.findMany({
      where: { sharedWith: userId },
    });
  }

  /**
   * Update share permission
   */
  async update(taskId: string, sharedWith: string, permission: Permission): Promise<TaskShare> {
    return prisma.taskShare.update({
      where: { taskId_sharedWith: { taskId, sharedWith } },
      data: { permission },
    });
  }

  /**
   * Revoke share
   */
  async delete(taskId: string, sharedWith: string): Promise<void> {
    await prisma.taskShare.delete({
      where: { taskId_sharedWith: { taskId, sharedWith } },
    });
  }
}

export const taskShareRepository = new TaskShareRepository();
