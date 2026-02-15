// tests/setup.ts

// Set test environment before loading dotenv (so .env doesn't override it)
process.env.NODE_ENV = 'test';

// Load environment variables for tests
import 'dotenv/config';

// Silence console.error and console.log during tests
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});