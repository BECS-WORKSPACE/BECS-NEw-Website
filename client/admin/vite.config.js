import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: process.env.VITE_SUBDOMAIN_DEPLOY === 'true' ? '/' : (command === 'build' ? '/admin/' : '/'),
  server: {
    port: 5175,
  },
}))
