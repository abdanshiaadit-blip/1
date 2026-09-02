/**
 * Annotation anchors — BRIEF.md Part 7.5.1, authored in Session 0 from the
 * real plates in session0/app-screens-meera/ (Part 5.1 item 8).
 *
 * STAGED, NOT WIRED. This file's home is `src/config/annotations.ts` inside
 * the site project, which does not exist until the repo-layout question in
 * Part 5.1 item 1 is answered. Move it there unchanged.
 *
 * Coordinates are normalised {x, y} in 0–1 against the 390 x 844 screen area,
 * so rendered position = coordinate x the frame's current scaled size and the
 * anchors survive every viewport without re-authoring. Every value below was
 * MEASURED from the live DOM (element centre / viewport), not estimated, then
 * pulled toward the region's edge where the brief's gutter rule needs it.
 *
 * PERSONA: these anchor the app running as Meera Iyer, not the default Aadit
 * Rao. That is a real decision, not a detail — see session0/DISCOVERY.md.
 * On Aadit, two of these five screens do not exist as the brief describes
 * them: there is no ranked list of three (he has four priorities) and no
 * twelve-week before-and-after (his completed experiment ran eight weeks).
 *
 * Anchors point at REGIONS — the middle of a card, not the edge of a glyph —
 * so they survive the app being tweaked.
 */

export interface Annotation {
  /** 2–5 words, `telemetry` style. VERBATIM from Part 7.5.1. */
  label: string
  /** Normalised against the 390 x 844 screen area. */
  x: number
  y: number
  /** What the dot sits on in the captured plate, and where that was measured. */
  anchors: string
}

export const ANNOTATIONS: Record<string, Annotation[]> = {
  timeline: [
    {
      label: 'Every test, kept',
      x: 0.3,
      y: 0.442,
      anchors:
        'The list of past results in the Health Passport. Measured on the ' +
        "\"Women's Health Panel — 44 markers\" entry (centre 0.529, 0.442); " +
        'pulled left onto the same row so the leader runs to the right gutter.',
    },
  ],

  score: [
    {
      label: 'One number',
      x: 0.44,
      y: 0.381,
      anchors:
        'The score numeral itself — the 76 inside the dial (measured centre ' +
        '0.500, 0.381, a 99x79 box, so 0.44 still sits well inside it).',
    },
  ],

  priorities: [
    {
      label: 'Fix this one first',
      x: 0.22,
      y: 0.363,
      anchors:
        'The first row of the ranked list in "What HUMAN is not showing you" — ' +
        'rank 1, "Iron & Energy Restore / Active now" (row box 20,273 350x67). ' +
        'Anchored left of centre so the leader runs to the right gutter.',
    },
  ],

  plan: [
    {
      label: 'One tap to confirm',
      x: 0.133,
      y: 0.269,
      anchors:
        'The confirm control on the first action row, "Iron + vitamin C, ' +
        'mid-morning" — a 32x32 button, measured centre 0.133, 0.269.',
    },
  ],

  /* The one permitted two-annotation screen, because the whole point is two
     numbers side by side. Staggered 220ms apart — the only stagger in the
     layer. Both sit low in the frame (y ~0.9); if Session 4 reframes the plate
     so the "Signals at the end" block sits higher, re-measure both. */
  week12: [
    {
      label: 'Your first result',
      x: 0.376,
      y: 0.906,
      anchors: 'The baseline under the signal name — "from 16 ng/mL".',
    },
    {
      label: 'Twelve weeks later',
      x: 0.771,
      y: 0.894,
      anchors:
        'The current value on the same row — "24 ng/mL". The readout states ' +
        '"Vitamin D rose from 16 to 24 ng/mL across the 12 weeks", so the ' +
        'label is literally true on this plate.',
    },
  ],
}

/** Mobile takes one annotation per screen, week12 included (Part 7.5.1). */
export const MOBILE_ANNOTATION: Record<string, number> = {
  timeline: 0,
  score: 0,
  priorities: 0,
  plan: 0,
  week12: 1, // "Twelve weeks later" only.
}
