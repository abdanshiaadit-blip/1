'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { NAV_LINKS } from '@/lib/content'
import { WaitlistButton } from '@/components/waitlist/WaitlistButton'

/**
 * §11.2 — a full-screen menu.
 *
 * Built on `<dialog>` so the background is inert, focus is trapped and
 * Escape closes, with focus returned to the menu button by the platform.
 * Body scroll locks via `overflow: hidden` and the scroll position is
 * restored on close — never `position: fixed` on body, which loses the
 * scroll position on iOS.
 */
export function MobileMenu({
  isOpen,
  onClose,
  pathname,
}: {
  isOpen: boolean
  onClose: () => void
  pathname: string
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return

    if (isOpen && !dialog.open) {
      const scrollY = window.scrollY
      dialog.showModal()
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
        window.scrollTo(0, scrollY)
      }
    }
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    const onCancel = (event: Event) => {
      event.preventDefault()
      onClose()
    }
    dialog.addEventListener('cancel', onCancel)
    return () => dialog.removeEventListener('cancel', onCancel)
  }, [onClose])

  return (
    <dialog ref={ref} id="mobile-menu" className="menu" aria-label="Menu">
      <div className="menu__inner">
        <div className="menu__top">
          <span className="nav__wordmark">HUMAN</span>
          <button type="button" className="menu__close t-small" onClick={onClose}>
            Close
          </button>
        </div>

        <nav className="menu__links" aria-label="Primary">
          {NAV_LINKS.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className="menu__link t-h3"
              style={{ animationDelay: `${index * 40}ms` }}
              aria-current={pathname === link.href ? 'page' : undefined}
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <WaitlistButton className="menu__cta" />
      </div>
    </dialog>
  )
}
