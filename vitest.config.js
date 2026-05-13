import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // default environment is node; individual test files opt-in to jsdom via
    // @vitest-environment jsdom docblock
  },
});
