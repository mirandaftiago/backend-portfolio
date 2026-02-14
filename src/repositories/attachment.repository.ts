// src/repositories/attachment.repository.ts

import prisma from '../config/database';
import { Attachment } from '@prisma/client';

interface CreateAttachmentData {
  taskId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  uploadedBy: string;
}

export class AttachmentRepository {
  async create(data: CreateAttachmentData): Promise<Attachment> {
    return prisma.attachment.create({ data });
  }

  async findById(id: string): Promise<Attachment | null> {
    return prisma.attachment.findUnique({ where: { id } });
  }

  async findAllByTask(taskId: string): Promise<Attachment[]> {
    return prisma.attachment.findMany({
      where: { taskId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.attachment.delete({ where: { id } });
  }
}

export const attachmentRepository = new AttachmentRepository();
