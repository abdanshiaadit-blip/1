import { useEffect, useRef, useState } from 'react'
import { joinCta, tagline } from '../copy'
import { scrollToId } from '../lib/scroll'
import { watchScrollY } from '../lib/scroll'
import { focusWaitlist } from './WaitlistForm'
import { Button, Wordmark } from './ui'
import './header.css'

/* ── The header · spec 3.7 ────────────────────────────────────────────────────
   A single fixed bar, 64px, paper at 88% with a 12px backdrop blur, and a
   hairline bottom border that only appears once the page has scrolled past 40px.
   No navigation menu. There are no other pages. Do not build a hamburger.
   ───────────────────────────────────────────────────────────────────────────── */

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const state = useRef({ scrolled: false, pastHero: false })

  useEffect(() => {
    return watchScrollY((y) => {
      const hero = document.getElementById('opening')
      /* Derived from the hero's own height, never a guessed pixel value. */
      const heroEnd = hero ? hero.offsetHeight - 64 : window.innerHeight

      const nextScrolled = y > 40
      const nextPast = y > heroEnd

      if (nextScrolled !== state.current.scrolled) {
        state.current.scrolled = nextScrolled
        setScrolled(nextScrolled)
      }
      if (nextPast !== state.current.pastHero) {
        state.current.pastHero = nextPast
        setPastHero(nextPast)
      }
    })
  }, [])

  return (
    <header className="header" data-scrolled={scrolled ? 'true' : 'false'}>
      <div className="header__inner page">
        <a
          className="header__mark"
          href="#opening"
          onClick={(e) => {
            e.preventDefault()
            scrollToId('opening')
          }}
        >
          <Wordmark />
          <span className="sr-only">HUMAN — home</span>
        </a>

        {/* spec 3.7: the tagline appears here and once at the very end. Desktop only. */}
        <p className="header__tagline t-micro">{tagline}</p>

        <Button
          variant={pastHero ? 'primary' : 'ghost'}
          className="header__cta"
          onClick={() => {
            scrollToId('close')
            window.setTimeout(focusWaitlist, 600)
          }}
        >
          {joinCta}
        </Button>
      </div>
    </header>
  )
}
