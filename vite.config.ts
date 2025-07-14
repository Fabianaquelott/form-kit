// vite.config.ts

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 1. Importar o módulo 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      // 2. CORREÇÃO: Usando path.resolve com __dirname para garantir caminhos absolutos
      alias: {
        '@/core': path.resolve(__dirname, './src/core'),
        '@/ui': path.resolve(__dirname, './src/ui'),
        '@': path.resolve(__dirname, './src'),
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
        '/main-api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/main-api/, ''),
        },
        '/erp-api': {
          target: env.VITE_API_ERP_QA,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/erp-api/, ''),
        },
      },
    },
  }
})
