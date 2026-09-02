/**
 * capture-app.mjs — BRIEF.md Part 5.1 item 8.
 *
 * Drives the HUMAN app in a real browser at 390x844 / dSF 3 and writes one PNG
 * per website screen id. These images are three things at once: the mobile
 * experience (Part 5.7), the reduced-motion state (Part 4.10), and the
 * authoring reference for the annotation anchors (Part 7.5.1).
 *
 *   node scripts/capture-app.mjs [--out DIR] [--url URL] [--persona aadit|meera]
 *
 * Defaults to the site's public/app, per the brief. Override --out while the
 * repo layout is still undecided so the app's own build stays untouched.
 *
 * Env escape hatches, both only needed off a normal site checkout:
 *   PLAYWRIGHT_MODULE  path to a playwright entry outside this package
 *   CHROMIUM_PATH      an already-downloaded Chromium binary
 */

import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}

const OUT = arg('out', 'public/app')
const URL_ = arg('url', 'http://127.0.0.1:5173/')
const PERSONA = arg('persona', 'aadit')
/* Part 7.5.1: the anchors are re-verified every time this script runs. The
   machine-readable mirror of src/config/annotations.ts. */
const ANCHORS = arg('anchors', 'session0/annotations.json')

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright')

/* The app's launch overlay is gated on a sessionStorage key (see
   src/components/LaunchIntro.tsx). Setting it before first paint skips the
   ~5s sequence rather than waiting it out — and keeps the capture
   deterministic. */
const INTRO_KEY = 'human.intro.played'

/* Each screen: how to reach it from a settled Home, and what must be visible
   before the shutter fires. `scrollTo` is a selector we scroll into view; the
   frame is 390x844 and several of these views are taller than one screen. */
const SCREENS = [
  {
    id: 'timeline',
    describe: 'Health Passport — the longitudinal record',
    async go(page) {
      await tab(page, 'Health')
      await page.locator('.ppreview').scrollIntoViewIfNeeded()
      await page.locator('.ppreview').click()
      await page.getByText('Your longitudinal record').waitFor()
    },
  },
  {
    id: 'score',
    describe: 'Home hero — the Health Intelligence dial',
    async go(page) {
      await tab(page, 'Home')
      await page.getByText('HEALTH INTELLIGENCE').waitFor()
    },
  },
  {
    id: 'priorities',
    describe: 'Decision Engine — the ranked list, one active and the rest held',
    async go(page) {
      await tab(page, 'Action')
      /* The only ranked list of priorities in the app: Action -> "Not now" ->
         "Why". The Action screen itself shows ONE priority, never three. */
      const why = page.getByRole('button', { name: 'Why', exact: true })
      await why.scrollIntoViewIfNeeded()
      await why.click()
      await page.getByText('What HUMAN is not showing you').waitFor()
    },
  },
  {
    id: 'plan',
    describe: 'Action — Today, one tap to confirm',
    async go(page) {
      await tab(page, 'Action')
      await page.getByText('Today', { exact: true }).waitFor()
      await page.evaluate(() => document.querySelector('.screen__scroll')?.scrollTo(0, 0))
    },
  },
  {
    id: 'week12',
    describe: 'Readout — signals at the end, each against its baseline',
    async go(page) {
      await tab(page, 'Action')
      const readout = page.getByText('Readout', { exact: true }).first()
      await readout.scrollIntoViewIfNeeded()
      await readout.click()
      await page.getByText('Signals at the end').waitFor()
      /* Sheets scroll in .sheet__body, not the screen. The baseline-vs-now
         rows are the last block, so run it to the bottom. */
      await page.evaluate(() => {
        const sb = document.querySelector('.sheet__body')
        if (sb) sb.scrollTo({ top: sb.scrollHeight, behavior: 'instant' })
      })
    },
  },
]

async function tab(page, name) {
  await page.getByRole('tab', { name, exact: true }).click()
  await page.waitForTimeout(500) // the app re-keys and replays entry animations
}

/* Sheets stack; close them all before the next screen so each capture starts
   from the same place. Escape is not wired, so use the close control. */
async function reset(page) {
  for (let i = 0; i < 4; i++) {
    const close = page.getByRole('button', { name: /close/i }).first()
    if (!(await close.count())) break
    await close.click()
    await page.waitForTimeout(260)
  }
}

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--no-proxy-server'],
})
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
})
await ctx.addInitScript(k => { try { sessionStorage.setItem(k, '1') } catch {} }, INTRO_KEY)

const page = await ctx.newPage()
const problems = []
page.on('console', m => { if (m.type() === 'error') problems.push(m.text()) })
page.on('pageerror', e => problems.push('PAGEERROR: ' + e.message))

await page.goto(URL_, { waitUntil: 'networkidle' })
await page.waitForTimeout(600)

if (PERSONA !== 'aadit') {
  /* The switcher lives beside the device and is desktop-only, so widen, click,
     and come back. React state survives the resize. */
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.getByRole('button', { name: new RegExp(PERSONA, 'i') }).first().click()
  await page.waitForTimeout(400)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(400)
}

mkdirSync(OUT, { recursive: true })

for (const s of SCREENS) {
  await reset(page)
  await s.go(page)
  await page.waitForTimeout(700) // let entry animations settle — no motion in the plate
  const file = join(OUT, `screen-${s.id}@3x.png`)
  await page.screenshot({ path: file })
  console.log(`${s.id.padEnd(11)} ${file}   ${s.describe}`)
}

/* ---- Annotation check (Part 7.5.1) --------------------------------------
   Render each authored dot over the plate that was just captured, so a human
   can glance at public/app/_annotation-check/ and see every dot landing on
   the element it claims. Coordinates are normalised against 390x844. */
if (existsSync(ANCHORS)) {
  const anchors = JSON.parse(readFileSync(ANCHORS, 'utf8'))
  const checkDir = join(OUT, '_annotation-check')
  mkdirSync(checkDir, { recursive: true })
  const check = await ctx.newPage()

  for (const s of SCREENS) {
    const dots = anchors[s.id] ?? []
    if (!dots.length) continue
    /* Inline the plate: a page created with setContent has an opaque origin
       and cannot load file:// images. */
    const src = 'data:image/png;base64,' +
      readFileSync(resolve(OUT, `screen-${s.id}@3x.png`)).toString('base64')
    await check.setContent(`
      <style>
        html,body{margin:0;background:#05100D}
        .f{position:relative;width:390px;height:844px;overflow:hidden}
        .f img{width:390px;height:844px;display:block}
        .d{position:absolute;width:14px;height:14px;margin:-7px 0 0 -7px;
           border:1.5px solid #7FE3C0;border-radius:50%;box-sizing:border-box}
        .d.bad{border-color:#E0A458}
        .l{position:absolute;transform:translateY(-50%);font:11px/1.3 system-ui;
           letter-spacing:.08em;color:#7FE3C0;background:#05100Dcc;padding:2px 4px;white-space:nowrap}
        .l.bad{color:#E0A458}
      </style>
      <div class="f">
        <img src="${src}">
        ${dots.map(d => {
          const bad = d.verified === 'blocked' ? ' bad' : ''
          const left = d.x < 0.5
          const lx = left ? `left:${d.x * 390 + 14}px` : `right:${(1 - d.x) * 390 + 14}px`
          return `<div class="d${bad}" style="left:${d.x * 390}px;top:${d.y * 844}px"></div>
                  <div class="l${bad}" style="${lx};top:${d.y * 844}px">${d.label}</div>`
        }).join('')}
      </div>`)
    await check.waitForTimeout(120)
    const file = join(checkDir, `${s.id}.png`)
    await check.locator('.f').screenshot({ path: file })
    const blocked = dots.filter(d => d.verified === 'blocked').length
    console.log(`check      ${file}${blocked ? `   ${blocked} BLOCKED anchor(s) — amber` : ''}`)
  }
  await check.close()
} else {
  console.log(`\nno anchor file at ${ANCHORS} — skipped the annotation check`)
}

if (problems.length) {
  console.log('\nconsole/page errors during capture:')
  for (const p of problems) console.log('  ' + p)
} else {
  console.log('\nno console or page errors during capture')
}

await browser.close()
