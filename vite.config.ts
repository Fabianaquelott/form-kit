import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/core': resolve(__dirname, 'src/core'),
      '@/ui': resolve(__dirname, 'src/ui'),
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: `@use "@/ui/styles/theme.scss" as *;`
      }
    },
    modules: {
      localsConvention: 'camelCase'
    }
  },
  server: {
    port: 3000,
    open: true
  }
})