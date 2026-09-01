import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* The official HUMAN website.

   A second Vite root so the app at ./index.html stays untouched: the site
   imports the app's real source rather than a copy of it, which is the whole
   point — the product shown on the site IS the product.

   Paths are relative to this file / to `root`, so the config needs no Node
   APIs and typechecks alongside the app without @types/node. */
export default defineConfig({
  plugins: [react()],
  root: 'site',
  base: './',
  server: {
    host: true,
    port: 5174,
    // The site imports from ../src, which lives outside the Vite root.
    fs: { allow: ['..'] },
  },
  build: {
    target: 'es2022',
    outDir: '../dist-site',
    emptyOutDir: true,
    assetsInlineLimit: 2048,
  },
})
