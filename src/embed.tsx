/**
 * The embed entry. NEW FILE — no existing app file is modified.
 *
 * The website frames this document at the same origin (BRIEF.md Part 5.2,
 * Strategy 2, recorded in DECISIONS.md D2). Building the app to its own
 * document rather than mounting its components into the site is what gives
 * the site perfect CSS isolation for free, and — the part scoping could never
 * have fixed — lets the app's own `@media (max-width: 460px)` resolve against
 * the frame instead of the page, so it renders its phone layout rather than
 * drawing a second iPhone inside the site's.
 *
 * Three things this entry does that the app's own entry does not:
 *
 *   1. Runs as Meera (DECISIONS.md D3). She is the only persona for whom the
 *      website's screen 3 and screen 5 copy is true.
 *   2. Suppresses every price. Part 1.4 and Part 13 ban a price in any
 *      currency anywhere on the site, and once a visitor takes control she can
 *      reach the membership sheet and the booking flow in two taps.
 *   3. Accepts navigation from the parent frame, so `AppStage.show()` drives
 *      the real product.
 *
 * All three use only the app's already-exported public surface — `AppProvider`,
 * `useApp` — so nothing here is a fork of the app.
 */

import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import './styles/tokens.css'
import './styles/base.css'
import './styles/app.css'
import './styles/embed.css'
import { AppProvider, useApp, type SheetKind, type TabId } from './state/app'
import { PhoneFrame, StatusBar, TabBar } from './components/shell'
import SheetHost from './components/SheetHost'
import Home from './screens/Home'
import Health from './screens/Health'
import Action from './screens/Action'
import Profile from './screens/Profile'

const SCREENS = { home: Home, health: Health, action: Action, profile: Profile } as const

/** The website's five screen ids, mapped onto what actually renders them.
 *  Established in session0/DISCOVERY.md; three of the five are sheets. */
const ROUTES: Record<string, { tab: TabId; sheet?: SheetKind }> = {
  timeline: { tab: 'health', sheet: 'passport' },
  score: { tab: 'home' },
  priorities: { tab: 'action', sheet: 'nextup' },
  plan: { tab: 'action' },
  week12: { tab: 'action', sheet: 'readout' },
}

/** Sheets that display a price. Never opened in the embed. */
const PRICED_SHEETS: SheetKind[] = ['membership']

function Bridge() {
  const { persona, setPersona, setTab, openSheet, closeAllSheets, sheets, booking, closeBooking, p } =
    useApp()

  // Meera, before first paint of anything the visitor can read.
  useEffect(() => {
    setPersona('meera')
  }, [setPersona])

  /* The price gate. A guard rather than a fork: if anything in the app opens a
     priced surface, it is closed on the same tick, so the visitor never sees a
     rupee figure on the website. The booking modal is simply never rendered
     below, and this closes the state that would have opened it. */
  useEffect(() => {
    if (booking) closeBooking()
  }, [booking, closeBooking])

  useEffect(() => {
    const top = sheets[sheets.length - 1]
    if (top && PRICED_SHEETS.includes(top.kind)) closeAllSheets()
  }, [sheets, closeAllSheets])

  // Navigation from the parent frame. Same origin, so a hash is enough and
  // there is no handshake to fail.
  /* Gated on the persona actually being applied. setPersona resets the tab to
     home and clears the sheet stack, so navigating before it lands would be
     silently undone a tick later. */
  useEffect(() => {
    if (persona !== 'meera') return
    const apply = () => {
      const id = window.location.hash.replace(/^#\/?/, '')
      const route = ROUTES[id]
      if (!route) return
      closeAllSheets()
      setTab(route.tab)
      if (route.sheet) {
        // The sheet stack is cleared by setTab, so open on the next tick.
        window.setTimeout(() => {
          if (route.sheet === 'readout') {
            // The one sheet that needs an id: Meera's completed twelve-week
            // Vitamin D experiment, the only true before-and-after in the app.
            const done = p.experiments.find((e) => e.readout)
            if (done) openSheet('readout', done.id)
          } else {
            openSheet(route.sheet)
          }
        }, 60)
      }
    }
    apply()
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
  }, [persona, setTab, openSheet, closeAllSheets, p])

  return null
}

function EmbedShell() {
  const { tab } = useApp()
  const Screen = SCREENS[tab]
  return (
    <PhoneFrame>
      <StatusBar />
      <main className="screen__main">
        <Screen />
      </main>
      <TabBar />
      <SheetHost />
      <Bridge />
      {/* No <Booking /> and no <LaunchIntro />: the booking flow shows prices,
          and the launch overlay would play inside the website's phone frame
          during 7.5 Beat 2, which is exactly the "spinner" the brief forbids. */}
    </PhoneFrame>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <EmbedShell />
    </AppProvider>
  </StrictMode>,
)
