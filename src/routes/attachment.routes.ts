// src/routes/attachment.routes.ts

import express from 'express';
import {
  uploadAttachment,
  getAttachments,
  downloadAttachment,
  deleteAttachment,
} from '../controllers/attachment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../config/upload';

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Attachments
 *   description: File attachment endpoints
 */

/**
 * @swagger
 * /tasks/{id}/attachments:
 *   post:
 *     summary: Upload a file attachment to a task
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: No file provided or invalid file type
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.post('/tasks/:id/attachments', upload.single('file'), uploadAttachment);

/**
 * @swagger
 * /tasks/{id}/attachments:
 *   get:
 *     summary: Get all attachments for a task
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Task ID
 *     responses:
 *       200:
 *         description: List of attachments
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.get('/tasks/:id/attachments', getAttachments);

/**
 * @swagger
 * /attachments/{attachmentId}/download:
 *   get:
 *     summary: Download an attachment
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Attachment ID
 *     responses:
 *       200:
 *         description: File download
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Attachment not found
 */
router.get('/attachments/:attachmentId/download', downloadAttachment);

/**
 * @swagger
 * /attachments/{attachmentId}:
 *   delete:
 *     summary: Delete an attachment
 *     tags: [Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Attachment ID
 *     responses:
 *       204:
 *         description: Attachment deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Attachment not found
 */
router.delete('/attachments/:attachmentId', deleteAttachment);

export default router;
