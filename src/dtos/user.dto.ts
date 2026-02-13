// src/dtos/user.dto.ts

/**
 * User response DTO (what we send to client)
 * Never includes password!
 */
export interface UserResponseDTO {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create user data (internal use)
 */
export interface CreateUserData {
  username: string;
  email: string;
  password: string; // This should be hashed!
}
