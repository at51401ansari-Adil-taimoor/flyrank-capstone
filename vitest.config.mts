import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [
    // Explicitly use Babel transform for JSX with react-jsx runtime,
    // bypassing the tsconfig jsx:preserve setting that Next.js requires.
    react({
      jsxRuntime: 'automatic',
      babel: {
        presets: [
          ['@babel/preset-react', { runtime: 'automatic' }],
        ],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    pool: 'forks',
    exclude: ['**/node_modules/**', '**/tests/e2e/**'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
});
