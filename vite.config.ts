/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages project sites are served from /<repo-name>/, not the domain root — only
  // apply that during build so `vite dev` still serves from / locally.
  base: command === 'build' ? '/fretboard-trainer/' : '/',
  test: {
    environment: 'jsdom',
    globals: true,
  },
}))
