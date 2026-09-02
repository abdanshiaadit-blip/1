/**
 * The device. BRIEF.md Parts 2.3, 2.6, 7.5.
 *
 * Dead upright. No tilt, no perspective, no reflection, no hand, no second
 * device. A 1px `hairline-lit` outline at 24px radius carrying the one shadow
 * token that exists on this site. Behind it, the single jade glow.
 *
 * The screen area is hard-clipped: nothing ever renders outside the frame.
 *
 * Frame dimensions derive from the 390x844 ratio, never the reverse — a screen
 * cropped by the frame means the frame was sized first, which is backwards.
 *
 * > The page is a dark measurement chamber. The app is the only lit object
 * > in it.
 *
 * That is the whole art direction in one sentence, and this component is where
 * it either happens or does not. The app's UI is light; on a near-black page
 * the embedded phone becomes the single light source and the product literally
 * glows.
 */

import type { ReactNode } from 'react'

interface Props {
  /** What sits on the screen: a poster image, or the live app's iframe. */
  children: ReactNode
  /**
   * The jade glow, 0–1. Ignited once as the frame locks (Part 7.5 Beat 1) and
   * then left alone — it is one of only three things on this site that move
   * without the visitor causing it.
   */
  glow?: number
  /** Beneath the frame, permanently. Part 1.4: none of the numbers shown
   *  belong to a real member, and the label says so on every plate. */
  sampleData?: boolean
  /** Beneath the label. "Take control", or on mobile "Open the app". */
  footer?: ReactNode
  className?: string
}

export default function DeviceFrame({
  children,
  glow = 1,
  sampleData = true,
  footer,
  className = '',
}: Props) {
  return (
    <div className={`device ${className}`}>
      {/* Light source 2 of 3. Radial, 900px, jade at 8%, blurred — behind the
          frame only, and the only glow anywhere on the site. */}
      <div className="device__glow" aria-hidden="true" style={{ opacity: glow }} />

      <div className="device__frame">
        <div className="device__screen">{children}</div>
      </div>

      {sampleData && (
        <p className="device__label t-telemetry">Sample data</p>
      )}
      {footer && <div className="device__footer">{footer}</div>}
    </div>
  )
}
