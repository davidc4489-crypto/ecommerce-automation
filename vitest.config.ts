import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@shared': new URL('./packages/shared/src', import.meta.url).pathname,
    },
  },
});
