/**
 * The section wash. BRIEF.md Part 2.3, light source 3 of 3.
 *
 * A barely perceptible radial from `#0A211B` at 40% of viewport height out to
 * `void` at the edges. Under 10% luminance range across a full viewport — it
 * should be almost impossible to point at, and if you can point at it, it is
 * too strong.
 *
 * Exactly three light sources exist on this page: the phone screen, one jade
 * glow behind the phone, and this. A fourth is how the site becomes the
 * generic dark site.
 *
 * Sits at `--z-wash` behind everything, inside a `position: relative` parent.
 */

export default function SectionWash() {
  return <div className="wash" aria-hidden="true" role="presentation" />
}
