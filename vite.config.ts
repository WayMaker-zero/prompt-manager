import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/prompt-manager/',
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    host: true,
    port: 3006,
  },
})
