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

/** * @route   GET /api/shared-tasks
 * @desc    Get tasks shared with the authenticated user
 * @access  Protected
 */
router.get('/shared-tasks', getSharedWithMe);

/**
 * @route   POST /api/tasks/:id/share
 * @desc    Share a task with another user
 * @access  Protected
 */
router.post('/tasks/:id/shares', shareTask);

/**
 * @route   GET /api/tasks/:id/shared-users
 * @desc    Get users with whom the task is shared
 * @access  Protected
 */
router.get('/tasks/:id/shares', getSharedUsers);

/**
 * @route   PATCH /api/tasks/:id/shares
 * @desc    Update sharing permissions for a user
 * @access  Protected
 */
router.patch('/tasks/:id/shares/:sharedWith', updatePermission);

/**
 * @route   DELETE /api/tasks/:id/shares/:sharedWith
 * @desc    Remove a user from the shared list of a task
 * @access  Protected
 */
router.delete('/tasks/:id/shares/:sharedWith', revokeShare);
export default router;
