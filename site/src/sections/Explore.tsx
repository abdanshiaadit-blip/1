import { useMediaQuery, useNearViewport, useReveal } from '../lib/hooks'
import LiveApp from '../app/LiveApp'
import { explore, PROTOTYPE_URL } from '../content/product'

/* ==========================================================================
   11 · Explore — the CTA.

   One button on near-black with nothing competing, and the product itself
   still running behind it. The last thing you touch on this page should feel
   like the most expensive thing on it.
   ========================================================================== */

export default function Explore() {
  const { ref: mountRef, near } = useNearViewport<HTMLDivElement>('30%')
  const head = useReveal<HTMLDivElement>()
  // Purely atmospheric here — not worth a second app instance on a phone.
  const roomy = useMediaQuery('(min-width: 900px)')

  return (
    <section className="hu-sec cta" id="explore" aria-labelledby="cta-title">
      <div ref={mountRef} className="cta__bg" aria-hidden="true">
        {near && roomy && <LiveApp maxScale={0.7} label="" className="cta__device" />}
      </div>

      <div className="wrap cta__wrap">
        <div ref={head.ref} className={`cta__inner rev ${head.shown ? 'in' : ''}`}>
          <span className="cap">{explore.eyebrow}</span>
          <h2 id="cta-title" className="display cta__title">
            {explore.title}
          </h2>
          <p className="lead cta__lead">{explore.lead}</p>

          <a
            className="hu-btn cta__btn"
            href={PROTOTYPE_URL}
            target="_blank"
            rel="noreferrer noopener"
          >
            {explore.cta}
            <span className="hu-btn__arrow" aria-hidden="true">→</span>
          </a>

          <p className="cta__note">{explore.note}</p>
        </div>
      </div>
    </section>
  )
}
