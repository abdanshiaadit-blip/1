import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Builds the app's embed document straight into the website's public folder,
 * so the site serves it from its own origin at /app-embed/ (BRIEF.md Part 5.2).
 *
 * Separate from vite.config.ts on purpose: `npm run build` and `npm run
 * portable` are untouched, and the app's own dist never gains an entry it
 * does not need.
 */
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'es2022',
    outDir: 'site/public/app-embed',
    emptyOutDir: true,
    rollupOptions: { input: 'app-embed.html' },
  },
})
