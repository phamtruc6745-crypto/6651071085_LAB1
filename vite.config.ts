import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  base: '/6651071085_LAB1/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
})
