# HUMAN — the website

The public marketing site for HUMAN, built to the **Master Website Specification v1.0**.

One page. One argument, in thirteen beats. One action: a WhatsApp number.

```bash
cd site
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc + vite build → dist/
npm run preview    # serve the production build
```

This is a **new build from the specification alone**. It shares no code, no components and
no visual language with the app prototype at the repository root.

---

## What it is

A single scrolling page, 2,030vh on desktop and 1,530vh on mobile, made of fourteen
sections. Five of them are scroll-linked set pieces on a sticky stage; the rest are ordinary
flowing page. The argument runs unease → clarity → desire → trust → decision, and the motion
follows the same curve: restrained, then generous through the middle, then almost still at
the end. The last three sections have the least animation on the page, because decisions are
made in stillness.

## How it is put together

```
src/
  copy.ts              Every word on the site, transcribed verbatim from the spec.
                       No component types a sentence. This file is the single place
                       to diff the site against the copy deck.
  site.config.ts       The four values the spec leaves open: launch month, price,
                       entity, domain. Each is a one-line edit.
  styles/
    tokens.css         The palette, the ten type styles, the eight spacing values,
                       two radii, one shadow, the motion table, the six z-indexes.
                       Every value is quoted from the spec. Nothing else invents one.
    base.css           Fonts, reset, the type classes, the two entrance primitives,
                       and the reduced-motion poster state.
    app.css            Page-level composition: flow sections, the 40vh landing gaps.
  lib/
    scroll.ts          The scroll engine. One requestAnimationFrame loop for the whole
                       site, and it sleeps when the page is still. Lenis at duration 0.9
                       drives window scroll, so it never becomes a transform ancestor of
                       a sticky stage. Disabled on touch and under reduced motion.
    hooks.ts           The only ways a section may listen to scroll.
  components/          The twelve components of spec §10, plus the header, the mobile
                       action bar, the waitlist form and the five app screens.
  sections/            One file plus one stylesheet per section of spec §8.
```

### The rules the code enforces

- **One rAF loop.** `lib/scroll.ts` owns it. No section adds a scroll listener or a loop of
  its own, and the loop stops running a few frames after the page stops moving.
- **Transform and opacity only.** Nothing animates a dimension. The single exception is the
  disclosure expander, which the spec explicitly permits, and it measures its own height so
  it can never push what sits below it.
- **One sticky implementation.** `StickyStage` — section is the scroll budget, stage is
  exactly one viewport, two lanes with a hard boundary. Nothing animating ever enters the
  quiet lane.
- **Scroll-linked state is a pure function of progress.** Scrub the scrollbar anywhere and
  the frame is correct; scroll back and it retraces exactly.
- **Reduced motion is a first-class output.** Every stage renders its final composition
  statically at one viewport tall. It is a finished page, not a skeleton.

## Assets

| Asset | Status |
|---|---|
| Switzer 400 / 500 / 600 | Shipped, self-hosted, 57 KB total |
| Gambetta Italic 400 | **Missing** — see `public/fonts/FONTS.md` |
| The rupee sign ₹ | Served from a 1.2 KB single-glyph subset — see `public/fonts/FONTS.md` |
| App screens ×5 | Recreated in HTML/SVG per spec §11, not exported from the prototype |
| Founder portrait | Omitted, per spec §3.6 — no photograph beats a bad one |
| Favicon | Built from the real Switzer "H" outline |
| Wordmark SVG | Not shipped as a file; the wordmark is set in Switzer, which is self-hosted |

## Open items

These are the spec's own open decisions (§16) and missing assets (§11), not gaps in the
build. Each is a single edit in `src/site.config.ts` unless noted.

1. **Launch month.** `<MONTH>` appears in §8.1 and §8.13. `config.launchMonth` is `null`, so
   those two lines currently read "Opening soon" and "in the first intake". Set it to a
   month and both lines become the specified copy exactly.
2. **GST slab.** Unconfirmed, so GST is stated beside the price and never absorbed into it.
3. **Registered entity name and domain.** `config.entity` is `null`; the footer falls back to
   "© 2026 HUMAN".
4. **The cost breakdown in §8.11.** The spec names the five cost lines but supplies no
   figures. They ship named and unpriced — inventing a number would be a claim about the
   business. Fill in `price.costLines[].amount` in `copy.ts` when the figures exist.
5. **Privacy and Terms** are linked but not written.
6. **The waitlist has no backend.** `config.waitlistEndpoint` is `null`, so the form
   validates and confirms in place without posting. Point it at a real endpoint to wire it up.

## Two places the spec contradicts itself

Both are resolved in favour of the more specific rule, and both are worth a decision:

- **The medical scope line.** §1.4 ends it "If something looks urgent in your results…";
  §8.11 ends it "If something in your results looks urgent…". Each is used where its own
  section specifies it (`medicalScopeFooter` / `medicalScopePricing` in `copy.ts`).
- **The footer meta string.** §8.14's wireframe writes "Privacy · Terms · hello@…", but §3.4
  bans middle-dot meta strings and says to use spacing, hairlines or separate lines. §3.4
  wins; the footer uses hairline separators.
