'use client'

import { useRef } from 'react'
import { Phone } from '@/components/app-showcase/Phone'
import { WaitlistButton } from '@/components/waitlist/WaitlistButton'
import { useMotionEffect } from '@/lib/animation'

/** The load sequence runs once per page load, never again on a
 *  client-side navigation back to `/` (§01 engineering notes). */
let hasPlayed = false

export function Hero() {
  const root = useRef<HTMLElement>(null)

  useMotionEffect(({ gsap }) => {
    const node = root.current
    if (!node || hasPlayed) return
    hasPlayed = true

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        // §01 — the one orchestrated load sequence on the site. Written as
        // from(), so every element's resting state is its final one and a
        // failed script leaves the hero correctly composed.
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.from('.nav__wordmark', { opacity: 0, duration: 0.4 }, 0)
          .from('[data-hero-headline]', { opacity: 0, y: 20, duration: 0.72 }, 0.12)
          .from('[data-hero-lede]', { opacity: 0, y: 20, duration: 0.64 }, 0.34)
          .from('[data-hero-cta]', { opacity: 0, y: 20, duration: 0.48 }, 0.56)
          .from('[data-hero-note]', { opacity: 0, duration: 0.4 }, 0.7)
          .from('[data-hero-phone]', { opacity: 0, y: 40, duration: 0.9 }, 0.48)
      }, node)
      return () => ctx.revert()
    })
    return () => mm.revert()
  })

  return (
    <section id="01-hero" ref={root} className="hero bg-paper-section">
      <div className="hero__inner container-h">
        <div className="hero__text">
          <h1 className="t-display hero__headline" data-hero-headline>
            Know earlier. Act sooner.
          </h1>
          <p className="t-lead measure-lead hero__lede" data-hero-lede>
            Most serious illness in India builds quietly for years before it hurts. A blood test would find
            it. HUMAN tests you at home, tells you the three things worth fixing, and comes back at week 12
            to check that they moved.
          </p>
          <div className="hero__cta" data-hero-cta>
            <WaitlistButton />
            <span className="t-small hero__cta-note">Opening to a small founding group</span>
          </div>
          <p className="t-caption hero__note" data-hero-note>
            A working app. Not yet open to everyone.
          </p>
        </div>

        {/* The phone rises from the bottom edge. It is a plain Phone, never
            the sticky rail, and it is not interactive here. */}
        <div className="hero__phone-window" data-hero-phone>
          <Phone screen="s1-home" priority className="hero__phone" />
        </div>
      </div>
    </section>
  )
}
