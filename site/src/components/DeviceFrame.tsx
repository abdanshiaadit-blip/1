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

import { useEffect, useRef, type ReactNode } from 'react'

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
  /**
   * The mobile annotation lane (Part 7.5.1). There is no gutter on a phone —
   * the frame is most of the viewport — so the label sits in a reserved lane
   * directly beneath the frame instead. **The lane's height is reserved
   * whether or not an annotation is present**, so nothing below it ever
   * shifts and CLS stays at 0.00.
   */
  lane?: ReactNode
  /**
   * The annotation layer. Rendered as a sibling of the frame, spanning the
   * whole device cell — NOT inside the screen. The label belongs in the
   * cell's gutter beside the phone (Part 7.5.1); inside the screen it would
   * be clipped to the glass and land on top of the app.
   */
  annotations?: ReactNode
  className?: string
}

export default function DeviceFrame({
  children,
  glow = 1,
  sampleData = true,
  footer,
  lane,
  annotations,
  className = '',
}: Props) {
  const stage = useRef<HTMLDivElement>(null)

  /* The screen is rendered at exactly 390x844 and scaled to fit, so the live
     app lays out identically to the authored plates. Without this the iframe
     is its own viewport at whatever the frame happens to be, the app reflows,
     and the annotation anchors drift off their targets in LIVE while looking
     correct in DEGRADED — the failure mode Part 7.5.1 calls out by name.
     Measured rather than derived, because CSS cannot divide a length by a
     length to produce the unitless number scale() needs. */
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const screen = el.querySelector<HTMLElement>('.device__screen')
    if (!screen) return
    const ro = new ResizeObserver(() => {
      el.style.setProperty('--screen-scale', String(screen.clientWidth / 390))
    })
    ro.observe(screen)
    return () => ro.disconnect()
  }, [])

  return (
    <div className={`device ${className}`}>
      {/* Light source 2 of 3. Radial, 900px, jade at 8%, blurred — behind the
          frame only, and the only glow anywhere on the site. */}
      <div className="device__glow" aria-hidden="true" style={{ opacity: glow }} />

      {/* Spans the full width of the device cell with the frame centred in
          it, so the annotation layer has the gutter either side that Part
          7.5.1 places its labels in. */}
      <div className="device__stage" ref={stage}>
        <div className="device__frame">
          <div className="device__screen">{children}</div>
        </div>
        {annotations && <div className="device__annos">{annotations}</div>}
      </div>

      {lane !== undefined && <div className="device__lane t-telemetry">{lane}</div>}

      {sampleData && (
        <p className="device__label t-telemetry">Sample data</p>
      )}
      {footer && <div className="device__footer">{footer}</div>}
    </div>
  )
}
