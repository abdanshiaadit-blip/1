import type { ReactNode } from 'react'
import { useApp, type TabId } from '../state/app'
import { profiles, type PersonaId } from '../data'

/* ------------------------------------------------------------ Status bar */

export function StatusBar() {
  return (
    <div className="statusbar">
      <span className="statusbar__time num">9:41</span>
      <div className="island" aria-hidden="true" />
      <span className="statusbar__right" aria-hidden="true">
        <svg width="17" height="11" viewBox="0 0 17 11">
          <rect x="0" y="7" width="3" height="4" rx="1" fill="currentColor" />
          <rect x="4.6" y="5" width="3" height="6" rx="1" fill="currentColor" />
          <rect x="9.2" y="2.6" width="3" height="8.4" rx="1" fill="currentColor" />
          <rect x="13.8" y="0" width="3" height="11" rx="1" fill="currentColor" opacity=".4" />
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11">
          <path
            d="M8 9.6l1.9-2.1a2.7 2.7 0 00-3.8 0L8 9.6zM8 5.1c1.4 0 2.7.5 3.7 1.5l1.4-1.5A7.4 7.4 0 008 3a7.4 7.4 0 00-5.1 2.1l1.4 1.5A5.3 5.3 0 018 5.1zM8 1c2.3 0 4.4.9 6 2.4l1.4-1.5A10.4 10.4 0 008-1 10.4 10.4 0 00.6 1.9L2 3.4A8.4 8.4 0 018 1z"
            fill="currentColor"
            transform="translate(0,1)"
          />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12">
          <rect x="0.5" y="0.5" width="20" height="11" rx="3.2" stroke="currentColor" fill="none" opacity=".45" />
          <rect x="2.2" y="2.2" width="15.5" height="7.6" rx="1.9" fill="currentColor" />
          <path d="M22.4 4v4a2.1 2.1 0 000-4z" fill="currentColor" opacity=".45" />
        </svg>
      </span>
    </div>
  )
}

/* ---------------------------------------------------------------- Tab bar */

const ICONS: Record<TabId, ReactNode> = {
  home: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="3.4" />
    </>
  ),
  health: (
    <path d="M3 12.4h3.6l1.7-4.1 2.6 8.6 2.3-6.2 1.4 3.3 1.6-1.6H21" strokeLinecap="round" strokeLinejoin="round" />
  ),
  action: (
    <>
      <path d="M4.5 12.6l4.6 4.6L19.5 6.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8.2" r="3.9" />
      <path d="M4.8 20c1.1-3.7 3.9-5.6 7.2-5.6s6.1 1.9 7.2 5.6" strokeLinecap="round" />
    </>
  ),
}

const LABELS: Record<TabId, string> = {
  home: 'Home',
  health: 'Health',
  action: 'Action',
  profile: 'Profile',
}

export function TabBar() {
  const { tab, setTab } = useApp()
  const tabs: TabId[] = ['home', 'health', 'action', 'profile']
  return (
    <nav className="tabbar" role="tablist">
      {tabs.map((t) => (
        <button
          key={t}
          type="button"
          role="tab"
          aria-selected={tab === t}
          className={`tabbar__b ${tab === t ? 'is-on' : ''}`}
          onClick={() => setTab(t)}
        >
          <svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="1.8">
            {ICONS[t]}
          </svg>
          <span>{LABELS[t]}</span>
        </button>
      ))}
      <div className="homebar" aria-hidden="true" />
    </nav>
  )
}

/* ------------------------------------------------------- Persona switcher
   Demo affordance only. Lives on the desktop backdrop, OUTSIDE the device,
   so it never appears inside the product UI.                              */

export function PersonaSwitch() {
  const { persona, setPersona } = useApp()
  const ids: PersonaId[] = ['aadit', 'meera']
  return (
    <aside className="switcher" aria-label="Prototype persona">
      <div className="switcher__cap">Viewing as</div>
      {ids.map((id) => {
        const u = profiles[id].user
        return (
          <button
            key={id}
            type="button"
            className={`switcher__b ${persona === id ? 'is-on' : ''}`}
            onClick={() => setPersona(id)}
          >
            <span className="switcher__name">{u.name}</span>
            <span className="switcher__meta">
              {u.age} · {u.sex === 'male' ? 'M' : 'F'} · {u.city}
            </span>
          </button>
        )
      })}
      <p className="switcher__note">
        Two members, one product. HUMAN is unisex — women's longitudinal health is a first-class
        pillar, not a separate app.
      </p>
    </aside>
  )
}

/* ----------------------------------------------------------- Phone frame */

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="stage">
      <PersonaSwitch />
      <div className="device">
        <span className="device__btn device__btn--silent" />
        <span className="device__btn device__btn--up" />
        <span className="device__btn device__btn--down" />
        <span className="device__btn device__btn--power" />
        <div className="screen">{children}</div>
      </div>
    </div>
  )
}
