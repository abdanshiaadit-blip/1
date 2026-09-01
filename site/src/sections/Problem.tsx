import { useProgress, usePinEntrance } from '../lib/hooks'
import { problem } from '../content/product'

/* ==========================================================================
   02 · The problem — 320vh, sticky.

   Nine years drawn as one line. It never spikes and it never turns red until
   the very end, because that is the actual shape of the thing: a slow drift
   nobody feels. Each year stamps another "You feel fine" that fades as the
   next arrives.

   The chart is explicitly labelled an illustration. There is no sourced
   statistic in this project, so no number appears anywhere on this site.
   ========================================================================== */

// Flat inside the healthy band, then a long unhurried drift out of it.
const D =
  'M40,322 C170,321 260,315 360,304 C470,292 540,268 620,232 C700,196 780,150 860,124 C900,111 935,102 960,96'
const AREA = `${D} L960,346 L40,346 Z`

export default function Problem() {
  const { ref, pinRef } = useProgress('pin')
  const enter = usePinEntrance()

  return (
    <section ref={ref} className="pinwrap prob" aria-labelledby="prob-title">
      <div ref={pinRef} className="pin prob__pin">
        <div ref={enter.ref} className={`wrap prob__inner rev ${enter.shown ? 'in' : ''}`}>
          <header className="prob__head">
            <span className="cap">{problem.eyebrow}</span>
            <h2 id="prob-title" className="prob__title h2">
              {problem.title}
            </h2>
          </header>

          <div className="prob__chartwrap">
            <div className="prob__chart">
              <svg className="prob__svg" viewBox="0 0 1000 420" aria-hidden="true" focusable="false">
                <defs>
                  <linearGradient id="driftline" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--s-optimal)" />
                    <stop offset="58%" stopColor="var(--s-monitor)" />
                    <stop offset="100%" stopColor="var(--s-attention)" />
                  </linearGradient>
                  <linearGradient id="driftfill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,125,79,.22)" />
                    <stop offset="100%" stopColor="rgba(255,125,79,0)" />
                  </linearGradient>
                  {/* The fill is revealed by a wipe that tracks the line head. */}
                  <clipPath id="driftclip">
                    <rect x="0" y="0" width="1000" height="420" className="prob__wipe" />
                  </clipPath>
                </defs>

                {/* The band everything is supposed to stay inside. */}
                <rect x="0" y="250" width="1000" height="96" className="prob__band" />
                <line x1="0" y1="250" x2="1000" y2="250" className="prob__bandline" />

                <path d={AREA} fill="url(#driftfill)" clipPath="url(#driftclip)" />
                <path d={D} className="prob__trace" pathLength={1} />

                {/* Rides the same path, in the same coordinate space, so it can
                    never drift off the line. */}
                <circle r="7" className="prob__dot" style={{ offsetPath: `path("${D}")` }} />
              </svg>

              <span className="prob__bandlabel" aria-hidden="true">
                Normal range
              </span>

              <ol className="prob__years">
                {problem.years.map((y, i) => (
                  <li
                    key={y.year}
                    className={`prob__year ${i === problem.years.length - 1 ? 'is-last' : ''}`}
                    style={{ '--i': i } as React.CSSProperties}
                  >
                    <span className="prob__yearn">{y.year}</span>
                    <span className="prob__yearline">{y.line}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="prob__punch">
            <p className="prob__punchline h3">{problem.punch}</p>
            <p className="prob__after body">{problem.after}</p>
            <p className="prob__note">{problem.note}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
