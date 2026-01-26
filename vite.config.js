import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
   resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
   server: {
     allowedHosts: [
      'nonsolidified-annika-criminally.ngrok-free.dev',
      'https://nonsolidified-annika-criminally.ngrok-free.dev'
    ],
    proxy: {
      "/api": {
        target: "http://192.168.0.226:5000",
        changeOrigin: true,
        secure: false,
      },
    },

    host: true,
    port: 5173,
  }
})
