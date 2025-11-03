/**
 * @file Vite configuration for Calendar library build
 * @module vite.lib.config
 */

import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  publicDir: false,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.js', '.vue']
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    lib: {
      name: 'Vue3Calendar',
      entry: resolve(__dirname, 'src/index.js'),
      fileName: (format) => `calendar-component.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
