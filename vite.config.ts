/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true, // permite usar expect() sem import
    environment: 'jsdom', // garante document e window
    setupFiles: './src/setupTests.ts', // arquivo para importar jest-dom
    include: ['src/**/*.{test,spec}.{ts,tsx}'], // arquivos de teste
  },
})
