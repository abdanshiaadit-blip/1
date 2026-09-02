import { createReadStream, existsSync, statSync } from 'node:fs'
import { dirname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const here = dirname(fileURLToPath(import.meta.url))
const EMBED_DIR = join(here, 'public', 'app-embed')

const TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
}

/**
 * Serve the app's prebuilt embed document from public/app-embed verbatim.
 *
 * Necessary because Vite's dev server runs its module transform before static
 * serving, and that transform tries to resolve any request that looks like a
 * JS module against the project's own graph. The embed's bundle is not in that
 * graph — it is a finished artifact built from the app at the repo root — so
 * the request 404s in a browser while succeeding under curl, which is exactly
 * as confusing as it sounds. Registering here, in the body of configureServer,
 * puts this ahead of the transform.
 *
 * Production needs none of this: public/ is copied into dist/ and served as
 * static files by whatever is hosting the site.
 */
function serveAppEmbed(): Plugin {
  return {
    name: 'human-serve-app-embed',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? '').split('?')[0]
        if (!url.startsWith('/app-embed/')) return next()

        const rel = decodeURIComponent(url.slice('/app-embed/'.length)) || 'index.html'
        const file = normalize(join(EMBED_DIR, rel))
        // Never serve outside the embed directory.
        if (!file.startsWith(EMBED_DIR)) return next()
        if (!existsSync(file) || statSync(file).isDirectory()) return next()

        const ext = file.slice(file.lastIndexOf('.'))
        res.setHeader('Content-Type', TYPES[ext] ?? 'application/octet-stream')
        res.setHeader('Cache-Control', 'no-cache')
        createReadStream(file).pipe(res)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), serveAppEmbed()],
  server: { host: '127.0.0.1', port: 5174 },
  build: { target: 'es2022', outDir: 'dist' },
})
