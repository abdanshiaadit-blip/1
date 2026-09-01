import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Portable build of the WEBSITE — one self-contained file that opens by
 * double-click, offline, with no server and no install.
 *
 * Same two departures from the normal build as vite.config.portable.ts:
 *  - `format: 'iife'` emits a classic script, because browsers refuse to load
 *    ES modules over file://.
 *  - assets stay separate so scripts/build-portable.mjs can inline them
 *    itself, fonts included (file:// font requests are blocked too).
 */
export default defineConfig({
  plugins: [react()],
  root: 'site',
  base: './',
  build: {
    target: 'es2020',
    outDir: '../dist-site-portable',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    cssCodeSplit: false,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'site.js',
        assetFileNames: '[name][extname]',
      },
    },
  },
})
