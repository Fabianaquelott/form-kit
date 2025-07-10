// vite.config.ts

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@/core': new URL('./src/core', import.meta.url).pathname,
        '@/ui': new URL('./src/ui', import.meta.url).pathname,
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/ui/styles/theme.scss" as *;`,
        },
      },
      modules: {
        localsConvention: 'camelCase',
      },
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        // Proxy para a API principal
        '/main-api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/main-api/, ''),
        },
        // Proxy para a API de ERP (upload)
        '/erp-api': {
          target: env.VITE_API_ERP_QA,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/erp-api/, ''),
        },
      },
    },
  }
})
