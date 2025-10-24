// frontend/vite.config.ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')

  return {
    server: {
      host: '0.0.0.0',
      port: 5173,            // ← ما عادش 3000
    },
    plugins: [react()],
    // نصيحة: في Vite استعمل import.meta.env بدل process.env
    // ولو باش تصرّ على define، خليه مؤقتًا:
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        // ← خليه على src متاع الفرونت
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
