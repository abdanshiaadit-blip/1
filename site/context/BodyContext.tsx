'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Body } from '@/lib/content'

type BodyState = {
  body: Body
  setBody: (next: Body) => void
}

const BodyCtx = createContext<BodyState | null>(null)

/**
 * §11.4 — the Body toggle's state. Session-scoped, defaulting to Women.
 * Both toggle instances (sections 06 and 12) read and write this, so they
 * stay in sync. Nothing else on the site reacts to it.
 */
export function BodyProvider({ children }: { children: ReactNode }) {
  const [body, setBody] = useState<Body>('women')
  const value = useMemo(() => ({ body, setBody }), [body])
  return <BodyCtx.Provider value={value}>{children}</BodyCtx.Provider>
}

export function useBody(): BodyState {
  const ctx = useContext(BodyCtx)
  if (!ctx) throw new Error('useBody must be used inside <BodyProvider>')
  return ctx
}
