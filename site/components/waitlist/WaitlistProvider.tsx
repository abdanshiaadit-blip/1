'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { WaitlistModal } from './WaitlistModal'

type WaitlistState = {
  open: () => void
  close: () => void
  isOpen: boolean
}

const Ctx = createContext<WaitlistState | null>(null)

/**
 * §11.3 — the waitlist CTA appears in five places and opens one modal.
 * `/waitlist` remains a real page for direct links and for no-JS.
 */
export function WaitlistProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen])

  return (
    <Ctx.Provider value={value}>
      {children}
      <WaitlistModal isOpen={isOpen} onClose={close} />
    </Ctx.Provider>
  )
}

export function useWaitlist(): WaitlistState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useWaitlist must be used inside <WaitlistProvider>')
  return ctx
}
