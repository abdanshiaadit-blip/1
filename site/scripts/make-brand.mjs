/**
 * §16.1 — the brand assets that have to be raster.
 *
 * The favicon mark is the wordmark's H set in Newsreader on --forest; the
 * Open Graph card is the wordmark and "Know earlier. Act sooner." on the
 * same ground, with no screenshot and no photograph. One card is enough
 * for the whole site.
 *
 *   node scripts/make-brand.mjs
 */
import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

const FONT = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Atkinson+Hyperlegible:wght@400&display=block" rel="stylesheet">`

const mark = (size) => `<!doctype html><meta charset="utf-8">${FONT}
<style>
  html,body{margin:0;padding:0}
  body{width:${size}px;height:${size}px;background:#1B3B30;display:grid;place-items:center}
  span{font-family:'Newsreader',Georgia,serif;font-weight:500;font-size:${size * 0.68}px;
       color:#EDF1EC;line-height:1;letter-spacing:0.01em}
</style><span>H</span>`

const card = `<!doctype html><meta charset="utf-8">${FONT}
<style>
  html,body{margin:0;padding:0}
  body{width:1200px;height:630px;background:#1B3B30;display:flex;flex-direction:column;
       justify-content:space-between;padding:72px 88px;box-sizing:border-box}
  .mark{font-family:'Newsreader',Georgia,serif;font-weight:500;font-size:30px;letter-spacing:0.06em;color:#EDF1EC}
  h1{font-family:'Newsreader',Georgia,serif;font-weight:400;font-size:96px;line-height:1.02;
     letter-spacing:-0.025em;color:#EDF1EC;margin:0;max-width:16ch}
  p{font-family:'Atkinson Hyperlegible',system-ui,sans-serif;font-size:24px;color:#A9BAB2;margin:24px 0 0}
</style>
<div class="mark">HUMAN</div>
<div>
  <h1>Know earlier. Act sooner.</h1>
  <p>Preventive health, built for India.</p>
</div>`

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' })

for (const [size, file] of [
  [32, join(ROOT, 'app', 'icon.png')],
  [180, join(ROOT, 'app', 'apple-icon.png')],
]) {
  const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 })
  await page.setContent(mark(size))
  await page.waitForTimeout(700)
  await page.screenshot({ path: file, type: 'png' })
  await page.close()
  console.log(`  ${file.split('/').slice(-2).join('/')}  ${size} × ${size}`)
}

const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
await page.setContent(card)
await page.waitForTimeout(900)
await page.screenshot({ path: join(ROOT, 'public', 'og.png'), type: 'png' })
await browser.close()
console.log('  public/og.png  1200 × 630')
