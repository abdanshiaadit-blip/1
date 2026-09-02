/**
 * §9.2 — placeholder app screens, generated to the image contract.
 *
 * Solid --mist rectangles at exactly 1170 × 2532 (iPhone 15 Pro at 3×),
 * labelled with the screen name. Dropping a real export over one of these
 * must change no layout, because the dimensions are identical.
 *
 *   node scripts/make-placeholders.mjs
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'app')

const SCREENS = [
  ['s1-home', 'Start Your Day', 'today’s actions'],
  ['s2-results', 'Results', 'the timeline'],
  ['s3-marker', 'Marker', 'one number, explained'],
  ['s4-score', 'HUMAN Score', 'and body age'],
  ['s5-priorities', 'Priorities', 'the three things to fix'],
  ['s6-plan', 'Plan', 'the quarter'],
  ['s7-progress', 'Progress', 'against your own past'],
  ['s8-coach', 'Coach', 'someone to ask'],
]

const page = (id, title, sub) => `<!doctype html>
<meta charset="utf-8">
<style>
  html,body{margin:0;padding:0}
  body{
    width:1170px;height:2532px;background:#E3E9E4;
    font-family:'Atkinson Hyperlegible',system-ui,sans-serif;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:36px;color:#61716A;
  }
  .name{font-size:52px;letter-spacing:0.01em;color:#4A5A54}
  .sub{font-size:39px;letter-spacing:0.01em}
  .slot{font-size:33px;letter-spacing:0.01em;color:#8A9A93}
  .rule{width:520px;height:3px;background:#CFD9D2}
</style>
<div class="name">${title}</div>
<div class="rule"></div>
<div class="sub">${sub}</div>
<div class="slot">${id} · 1170 × 2532</div>
`

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' })
await mkdir(OUT, { recursive: true })
const tab = await browser.newPage({ viewport: { width: 1170, height: 2532 } })

for (const [id, title, sub] of SCREENS) {
  await tab.setContent(page(id, title, sub))
  await tab.screenshot({ path: join(OUT, `${id}.png`), type: 'png' })
  console.log(`  ${id}.png  1170 × 2532`)
}

await browser.close()
console.log(`\n${SCREENS.length} placeholder screens written to public/app/`)
