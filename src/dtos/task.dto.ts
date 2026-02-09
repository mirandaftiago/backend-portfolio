// src/dtos/task.dto.ts

import { Status, Priority } from '@prisma/client';

/**
 * Task response DTO (what we send to client)
 */
export interface TaskResponseDTO {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  dueDate: Date | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create task data (internal use)
 */
export interface CreateTaskData {
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  dueDate?: Date;
  userId: string;
}

/**
 * Update task data (internal use)
 */
export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  dueDate?: Date;
}

/**
 * Task filters for querying
 */
export interface TaskFilters {
  status?: Status;
  priority?: Priority;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  search?: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated tasks response
 */
export interface PaginatedTasksDTO {
  data: TaskResponseDTO[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}