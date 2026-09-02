/**
 * Worst-case text contrast over a live, translucent, refracting surface.
 *
 * The only honest way to measure type on glass: screenshot the real page and
 * compare each run of text against the ground THE GLYPHS THEMSELVES sit on —
 * not against a nominal token, and not against the worst pixel anywhere in the
 * control, which on a bevelled surface is always the rim and never the type.
 *
 * So: collect the client rects of every text node first, then hide the
 * foreground and screenshot, then sample only inside those rects.
 *
 *   node tools/contrast.mjs ".btn,.hdr__in"
 */
import { chromium } from 'playwright'

/* This environment ships a Chromium that `playwright install` cannot fetch, so
   CHROMIUM_PATH points at it. Anywhere else, leave it unset and Playwright
   uses its own (`npx playwright install chromium`). */
const CHROMIUM = process.env.CHROMIUM_PATH || undefined
const SITE = process.env.SITE || 'http://localhost:5174/'

const SELECTORS = process.argv[2]
  ? process.argv[2].split(',')
  : ['.hdr__in', '.btn--primary', '.btn--ghost', '.seg__b', '.wl__field', '.disc__btn', '.inc__card', '.mbar']
const FLOOR = 4.5

const b = await chromium.launch({ executablePath: CHROMIUM })
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
await p.goto(SITE, { waitUntil: 'domcontentloaded' })
await p.evaluate(() => window.sessionStorage.setItem('human.intro.played', '1'))
await p.reload({ waitUntil: 'domcontentloaded' })
await p.waitForTimeout(1600)
await p.evaluate(() => {
  const st = document.createElement('style')
  st.id = '__probe_css'
  st.textContent = '.__probe > *{visibility:hidden !important}.__probe{color:transparent !important;-webkit-text-fill-color:transparent !important}'
  st.disabled = true
  document.head.appendChild(st)
})

const rows = []
for (const sel of SELECTORS) {
  const el = p.locator(sel).first()
  if (!(await el.count())) { rows.push({ sel, skip: 'not found' }); continue }
  /* Back to the top first: the floating bar hides itself on the way DOWN, so a
     probe that arrives there by scrolling measures a control that is currently
     translated off the screen and finds no text at all. */
  await p.evaluate(() => window.scrollTo(0, 0))
  await p.waitForTimeout(400)
  try { await el.scrollIntoViewIfNeeded({ timeout: 3000 }) } catch { /* fixed chrome does not scroll */ }
  await p.waitForTimeout(700)

  /* Every run of text inside the control, with the colour it is painted in and
     the size it is painted at — 18.66px+ (or 14px bold) is "large text" and
     takes the 3:1 floor rather than 4.5:1. */
  const runs = await el.evaluate((root) => {
    const out = []
    const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      if (!n.textContent.trim()) continue
      const parent = n.parentElement
      const cs = getComputedStyle(parent)
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue
      const r = document.createRange()
      r.selectNodeContents(n)
      for (const box of r.getClientRects()) {
        if (box.width < 4 || box.height < 4) continue
        const px = parseFloat(cs.fontSize)
        const bold = parseInt(cs.fontWeight, 10) >= 700
        out.push({
          text: n.textContent.trim().slice(0, 28),
          color: cs.color,
          large: px >= 24 || (px >= 18.66 && bold),
          x: box.x, y: box.y, w: box.width, h: box.height,
        })
      }
    }
    return out
  })
  if (!runs.length) { rows.push({ sel, skip: 'no text' }); continue }

  await el.evaluate((n) => n.classList.add('__probe'))
  await p.evaluate(() => { document.getElementById('__probe_css').disabled = false })
  await p.waitForTimeout(150)
  const png = (await p.screenshot()).toString('base64')
  await p.evaluate(() => { document.getElementById('__probe_css').disabled = true })
  await el.evaluate((n) => n.classList.remove('__probe'))

  const measured = await p.evaluate(async ({ png, runs }) => {
    const img = new Image()
    img.src = 'data:image/png;base64,' + png
    await img.decode()
    const c = document.createElement('canvas')
    c.width = img.width
    c.height = img.height
    const g = c.getContext('2d', { willReadFrequently: true })
    g.drawImage(img, 0, 0)
    const lum = (r, gg, bb) => {
      const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
      return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(bb)
    }
    const ratio = (a, z) => (Math.max(a, z) + 0.05) / (Math.min(a, z) + 0.05)
    const out = []
    for (const run of runs) {
      const x0 = Math.max(0, Math.round(run.x)), y0 = Math.max(0, Math.round(run.y))
      const x1 = Math.min(c.width, Math.round(run.x + run.w)), y1 = Math.min(c.height, Math.round(run.y + run.h))
      if (x1 - x0 < 2 || y1 - y0 < 2) continue
      const d = g.getImageData(x0, y0, x1 - x0, y1 - y0).data
      let lo = 1, hi = 0
      for (let i = 0; i < d.length; i += 4) {
        const L = lum(d[i], d[i + 1], d[i + 2])
        if (L < lo) lo = L
        if (L > hi) hi = L
      }
      const m = run.color.match(/[\d.]+/g).map(Number)
      const t = lum(m[0], m[1], m[2])
      out.push({ text: run.text, large: run.large, worst: +Math.min(ratio(t, lo), ratio(t, hi)).toFixed(2) })
    }
    return out
  }, { png, runs })

  const worst = measured.reduce((a, r) => (a && a.worst <= r.worst ? a : r), null)
  rows.push({ sel, ...worst, runs: measured.length })
}

let fails = 0
for (const r of rows) {
  if (r.skip) { console.log(String(r.sel).padEnd(16), r.skip); continue }
  const floor = r.large ? 3 : FLOOR
  const ok = r.worst >= floor
  if (!ok) fails++
  console.log(
    String(r.sel).padEnd(16),
    `${ok ? 'PASS' : 'FAIL'}  ${String(r.worst).padStart(6)}:1  (needs ${floor}:1${r.large ? ', large' : ''})  ${r.runs} runs  worst on "${r.text}"`,
  )
}
console.log(fails ? `\n${fails} FAILING` : '\nall pass')
await b.close()
process.exit(fails ? 1 : 0)
