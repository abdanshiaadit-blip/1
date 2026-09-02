/**
 * 7.16 The header. BRIEF.md Part 7.16.
 *
 * 64px fixed, void at 88% with 12px backdrop blur, hairline bottom border
 * appearing only after 40px of scroll.
 *
 * The button is ghost until the hero has passed, then fills to jade-deep — a
 * 240ms crossfade of background-color and color only.
 *
 * No navigation menu. No hamburger. There are no other pages.
 *
 * Under the client's iOS direction the bar FLOATS (DECISIONS.md D13), which
 * means it no longer reserves its own space and spends its life over running
 * copy. So it gets out of the way: reading happens downward, and a bar sitting
 * on the headline you are reading is the whole complaint. It leaves on the way
 * down and comes back the moment you go up — which is also, exactly, what iOS
 * and Safari do. It never leaves while it holds focus, or a keyboard visitor
 * would tab into something they cannot see.
 */

import { useEffect, useState } from 'react'
import Button from './Button'
import { subscribe } from '../lib/raf'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const [away, setAway] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    return subscribe((y) => {
      setScrolled(y > 40)
      setPastHero(y > window.innerHeight * 0.8)
      /* 4px of deadband: a trackpad's idle jitter is a pixel or two, and a bar
         that flickers on the noise is worse than one that never moves. */
      const d = y - last
      if (Math.abs(d) > 4) {
        setAway(d > 0 && y > 240)
        last = y
      }
    })
  }, [])

  return (
    <header className={`hdr ${scrolled ? 'is-ruled' : ''} ${away ? 'is-away' : ''}`}>
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
