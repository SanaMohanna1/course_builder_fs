import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  setupFilesAfterEnv: [path.join(__dirname, 'jest.setup.js')],
  globalSetup: path.join(__dirname, 'jest.global-setup.js'),
  globalTeardown: path.join(__dirname, 'jest.global-teardown.js'),
  transform: {},
  coverageThreshold: {
    global: {
      statements: 30,
      branches: 20,
      lines: 30,
      functions: 30
    }
  }
};
