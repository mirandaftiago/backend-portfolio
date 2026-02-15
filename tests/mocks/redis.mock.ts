// tests/mocks/redis.mock.ts
// Global Redis mock — prevents real connections during tests

const redisMock = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  keys: jest.fn().mockResolvedValue([]),
  on: jest.fn(),
  quit: jest.fn(),
};

export default redisMock;
