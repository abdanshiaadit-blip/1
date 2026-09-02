'use client'

import { useEffect, useRef } from 'react'
import { WaitlistForm } from './WaitlistForm'

/**
 * §11.3 — the modal.
 *
 * Built on the native `<dialog>`, which gives an inert background, a real
 * focus trap, Escape-to-close and focus returned to the trigger without
 * hand-rolling any of it. Backdrop click closes. Body scroll is locked
 * while it is open, and the scroll position is preserved.
 */
export function WaitlistModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      dialog.querySelector<HTMLInputElement>('input:not([type="hidden"]):not([tabindex="-1"])')?.focus()
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
    <dialog
      ref={ref}
      className="wl-modal"
      aria-labelledby="wl-modal-title"
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
    >
      <div className="wl-modal__panel">
        <button type="button" className="wl-modal__close t-small" onClick={onClose}>
          Close
        </button>
        <h2 id="wl-modal-title" className="t-h2">
          Join the founding cohort
        </h2>
        <p className="t-body measure-body wl-modal__lede">
          We’re opening a small first group. Leave your details and we’ll message you on WhatsApp when a
          place is available.
        </p>
        <WaitlistForm source="modal" onDone={onClose} />
      </div>
    </dialog>
  )
}
