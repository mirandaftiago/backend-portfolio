// src/routes/task.routes.ts

import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
} from '../controllers/task.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// All task routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/tasks/stats
 * @desc    Get task statistics for current user
 * @access  Protected
 */
router.get('/stats', getTaskStats);

/**
 * @route   POST /api/tasks
 * @desc    Create new task
 * @access  Protected
 */
router.post('/', createTask);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for current user
 * @access  Protected
 */
router.get('/', getTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get task by ID
 * @access  Protected
 */
router.get('/:id', getTaskById);

/**
 * @route   PATCH /api/tasks/:id
 * @desc    Update task
 * @access  Protected
 */
router.patch('/:id', updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task
 * @access  Protected
 */
router.delete('/:id', deleteTask);

export default router;
