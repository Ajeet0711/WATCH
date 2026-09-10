import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * GitHub Pages serves this project from https://<user>.github.io/WATCH/, so
 * assets must be requested under that sub-path rather than the domain root.
 */
const BASE = '/WATCH/'

/**
 * Pages has no server-side rewrite, so a deep link like /WATCH/dashboard would
 * 404. Shipping the SPA shell as 404.html lets Pages hand those URLs back to
 * the app, and React Router then renders the right route.
 */
function spaFallback() {
  return {
    name: 'spa-404-fallback',
    closeBundle() {
      const dist = resolve(__dirname, 'dist')
      copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [react(), spaFallback()],
})
