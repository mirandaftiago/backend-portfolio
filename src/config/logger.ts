// src/config/logger.ts

import { env } from './env';
import pino from 'pino';

const isProduction = env.NODE_ENV === 'production';
const isTest = env.NODE_ENV === 'test';

const logger = pino({
  level: isTest ? 'silent' : isProduction ? 'info' : 'debug',
  ...(isProduction
    ? {} // JSON output in production (Pino's default)
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      }),
});

export default logger;
