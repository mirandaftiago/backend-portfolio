import { taskShareRepository } from '../repositories/task-share.repository';
import { taskRepository } from '../repositories/task.repository';
import { userRepository } from '../repositories/user.repository';
import { NotFoundError, ForbiddenError, ConflictError } from '../errors/app-errors';
import { Permission } from '@prisma/client';

export class TaskShareService {
  async shareTask(ownerId: string, taskId: string, sharedWith: string, permission: Permission) {
    // 1. Check task exists and caller is the owner
    const task = await taskRepository.findById(taskId, ownerId);
    if (!task) {
      throw new NotFoundError('Task not found or access denied');
    }
    // 2. Can't share with yourself
    if (ownerId === sharedWith) {
      throw new ForbiddenError('Cannot share task with yourself');
    }
    // 3. Recipient must exist
    const recipient = await userRepository.findById(sharedWith);
    if (!recipient) {
      throw new NotFoundError('Recipient user not found');
    }
    // 4. Check not already shared
    const existingShare = await taskShareRepository.findByTaskAndUser(taskId, sharedWith);
    if (existingShare) {
      throw new ConflictError('Task already shared with this user');
    }
    // 5. Create the share
    return await taskShareRepository.create(taskId, sharedWith, permission);
  }

  async getSharedUsers(ownerId: string, taskId: string) {
    // Check task exists and caller is the owner
    const task = await taskRepository.findById(taskId, ownerId);
    if (!task) {
      throw new NotFoundError('Task not found or access denied');
    }
    // Get shared users
    return await taskShareRepository.findAllByTask(taskId);
  }

  async updatePermission(
    ownerId: string,
    taskId: string,
    sharedWith: string,
    permission: Permission,
  ) {
    // Check task exists and caller is the owner
    const task = await taskRepository.findById(taskId, ownerId);
    if (!task) {
      throw new NotFoundError('Task not found or access denied');
    }
    // Check share exists
    const share = await taskShareRepository.findByTaskAndUser(taskId, sharedWith);
    if (!share) {
      throw new NotFoundError('Share not found');
    }
    // Update permission
    return await taskShareRepository.update(taskId, sharedWith, permission);
  }

  async revokeShare(ownerId: string, taskId: string, sharedWith: string) {
    // Check task exists and caller is the owner
    const task = await taskRepository.findById(taskId, ownerId);
    if (!task) {
      throw new NotFoundError('Task not found or access denied');
    }
    // Check share exists
    const share = await taskShareRepository.findByTaskAndUser(taskId, sharedWith);
    if (!share) {
      throw new NotFoundError('Share not found');
    }
    // Delete share
    await taskShareRepository.delete(taskId, sharedWith);
  }

  async getSharedWithMe(userId: string) {
    return await taskShareRepository.findAllSharedWithUser(userId);
  }
}

export const taskShareService = new TaskShareService();
