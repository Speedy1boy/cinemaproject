import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // Указываем желаемый порт здесь
    strictPort: true, // Если порт 3000 занят, Vite выдаст ошибку, а не переключится на 3001
    // host: true, // Раскомментируй, если захочешь открыть сайт с телефона по локальной Wi-Fi сети
  }
})