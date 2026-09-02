import { chromium } from 'playwright'
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const fails = []
page.on('requestfailed', (r) => fails.push(r.url().slice(0, 80)))
page.on('request', (r) => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) fails.push('NETWORK ' + r.url().slice(0, 80)) })
page.on('pageerror', (e) => fails.push('JS ' + String(e).slice(0, 100)))

await page.goto('file:///home/user/1/site/human-site-preview.html', { waitUntil: 'load' })
await page.waitForTimeout(1500)

const state = await page.evaluate(() => ({
  sections: document.querySelectorAll('section[id]').length,
  height: document.documentElement.scrollHeight,
  images: Array.from(document.images).filter((i) => i.naturalWidth > 0).length,
  totalImages: document.images.length,
  displayFont: getComputedStyle(document.querySelector('h1')).fontFamily.split(',')[0],
  bodyFont: getComputedStyle(document.body).fontFamily.split(',')[0],
  toggleVisible: getComputedStyle(document.querySelector('.body-toggle-wrap')).display,
  activePanels: document.querySelectorAll('.body-panel[data-state="active"]').length,
}))
console.log('render:', JSON.stringify(state))

await page.screenshot({ path: 'qa-shots/standalone-hero.png' })

// toggle
await page.locator('#panel-tab-men').click()
await page.waitForTimeout(400)
console.log('after toggle:', await page.evaluate(() => ({
  panel: document.getElementById('panel-tab-men').getAttribute('aria-selected'),
  conditions: document.getElementById('conditions-tab-men').getAttribute('aria-selected'),
  caption: document.querySelector('.rail__caption').textContent.slice(-16),
})))

// modal + inert form
await page.locator('.nav__button').click()
await page.waitForTimeout(400)
console.log('modal open:', await page.locator('dialog.wl-modal[open]').count() === 1)
await page.locator('.wl-submit').click()
await page.waitForTimeout(300)
console.log('form note:', (await page.locator('.preview-form-note').textContent()).slice(0, 48))
await page.keyboard.press('Escape')
await page.waitForTimeout(300)
console.log('modal closed:', await page.locator('dialog.wl-modal[open]').count() === 0)

await page.evaluate(() => window.scrollTo(0, 11800))
await page.waitForTimeout(800)
console.log('nav while scrolled:', await page.evaluate(() => {
  const nav = document.querySelector('.nav')
  return {
    top: Math.round(nav.getBoundingClientRect().top),
    position: getComputedStyle(nav).position,
    hidden: nav.dataset.hidden,
  }
}))
await page.screenshot({ path: 'qa-shots/standalone-mid.png' })
console.log('offsite requests / errors:', fails.length ? fails.slice(0, 5) : 'none')
await browser.close()
