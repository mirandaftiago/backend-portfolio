// src/services/auth.service.ts

import bcrypt from 'bcrypt';
import { RegisterDTO } from '../schemas/auth.schema';
import { UserResponseDTO } from '../dtos/user.dto';
import { userRepository } from '../repositories/user.repository';
import { ConflictError } from '../errors/app-errors';

const SALT_ROUNDS = 10;

/**
 * Authentication service - handles business logic
 */
export class AuthService {
  /**
   * Register new user
   */
  async register(data: RegisterDTO): Promise<UserResponseDTO> {
    // Check if email already exists
    const emailExists = await userRepository.emailExists(data.email);
    if (emailExists) {
      throw new ConflictError('Email already registered');
    }

    // Check if username already exists
    const usernameExists = await userRepository.usernameExists(data.username);
    if (usernameExists) {
      throw new ConflictError('Username already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Create user
    const user = await userRepository.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
    });

    // Transform to DTO (exclude password!)
    return this.toUserResponseDTO(user);
  }

  /**
   * Transform User model to UserResponseDTO
   * Removes sensitive fields like password
   */
  private toUserResponseDTO(user: any): UserResponseDTO {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

// Export singleton instance
export const authService = new AuthService();