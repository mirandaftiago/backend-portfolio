// src/controllers/attachment.controller.ts

import { Request, Response, NextFunction } from 'express';
import { attachmentService } from '../services/attachment.service';
import { ValidationError } from '../errors/app-errors';

export const uploadAttachment = async (
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
    const file = req.file;

    if (!file) {
      throw new ValidationError('No file uploaded');
    }

    const attachment = await attachmentService.uploadAttachment(userId, taskId, file);

    res.status(201).json({
      message: 'File uploaded successfully',
      data: attachment,
    });
  } catch (error) {
    next(error);
  }
};

export const getAttachments = async (
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
    const attachments = await attachmentService.getAttachments(userId, taskId);

    res.status(200).json({
      message: 'Attachments retrieved successfully',
      data: attachments,
    });
  } catch (error) {
    next(error);
  }
};

export const downloadAttachment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ValidationError('User not authenticated');
    }

    const attachmentId = req.params.attachmentId as string;
    const attachment = await attachmentService.getAttachmentForDownload(userId, attachmentId);

    res.download(attachment.path, attachment.originalName);
  } catch (error) {
    next(error);
  }
};

export const deleteAttachment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ValidationError('User not authenticated');
    }

    const attachmentId = req.params.attachmentId as string;
    await attachmentService.deleteAttachment(userId, attachmentId);

    res.status(200).json({
      message: 'Attachment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
