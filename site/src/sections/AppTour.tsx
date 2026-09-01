import { useCallback, useEffect, useRef } from 'react'
import { useNearViewport, usePinEntrance, useSteps } from '../lib/hooks'
import LiveApp, { type AppHandle } from '../app/LiveApp'
import type { SheetKind, TabId } from '../../../src/state/app'
import { tour, PROTOTYPE_URL } from '../content/product'

/* ==========================================================================
   05 · The app — the centrepiece.

   This is not a gallery of screenshots and it is not a rebuild. The device
   below runs the actual HUMAN prototype, imported from src/. Scrolling the
   page changes its tab, opens its sheets, starts its booking flow and
   scrolls its screens — so a visitor is genuinely moving through the product
   rather than watching a video of it.

   Everything the panel says in prose is also true of what is on the screen
   beside it, because there is only one source: the app itself.
   ========================================================================== */

/** How far to scroll the app's own screen across the life of a stop. */
const SCROLL_RANGE: Record<string, [number, number]> = {
  home: [0, 340],
  score: [0, 300],
  book: [0, 220],
  health: [0, 460],
  marker: [0, 420],
  priority: [0, 560],
  notnow: [0, 300],
  plan: [0, 520],
  experiment: [0, 620],
  readout: [0, 480],
  passport: [0, 560],
}

export default function AppTour() {
  const app = useRef<AppHandle | null>(null)
  const { ref: mountRef, near } = useNearViewport<HTMLDivElement>('40%')

  // Intra-stop scrolling: the app's screen keeps moving between stops, which
  // is what makes it read as use rather than as a slideshow. Instant, never
  // smooth, so it cannot fight the page's own scrolling.
  const onProgress = useCallback((step: number, frac: number) => {
    const h = app.current
    if (!h) return
    const range = SCROLL_RANGE[tour[step]?.id ?? '']
    if (!range) return
    // Wait out the sheet's entrance before taking over its scroll position.
    const eased = frac < 0.18 ? 0 : (frac - 0.18) / 0.82
    h.scrollScreen(range[0] + (range[1] - range[0]) * eased, false)
  }, [])

  const { ref, pinRef, step } = useSteps(tour.length, {
    lead: 0.03,
    tail: 0.05,
    onProgress,
  })

  const stop = tour[step]
  const enter = usePinEntrance()

  // Take the app to the stop. Sheets and the booking modal are opened a beat
  // after the tab change so their own spring entrance is visible.
  useEffect(() => {
    const h = app.current
    if (!h) return
    let t = 0

    h.closeBooking()
    h.closeSheets()
    h.setTab(stop.tab as TabId)
    h.scrollScreen(stop.scroll ?? 0, false)

    if (stop.booking) {
      t = window.setTimeout(() => h.openBooking(), 240)
    } else if (stop.sheet) {
      t = window.setTimeout(() => h.openSheet(stop.sheet!.kind as SheetKind, stop.sheet!.id), 240)
    }
    return () => window.clearTimeout(t)
  }, [stop, near])

  const onReady = useCallback((h: AppHandle) => {
    app.current = h
  }, [])

  return (
    <section ref={ref} className="pinwrap tour" id="app" aria-labelledby="tour-title">
      <div ref={pinRef} className="pin tour__pin">
        <div ref={enter.ref} className={`wrap tour__inner rev ${enter.shown ? 'in' : ''}`}>
          {/* ------------------------------------------------------- copy */}
          <header className="tour__head">
            <span className="cap">The app</span>
            <h2 id="tour-title" className="tour__title h2">
              This is the product. Not a picture of it.
            </h2>
          </header>

          <div className="tour__copy">
            {/* All eleven stops live in the DOM. Assistive tech and search
                engines read the lot; the site shows one at a time. */}
            <ol className="tour__stops" style={{ '--step': step } as React.CSSProperties}>
              {tour.map((s, i) => (
                <li
                  key={s.id}
                  className={`tourstop ${i === step ? 'is-on' : ''}`}
                  style={{ '--i': i } as React.CSSProperties}
                >
                  <span className="cap tourstop__cap">{s.eyebrow}</span>
                  <h3 className="tourstop__title h3">{s.title}</h3>
                  <p className="tourstop__body body">{s.body}</p>
                </li>
              ))}
            </ol>

            <div className="tour__foot">
              <span className="tour__count tnum" aria-hidden="true">
                {String(step + 1).padStart(2, '0')}
                <span className="tour__countsep">/</span>
                {String(tour.length).padStart(2, '0')}
              </span>
              <span className="tour__ticks" aria-hidden="true">
                {tour.map((s, i) => (
                  <span key={s.id} className={`tour__tick ${i <= step ? 'is-on' : ''}`} />
                ))}
              </span>
            </div>
          </div>

          {/* ----------------------------------------------------- device */}
          <div ref={mountRef} className="tour__stage">
            <span className="tour__badge">
              <span className="tour__badgedot" aria-hidden="true" />
              Live · working prototype
            </span>

            <div className="tour__devicebox">
              {near && (
                <LiveApp
                  onReady={onReady}
                  maxScale={0.92}
                  label={`The HUMAN app, showing ${stop.eyebrow}: ${stop.title}`}
                />
              )}
            </div>

            <a
              className="tour__link"
              href={PROTOTYPE_URL}
              target="_blank"
              rel="noreferrer noopener"
            >
              Open it yourself
              <span className="hu-btn__arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
