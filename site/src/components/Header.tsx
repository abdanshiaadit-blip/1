/**
 * 7.16 The header. BRIEF.md Part 7.16.
 *
 * 64px fixed, void at 88% with 12px backdrop blur, hairline bottom border
 * appearing only after 40px of scroll.
 *
 * The button is ghost until the hero has passed, then fills to jade-deep — a
 * 240ms crossfade of background-color and color only. **Nothing moves.**
 *
 * No navigation menu. No hamburger. There are no other pages.
 */

import { useEffect, useState } from 'react'
import Button from './Button'
import { subscribe } from '../lib/raf'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)

  useEffect(
    () =>
      subscribe((y) => {
        setScrolled(y > 40)
        setPastHero(y > window.innerHeight * 0.8)
      }),
    [],
  )

  return (
    <header className={`hdr ${scrolled ? 'is-ruled' : ''}`}>
      <div className="hdr__in">
        <a className="hdr__mark" href="#top">
          HUMAN
        </a>
        <span className="t-telemetry hdr__tag">Know earlier. Act sooner.</span>
        <Button variant={pastHero ? 'primary' : 'ghost'} onClick={goToWaitlist} className="hdr__cta">
          Join the waitlist
        </Button>
      </div>
    </header>
  )
}

export function goToWaitlist() {
  document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  window.setTimeout(() => document.getElementById('whatsapp')?.focus(), 700)
}
