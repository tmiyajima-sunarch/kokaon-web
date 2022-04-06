/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: 'window',
    util: {
      inherits: 'function() {}',
    },
  },
  plugins: [react()],
  test: {
    environment: 'happy-dom',
  },
});
