/**
 * @file Vite configuration for Calendar demo build
 * @module vite.config
 */

import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  publicDir: resolve(__dirname, 'public'),
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.js', '.vue']
  },
  build: {
    outDir: resolve(__dirname, 'demo'),
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true,
    host: true
  }
})
