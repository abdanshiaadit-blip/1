import { useProgress } from '../lib/hooks'
import { closing, legal } from '../content/product'

/* ==========================================================================
   12 · The last word.
   ========================================================================== */

export default function Closing() {
  const { ref, pinRef } = useProgress('pin')

  return (
    <section ref={ref} className="pinwrap end" aria-label="HUMAN">
      <div ref={pinRef} className="pin end__pin">
        <div className="wrap end__inner">
          <p className="end__lines">
            {closing.lines.map((l, i) => (
              <span key={l} className="end__line" style={{ '--i': i } as React.CSSProperties}>
                {l}
              </span>
            ))}
          </p>
          <span className="end__mark grad" aria-hidden="true">
            HUMAN
          </span>
          <p className="end__safety">{legal.safety}</p>
        </div>
      </div>
    </section>
  )
}
