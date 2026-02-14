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

// Task attachment routes
router.post('/tasks/:id/attachments', upload.single('file'), uploadAttachment);
router.get('/tasks/:id/attachments', getAttachments);

// Attachment-specific routes
router.get('/attachments/:attachmentId/download', downloadAttachment);
router.delete('/attachments/:attachmentId', deleteAttachment);

export default router;
