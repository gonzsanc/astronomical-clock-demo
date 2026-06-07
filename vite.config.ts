import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [svelte()],
  build: {
    chunkSizeWarningLimit: 800
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts']
  }
});
