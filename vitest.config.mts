import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
  plugins: [
    // @vitejs/plugin-react v4 uses Babel internally. We pass @babel/preset-react
    // explicitly so it correctly transforms JSX even though tsconfig.json sets
    // jsx:"preserve" (which is required by Next.js for its own compilation).
    // @babel/preset-react is pinned to ^7.x in package.json so it is compatible
    // with the project's @babel/core@7.x and does not break Vercel's npm install.
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
