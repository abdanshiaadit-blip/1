/**
 * The §18 checks that are mechanical: interaction, failure modes,
 * accessibility structure and layout collisions. Anything that needs eyes
 * is in scripts/screenshot.mjs.
 *
 *   node scripts/functional.mjs [baseUrl]
 */
import { chromium } from 'playwright'

const BASE = process.argv[2] ?? 'http://127.0.0.1:3000'
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/opt/pw-browsers/chromium' })

const results = []
const check = (name, pass, detail = '') => {
  results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? `  — ${detail}` : ''}`)
}

async function withPage(options, fn) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...options })
  const page = await context.newPage()
  try {
    await fn(page, context)
  } finally {
    await context.close()
  }
}

// ---- 18.5 Body toggle: both instances stay in sync, page height is stable
await withPage({}, async (page) => {
  await page.goto(BASE, { waitUntil: 'load', timeout: 90000 })
  await page.waitForTimeout(1200)

  const heightBefore = await page.evaluate(() => document.documentElement.scrollHeight)
  await page.locator('#panel-tab-men').click()
  await page.waitForTimeout(600)
  const heightAfter = await page.evaluate(() => document.documentElement.scrollHeight)
  check('Body toggle: page height unchanged', heightBefore === heightAfter, `${heightBefore} → ${heightAfter}`)

  const synced = await page.evaluate(() => ({
    panel: document.getElementById('panel-tab-men')?.getAttribute('aria-selected'),
    conditions: document.getElementById('conditions-tab-men')?.getAttribute('aria-selected'),
  }))
  check(
    'Body toggle: both instances in sync',
    synced.panel === 'true' && synced.conditions === 'true',
    JSON.stringify(synced),
  )

  const marker = await page.evaluate(() => document.querySelector('.rail__caption')?.textContent ?? '')
  check("Body toggle: section 07's example marker follows it", marker.includes('testosterone'), marker.trim())

  // Arrow keys, per the ARIA tabs pattern
  await page.locator('#conditions-tab-men').focus()
  await page.keyboard.press('ArrowLeft')
  await page.waitForTimeout(400)
  const backToWomen = await page.evaluate(
    () => document.getElementById('panel-tab-women')?.getAttribute('aria-selected'),
  )
  check('Body toggle: arrow keys switch tabs', backToWomen === 'true')
})

// ---- 18.5 Waitlist modal: opens, traps focus, escapes, submits
await withPage({}, async (page) => {
  const posts = []
  await page.route('**/api/waitlist', async (route) => {
    posts.push(JSON.parse(route.request().postData() ?? '{}'))
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
  })
  await page.goto(BASE, { waitUntil: 'load', timeout: 90000 })
  await page.waitForTimeout(1000)

  await page.locator('.nav__button').click()
  await page.waitForTimeout(500)
  check('Modal: opens from the nav', await page.locator('dialog.wl-modal[open]').count() === 1)
  check(
    'Modal: focus moves into the panel',
    await page.evaluate(() => document.activeElement?.closest('.wl-modal__panel') !== null),
  )

  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)
  check('Modal: Escape closes', (await page.locator('dialog.wl-modal[open]').count()) === 0)

  await page.locator('.nav__button').click()
  await page.waitForTimeout(400)
  await page.locator('#wl-name-modal').fill('A')
  await page.locator('#wl-phone-modal').fill('12345')
  await page.locator('.wl-submit').click()
  await page.waitForTimeout(400)
  const errors = await page.locator('.wl-error').allTextContents()
  check('Form: client-side validation blocks a bad submit', posts.length === 0 && errors.length >= 3, `${errors.length} field errors`)

  await page.locator('#wl-name-modal').fill('Meera Iyer')
  await page.locator('#wl-phone-modal').fill('+91 98765 43210')
  await page.locator('#wl-city-modal').selectOption('Bengaluru')
  await page.locator('.wl-submit').click()
  await page.waitForTimeout(700)
  check('Form: valid submit posts once', posts.length === 1, JSON.stringify(posts[0] ?? {}).slice(0, 90))
  check(
    'Form: success replaces the panel content',
    (await page.locator('.wl-success').count()) === 1,
  )
})

// ---- 18.6 No JavaScript
await withPage({ javaScriptEnabled: false }, async (page) => {
  await page.goto(BASE, { waitUntil: 'load', timeout: 90000 })
  const counts = {
    sections: await page.locator('section[id]').count(),
    hiddenText: await page.locator('[style*="opacity: 0"]').count(),
    bothPanels: await page.locator('.body-panel').count(),
    subheads: await page.locator('.body-panel__nojs-heading:visible').count(),
    toggleVisible: await page.locator('.body-toggle-wrap:visible').count(),
    ctaHref: await page.locator('.nav__button').getAttribute('href'),
  }
  check('No JS: every section renders', counts.sections >= 13, `${counts.sections} sections`)
  check('No JS: nothing is left hidden', counts.hiddenText === 0)
  check('No JS: both Body states render under sub-headings', counts.bothPanels === 4 && counts.subheads === 4)
  check('No JS: the toggle itself is hidden', counts.toggleVisible === 0)
  check('No JS: the waitlist CTA is a real link', counts.ctaHref === '/waitlist', String(counts.ctaHref))

  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  check('No JS: the page has full height', h > 8000, `${h}px`)
})

// ---- 18.6 Reduced motion
const window_h = 900
await withPage({ reducedMotion: 'reduce' }, async (page) => {
  await page.goto(BASE, { waitUntil: 'load', timeout: 90000 })
  await page.waitForTimeout(1500)
  const state = await page.evaluate(() => {
    const w12 = document.getElementById('10-week12')
    const track = w12.querySelector('.scene-track')
    const sticky = w12.querySelector('.scene-sticky')
    // `[data-visible]` marks progressive disclosure — C1's hover detail,
    // whose text also appears in the chart caption and the source note —
    // so it is meant to be hidden until asked for.
    const hidden = Array.from(document.querySelectorAll('h1,h2,h3,p,li'))
      .filter((el) => !el.closest('[data-visible]') && !el.hasAttribute('data-visible'))
      .filter((el) => Number(getComputedStyle(el).opacity) < 0.5)
      .map((el) => `${el.tagName}.${el.className}`.slice(0, 70))
    return {
      trackHeight: getComputedStyle(track).height,
      stickyPosition: getComputedStyle(sticky).position,
      hidden,
      progressBar: getComputedStyle(document.querySelector('.scroll-progress')).display,
    }
  })
  check('Reduced motion: pinning is off', state.stickyPosition === 'static', state.stickyPosition)
  check(
    'Reduced motion: pinned sections claim no extra scroll',
    parseInt(state.trackHeight, 10) < 3 * window_h,
    state.trackHeight,
  )
  check('Reduced motion: no text left faded', state.hidden.length === 0, state.hidden.join(' | '))
  check('Reduced motion: the progress bar is hidden', state.progressBar === 'none')
})

// ---- 18.1 / 18.7 structure
await withPage({}, async (page) => {
  await page.goto(BASE, { waitUntil: 'load', timeout: 90000 })
  await page.waitForTimeout(1200)
  const structure = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((h) =>
      Number(h.tagName[1]),
    )
    let skips = 0
    for (let i = 1; i < headings.length; i++) if (headings[i] - headings[i - 1] > 1) skips++
    const imgs = Array.from(document.querySelectorAll('img'))
    return {
      h1: document.querySelectorAll('h1').length,
      skips,
      mains: document.querySelectorAll('main').length,
      imgsWithoutAlt: imgs.filter((i) => i.alt === null || i.getAttribute('alt') === null).length,
      cover: imgs.filter((i) => getComputedStyle(i).objectFit === 'cover').length,
      rawZ: Array.from(document.querySelectorAll('body *')).filter((el) => {
        const z = getComputedStyle(el).zIndex
        return z !== 'auto' && ![0, 10, 20, 100, 200, 300].includes(Number(z))
      }).length,
    }
  })
  check('One h1 on the page', structure.h1 === 1, String(structure.h1))
  check('Heading order never skips a level', structure.skips === 0, `${structure.skips} skips`)
  check('One <main>', structure.mains === 1)
  check('Every image has alt text', structure.imgsWithoutAlt === 0)
  check('No object-fit: cover on any app screen', structure.cover === 0)
  check('Only the six sanctioned z-index values', structure.rawZ === 0, `${structure.rawZ} others`)

  // Keyboard: the skip link is first
  await page.keyboard.press('Tab')
  const first = await page.evaluate(() => document.activeElement?.className ?? '')
  check('Skip link is the first focusable element', first.includes('skip-link'), first)
})

// ---- 18.5 Nav: never dark-on-dark or light-on-light at any boundary
await withPage({}, async (page) => {
  await page.goto(BASE, { waitUntil: 'load', timeout: 90000 })
  await page.waitForTimeout(1200)

  const readings = await page.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms))
    const nav = document.querySelector('.nav')
    const out = []
    const ids = ['03-scale', '05-loop', '06-panel', '10-week12', '13-india', '15-waitlist']
    for (const id of ids) {
      const section = document.getElementById(id)
      // Land the nav band inside the section rather than at its edge.
      window.scrollTo(0, window.scrollY + section.getBoundingClientRect().top + 200)
      await wait(900)
      const dark = ['03-scale', '05-loop', '10-week12', '15-waitlist'].includes(id)
      out.push({ id, expectedDark: dark, overDark: nav.dataset.overDark === 'true' })
    }
    return out
  })
  const wrong = readings.filter((r) => r.expectedDark !== r.overDark)
  check(
    'Nav: swaps to light text over every dark section, and back',
    wrong.length === 0,
    wrong.map((w) => `${w.id} expected ${w.expectedDark}`).join(', '),
  )
})

// ---- 18.3 Fast scroll to the bottom leaves a correct final state
await withPage({}, async (page) => {
  await page.goto(BASE, { waitUntil: 'load', timeout: 90000 })
  await page.waitForTimeout(1000)
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.waitForTimeout(1400)
  const faded = await page.evaluate(() =>
    Array.from(document.querySelectorAll('h1,h2,h3,p,li'))
      .filter((el) => !el.closest('[data-visible]') && !el.hasAttribute('data-visible'))
      .filter((el) => !el.closest('.body-panel[data-state="inactive"]'))
      .filter((el) => el.getBoundingClientRect().width > 0)
      .filter((el) => Number(getComputedStyle(el).opacity) < 0.5)
      .map((el) => `${el.tagName}.${el.className}`.slice(0, 60)),
  )
  check('Fast scroll to bottom: nothing left mid-animation', faded.length === 0, faded.join(' | '))

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(1200)
  const heroOk = await page.evaluate(() => {
    const h1 = document.querySelector('.hero__headline')
    return Number(getComputedStyle(h1).opacity) === 1
  })
  check('Scroll back to top: the hero is intact', heroOk)
})

// ---- 18.5 Mobile menu
await withPage({ viewport: { width: 390, height: 844 }, hasTouch: true }, async (page) => {
  await page.goto(BASE, { waitUntil: 'load', timeout: 90000 })
  await page.waitForTimeout(900)
  // Scroll down, then back up a little: the nav hides on the way down and
  // returns on any upward move, which is the state the menu is used from.
  await page.evaluate(() => window.scrollTo(0, 2100))
  await page.waitForTimeout(800)
  await page.evaluate(() => window.scrollTo(0, 2000))
  await page.waitForTimeout(800)
  check(
    'Nav: hides on scroll down and returns on scroll up',
    (await page.evaluate(() => document.querySelector('.nav').dataset.hidden)) === 'false',
  )
  const scrollBefore = await page.evaluate(() => window.scrollY)

  await page.locator('.nav__menu-button').click()
  await page.waitForTimeout(500)
  check('Mobile menu: opens', (await page.locator('dialog.menu[open]').count()) === 1)
  check(
    'Mobile menu: body scroll locks',
    (await page.evaluate(() => document.body.style.overflow)) === 'hidden',
  )

  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)
  check('Mobile menu: Escape closes', (await page.locator('dialog.menu[open]').count()) === 0)
  const scrollAfter = await page.evaluate(() => window.scrollY)
  check(
    'Mobile menu: scroll position restored',
    Math.abs(scrollAfter - scrollBefore) < 4,
    `${scrollBefore} → ${scrollAfter}`,
  )
  check(
    'Mobile menu: focus returns to the menu button',
    await page.evaluate(() => document.activeElement?.classList.contains('nav__menu-button') === true),
  )
})

await browser.close()
const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length ? 1 : 0)
