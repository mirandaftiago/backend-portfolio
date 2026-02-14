import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  setupFiles: ['<rootDir>/tests/setup.ts'],
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
};

export default config;