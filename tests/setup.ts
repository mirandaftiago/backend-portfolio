// tests/setup.ts

// Load environment variables for tests
import 'dotenv/config';

// Silence console.error and console.log during tests
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});