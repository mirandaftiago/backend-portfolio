// tests/setup.ts

// Load environment variables for tests
import 'dotenv/config';

// Silence console.error during tests (error middleware logs expected errors)
jest.spyOn(console, 'error').mockImplementation(() => {});