// src/services/attachment.service.ts

import fs from 'fs';
import { Attachment } from '@prisma/client';
import { attachmentRepository } from '../repositories/attachment.repository';
import { taskRepository } from '../repositories/task.repository';
import { NotFoundError } from '../errors/app-errors';

export class AttachmentService {
  async uploadAttachment(
    userId: string,
    taskId: string,
    file: Express.Multer.File,
  ): Promise<Attachment> {
    // Verify task exists and user owns it
    const task = await taskRepository.findById(taskId, userId);
    if (!task) {
      // Clean up uploaded file since task validation failed
      fs.unlinkSync(file.path);
      throw new NotFoundError('Task not found');
    }

    return attachmentRepository.create({
      taskId,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      uploadedBy: userId,
    });
  }

  async getAttachments(userId: string, taskId: string): Promise<Attachment[]> {
    const task = await taskRepository.findById(taskId, userId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return attachmentRepository.findAllByTask(taskId);
  }

  async getAttachmentForDownload(userId: string, attachmentId: string): Promise<Attachment> {
    const attachment = await attachmentRepository.findById(attachmentId);
    if (!attachment) {
      throw new NotFoundError('Attachment not found');
    }

    // Verify user owns the task
    const task = await taskRepository.findById(attachment.taskId, userId);
    if (!task) {
      throw new NotFoundError('Attachment not found');
    }

    // Verify file exists on disk
    if (!fs.existsSync(attachment.path)) {
      throw new NotFoundError('File not found on disk');
    }

    return attachment;
  }

  async deleteAttachment(userId: string, attachmentId: string): Promise<void> {
    const attachment = await attachmentRepository.findById(attachmentId);
    if (!attachment) {
      throw new NotFoundError('Attachment not found');
    }

    // Verify user owns the task
    const task = await taskRepository.findById(attachment.taskId, userId);
    if (!task) {
      throw new NotFoundError('Attachment not found');
    }

    // Delete file from disk
    if (fs.existsSync(attachment.path)) {
      fs.unlinkSync(attachment.path);
    }

    // Delete record from DB
    await attachmentRepository.delete(attachmentId);
  }
}

export const attachmentService = new AttachmentService();
