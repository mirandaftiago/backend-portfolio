// src/schemas/task.schema.ts

import { z } from 'zod';
import { Status, Priority } from '@prisma/client';

/**
 * Create task validation schema
 */
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must not exceed 200 characters'),
  
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional(),
  
  status: z
    .nativeEnum(Status)
    .optional(),
  
  priority: z
    .nativeEnum(Priority)
    .optional(),
  
  dueDate: z
    .string()
    .datetime()
    .transform((str) => new Date(str))
    .optional(),
});

/**
 * Update task validation schema
 */
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must not exceed 200 characters')
    .optional(),
  
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .nullable()
    .optional(),
  
  status: z
    .nativeEnum(Status)
    .optional(),
  
  priority: z
    .nativeEnum(Priority)
    .optional(),
  
  dueDate: z
    .string()
    .datetime()
    .transform((str) => new Date(str))
    .nullable()
    .optional(),
});

/**
 * Query tasks validation schema
 */
export const queryTasksSchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1))
    .optional(),
  
  pageSize: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(100))
    .optional(),
  
  status: z
    .nativeEnum(Status)
    .optional(),
  
  priority: z
    .nativeEnum(Priority)
    .optional(),
  
  sortBy: z
    .enum(['createdAt', 'dueDate', 'priority', 'title'])
    .optional(),
  
  sortOrder: z
    .enum(['asc', 'desc'])
    .optional(),
  
  search: z
    .string()
    .max(200)
    .optional(),
  
  dueDateFrom: z
    .string()
    .datetime()
    .transform((str) => new Date(str))
    .optional(),
  
  dueDateTo: z
    .string()
    .datetime()
    .transform((str) => new Date(str))
    .optional(),
});

/**
 * Type inference from schemas
 */
export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof updateTaskSchema>;
export type QueryTasksDTO = z.infer<typeof queryTasksSchema>;
