import { useSteps } from '../lib/hooks'
import { transform, aadit } from '../content/product'

/* ==========================================================================
   06 · From a number to something you can do — 300vh, sticky.

   One card. Four states. It never disappears — it transforms. That is the
   whole value proposition expressed as an object rather than a paragraph:
   a lab report stops at state one, and HUMAN carries the same value through
   the other three.

   The value, the range, the reasoning and the action are all Aadit's real
   prototype data, imported rather than retyped.
   ========================================================================== */

const m = aadit.biomarkers.find((b) => b.id === 'hba1c')!
const span = m.range.ceil - m.range.floor
const pct = (v: number) => ((v - m.range.floor) / span) * 100

export default function Transform() {
  const { ref, pinRef, step, prev, goTo } = useSteps(transform.states.length, {
    lead: 0.08,
    tail: 0.14,
  })

  return (
    <section ref={ref} className="pinwrap xf" aria-labelledby="xf-title">
      <div ref={pinRef} className="pin xf__pin">
        <div className="wrap xf__inner">
          <header className="xf__head">
            <span className="cap">{transform.eyebrow}</span>
            <h2 id="xf-title" className="xf__title h2">
              {transform.title}
            </h2>
            <p className="xf__lead lead">{transform.lead}</p>
          </header>

          <div className="xf__stagewrap" style={{ '--s': step } as React.CSSProperties}>
            {/* The two findings HUMAN is holding back. They arrive at state 3,
                behind the card, dimmed — because that is what ranking looks
                like. */}
            <div className="xf__ghosts" aria-hidden="true">
              {aadit.priorities.slice(1, 3).map((p, i) => (
                <div key={p.id} className="xf__ghost" style={{ '--g': i } as React.CSSProperties}>
                  <span className="xf__ghostrank tnum">{p.rank}</span>
                  <span className="xf__ghostname">{p.title}</span>
                  <span className="xf__ghostwait">Waiting</span>
                </div>
              ))}
            </div>

            <article className="xf__card">
              <div className="xf__cardtop">
                <div className="xf__marker">
                  <span className="xf__markerlabel">{transform.markerLabel}</span>
                  <span className="xf__value tnum">
                    {m.value}
                    <em>{m.unit}</em>
                  </span>
                </div>
                <span className="xf__state">{m.deltaLabel}</span>
              </div>

              {/* The range band. Drawn once, revealed from state 2. */}
              <div className="xf__range" aria-hidden="true">
                <span className="xf__rangetrack" />
                <span
                  className="xf__rangeopt"
                  style={{
                    left: `${pct(m.range.optLow)}%`,
                    width: `${pct(m.range.optHigh) - pct(m.range.optLow)}%`,
                  }}
                />
                <span className="xf__rangepin" style={{ left: `${pct(m.value)}%` }} />
              </div>

              <div className="xf__slides">
                {transform.states.map((st, i) => (
                  <div
                    key={st.cap}
                    className={`xf__slide ${i === step ? 'is-on' : i === prev ? 'is-prev' : ''}`}
                  >
                    <span className="cap xf__cap">{st.cap}</span>
                    <h3 className="xf__head3 h3">{st.head}</h3>
                    <p className="xf__body body">{st.body}</p>
                  </div>
                ))}
              </div>

              {/* State 4 — the card becomes something to tick off. */}
              <div className="xf__action" aria-hidden={step < 3}>
                <span className="xf__check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="xf__actiontitle">{aadit.actions[0].title}</span>
                <span className="xf__actionmeta tnum">
                  Retest {aadit.priorities[0].retest.dueDate}
                </span>
              </div>
            </article>
          </div>

          {/* The four states, reachable directly. Scrolling is the default
              way through; this is for the second look. */}
          <div className="xf__ticks" role="tablist" aria-label="The four states of one result">
            {transform.states.map((st, i) => (
              <button
                key={st.cap}
                type="button"
                role="tab"
                aria-selected={i === step}
                className={`xf__tick ${i <= step ? 'is-on' : ''} ${i === step ? 'is-now' : ''}`}
                onClick={() => goTo(i)}
              >
                {st.cap}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
