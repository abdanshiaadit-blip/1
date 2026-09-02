import { chromium } from 'playwright'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
for (const url of ['file:///home/user/1/site/human-site-preview.html', 'http://127.0.0.1:3230/']) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(url, { waitUntil: 'load' })
  await page.waitForTimeout(1200)
  await page.evaluate(() => window.scrollTo(0, 11800))
  await page.waitForTimeout(800)
  console.log(url.slice(0, 22), JSON.stringify(await page.evaluate(() => {
    const nav = document.querySelector('.nav')
    const r = nav.getBoundingClientRect()
    return {
      navTop: Math.round(r.top), position: getComputedStyle(nav).position,
      transform: getComputedStyle(nav).transform,
      hidden: nav.dataset.hidden, scrolled: nav.dataset.scrolled,
      bodyTransform: getComputedStyle(document.body).transform,
      htmlOverflow: getComputedStyle(document.documentElement).overflowX,
    }
  })))
  await page.close()
}
await browser.close()
