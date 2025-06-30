import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  },
  resolve: {
    alias: {
      '@/core': resolve(__dirname, 'src/core'),
      '@/ui': resolve(__dirname, 'src/ui'),
      '@': resolve(__dirname, 'src')
    }
  }
})