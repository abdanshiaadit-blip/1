/**
 * Build a single self-contained HTML file of the home page.
 *
 *   npx next start -p 3230 &
 *   node scripts/make-standalone.mjs http://127.0.0.1:3230 human-site-preview.html
 *
 * The site is built so that its resting CSS state is the finished page
 * (§8 Law 1), so the server-rendered markup with the stylesheet, fonts and
 * screens inlined is a faithful rendering of every section — the same
 * no-JS mode the QA suite checks. Motion is the one thing it cannot carry;
 * for that, run the site.
 *
 * A small script is added for the three interactions worth having in a
 * static file: the Body toggle, the waitlist modal and the mobile menu.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const BASE = process.argv[2] ?? 'http://127.0.0.1:3230'
const OUT = process.argv[3] ?? 'human-site-preview.html'

const text = async (path) => (await fetch(BASE + path)).text()
const bytes = async (path) => Buffer.from(await (await fetch(BASE + path)).arrayBuffer())

let html = await text('/')

// --- stylesheet, with the webfonts inlined into it ---
const cssHrefs = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g)].map((m) => m[1])
let css = ''
for (const href of cssHrefs) css += await text(href.replace(/&amp;/g, '&'))

const fontUrls = [...new Set([...css.matchAll(/url\((\/_next\/static\/media\/[^)]+\.woff2?)\)/g)].map((m) => m[1]))]
for (const url of fontUrls) {
  const data = await bytes(url)
  const mime = url.endsWith('.woff2') ? 'font/woff2' : 'font/woff'
  css = css.split(url).join(`data:${mime};base64,${data.toString('base64')}`)
  process.stdout.write(`  font  ${url.split('/').pop()}  ${(data.length / 1024).toFixed(0)} kB\n`)
}

// --- app screens, straight from the source PNGs ---
const screens = new Map()
for (const match of html.matchAll(/%2Fapp%2F([a-z0-9-]+)\.png/g)) {
  const id = match[1]
  if (screens.has(id)) continue
  const file = await readFile(join(process.cwd(), 'public', 'app', `${id}.png`))
  screens.set(id, `data:image/png;base64,${file.toString('base64')}`)
  process.stdout.write(`  screen ${id}.png  ${(file.length / 1024).toFixed(0)} kB\n`)
}

// --- strip everything that would go looking for the server ---
html = html
  .replace(/<script[\s\S]*?<\/script>/g, '')
  .replace(/<link[^>]+rel="preload"[^>]*>/g, '')
  .replace(/<link[^>]+rel="stylesheet"[^>]*>/gi, '')
  .replace(/<link[^>]+rel="icon"[^>]*>/gi, '')
  .replace(/<link[^>]+rel="apple-touch-icon"[^>]*>/gi, '')
  .replace(/\ssrcSet="[^"]*"/gi, '')
  .replace(/\ssizes="[^"]*"/gi, '')

for (const [id, uri] of screens) {
  html = html.replace(
    new RegExp(`/_next/image\\?url=%2Fapp%2F${id}\\.png(&amp;|&)w=\\d+(&amp;|&)q=\\d+`, 'g'),
    uri,
  )
}

// Mark the document as scripted, as the real one does before first paint.
// This goes into the existing class attribute: next/font puts the classes
// carrying --font-newsreader and --font-atkinson there, and a second
// class attribute would be ignored and take both typefaces with it.
html = html.replace(/(<html[^>]*\sclass=")/, '$1js ')

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%231B3B30'/%3E%3Ctext x='16' y='16' fill='%23EDF1EC' font-family='Georgia,serif' font-size='22' font-weight='500' text-anchor='middle' dominant-baseline='central'%3EH%3C/text%3E%3C/svg%3E"

const head = `<link rel="icon" href="${FAVICON}"/><style>${css}</style><style>
.preview-note{background:var(--color-forest-deep);color:var(--color-paper-on-dark-soft);
  padding:var(--spacing-s9) 0;border-top:1px solid var(--color-rule-on-dark)}
.preview-note p{max-width:65ch;margin-top:var(--spacing-s4)}
.preview-note strong{color:var(--color-paper-on-dark);font-weight:400}
</style>`

html = html.replace('</head>', `${head}</head>`)

const script = `
<script>
(function () {
  // The Body toggle (§11.4). Both instances share one state, as they do
  // in the real site.
  var body = 'women'
  function apply() {
    document.querySelectorAll('.body-toggle').forEach(function (t) { t.dataset.active = body })
    document.querySelectorAll('[role="tab"]').forEach(function (tab) {
      var mine = tab.id.indexOf('-' + body) > -1
      tab.setAttribute('aria-selected', mine ? 'true' : 'false')
      tab.tabIndex = mine ? 0 : -1
    })
    document.querySelectorAll('.body-panel').forEach(function (p) {
      p.dataset.state = p.id.indexOf('-' + body) > -1 ? 'active' : 'inactive'
    })
    var caption = document.querySelector('.rail__caption')
    if (caption) {
      caption.textContent = 'Screens from the working app. The marker added for you here is ' +
        (body === 'women' ? 'ferritin' : 'testosterone') + '.'
    }
  }
  document.addEventListener('click', function (e) {
    var tab = e.target.closest && e.target.closest('[role="tab"]')
    if (!tab) return
    body = tab.id.indexOf('-men') > -1 ? 'men' : 'women'
    apply()
  })
  document.addEventListener('keydown', function (e) {
    var tab = document.activeElement
    if (!tab || tab.getAttribute('role') !== 'tab') return
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) < 0) return
    e.preventDefault()
    body = body === 'women' ? 'men' : 'women'
    apply()
    var next = document.getElementById(tab.id.replace(/-(women|men)$/, '-' + body))
    if (next) next.focus()
  })
  apply()

  // The waitlist modal and the mobile menu.
  var modal = document.querySelector('dialog.wl-modal')
  var menu = document.querySelector('dialog.menu')
  function close(d) { if (d && d.open) { d.close(); document.body.style.overflow = '' } }
  function open(d) { if (d && !d.open) { d.showModal(); document.body.style.overflow = 'hidden' } }

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href]')
    if (link) {
      var href = link.getAttribute('href')
      if (href === '/waitlist') { e.preventDefault(); open(modal); return }
      // Only this page is in the file; the rest of the site needs the app.
      if (href.charAt(0) === '/' && href.indexOf('//') !== 0) { e.preventDefault(); return }
    }
    if (e.target.closest && e.target.closest('.nav__menu-button')) { e.preventDefault(); open(menu) }
    if (e.target.closest && e.target.closest('.menu__close')) close(menu)
    if (e.target.closest && e.target.closest('.wl-modal__close')) close(modal)
    if (e.target === modal) close(modal)
  })
  ;[modal, menu].forEach(function (d) {
    if (d) d.addEventListener('cancel', function (e) { e.preventDefault(); close(d) })
  })

  // Nothing in this file has anywhere to send a phone number, so the form
  // says so rather than pretending.
  document.querySelectorAll('.wl-form').forEach(function (form) {
    form.removeAttribute('action')
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      var note = form.querySelector('.preview-form-note')
      if (!note) {
        note = document.createElement('p')
        note.className = 'wl-error t-small preview-form-note'
        note.setAttribute('role', 'alert')
        note.textContent = 'This is a static preview, so the form does not send anything. It submits for real in the running site.'
        form.querySelector('.wl-submit').insertAdjacentElement('beforebegin', note)
      }
    })
  })

  // The nav's scrolled state, which is pure CSS once the flag is set.
  var nav = document.querySelector('.nav')
  if (nav) {
    var onScroll = function () { nav.dataset.scrolled = window.scrollY > 80 ? 'true' : 'false' }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }
})()
</script>`

const note = `<section class="preview-note"><div class="container-h"><div class="grid-h"><div class="place-text">
<h2 class="t-h3" style="color:var(--color-paper-on-dark)">About this file</h2>
<p class="t-small">This is the HUMAN home page as a single HTML file, with the stylesheet, both
typefaces and all eight app screens embedded. Nothing loads from the network, so it opens the same
way on a plane as on a desk.</p>
<p class="t-small"><strong>What is here:</strong> every one of the fifteen sections, at full fidelity —
layout, type, colour, the marker rows, the four charts, the phone frames. The Body toggle works, the
waitlist modal opens, the mobile menu opens. Resize the window and the layout responds exactly as the
real site does.</p>
<p class="t-small"><strong>What is not:</strong> the motion. Every reveal, the four pinned scenes and
the sticky phone rail need the running site — what you see here is the state each animation ends in,
which is also what the site shows a visitor with JavaScript disabled. The other pages and the working
waitlist form need the app too: <code>cd site &amp;&amp; npm install &amp;&amp; npm run dev</code>.</p>
<p class="t-small"><strong>The app screens are placeholders</strong> at the exact export dimensions,
1170 × 2532. Real screenshots drop over them without changing any layout.</p>
</div></div></div></section>`

html = html.replace('</body>', `${note}${script}</body>`)
html = html.replace(/<title>[^<]*<\/title>/, '<title>HUMAN — home page preview</title>')

await writeFile(OUT, html, 'utf8')
console.log(`\n${OUT}  ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB`)
