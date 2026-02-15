// tests/setup.ts

// Set test environment before loading dotenv (so .env doesn't override it)
process.env.NODE_ENV = 'test';

// Provide defaults for required env vars in test environment
// (tests mock the database/services, so these are never actually used)
process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/testdb';
process.env.JWT_SECRET ??= 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET ??= 'test-jwt-refresh-secret';

// Load environment variables for tests
import 'dotenv/config';

// Silence console.error and console.log during tests
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});
