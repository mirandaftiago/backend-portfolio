// src/routes/task-share.routes.ts

import express from 'express';
import {
  shareTask,
  getSharedUsers,
  getSharedWithMe,
  updatePermission,
  revokeShare,
} from '../controllers/task-share.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// All task share routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Task Sharing
 *   description: Task sharing and collaboration endpoints
 */

/**
 * @swagger
 * /shared-tasks:
 *   get:
 *     summary: Get tasks shared with me
 *     tags: [Task Sharing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks shared with the current user
 *       401:
 *         description: Unauthorized
 */
router.get('/shared-tasks', getSharedWithMe);

/**
 * @swagger
 * /tasks/{id}/shares:
 *   post:
 *     summary: Share a task with another user
 *     tags: [Task Sharing]
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
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sharedWith, permission]
 *             properties:
 *               sharedWith:
 *                 type: string
 *                 format: uuid
 *                 description: User ID to share with
 *               permission:
 *                 type: string
 *                 enum: [VIEW, EDIT]
 *     responses:
 *       201:
 *         description: Task shared successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task or user not found
 */
router.post('/tasks/:id/shares', shareTask);

/**
 * @swagger
 * /tasks/{id}/shares:
 *   get:
 *     summary: Get users a task is shared with
 *     tags: [Task Sharing]
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
 *         description: List of shared users and their permissions
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 */
router.get('/tasks/:id/shares', getSharedUsers);

/**
 * @swagger
 * /tasks/{id}/shares/{sharedWith}:
 *   patch:
 *     summary: Update sharing permission
 *     tags: [Task Sharing]
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
 *       - in: path
 *         name: sharedWith
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID of the shared user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [permission]
 *             properties:
 *               permission:
 *                 type: string
 *                 enum: [VIEW, EDIT]
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Share not found
 */
router.patch('/tasks/:id/shares/:sharedWith', updatePermission);

/**
 * @swagger
 * /tasks/{id}/shares/{sharedWith}:
 *   delete:
 *     summary: Revoke task sharing
 *     tags: [Task Sharing]
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
 *       - in: path
 *         name: sharedWith
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to revoke access from
 *     responses:
 *       204:
 *         description: Share revoked successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Share not found
 */
router.delete('/tasks/:id/shares/:sharedWith', revokeShare);

export default router;
