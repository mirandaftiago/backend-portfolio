import { Request, Response, NextFunction } from 'express';
import { shareTaskSchema, updatePermissionSchema } from '../schemas/task-share.schema';
import { taskShareService } from '../services/task-share.service';
import { ValidationError } from '../errors/app-errors';

export const shareTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ValidationError('User not authenticated');
    }

    // Validate request body
    const result = shareTaskSchema.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError('Validation failed', result.error.issues);
    }

    // Share task
    const taskId = req.params.id as string;
    const share = await taskShareService.shareTask(
      userId,
      taskId,
      result.data.sharedWith,
      result.data.permission,
    );

    res.status(201).json({
      message: 'Task shared successfully',
      data: share,
    });
  } catch (error) {
    next(error);
  }
};

export const getSharedUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ValidationError('User not authenticated');
    }

    const taskId = req.params.id as string;
    const sharedUsers = await taskShareService.getSharedUsers(userId, taskId);

    res.status(200).json({
      message: 'Shared users retrieved successfully',
      data: sharedUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePermission = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ValidationError('User not authenticated');
    }

    // Validate request body
    const result = updatePermissionSchema.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError('Validation failed', result.error.issues);
    }

    const taskId = req.params.id as string;
    const sharedWith = req.params.sharedWith as string;

    const updatedShare = await taskShareService.updatePermission(
      userId,
      taskId,
      sharedWith,
      result.data.permission,
    );

    res.status(200).json({
      message: 'Permission updated successfully',
      data: updatedShare,
    });
  } catch (error) {
    next(error);
  }
};

export const revokeShare = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ValidationError('User not authenticated');
    }

    const taskId = req.params.id as string;
    const sharedWith = req.params.sharedWith as string;

    await taskShareService.revokeShare(userId, taskId, sharedWith);

    res.status(200).json({
      message: 'Share revoked successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getSharedWithMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ValidationError('User not authenticated');
    }

    const sharedTasks = await taskShareService.getSharedWithMe(userId);

    res.status(200).json({
      message: 'Shared tasks retrieved successfully',
      data: sharedTasks,
    });
  } catch (error) {
    next(error);
  }
};

export const taskShareController = {
  shareTask,
  getSharedUsers,
  updatePermission,
  revokeShare,
  getSharedWithMe,
};
