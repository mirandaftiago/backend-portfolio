// src/config/security.ts

import { CorsOptions } from 'cors';

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];

export const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours — browsers cache preflight response
};
