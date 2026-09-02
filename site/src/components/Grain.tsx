/**
 * The noise overlay. BRIEF.md Part 2.4.
 *
 * Dark gradients band on 8-bit displays, and banding is the commonest reason
 * a dark site looks cheap. A tiled 128x128 feTurbulence at 2.5% opacity in
 * `overlay` blend mode dithers every gradient on the page.
 *
 * Generated once as a data URI rather than fetched: it is under 300 bytes,
 * so a request for it would cost more than the bytes.
 *
 * Decorative in the strict Part 3.1 sense — aria-hidden, pointer-events:none,
 * and therefore invisible to the overlap test, which only walks content.
 */

export default function Grain() {
  return <div className="grain" aria-hidden="true" role="presentation" />
}
