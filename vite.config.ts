import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const IS_DEVELOPMENT = Boolean(process.env.NODE_ENV === 'development') as boolean

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: IS_DEVELOPMENT ? '/' : '/demos/memory-game-next',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/helpers.scss";`
      }
    }
  }
})
