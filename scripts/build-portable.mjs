/**
 * Collapses a portable Vite build into ONE self-contained index.html that
 * opens by double-click, offline, with no server and no install.
 *
 * Serves both portable targets — the app and the website — since the
 * inlining problem is identical for each. Defaults are the app's.
 *
 * Inlines: the stylesheet, the bundled script (as a classic <script>), and the
 * Inter woff2 subsets the app actually needs, as base64 data URIs.
 *
 * Font subsets: latin covers the UI; latin-ext is required for the rupee sign
 * (U+20B9, inside its U+20AD–20C0 range) which appears throughout pricing.
 * The remaining subsets (cyrillic, greek, vietnamese) are dropped — roughly
 * 85 KB of woff2 the app never renders.
 *
 * Usage: node scripts/build-portable.mjs [--in DIR] [--out DIR] [--readme FILE]
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}
const dist = join(root, arg('in', 'dist-portable'))
const out = join(root, arg('out', 'HUMAN-app'))
const readme = join(root, 'scripts', arg('readme', 'portable-README.txt'))

const KEEP_SUBSETS = ['latin', 'latin-ext']
const kb = (s) => `${(Buffer.byteLength(s) / 1024).toFixed(0)} KB`

// ---- locate build output -------------------------------------------------
const files = readdirSync(dist)
const cssName = files.find((f) => f.endsWith('.css'))
const jsName = files.find((f) => f.endsWith('.js'))
if (!cssName || !jsName) throw new Error(`expected .css and .js in ${dist}, saw: ${files.join(', ')}`)

let css = readFileSync(join(dist, cssName), 'utf8')
const js = readFileSync(join(dist, jsName), 'utf8')

// ---- drop unused font subsets -------------------------------------------
// Each @font-face block ends at the first '}'; none contain nested braces.
const before = css.length
css = css.replace(/@font-face\s*\{[^}]*\}/g, (block) => {
  const url = block.match(/url\(([^)]+)\)/)
  if (!url) return block
  const file = url[1].replace(/['"]/g, '').split('/').pop()
  return KEEP_SUBSETS.some((s) => file.includes(`-${s}-`)) ? block : ''
})

// ---- inline remaining fonts as data URIs --------------------------------
let fontsInlined = 0
css = css.replace(/url\(([^)]+\.woff2?)\)/g, (whole, raw) => {
  const file = raw.replace(/['"]/g, '').split('/').pop()
  try {
    const b64 = readFileSync(join(dist, file)).toString('base64')
    fontsInlined++
    return `url(data:font/woff2;charset=utf-8;base64,${b64})`
  } catch {
    console.warn(`  ! font not found, left as-is: ${file}`)
    return whole
  }
})

// ---- assemble ------------------------------------------------------------
const html = readFileSync(join(dist, 'index.html'), 'utf8')

// A literal </script> inside the bundle would close the tag early.
const safeJs = js.replace(/<\/script>/gi, '<\\/script>')

// Replacer FUNCTIONS, not strings: a string replacement expands `$&`, `$'` and
// friends, and minified JS reliably contains `$&` (from `x$ && y`). That would
// splice the original <script> tag back into the output.
//
// The script also has to MOVE to the end of <body>. Vite emits it in <head>,
// which is fine for `type="module"` (deferred by default) but not for the
// classic inline script we need here — it would run before #root exists.
const finalHtml = html
  .replace(new RegExp(`\\s*<link[^>]+href="[^"]*${cssName}"[^>]*>`), () => `\n    <style>\n${css}\n    </style>`)
  .replace(new RegExp(`\\s*<script[^>]+src="[^"]*${jsName}"[^>]*></script>`), () => '')
  .replace('</body>', () => `  <script>\n${safeJs}\n    </script>\n  </body>`)

if (finalHtml.includes(cssName) || finalHtml.includes(jsName)) {
  throw new Error('inlining failed — a external asset reference survived')
}

rmSync(out, { recursive: true, force: true })
mkdirSync(out, { recursive: true })
writeFileSync(join(out, 'index.html'), finalHtml)
writeFileSync(join(out, 'README.txt'), readFileSync(readme, 'utf8'))

console.log(`portable build → ${arg('out', 'HUMAN-app')}/index.html`)
console.log(`  css ${kb(css)} · js ${kb(js)} · fonts inlined: ${fontsInlined}`)
console.log(`  css shrank from ${(before / 1024).toFixed(0)} KB of @font-face by dropping unused subsets`)
console.log(`  total ${kb(finalHtml)} — single file, no external requests`)
