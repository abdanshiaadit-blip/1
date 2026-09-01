import { useProgress } from '../lib/hooks'
import { philosophy } from '../content/product'

/* ==========================================================================
   09 · The philosophy — 180vh, type only.

   The only section on the site with nothing moving but the words. Two lines
   arriving slowly, with more space around them than feels comfortable. The
   restraint is the point.
   ========================================================================== */

export default function Philosophy() {
  const { ref, pinRef } = useProgress('pin')

  return (
    <section ref={ref} className="pinwrap philo" aria-labelledby="philo-title">
      <div ref={pinRef} className="pin philo__pin">
        <div className="wrap">
          <h2 id="philo-title" className="philo__lines">
            {philosophy.lines.map((l, i) => (
              <span key={l} className="philo__line" style={{ '--i': i } as React.CSSProperties}>
                {l}
              </span>
            ))}
          </h2>
          <p className="philo__sub">{philosophy.sub}</p>
        </div>
      </div>
    </section>
  )
}
