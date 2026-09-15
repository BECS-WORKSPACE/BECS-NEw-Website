import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  envPrefix: ['VITE_', 'RAZORPAY_KEY_ID', 'GOOGLE_CLIENT_ID'],
  server: {
    port: 5174,
  },
})
