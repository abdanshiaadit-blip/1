import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { profiles, type PersonaId } from '../data'
import type { Profile } from '../data/types'

export type TabId = 'home' | 'health' | 'action' | 'profile'

export type SheetKind =
  | 'intel'
  | 'loop'
  | 'priority'
  | 'nextup'
  | 'system'
  | 'biomarker'
  | 'experiment'
  | 'readout'
  | 'insight'
  | 'womens'
  | 'passport'
  | 'learnings'
  | 'careCircle'
  | 'careMember'
  | 'membership'
  | 'reports'
  | 'retest'
  | 'devices'
  | 'privacy'
  | 'history'
  | 'goals'
  | 'medical'

export interface SheetRef {
  kind: SheetKind
  id?: string
}

interface AppValue {
  persona: PersonaId
  setPersona: (p: PersonaId) => void
  p: Profile
  tab: TabId
  setTab: (t: TabId) => void
  sheets: SheetRef[]
  openSheet: (kind: SheetKind, id?: string) => void
  closeSheet: () => void
  closeAllSheets: () => void
  booking: boolean
  openBooking: (panelId?: string) => void
  closeBooking: () => void
  bookingPanel: string | undefined
  done: Record<string, boolean>
  toggleAction: (id: string) => void
}

const Ctx = createContext<AppValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaRaw] = useState<PersonaId>('aadit')
  const [tab, setTabRaw] = useState<TabId>('home')
  const [sheets, setSheets] = useState<SheetRef[]>([])
  const [booking, setBooking] = useState(false)
  const [bookingPanel, setBookingPanel] = useState<string | undefined>()
  const [done, setDone] = useState<Record<string, boolean>>({})

  const p = profiles[persona]

  const setPersona = useCallback((next: PersonaId) => {
    setPersonaRaw(next)
    setSheets([])
    setBooking(false)
    setDone({})
    setTabRaw('home')
  }, [])

  const setTab = useCallback((t: TabId) => {
    setSheets([])
    setTabRaw(t)
  }, [])

  const openSheet = useCallback((kind: SheetKind, id?: string) => {
    setSheets((s) => [...s, { kind, id }])
  }, [])

  const closeSheet = useCallback(() => setSheets((s) => s.slice(0, -1)), [])
  const closeAllSheets = useCallback(() => setSheets([]), [])

  const openBooking = useCallback((panelId?: string) => {
    setBookingPanel(panelId)
    setBooking(true)
  }, [])
  const closeBooking = useCallback(() => setBooking(false), [])

  const toggleAction = useCallback((id: string) => {
    setDone((d) => ({ ...d, [id]: !d[id] }))
  }, [])

  const value = useMemo<AppValue>(
    () => ({
      persona,
      setPersona,
      p,
      tab,
      setTab,
      sheets,
      openSheet,
      closeSheet,
      closeAllSheets,
      booking,
      openBooking,
      closeBooking,
      bookingPanel,
      done,
      toggleAction,
    }),
    [
      persona,
      setPersona,
      p,
      tab,
      setTab,
      sheets,
      openSheet,
      closeSheet,
      closeAllSheets,
      booking,
      openBooking,
      closeBooking,
      bookingPanel,
      done,
      toggleAction,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used inside AppProvider')
  return v
}

/* ---- Lookup helpers: keep screens free of find() noise ---------------- */

export function useLookups() {
  const { p } = useApp()
  return useMemo(
    () => ({
      marker: (id: string) => p.biomarkers.find((b) => b.id === id),
      system: (id: string) => p.systems.find((s) => s.id === id),
      priority: (id: string) => p.priorities.find((x) => x.id === id),
      experiment: (id: string) => p.experiments.find((x) => x.id === id),
      action: (id: string) => p.actions.find((x) => x.id === id),
      insight: (id: string) => p.insights.find((x) => x.id === id),
      member: (id: string) => p.careCircle.find((x) => x.id === id),
    }),
    [p],
  )
}
