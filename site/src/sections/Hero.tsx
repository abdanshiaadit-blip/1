import { useProgress, usePointerParallax, useNearViewport } from '../lib/hooks'
import LiveApp from '../app/LiveApp'
import { hero, PROTOTYPE_URL } from '../content/product'

/* ==========================================================================
   01 · Hero — 300vh, sticky.

   Three movements against one pinned panel:
     0 – 22%   HUMAN alone. A title card, held long enough to be one.
     22 – 48%  The wordmark shrinks toward the nav position while the promise
               resolves out of blur beneath it.
     48 – 100% The device assembles out of its own glow, and the product —
               the real one — starts running inside it.

   Nothing here fades one thing out and another in. The wordmark that leaves
   is the wordmark that arrives in the navigation bar.
   ========================================================================== */

export default function Hero() {
  const { ref, pinRef } = useProgress('pin')
  const tilt = usePointerParallax<HTMLDivElement>(1)
  const { ref: mountRef, near } = useNearViewport<HTMLDivElement>('30%')

  return (
    <section ref={ref} className="pinwrap hu-hero" id="top" aria-labelledby="hero-title">
      <div ref={pinRef} className="pin hu-hero__pin">
        {/* Movement one — the brand, alone. */}
        <div className="hu-hero__markwrap" aria-hidden="true">
          <span className="hu-hero__mark">{hero.wordmark}</span>
        </div>

        {/* Movement two — the line it exists for. */}
        <div className="hu-hero__copy">
          <h1 id="hero-title" className="hu-hero__title display">
            {hero.promise}
          </h1>
          <p className="hu-hero__sub lead">{hero.sub}</p>
          <div className="hu-hero__actions">
            <a className="hu-btn" href={PROTOTYPE_URL} target="_blank" rel="noreferrer noopener">
              Explore the prototype
              <span className="hu-btn__arrow" aria-hidden="true">→</span>
            </a>
            <a className="hu-btn hu-btn--quiet" href="#how">
              See how it works
            </a>
          </div>
        </div>

        {/* Movement three — the product arrives. */}
        <div ref={mountRef} className="hu-hero__stage">
          <div ref={tilt} className="hu-hero__device">
            {near && <LiveApp className="hd--tilt" maxScale={0.86} label="The HUMAN app — Home" />}
          </div>
        </div>

        <div className="hu-hero__hint" aria-hidden="true">
          <span>{hero.scrollHint}</span>
          <span className="hu-hero__hintline" />
        </div>
      </div>
    </section>
  )
}
