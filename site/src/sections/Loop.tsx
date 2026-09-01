import { usePinEntrance, useSteps } from '../lib/hooks'
import { loop, loopIntro } from '../content/product'

/* ==========================================================================
   03 · The idea — 320vh, sticky.

   Seven stages arrive one at a time around an arc, and the arc closes into a
   ring. That closing is the single most important motion on the site,
   because the loop IS the product: ADAPT joins back to MEASURE, and the next
   cycle starts knowing more than the last.

   The seven names are the app's own LOOP_STAGES, drawn on Home as the loop
   strip. Nothing is renamed for the website.
   ========================================================================== */

const N = loop.length
const R = 39 // node radius, as a % of the ring box

export default function Loop() {
  const { ref, pinRef, step } = useSteps(N, { lead: 0.08, tail: 0.2 })
  const active = loop[step]
  const enter = usePinEntrance()

  return (
    <section ref={ref} className="pinwrap loopsec" id="how" aria-labelledby="loop-title">
      <div ref={pinRef} className="pin loopsec__pin">
        <div ref={enter.ref} className={`wrap loopsec__inner rev ${enter.shown ? 'in' : ''}`}>
          <header className="loopsec__head">
            <span className="cap">{loopIntro.eyebrow}</span>
            <h2 id="loop-title" className="loopsec__title h2">
              {loopIntro.title}
            </h2>
            <p className="loopsec__lead lead">{loopIntro.lead}</p>
          </header>

          <div className="loopring" style={{ '--n': N } as React.CSSProperties}>
            <svg className="loopring__svg" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="loopgrad" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--b1)" />
                  <stop offset="50%" stopColor="var(--b2)" />
                  <stop offset="100%" stopColor="var(--b3)" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r={R * 2} className="loopring__track" />
              <circle
                cx="100"
                cy="100"
                r={R * 2}
                className="loopring__arc"
                pathLength={1}
                transform="rotate(-90 100 100)"
              />
            </svg>

            <ol className="loopring__nodes">
              {loop.map((s, i) => {
                const a = (-90 + (360 / N) * i) * (Math.PI / 180)
                const ux = Math.cos(a)
                const uy = Math.sin(a)
                return (
                  <li
                    key={s.stage}
                    className={`loopnode ${i === step ? 'is-on' : ''} ${i < step ? 'is-past' : ''}`}
                    style={
                      {
                        '--x': `${50 + R * ux}%`,
                        '--y': `${50 + R * uy}%`,
                        '--ux': ux.toFixed(4),
                        '--uy': uy.toFixed(4),
                      } as React.CSSProperties
                    }
                  >
                    <span className="loopnode__dot" aria-hidden="true" />
                    {/* Pushed radially outward so no label ever sits on the arc. */}
                    <span className="loopnode__name">{s.stage}</span>
                    {/* Read by assistive tech in order; shown visually below. */}
                    <span className="sr-only">
                      {s.plain}. {s.body}
                    </span>
                  </li>
                )
              })}
            </ol>

            <div className="loopcentre" aria-hidden="true">
              <div className="loopcentre__inner" key={active.stage}>
                <span className="loopcentre__cap">{active.stage}</span>
                <p className="loopcentre__plain">{active.plain}</p>
              </div>
            </div>
          </div>

          {/* Kept out of the ring so it can never collide with a label. */}
          <p className="loopsec__body" aria-hidden="true" key={active.stage}>
            {active.body}
          </p>

          <p className="loopsec__closing">{loopIntro.closing}</p>
        </div>
      </div>
    </section>
  )
}
