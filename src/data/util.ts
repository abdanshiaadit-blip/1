/** Expand a compact "1101…" adherence string to a fixed-length array.
 *  Days beyond the string are `null` — not yet reached. */
export function adherence(bits: string, total: number): (boolean | null)[] {
  return Array.from({ length: total }, (_, i) => (i < bits.length ? bits[i] === '1' : null))
}
