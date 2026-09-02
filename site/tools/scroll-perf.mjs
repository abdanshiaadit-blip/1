/**
 * Frame timings across a full-page scroll, with and without the material.
 *
 * The glass is the most expensive thing on this page: every translucent
 * surface makes the compositor re-read and re-filter what is behind it. This
 * is the number that says whether that is affordable.
 *
 *   node tools/scroll-perf.mjs [width]
 *
 * Note the browser here is software-rendered and headless, so these are a
 * pessimistic bound rather than what a visitor's GPU will do — but the DELTA
 * between the two runs is real, and the delta is the point.
 */
import { chromium } from 'playwright'

/* This environment ships a Chromium that `playwright install` cannot fetch, so
   CHROMIUM_PATH points at it. Anywhere else, leave it unset and Playwright
   uses its own (`npx playwright install chromium`). */
const CHROMIUM = process.env.CHROMIUM_PATH || undefined
const SITE = process.env.SITE || 'http://localhost:5174/'

const W = +(process.argv[2] || 1440)
const H = W < 768 ? 844 : 900

async function run(material) {
  const b = await chromium.launch({ executablePath: CHROMIUM })
  const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
  await p.goto(SITE, { waitUntil: 'domcontentloaded' })
  await p.evaluate(() => window.sessionStorage.setItem('human.intro.played', '1'))
  await p.reload({ waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(1500)
  if (!material) {
    await p.addStyleTag({ content: '*{backdrop-filter:none !important;-webkit-backdrop-filter:none !important}' })
    await p.waitForTimeout(400)
  }
  const r = await p.evaluate(async () => {
    const frames = []
    let last = performance.now()
    let stop = false
    const tick = (t) => { frames.push(t - last); last = t; if (!stop) requestAnimationFrame(tick) }
    requestAnimationFrame(tick)
    const H = document.documentElement.scrollHeight - innerHeight
    for (let i = 0; i <= 120; i++) {
      window.scrollTo(0, (H * i) / 120)
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
    }
    stop = true
    const f = frames.slice(3).sort((a, b) => a - b)
    const q = (n) => f[Math.floor(f.length * n)] || 0
    return { p50: +q(0.5).toFixed(1), p90: +q(0.9).toFixed(1), p99: +q(0.99).toFixed(1), over50: f.filter((x) => x > 50).length, frames: f.length }
  })
  const lenses = await p.evaluate(() => document.querySelectorAll('.lg-defs filter').length)
  await b.close()
  return { ...r, lenses }
}

console.log(`${W}px`)
console.log('  no material '.padEnd(16), JSON.stringify(await run(false)))
console.log('  with glass  '.padEnd(16), JSON.stringify(await run(true)))
