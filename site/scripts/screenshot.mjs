/**
 * QA screenshots (§19.10 — look at it).
 *
 *   node scripts/screenshot.mjs [baseUrl] [outDir]
 *
 * Captures each viewport in §18 at a set of scroll positions, and also
 * runs the mechanical checks that do not need eyes: horizontal overflow,
 * and any element whose box overlaps a text node's box.
 */
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const BASE = process.argv[2] ?? 'http://127.0.0.1:3000'
const OUT = process.argv[3] ?? 'qa-shots'

const VIEWPORTS = [
  { name: 'large-1920x1080', width: 1920, height: 1080 },
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'small-1280x720', width: 1280, height: 720 },
  { name: 'short-1024x640', width: 1024, height: 640 },
  { name: 'tablet-768x1024', width: 768, height: 1024 },
  { name: 'mobile-390x844', width: 390, height: 844 },
]

const STOPS = [0, 0.06, 0.14, 0.24, 0.34, 0.44, 0.56, 0.68, 0.78, 0.88, 1]

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' })
await mkdir(OUT, { recursive: true })
const report = []

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    reducedMotion: process.env.REDUCED === '1' ? 'reduce' : 'no-preference',
  })
  const page = await context.newPage()
  const errors = []
  const coveredText = []
  page.on('pageerror', (error) => errors.push(String(error)))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url().slice(0, 120)}`)
  })

  await page.goto(BASE, { waitUntil: 'load', timeout: 90000 })
  await page.waitForTimeout(1800)

  const height = await page.evaluate(() => document.documentElement.scrollHeight)

  for (const [index, stop] of STOPS.entries()) {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round((height - viewport.height) * stop))
    await page.waitForTimeout(900)
    await page.screenshot({ path: `${OUT}/${viewport.name}-${String(index).padStart(2, '0')}.png` })

    const covered = await page.evaluate(() => {
      const offenders = []
      for (const el of document.querySelectorAll('h1,h2,h3,p,li,figcaption,label,a,button')) {
        if (!el.textContent?.trim()) continue
        const style = getComputedStyle(el)
        if (style.visibility === 'hidden' || Number(style.opacity) === 0) continue
        const rect = el.getBoundingClientRect()
        if (rect.width < 8 || rect.height < 8) continue
        if (rect.top < 4 || rect.bottom > window.innerHeight - 4) continue
        const hit = document.elementFromPoint(
          rect.left + Math.min(rect.width / 2, 40),
          rect.top + rect.height / 2,
        )
        if (!hit || hit === el || el.contains(hit) || hit.contains(el)) continue
        offenders.push(
          `${el.tagName}.${String(el.className).slice(0, 32)} <- ${hit.tagName}.${String(hit.className).slice(0, 32)}`,
        )
      }
      return offenders.slice(0, 4)
    })
    if (covered.length) coveredText.push({ stop: index, covered })
  }

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    offenders: Array.from(document.querySelectorAll('body *'))
      .filter((el) => {
        const rect = el.getBoundingClientRect()
        return rect.width > 0 && (rect.right > window.innerWidth + 1 || rect.left < -1)
      })
      .slice(0, 8)
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`),
  }))

  report.push({
    viewport: viewport.name,
    documentHeight: height,
    overflow,
    coveredText,
    errors: errors.slice(0, 8),
  })
  await context.close()
}

await browser.close()
await writeFile(`${OUT}/report.json`, JSON.stringify(report, null, 2))
for (const row of report) {
  const bad = row.overflow.scrollWidth > row.overflow.innerWidth
  const realErrors = row.errors.filter((e) => !/404 .*(_rsc=|favicon)/.test(e))
  console.log(
    `${row.viewport.padEnd(18)} height=${String(row.documentHeight).padEnd(7)} h-overflow=${bad ? 'YES ' + row.overflow.offenders.join(', ') : 'no'}  covered-text=${row.coveredText.length ? JSON.stringify(row.coveredText) : 'none'}  errors=${realErrors.length ? realErrors.join(' | ') : 'none'}`,
  )
}
