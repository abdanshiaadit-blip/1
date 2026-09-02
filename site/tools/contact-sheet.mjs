import { chromium } from 'playwright'

/* This environment ships a Chromium that `playwright install` cannot fetch, so
   CHROMIUM_PATH points at it. Anywhere else, leave it unset and Playwright
   uses its own (`npx playwright install chromium`). */
const CHROMIUM = process.env.CHROMIUM_PATH || undefined
const SITE = process.env.SITE || 'http://localhost:5174/'
const OUT = process.env.OUT_DIR ? process.env.OUT_DIR.replace(/\/?$/, "/") : "./.shots/"
const b = await chromium.launch({ executablePath: CHROMIUM })

for (const [w, h, tag] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })
  await p.goto(SITE, { waitUntil: 'domcontentloaded' })
  await p.evaluate(() => window.sessionStorage.setItem('human.intro.played', '1'))
  await p.reload({ waitUntil: 'domcontentloaded' })
  await p.waitForTimeout(2000)
  const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight)
  const shots = []
  for (let i = 0; i < 6; i++) {
    const y = Math.round((H * i) / 5)
    await p.evaluate((yy) => window.scrollTo(0, yy), y)
    await p.waitForTimeout(1100)
    const f = `${OUT}sheet-${tag}-${i}.png`
    await p.screenshot({ path: f })
    shots.push(f)
  }
  // Compose the six into one sheet, in the browser.
  const datas = []
  const fs = await import('fs')
  for (const f of shots) datas.push('data:image/png;base64,' + fs.readFileSync(f).toString('base64'))
  const cols = 3, rows = 2, gap = 12
  const sheet = await b.newPage({ viewport: { width: cols * w + (cols + 1) * gap, height: rows * h + (rows + 1) * gap } })
  await sheet.setContent(`<body style="margin:0;background:#111;display:grid;gap:${gap}px;padding:${gap}px;grid-template-columns:repeat(${cols},${w}px)">` +
    datas.map((d, i) => `<div style="position:relative"><img src="${d}" style="display:block;width:${w}px"><span style="position:absolute;left:8px;top:8px;background:#000c;color:#fff;font:12px system-ui;padding:3px 7px;border-radius:4px">${i + 1}/6</span></div>`).join('') + '</body>')
  await sheet.waitForTimeout(500)
  await sheet.screenshot({ path: `${OUT}glass-${tag}.png`, fullPage: true })
  await sheet.close()
  await p.close()
  console.log(tag, 'sheet done')
}
await b.close()
