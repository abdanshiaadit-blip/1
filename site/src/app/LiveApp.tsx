/* ==========================================================================
   The real HUMAN app, running on the website.

   Nothing here re-creates the product. It imports the actual screens, the
   actual state container and the actual sheets from ../../../src and renders
   them at their native 390 × 844, scaled to fit. What a visitor sees on this
   page is the same code that runs in the prototype.

   PhoneFrame is deliberately not used: it is fixed to the viewport and it
   carries the persona switcher, which is a demo affordance rather than
   product UI. The site supplies its own hardware instead.
   ========================================================================== */

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { AppProvider, useApp, type SheetKind, type TabId } from '../../../src/state/app'
import type { PersonaId } from '../../../src/data'
import { StatusBar, TabBar } from '../../../src/components/shell'
import SheetHost from '../../../src/components/SheetHost'
import Booking from '../../../src/screens/Booking'
import Home from '../../../src/screens/Home'
import Health from '../../../src/screens/Health'
import Action from '../../../src/screens/Action'
import Profile from '../../../src/screens/Profile'

const SCREENS = { home: Home, health: Health, action: Action, profile: Profile } as const

const DEVICE_W = 390
const DEVICE_H = 844
/* The titanium bezel and its rings are drawn outside the 390 × 844 screen,
   so the fit has to leave room for them or the edges get clipped. */
const BEZEL = 32

/** What the website is allowed to ask the app to do. */
export interface AppHandle {
  readonly tab: TabId
  setTab(tab: TabId): void
  openSheet(kind: SheetKind, id?: string): void
  closeSheets(): void
  openBooking(panelId?: string): void
  closeBooking(): void
  setPersona(id: PersonaId): void
  /** Scroll whichever surface is currently on top — sheet, modal or screen. */
  scrollScreen(top: number, smooth?: boolean): void
}

/* ------------------------------------------------------------------ driver
   Lives inside the provider, renders nothing, and hands the surrounding site
   a stable handle onto the app's own state. This is why the site needs no
   changes to src/ at all. */

function Driver({
  onReady,
  hostRef,
}: {
  onReady?: (h: AppHandle) => void
  hostRef: React.RefObject<HTMLDivElement | null>
}) {
  const app = useApp()
  const live = useRef(app)
  live.current = app

  const handle = useRef<AppHandle | null>(null)
  if (!handle.current) {
    const topScroller = (): HTMLElement | null => {
      const host = hostRef.current
      if (!host) return null
      const layers = host.querySelectorAll<HTMLElement>('.sheet-layer .sheet__body')
      if (layers.length) return layers[layers.length - 1]
      return (
        host.querySelector<HTMLElement>('.modal__body') ??
        host.querySelector<HTMLElement>('.screen__main .scroll')
      )
    }

    handle.current = {
      get tab() {
        return live.current.tab
      },
      setTab: (t) => live.current.setTab(t),
      openSheet: (k, id) => live.current.openSheet(k, id),
      closeSheets: () => live.current.closeAllSheets(),
      openBooking: (id) => live.current.openBooking(id),
      closeBooking: () => live.current.closeBooking(),
      setPersona: (id) => live.current.setPersona(id),
      scrollScreen: (top, smooth = true) => {
        const el = topScroller()
        if (!el) return
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
        el.scrollTo({ top, behavior: smooth && !reduce ? 'smooth' : 'auto' })
      },
    }
  }

  useEffect(() => {
    if (handle.current) onReady?.(handle.current)
  }, [onReady])

  return null
}

/* ------------------------------------------------------------------- shell */

function Screens() {
  const { tab, booking, persona } = useApp()
  const Screen = SCREENS[tab]
  // Re-key on tab or persona so the app's own entry animations replay,
  // exactly as they do in the prototype.
  const [key, setKey] = useState(0)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setKey((k) => k + 1)
  }, [tab, persona])

  return (
    <>
      <StatusBar />
      <main className="screen__main" key={key}>
        <Screen />
      </main>
      <TabBar />
      <SheetHost />
      {booking && <Booking />}
    </>
  )
}

/* --------------------------------------------------------------- a11y
   The demo is a figure, not a second navigation. Assistive technology skips
   it — every claim it makes is also written in the prose beside it — and it
   is kept out of the tab order so a keyboard user is never dropped into a
   forty-control app in the middle of a page. Pointer and touch still work,
   and the real thing is always one link away. */

function useUntabbable(hostRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    // .scroll is included because Chrome makes overflow containers focusable
    // for keyboard scrolling even without a tabindex.
    const SEL =
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), .scroll'
    const sweep = () => {
      host.querySelectorAll<HTMLElement>(SEL).forEach((el) => {
        // The property reads -1 for an element Chrome makes focusable only
        // implicitly, so the attribute is what has to be checked and set.
        if (el.getAttribute('tabindex') !== '-1') el.setAttribute('tabindex', '-1')
      })
    }
    sweep()
    // Sheets and modals mount later, so keep watching.
    const mo = new MutationObserver(sweep)
    mo.observe(host, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [hostRef])
}

/* ------------------------------------------------------- hardware + scaling
   The app is laid out at exactly the size it was designed for and then
   scaled as one layer, so no breakpoint inside the product is ever crossed
   by the website's viewport. */

function useFitScale(
  outer: React.RefObject<HTMLDivElement | null>,
  maxScale: number,
) {
  useLayoutEffect(() => {
    const node = outer.current
    const parent = node?.parentElement
    if (!node || !parent) return

    const apply = () => {
      const r = parent.getBoundingClientRect()
      if (!r.width || !r.height) return
      const k = Math.min(
        r.width / (DEVICE_W + BEZEL),
        r.height / (DEVICE_H + BEZEL),
        maxScale,
      )
      node.style.setProperty('--k', Math.max(0.2, k).toFixed(4))
    }

    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(parent)
    return () => ro.disconnect()
  }, [outer, maxScale])
}

export function DeviceShell({
  children,
  maxScale = 1,
  className = '',
  glow = false,
  label,
}: {
  children: ReactNode
  maxScale?: number
  className?: string
  glow?: boolean
  label?: string
}) {
  const outer = useRef<HTMLDivElement>(null)
  useFitScale(outer, maxScale)

  return (
    <div
      ref={outer}
      className={`hd ${className}`}
      {...(label ? { role: 'img', 'aria-label': label } : {})}
    >
      {glow && <span className="hd__glow" aria-hidden="true" />}
      <div className="hd__body">
        <span className="hd__btn hd__btn--silent" aria-hidden="true" />
        <span className="hd__btn hd__btn--up" aria-hidden="true" />
        <span className="hd__btn hd__btn--down" aria-hidden="true" />
        <span className="hd__btn hd__btn--power" aria-hidden="true" />
        <div className="hd__scale">{children}</div>
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- LiveApp */

export default function LiveApp({
  onReady,
  maxScale = 1,
  className = '',
  label = 'The HUMAN app running live',
}: {
  onReady?: (h: AppHandle) => void
  maxScale?: number
  className?: string
  label?: string
}) {
  const host = useRef<HTMLDivElement>(null)
  useUntabbable(host)

  return (
    <DeviceShell maxScale={maxScale} className={className} label={label}>
      {/* aria-hidden sits here, one level below the labelled figure, so the
          device announces as a single image and the app inside it is not
          re-announced control by control. */}
      <div ref={host} className="screen hd__screen" aria-hidden="true">
        <AppProvider>
          <Driver onReady={onReady} hostRef={host} />
          <Screens />
        </AppProvider>
      </div>
    </DeviceShell>
  )
}
