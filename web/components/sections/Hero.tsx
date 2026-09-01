'use client'

import { Button } from '@/components/ui/Button'
import { DeviceFrame } from '@/components/ui/DeviceFrame'
import { AppScreen } from '@/components/app-screens/screens'
import { hero, PROTOTYPE_URL } from '@/lib/content'

/**
 * 1 — Hero.
 *
 * The wordmark holds, alone, for the first third. Then it lifts and shrinks
 * away as the sentence resolves under it and the product rises from the
 * bottom of the frame. The wordmark is the only element on this site that
 * ends at opacity 0, and by then the header is carrying it.
 *
 * The two share one reserved box, so the hand-off cannot move anything, and
 * the wordmark has finished fading before the header's own appears.
 */
export function Hero() {
  return (
    <section className="scene hero" data-scene aria-labelledby="hero-h1">
      <div className="scene__pin hero__pin">
        <div className="hero__wash" aria-hidden="true" />

        <div className="hero__grid wrap">
          <div className="hero__top">
            <div className="reserve hero__swap">
              <p className="t-wordmark hero__mark" aria-hidden="true">
                {hero.wordmark}
              </p>
              <h1 id="hero-h1" className="t-hero hero__h1">
                {hero.h1}
              </h1>
            </div>

            <p className="t-lede hero__sub">{hero.sub}</p>

            <p className="t-label hero__chip">
              <span className="hero__chipdot" aria-hidden="true" />
              {hero.chip}
            </p>

            <div className="hero__btn">
              <Button href={PROTOTYPE_URL} external>
                {hero.cta}
              </Button>
            </div>
          </div>

          <div className="hero__stage">
            <DeviceFrame
              className="hero__device"
              label="The HUMAN app prototype, showing the Home screen"
            >
              <AppScreen id="home" />
            </DeviceFrame>
          </div>
        </div>

        <p className="t-label hero__scroll" aria-hidden="true">
          Scroll
        </p>
      </div>
    </section>
  )
}
