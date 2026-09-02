/**
 * 7.15 Mobile sticky action bar. BRIEF.md Part 7.15.
 *
 * Appears after 7.2, hides inside 7.13. Scroll-POSITION driven, not
 * scroll-direction driven, so it never flickers. Never bounces.
 */

import { useEffect, useState } from 'react'
import Button from './Button'
import { goToWaitlist } from './Header'
import { PROTOTYPE_URL } from '../lib/constants'
import { subscribe } from '../lib/raf'

export default function MobileBar() {
  const [show, setShow] = useState(false)

  useEffect(
    () =>
      subscribe(() => {
        const after = document.querySelector('[data-section="ledger"]')
        const before = document.querySelector('[data-section="close"]')
        if (!after || !before) return
        const started = after.getBoundingClientRect().top < window.innerHeight * 0.5
        const ended = before.getBoundingClientRect().top < window.innerHeight * 0.9
        setShow(started && !ended)
      }),
    [],
  )

  return (
    <div className={`mbar ${show ? 'is-on' : ''}`} aria-hidden={!show}>
      <Button variant="ghost" href={PROTOTYPE_URL} className="mbar__ghost">
        Try the prototype
      </Button>
      <Button variant="primary" onClick={goToWaitlist} className="mbar__cta">
        Join the waitlist
      </Button>
    </div>
  )
}
