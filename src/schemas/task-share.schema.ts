import { z } from 'zod';
import { Permission } from '@prisma/client';

export const shareTaskSchema = z.object({
  sharedWith: z.uuid('Invalid user ID'),
  permission: z.enum(Permission),
});

export const updatePermissionSchema = z.object({
  permission: z.enum(Permission),
});
