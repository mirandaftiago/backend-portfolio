// src/dtos/auth.dto.ts

import { Role } from '@prisma/client';
import { UserResponseDTO } from './user.dto';

/**
 * Login response DTO
 */
export interface LoginResponseDTO {
  user: UserResponseDTO;
  accessToken: string;
  refreshToken: string;
}

/**
 * Token refresh response DTO
 */
export interface RefreshResponseDTO {
  accessToken: string;
  refreshToken: string;
}

/**
 * JWT payload
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: Role;
}

/**
 * Decoded JWT with standard claims
 */
export interface DecodedJWT extends JWTPayload {
  iat: number;
  exp: number;
  role: Role;
}
