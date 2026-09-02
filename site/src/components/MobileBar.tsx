import { useEffect, useRef, useState } from 'react'
import { joinCta } from '../copy'
import { scrollToId, watchScrollY } from '../lib/scroll'
import { config } from '../site.config'
import { focusWaitlist } from './WaitlistForm'
import { Button } from './ui'
import './mobile-bar.css'

/* ── 8.15 · The mobile sticky action bar ──────────────────────────────────────
   Appears once the visitor has scrolled past section 8.2, and hides inside 8.11
   and 8.13 where the real action is already on screen. Scroll-position driven,
   never scroll-direction driven, so it can never flicker.
   ───────────────────────────────────────────────────────────────────────────── */

export function MobileBar() {
  const [visible, setVisible] = useState(false)
  const last = useRef(false)

  useEffect(() => {
    return watchScrollY((y) => {
      const after = document.getElementById('silent-build')
      const price = document.getElementById('price')
      const close = document.getElementById('close')
      if (!after || !price || !close) return

      const start = after.offsetTop + after.offsetHeight
      const hideFrom = price.offsetTop - window.innerHeight * 0.5
      const hideTo = close.offsetTop + close.offsetHeight

      const next = y > start && !(y > hideFrom && y < hideTo)
      if (next !== last.current) {
        last.current = next
        setVisible(next)
      }
    })
  }, [])

  return (
    <div className="mobile-bar" data-visible={visible ? 'true' : 'false'} aria-hidden={!visible}>
      <span className="t-caption mobile-bar__price">{config.price.barLabel}</span>
      <Button
        className="mobile-bar__cta"
        onClick={() => {
          scrollToId('close')
          window.setTimeout(focusWaitlist, 600)
        }}
      >
        {joinCta}
      </Button>
    </div>
  )
}
