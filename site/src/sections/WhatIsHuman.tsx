import { useProgress, useReveal } from '../lib/hooks'
import Words from '../components/Words'
import { what } from '../content/product'

/* ==========================================================================
   04 · What is HUMAN — a rhythm break.

   Two long sticky sections in a row will exhaust anyone, so this one simply
   scrolls. A rail draws itself down six plain sentences on the left; on the
   right, the product's actual information architecture — four tabs, each
   answering one question. That is a real and unusual product decision, so it
   is worth stating rather than decorating.
   ========================================================================== */

export default function WhatIsHuman() {
  const { ref } = useProgress<HTMLOListElement>('through')
  const head = useReveal<HTMLDivElement>()

  return (
    <section className="hu-sec what" aria-labelledby="what-title">
      <div className="wrap">
        <div ref={head.ref} className={`what__head headrev ${head.shown ? 'in' : ''}`}>
          <span className="cap">{what.eyebrow}</span>
          <Words
            as="h2"
            id="what-title"
            className="display what__title"
            text={what.title}
            shown={head.shown}
          />
          <p className="lead what__lead">{what.lead}</p>
        </div>

        <div className="what__grid">
          <ol ref={ref} className="rail">
            {what.steps.map((s, i) => (
              <li key={s.k} className="rail__i" style={{ '--i': i } as React.CSSProperties}>
                <span className="rail__n tnum" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="rail__dot" aria-hidden="true" />
                <div className="rail__body">
                  <h3 className="rail__k">{s.k}</h3>
                  <p className="rail__v">{s.v}</p>
                </div>
              </li>
            ))}
          </ol>

          <aside className="tabs">
            <div className="tabs__card">
              <span className="cap">Four tabs, no more</span>
              <p className="tabs__note">
                Every screen in HUMAN answers one of four questions. If something answers none of
                them, it doesn’t get built.
              </p>
              <ul className="tabs__list">
                {what.tabs.map((t) => (
                  <li key={t.name} className="tabs__row">
                    <span className="tabs__name">{t.name}</span>
                    <span className="tabs__q">{t.q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
