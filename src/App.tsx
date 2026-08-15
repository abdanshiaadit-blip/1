import { useEffect, useRef, useState } from 'react'
import { AppProvider, useApp } from './state/app'
import { PhoneFrame, StatusBar, TabBar } from './components/shell'
import SheetHost from './components/SheetHost'
import Home from './screens/Home'
import Health from './screens/Health'
import Action from './screens/Action'
import Profile from './screens/Profile'
import Booking from './screens/Booking'
import LaunchIntro, { shouldPlayIntro } from './components/LaunchIntro'

const SCREENS = { home: Home, health: Health, action: Action, profile: Profile } as const

function Shell() {
  const { tab, booking, persona } = useApp()
  const Screen = SCREENS[tab]
  const [key, setKey] = useState(0)
  const first = useRef(true)
  // Decided once on mount so navigating tabs can never re-trigger it.
  const [intro] = useState(shouldPlayIntro)

  // Re-key on tab or persona change so entry animations replay.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setKey((k) => k + 1)
  }, [tab, persona])

  return (
    <PhoneFrame>
      <StatusBar />
      <main className="screen__main" key={key}>
        <Screen />
      </main>
      <TabBar />
      <SheetHost />
      {booking && <Booking />}
      {/* Additive overlay inside the existing `.screen`, so it inherits the
          device radius and safe areas. Unmounts itself when the sequence ends. */}
      {intro && <LaunchIntro />}
    </PhoneFrame>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
