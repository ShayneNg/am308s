import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
      globals: true, // Allows using 'describe', 'it', 'expect' without importing them
      environment: 'node',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        thresholds: {
          lines: 86,
          functions: 86,
          branches: 86,
          statements: 86
        }
      },
    },
});