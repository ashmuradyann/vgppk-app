import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    server: {
      fs: {
        allow: [
          resolve(__dirname, 'src/renderer'), // стандарт
          resolve(__dirname, 'src/store') // разрешаем твой стор
        ]
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src'),
        '@store': resolve(__dirname, 'src/store')
      }
    },
    plugins: [react()]
  }
})
