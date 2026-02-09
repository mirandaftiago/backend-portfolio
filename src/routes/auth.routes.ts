// src/routes/auth.routes.ts

import express from 'express';
import { register } from '../controllers/auth.controller';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', register);

export default router;