/**
 * Boots the Liquid Glass runtime. DECISIONS.md D14.
 *
 * Renders nothing. Mounted once, at the root, because both halves of the
 * runtime are page-wide by design: one delegated pointer listener for the
 * specular, and one observer pair that sizes a refraction filter to each
 * surface as it appears or resizes.
 *
 * Every glass surface is complete without this component. If it never mounts —
 * JS disabled, an old browser, a visitor who has asked for reduced
 * transparency — the CSS still paints the fill, the blur, the rim and the
 * lighting. The runtime only adds the two things a stylesheet cannot express:
 * refraction sized to the element, and a highlight that follows the pointer.
 */

import { useEffect } from 'react'
import { autoLens, trackSpecular } from '../lib/glass'

export default function Glass() {
  useEffect(() => {
    /* Reduced transparency is a request for a solid surface, not a dimmer one.
       Neither optic runs, and the CSS media query takes the material down to
       an opaque fill at the same time. */
    const quiet = window.matchMedia('(prefers-reduced-transparency: reduce)')
    if (quiet.matches) return
    const stopLens = autoLens()
    /* A highlight that follows the cursor is motion, and the CSS half of the
       reduced-motion fallback only removed its EASING — which left the
       highlight jumping from position to position, more movement per frame
       rather than less. The tracking itself has to stop. Refraction is not
       motion and stays. */
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const stopSpec = still.matches ? () => {} : trackSpecular()
    return () => {
      stopLens()
      stopSpec()
    }
  }, [])

  return null
}
