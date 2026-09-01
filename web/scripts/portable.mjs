/**
 * Fold the exported site into one file you can double-click.
 *
 * A normal static export cannot be opened from `file://`: its asset paths are
 * absolute, so `/_next/...` resolves to the root of the disk. This reads the
 * export and inlines every part of it — stylesheet, fonts, scripts, icon,
 * poster — into a single self-contained `index.html` with no external
 * request left in it.
 *
 * Two details make it work rather than merely look like it works:
 *
 *  - The bundle's scripts are inlined **in document order and synchronously**.
 *    Next ships them `async`, and each chunk pushes itself onto a global array
 *    that the webpack runtime — last in the document — drains. Kept in order,
 *    that is exactly the sequence the runtime expects.
 *  - The `noModule` polyfill chunk is dropped. It only executes in a browser
 *    with no ES-module support, and such a browser cannot render this site:
 *    the layout needs container query units, `@property` and `svh`.
 *
 * Usage: npm run build && npm run portable   →  HUMAN-website/index.html
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(root, 'out')
const DEST = join(root, 'HUMAN-website')

if (!existsSync(join(OUT, 'index.html'))) {
  console.error('No build found. Run `npm run build` first.')
  process.exit(1)
}

/** Read a file the HTML refers to by its site-absolute path. */
const asset = (url) => readFileSync(join(OUT, url.split('?')[0].replace(/^\//, '')))
const dataUri = (url, mime) => `data:${mime};base64,${asset(url).toString('base64')}`
/* A closing tag inside a string literal would end the script element early. */
const safe = (js) => js.replace(/<\/script/gi, '<\\/script')

let html = readFileSync(join(OUT, 'index.html'), 'utf8')
const inlined = { fonts: 0, scripts: 0, bytes: 0 }

/* ---- stylesheet, with its fonts folded in ----
   The tag becomes a <style>, holding the CSS once, with the three font files
   embedded in it. The flight payload also describes that stylesheet by href
   and React re-renders the head from that description on hydration, so the
   href there is pointed at an empty data: URI — otherwise React inserts a
   second <link> aimed at a file that is not there. An empty stylesheet costs
   nothing and never leaves the document. */
for (const href of new Set([...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]))) {
  let css = asset(href).toString('utf8')
  css = css.replace(/url\(([^)]*\/_next\/static\/media\/[^)]+?)\)/g, (m, raw) => {
    const url = raw.trim().replace(/^["']|["']$/g, '')
    if (!/\.woff2?$/.test(url.split('?')[0])) return m
    inlined.fonts++
    return `url(${dataUri(url, 'font/woff2')})`
  })
  inlined.bytes += css.length
  html = html.replace(
    new RegExp(`<link rel="stylesheet" href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*/?>`),
    `<style>${css}</style>`,
  )
  html = html.split(href).join('data:text/css,')
}

/* ---- preloads for things that are no longer fetched ---- */
html = html.replace(/<link rel="preload"[^>]*(as="font"|as="script")[^>]*\/?>/g, '')

/* ---- the bundle, in order, synchronous ---- */
html = html.replace(/<script([^>]*)\bsrc="([^"]+)"([^>]*)><\/script>/g, (m, a, src, b) => {
  if (/noModule/i.test(a + b)) return ''
  const js = asset(src).toString('utf8')
  inlined.scripts++
  inlined.bytes += js.length
  const id = (a + b).match(/\bid="[^"]*"/)
  return `<script${id ? ' ' + id[0] : ''}>${safe(js)}</script>`
})

/* ---- the preload hints React re-inserts on hydration ----
   Removing the <link> tags from the static HTML is not enough: the same
   preloads are serialised into the flight payload as `HL` rows, and React
   puts them back the moment it hydrates. From a file:// document each one is
   a cross-origin font fetch, which the browser refuses and logs. The bytes
   they point at are already inside the <style> above, so the hints have
   nothing left to do — drop the rows. */
const before = html.length
html = html.replace(
  /:HL\[\\"\/_next\/static\/(?:media\/[^"\\]+\.woff2?|css\/[^"\\]+\.css)\\"[^\]]*\]\\n/g,
  '',
)
inlined.hints = before !== html.length

/* ---- icon and video poster ----
   Replaced by path rather than by attribute, because the favicon is described
   in the flight payload too and React puts it back on hydration. */
for (const m of new Set([...html.matchAll(/["'](\/[\w./-]+\.svg(?:\?[\w]+)?)["']/g)].map((x) => x[1]))) {
  html = html.split(m).join(dataUri(m, 'image/svg+xml'))
}

/* Nothing may point at a path on disk any more — not in an attribute, and
   not inside the flight payload either. */
const left = [
  ...[...html.matchAll(/(?:src|href)="(\/[^"]+)"/g)].map((m) => m[1]),
  ...[...html.matchAll(/\/_next\/static\/(?:media|css)\/[^"\\]+/g)].map((m) => m[0]),
]
if (left.length) {
  console.error('Still referencing files on disk:', [...new Set(left)].join(', '))
  process.exit(1)
}

rmSync(DEST, { recursive: true, force: true })
mkdirSync(DEST, { recursive: true })
writeFileSync(join(DEST, 'index.html'), html)
writeFileSync(
  join(DEST, 'README.txt'),
  [
    'HUMAN — the website, as one file.',
    '',
    'Double-click index.html. No server, no install, no network.',
    '',
    'Everything is inside that file: styles, fonts, the whole bundle. It is',
    'the same build as the deployable site, folded flat so it opens from',
    'your desktop. Use a current Chrome, Edge, Safari or Firefox.',
    '',
    'To host it properly instead, deploy the contents of web/out/ to any',
    'static host — no server code is involved either way.',
    '',
  ].join('\n'),
)

const kb = (n) => (n / 1024).toFixed(0) + 'KB'
console.log(
  `HUMAN-website/index.html — ${kb(html.length)}, ` +
    `${inlined.scripts} scripts and ${inlined.fonts} fonts inlined, nothing left to fetch.`,
)
