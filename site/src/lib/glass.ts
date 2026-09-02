/**
 * The Liquid Glass runtime. DECISIONS.md D14.
 *
 * Two things CSS cannot do on its own, and this module does:
 *
 *   1. REFRACTION. Real glass bends what is behind it, hardest at the rim and
 *      not at all through the middle. `backdrop-filter` can run an SVG filter,
 *      so a `feDisplacementMap` driven by a bevel map gives us the actual
 *      optics rather than an impression of them. But the map has to match the
 *      element: a bevel that is 14px wide on one edge and 60px on another is
 *      not a bevel, it is a smear. So the filters are GENERATED per measured
 *      size, bucketed so a page shares a handful of them.
 *
 *   2. THE SPECULAR. Glass looks wet because the highlight moves. The rim
 *      brightens where the pointer is and dims where it is not, which no
 *      static gradient can do.
 *
 * Both are progressive. With JS off, or `backdrop-filter` unsupported, or the
 * visitor asking for reduced transparency, every element keeps a complete,
 * correct appearance from CSS alone — the runtime only ever ADDS optics to a
 * surface that already reads.
 */

/* Bevel width in CSS px. The lens does nothing through the middle of the
   element and turns over this distance at each edge — the same number on all
   four sides, which is the whole point of generating per size. */
const BEVEL = 13
/* How far the rim drags the backdrop, in CSS px. Past about 12 the edge stops
   reading as glass and starts reading as a fisheye. */
const THROW = 7
/* Sizes are rounded into buckets so a page of controls shares filters instead
   of minting one per element. 8px buckets: a 48x168 and a 48x172 button are
   optically identical and nobody will ever see the difference. */
const BUCKET = 8

/**
 * Which surfaces get REFRACTION, and which get a pointer-tracked specular.
 *
 * These are selector lists rather than classes in the markup on purpose: the
 * whole iOS direction is meant to be revertible by deleting its own two files
 * (DECISIONS.md D13/D14), and hand-placed `.lg-*` classes across fourteen
 * components would leave it smeared through the codebase instead.
 *
 * The lens list is ONE SELECTOR, and that is the finding rather than a
 * compromise. Rendering every candidate surface with and without the filter
 * and diffing the pixels — with a stability control, because the section
 * entrance animations will happily impersonate a result:
 *
 *   .seg__ind      26.4% of pixels move (desktop), 23.6% (mobile)
 *   .btn--ghost     0.28%
 *   .wl__field      0%
 *   .inc__card      0%
 *   .hdr__in        0%
 *
 * The reason is the page, not the filter. This site's ground is ONE colour,
 * #05100D, and behind most of these surfaces the true backdrop is a single
 * distinct RGB triple — standard deviation exactly zero. Every backdrop
 * operation is closed under a constant function: you cannot bend, blur or
 * saturate a flat field into anything but itself.
 *
 * The segmented indicator is the exception because it does not sit over the
 * page — it sits in a WELL. Its backdrop is the track it slides in: a recessed
 * fill, a dark inner wall and a lit bottom edge, all of which run underneath
 * it. (Not the labels — those paint on top of it, by design. An earlier note
 * here said otherwise and was wrong.) A lit groove is the only structured
 * backdrop on this page, and bending one is the single moment where the
 * material behaves like a lens rather than looking like one.
 *
 * Cost, for the record: ten refracting surfaces take median frame time on a
 * full-page scroll from 16.7ms to 33.3ms. One takes it nowhere measurable.
 */
const LENS = '.seg__ind'
/* `.seg`, not `.seg__b`: the segment buttons are bare by design (the glass in
   that control is the indicator sliding behind them), so pointing the specular
   at them set --px on an element with nothing to light. */
const LIVE = '.btn, .seg, .disc__btn, .wl__field, .hdr__in, .inc__card'

let defs: SVGSVGElement | null = null
const made = new Set<string>()

function supported(): boolean {
  if (typeof window === 'undefined' || typeof CSS === 'undefined') return false
  // Safari still needs the prefix, and neither engine reports url() support
  // through the unprefixed property alone.
  return (
    CSS.supports('backdrop-filter', 'url(#x)') ||
    CSS.supports('-webkit-backdrop-filter', 'url(#x)')
  )
}

function ensureDefs(): SVGSVGElement {
  if (defs) return defs
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('width', '0')
  svg.setAttribute('height', '0')
  svg.classList.add('lg-defs')
  document.body.appendChild(svg)
  defs = svg
  return svg
}

/**
 * The bevel map. Red drives horizontal displacement, green vertical, and 128
 * in either channel means "leave this pixel where it is".
 *
 * The ramps are flat across the middle and turn over only within BEVEL of each
 * edge, so the middle of the glass is optically clean and the rim carries all
 * the distortion — which is how a real bevelled edge behaves, and the reason
 * this reads as thick glass rather than as a warped screenshot.
 */
function bevelMap(w: number, h: number): string {
  const ex = Math.min(0.5, BEVEL / w)
  const ey = Math.min(0.5, BEVEL / h)
  const pc = (n: number) => `${(n * 100).toFixed(3)}%`
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
    `<defs>` +
    `<linearGradient id="h" x1="0" y1="0" x2="1" y2="0">` +
    `<stop offset="0" stop-color="rgb(0,0,0)"/>` +
    `<stop offset="${pc(ex)}" stop-color="rgb(128,0,0)"/>` +
    `<stop offset="${pc(1 - ex)}" stop-color="rgb(128,0,0)"/>` +
    `<stop offset="1" stop-color="rgb(255,0,0)"/>` +
    `</linearGradient>` +
    `<linearGradient id="v" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="rgb(0,0,0)"/>` +
    `<stop offset="${pc(ey)}" stop-color="rgb(0,128,0)"/>` +
    `<stop offset="${pc(1 - ey)}" stop-color="rgb(0,128,0)"/>` +
    `<stop offset="1" stop-color="rgb(0,255,0)"/>` +
    `</linearGradient>` +
    `</defs>` +
    /* Screen, so the horizontal ramp lands in red and the vertical in green
       without either one touching the other's channel. */
    `<rect width="${w}" height="${h}" fill="url(#h)"/>` +
    `<rect width="${w}" height="${h}" fill="url(#v)" style="mix-blend-mode:screen"/>` +
    `</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/**
 * Returns the filter id for a box of this size, minting the filter on first
 * ask. Returns null when the browser cannot run a filter on a backdrop, and
 * every caller treats null as "keep the CSS-only appearance".
 */
export function lensFor(width: number, height: number): string | null {
  if (!supported()) return null
  const w = Math.max(BUCKET, Math.round(width / BUCKET) * BUCKET)
  const h = Math.max(BUCKET, Math.round(height / BUCKET) * BUCKET)
  const id = `lg-lens-${w}x${h}`
  if (made.has(id)) return id

  const svg = ensureDefs()
  const f = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
  f.setAttribute('id', id)
  /* The region is the element's own box, and the primitives are in CSS pixels
     inside it — which is what lets one number mean 13px of bevel on a 48px
     capsule and 13px on a 400px card. */
  f.setAttribute('filterUnits', 'objectBoundingBox')
  f.setAttribute('primitiveUnits', 'userSpaceOnUse')
  f.setAttribute('x', '0')
  f.setAttribute('y', '0')
  f.setAttribute('width', '100%')
  f.setAttribute('height', '100%')
  f.setAttribute('color-interpolation-filters', 'sRGB')
  f.innerHTML =
    `<feImage href="${bevelMap(w, h)}" x="0" y="0" width="${w}" height="${h}" ` +
    `preserveAspectRatio="none" result="map"/>` +
    /* A hair of blur on the MAP, not on the backdrop: the ramp meets the
       plateau at a hard corner, and displacement across a hard corner bands
       visibly. Softening the map rounds the shoulder instead. */
    `<feGaussianBlur in="map" stdDeviation="1.5" result="soft"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="soft" scale="${THROW}" ` +
    `xChannelSelector="R" yChannelSelector="G"/>`
  svg.appendChild(f)
  made.add(id)
  return id
}

/* --------------------------------------------------------------------------
   The specular.

   ONE delegated listener for the whole page rather than a pair per control,
   coalesced into a single rAF — Part 10 budgets no long tasks, and thirty
   controls each listening to pointermove is exactly how that budget goes.
   -------------------------------------------------------------------------- */

let tracking = false
let queued = 0
let hot: HTMLElement | null = null
let px = 0
let py = 0

function paint() {
  queued = 0
  if (!hot) return
  const r = hot.getBoundingClientRect()
  if (!r.width || !r.height) return
  hot.style.setProperty('--px', ((px - r.left) / r.width).toFixed(3))
  hot.style.setProperty('--py', ((py - r.top) / r.height).toFixed(3))
}

/** Give the highlight back to its resting position. */
function cool() {
  if (!hot) return
  hot.style.removeProperty('--px')
  hot.style.removeProperty('--py')
  hot.classList.remove('is-tracked')
  hot = null
}

function onMove(e: PointerEvent) {
  /* Touch never hovers. Tracking a highlight to a finger that is about to lift
     costs a frame and buys nothing. */
  if (e.pointerType !== 'mouse') return
  const t = e.target as Element | null
  const next = t && t.closest ? (t.closest(LIVE) as HTMLElement | null) : null

  if (next !== hot) {
    /* Hand the highlight back to its rest position rather than snapping it: a
       highlight that teleports on pointer-out reads as a bug. */
    cool()
    hot = next
    if (hot) hot.classList.add('is-tracked')
  }
  if (!hot) return

  px = e.clientX
  py = e.clientY
  if (!queued) queued = requestAnimationFrame(paint)
}

/** Idempotent: safe to call from every glass component that mounts. */
export function trackSpecular(): () => void {
  if (typeof window === 'undefined') return () => {}
  if (tracking) return () => {}
  tracking = true
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onMove, { passive: true })
  /* A pointer can also leave a control without moving: the page scrolls out
     from under it, or the cursor leaves the window entirely. Neither fires
     pointermove, so without these the highlight stays lit on a control the
     pointer is no longer anywhere near. */
  window.addEventListener('scroll', cool, { passive: true })
  document.addEventListener('pointerleave', cool, { passive: true })
  return () => {
    tracking = false
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerdown', onMove)
    window.removeEventListener('scroll', cool)
    document.removeEventListener('pointerleave', cool)
    if (queued) cancelAnimationFrame(queued)
    queued = 0
    cool()
  }
}

/** Test seam: forget every generated filter. */
export function resetLenses() {
  made.clear()
  defs?.remove()
  defs = null
}

/* --------------------------------------------------------------------------
   Applying the lens without threading a hook through thirty components.

   Everything matching LENS gets a filter sized to it, re-sized when it resizes
   and re-scanned when React adds more of them (a section mounting, the mobile
   bar arriving). One observer pair for the page.
   -------------------------------------------------------------------------- */

let ro: ResizeObserver | null = null
let mo: MutationObserver | null = null
/* Reset on teardown, not a module constant. Held across an unmount it would
   remember elements the disconnected ResizeObserver is no longer watching, so
   a remounted runtime would skip exactly the elements that need re-measuring. */
let watched = new WeakSet<Element>()

function fit(el: HTMLElement) {
  const r = el.getBoundingClientRect()
  if (!r.width || !r.height) return
  const id = lensFor(r.width, r.height)
  /* `--lg-lens` is consumed as `var(--lg-lens, )` inside backdrop-filter, so
     an element the runtime never reaches keeps its plain blur rather than
     losing the whole declaration to an invalid url(). */
  if (id) el.style.setProperty('--lg-lens', `url(#${id})`)
}

function scan(root: ParentNode) {
  const all: HTMLElement[] = []
  /* `querySelectorAll` looks at descendants only. React inserts the element
     itself, so a lensed surface added without a wrapper around it would never
     be found. */
  if (root instanceof Element && root.matches(LENS)) all.push(root as HTMLElement)
  all.push(...root.querySelectorAll<HTMLElement>(LENS))
  for (const el of all) {
    if (watched.has(el)) continue
    watched.add(el)
    ro?.observe(el)
    fit(el)
  }
}

/**
 * Start assigning lenses. Idempotent, and a no-op where `backdrop-filter`
 * cannot take a filter reference — in which case every glass surface keeps the
 * blur-and-light appearance CSS gives it, which is the whole design minus the
 * refraction.
 */
export function autoLens(): () => void {
  if (typeof window === 'undefined' || !supported()) return () => {}
  if (ro) return () => {}

  ro = new ResizeObserver((entries) => {
    for (const e of entries) fit(e.target as HTMLElement)
  })
  mo = new MutationObserver((records) => {
    for (const r of records) {
      for (const n of r.addedNodes) {
        if (n.nodeType === 1) scan(n as ParentNode)
      }
    }
  })
  scan(document)
  mo.observe(document.body, { childList: true, subtree: true })

  return () => {
    ro?.disconnect()
    mo?.disconnect()
    ro = null
    mo = null
    watched = new WeakSet<Element>()
  }
}
