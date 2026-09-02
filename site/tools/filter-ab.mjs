/**
 * Lens A/B, done correctly.
 *
 * Two earlier attempts were wrong and both looked convincing:
 *   1. no stability control — measured the section's entrance animation
 *   2. toggled `--lg-lens: none`, which makes `backdrop-filter: none blur(16px)`
 *      MALFORMED, so the browser dropped the whole declaration and the diff
 *      measured the loss of the blur
 * So: apply the real filter inline, compare against the same blur without it,
 * and keep the stability control.
 */
import { chromium } from 'playwright'
import * as esbuild from 'esbuild'
const built = await esbuild.build({ entryPoints: ['/home/user/1/site/src/lib/glass.ts'], bundle: true, format: 'iife', globalName: 'LG', write: false })
const js = built.outputFiles[0].text
const SELS = ['.inc__card', '.hdr__in', '.seg__ind', '.hdr__cta', '.mbar__ghost', '.btn--ghost', '.wl__field']

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
for (const [vw, vh, tag] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
  const p = await b.newPage({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1 })
  await p.goto('http://localhost:5174/', { waitUntil: 'domcontentloaded' })
  await p.evaluate(() => window.sessionStorage.setItem('human.intro.played', '1'))
  await p.reload({ waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(1800)
  await p.addScriptTag({ content: js })
  const shot = async (el) => {
    const r = await el.boundingBox()
    if (!r) return null
    const clip = { x: Math.max(0, r.x), y: Math.max(0, r.y), width: Math.min(r.width, vw - Math.max(0, r.x)), height: Math.min(r.height, vh - Math.max(0, r.y)) }
    if (clip.width < 2 || clip.height < 2) return null
    return (await p.screenshot({ clip })).toString('base64')
  }
  const diff = (a, c) => p.evaluate(async ({ a, c }) => {
    const load = async (s) => { const i = new Image(); i.src = 'data:image/png;base64,' + s; await i.decode(); const cv = document.createElement('canvas'); cv.width = i.width; cv.height = i.height; cv.getContext('2d').drawImage(i, 0, 0); return cv.getContext('2d').getImageData(0, 0, i.width, i.height).data }
    const [x, y] = await Promise.all([load(a), load(c)])
    if (x.length !== y.length) return { err: 'size' }
    let ch = 0, max = 0
    for (let i = 0; i < x.length; i += 4) {
      const d = Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2])
      if (d > 6) ch++
      if (d > max) max = d
    }
    return { pct: +(100 * ch / (x.length / 4)).toFixed(2), max }
  }, { a, c })

  console.log(`--- ${tag} ---`)
  for (const sel of SELS) {
    const el = p.locator(sel).first()
    if (!(await el.count())) { console.log(sel.padEnd(14), 'not found'); continue }
    try { await el.scrollIntoViewIfNeeded({ timeout: 2500 }) } catch {}
    await p.waitForTimeout(2600)
    const base = await el.evaluate((n) => getComputedStyle(n).backdropFilter)
    if (!base || base === 'none') { console.log(sel.padEnd(14), 'no backdrop-filter at rest'); continue }
    const blurOnly = base.replace(/url\([^)]*\)\s*/g, '').trim()
    await el.evaluate((n, f) => { n.style.backdropFilter = f; n.style.webkitBackdropFilter = f }, blurOnly)
    await p.waitForTimeout(600)
    const a1 = await shot(el)
    if (!a1) { console.log(sel.padEnd(14), 'offscreen'); continue }
    await p.waitForTimeout(700)
    const a2 = await shot(el)
    const control = await diff(a1, a2)
    const withLens = await el.evaluate((n, f) => {
      const r = n.getBoundingClientRect()
      const id = window.LG.lensFor(r.width, r.height)
      if (!id) return null
      const v = `url(#${id}) ${f}`
      n.style.backdropFilter = v
      n.style.webkitBackdropFilter = v
      return id
    }, blurOnly)
    await p.waitForTimeout(600)
    const c = await shot(el)
    await el.evaluate((n) => { n.style.backdropFilter = ''; n.style.webkitBackdropFilter = '' })
    const real = await diff(a2, c)
    const valid = control.pct !== undefined && control.pct < 0.2
    console.log(sel.padEnd(14), valid ? `lens moves ${String(real.pct).padStart(6)}% of pixels, max delta ${real.max}` : `INVALID (unstable: ${control.pct}%)`, withLens ? '' : '(no filter minted)')
  }
  await p.close()
}
await b.close()
