import { SCOPE_TEXT } from '@/lib/content'

/** §6.6 — a standing component. Sections 07, 08, 09, 10 and the footer. */
export function ScopeLine() {
  return <p className="scope-line t-caption">{SCOPE_TEXT}</p>
}
