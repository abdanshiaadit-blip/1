'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { NAV_LINKS } from '@/lib/content'
import { useMotionEffect, type Motion } from '@/lib/animation'
import { WaitlistButton } from '@/components/waitlist/WaitlistButton'
import { MobileMenu } from './MobileMenu'

/** On the home page each nav link stands for a section; the active
 *  underline follows whichever of them holds the viewport centre. */
const SECTION_FOR_LINK: Record<string, string> = {
  '/how-it-works': '05-loop',
  '/what-we-test': '06-panel',
  '/why-preventive': '03-scale',
  '/about': '14-people',
}

export function Nav() {
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // §11.1 — scrolled state, hide-on-scroll-down, and the dark-section swap.
  // All three read scroll through ScrollTrigger, which is the only scroll
  // authority on the site (Law 2). No scroll listeners anywhere.
  useMotionEffect(({ ScrollTrigger }: Motion) => {
    const nav = navRef.current
    if (!nav) return

    let lastY = window.scrollY
    let hiddenSince = 0

    const main = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 0,
      end: 'max',
      onUpdate: () => {
        const y = window.scrollY
        nav.dataset.scrolled = y > 80 ? 'true' : 'false'

        if (y < 80) {
          nav.dataset.hidden = 'false'
        } else if (y > 600) {
          if (y > lastY) {
            hiddenSince += y - lastY
            if (hiddenSince > 80) nav.dataset.hidden = 'true'
          } else {
            hiddenSince = 0
            nav.dataset.hidden = 'false'
          }
        }
        lastY = y
      },
    })

    // §11.1 — never let dark-on-dark or light-on-light occur. Each dark
    // section owns a trigger over the band the nav occupies.
    const dark = new Set<Element>()
    const darkTriggers = Array.from(document.querySelectorAll('[data-nav-dark]')).map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: 'top top+=64',
        end: 'bottom top+=64',
        onToggle: (self) => {
          if (self.isActive) dark.add(section)
          else dark.delete(section)
          nav.dataset.overDark = dark.size > 0 ? 'true' : 'false'
        },
      }),
    )

    // §11.1 — active link, updated by ScrollTrigger rather than a listener.
    const activeTriggers = Object.entries(SECTION_FOR_LINK)
      .map(([href, id]) => {
        const section = document.getElementById(id)
        if (!section) return null
        return ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) nav.dataset.active = href
            else if (nav.dataset.active === href) nav.dataset.active = ''
          },
        })
      })
      .filter(Boolean) as ReturnType<typeof ScrollTrigger.create>[]

    return () => {
      main.kill()
      darkTriggers.forEach((t) => t.kill())
      activeTriggers.forEach((t) => t.kill())
    }
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) menuButtonRef.current?.focus()
  }, [menuOpen])

  return (
    <>
      <header ref={navRef} className="nav" data-scrolled="false" data-hidden="false" data-over-dark="false">
        <div className="nav__inner container-h">
          <Link href="/" className="nav__wordmark">
            HUMAN
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav__link t-small"
                data-href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav__cta">
            <WaitlistButton className="nav__button" />
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="nav__menu-button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <span className="sr-only-h">Open menu</span>
            <span aria-hidden="true" className="nav__menu-bar" />
            <span aria-hidden="true" className="nav__menu-bar" />
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </>
  )
}
