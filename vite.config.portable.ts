import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Portable build — produces a bundle that runs from the filesystem with no
 * server, no install and no network.
 *
 * Two things differ from the normal build:
 *  - `format: 'iife'` emits a classic script. Browsers refuse to load ES
 *    modules over file://, so a module build cannot be opened by double-click.
 *  - assets stay as separate files so scripts/build-portable.mjs can inline
 *    them itself (fonts as data URIs — file:// font requests are also blocked
 *    in several browsers).
 */
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'es2020',
    outDir: 'dist-portable',
    assetsInlineLimit: 0,
    cssCodeSplit: false,
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'app.js',
        assetFileNames: '[name][extname]',
      },
    },
  },
})
