# HUMAN — website

The marketing site for HUMAN, a preventive healthcare membership for India.
Built from `HUMAN_Website_Blueprint_2.md`, which is the specification this
code answers to; section references throughout the source (`§6.1`, `Law 3`,
and so on) point back into it.

This is a new build. It shares no code, tokens or layout with the product
app prototype in the repository root.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start            # serve the production build
npm run typecheck
```

Two generator scripts produce committed assets, and only need re-running
when their inputs change:

```bash
npm run screens      # placeholder app screens → public/app/*.png
node scripts/make-brand.mjs   # favicon set and the Open Graph card
```

## The standalone preview

`human-site-preview.html` is the home page as one self-contained file —
stylesheet, both typefaces and all eight app screens embedded, nothing
loaded from the network. Open it by double-clicking; no Node, no install.

It carries every section at full fidelity, and the Body toggle, waitlist
modal and mobile menu work. It cannot carry the motion: what it shows is
the state each animation ends in, which is also what the site shows a
visitor with JavaScript disabled. The form is inert in it by design.

Regenerate it after a change:

```bash
npm run build && npm start &
node scripts/make-standalone.mjs http://127.0.0.1:3000 human-site-preview.html
node scripts/verify-standalone.mjs        # confirms it opens with no network access
```

## QA

The checks in §18 that can be automated are:

```bash
npm start &                                  # or any running instance
node scripts/functional.mjs http://127.0.0.1:3000
node scripts/screenshot.mjs http://127.0.0.1:3000 qa-shots
```

`functional.mjs` covers the Body toggle, the waitlist modal and form, the
no-JavaScript rendering, reduced motion, nav behaviour over dark sections,
fast scroll, the mobile menu, heading structure and the z-index budget.
`screenshot.mjs` captures the six viewports in §18 at eleven scroll
positions each and reports horizontal overflow, console errors, and any
element painted over text.

Both need Chromium. In an environment with a pre-installed browser, set
`CHROMIUM_PATH`; otherwise Playwright's own download is used.

`window.gsap` and `window.ScrollTrigger` are assigned when the motion
chunk loads, so those scripts can inspect live tween state against a
production build. Nothing in the site reads them.

## Architecture

```
app/                    routes, metadata, the waitlist route handler
components/
  layout/               Nav, MobileMenu, Footer, Container, Section, shells
  ui/                   Button, MarkerRow, StatBlock, Tag, ScopeLine, BodyToggle
  app-showcase/         Phone, ProductWalkthrough (sections 07–09)
  charts/               the four hand-built SVG charts, AnimatedNumber
  sections/             one file per home section, 01–15
  waitlist/             provider, modal, form
context/BodyContext     the Women | Men state
lib/animation.ts        the single animation helper and the reveal pattern
lib/tokens.ts           durations, easings, z-index, media queries
lib/content.ts          the copy the Body toggle switches between
```

The load-bearing decisions, all from §8:

- **Every animation is a `from()`.** The resting CSS state is the finished
  page. If the script never runs, never loads, or throws, the whole site is
  present and correctly laid out. This is the default architecture, not a
  fallback, and it is what makes the async motion chunk below safe.
- **One scroll authority.** GSAP ScrollTrigger reads scroll position;
  nothing else does. No IntersectionObserver animation, no scroll
  listeners, no CSS scroll-timeline.
- **Sticky, never fixed.** Pinned sections are `position: sticky` inside a
  parent of declared height. ScrollTrigger reads progress and never
  manipulates layout.
- **Transform and opacity only**, with one exception: the fixed nav's
  height, which is outside document flow and cannot cause layout shift.
- **Six z-index values**, as tokens. The functional suite fails the build
  if a seventh appears.

## App screens

`public/app/*.png` are placeholders at exactly 1170 × 2532, the dimensions
in §9.2. Real exports drop straight over them and change no layout —
`Phone` reserves the aspect ratio before the image loads and every screen
uses `object-fit: contain`.

The blueprint also asks for a 780 × 1688 set for `srcset`. That is handled
by `next/image`, which derives the whole responsive set from the 3× source,
so a second export set would be one more thing to keep in sync for no gain.

## The waitlist destination

`POST /api/waitlist` validates server-side, rate-limits by IP, applies a
honeypot and a submission-timing check, and stores a record with a
timestamp and the page it came from.

Set `WAITLIST_WEBHOOK_URL` (and optionally `WAITLIST_WEBHOOK_TOKEN`) to
whatever HUMAN's destination turns out to be — a Supabase function, an
Airtable proxy, a Sheets endpoint. Without it, the handler appends to
`.waitlist-submissions.jsonl` in development and **fails loudly in
production**, because a form that silently drops a phone number is worse
than one that errors.

`NEXT_PUBLIC_SITE_URL` sets the canonical origin for metadata, the sitemap
and `robots.txt`. It defaults to `https://humanhealth.in`.

## Where this departs from the blueprint, and why

Each of these is a case where following the specification literally would
have broken something it also requires. §19.10 — when motion and
readability conflict, cut the motion — is the standing instruction behind
most of them.

| # | Blueprint | What was built | Why |
|---|---|---|---|
| 1 | Atkinson at 400/600, toggle label at weight 500 | 400/700; button labels 700, toggle labels both 400 | Google Fonts serves Atkinson Hyperlegible at 400 and 700 only. Equal-weight toggle labels also keep the control from resizing when it switches, which §11.4 requires. |
| 2 | §04 solved rows recede to 55% opacity | 64% | 55% of `--ink` on `--paper` computes to 3.7:1, below AA for the 17px status text, and this recession is permanent rather than transient. 64% computes to 4.6:1 and is visually indistinguishable. |
| 3 | §05 step description 70% → 100% on hover | Same, but on an inner span, and coloured `--paper-on-dark` | Two reasons. Fading `--paper-on-dark-soft` to 70% lands at ~3.4:1; fading `--paper-on-dark` to 70% computes to the same colour as `--paper-on-dark-soft`, 6.0:1. And a CSS opacity transition on the same element GSAP animates makes GSAP record the mid-transition value as its destination — so the two now own different elements. |
| 4 | §14.3 `invalidateOnRefresh: true` | `false` | On refresh GSAP re-reads each tween's destination from the element's computed style, and a `from()` tween whose trigger has not been reached is sitting at its start value — so the destination is re-recorded as the hidden state and the content never appears. Nothing here animates a measured distance, so a refresh has nothing to re-measure. |
| 5 | §13.1 pinning enabled at ≥1024px | ≥1024px **and** ≥760px tall | §10's own notes ask for 1024 × 640 to be verified. A 100dvh sticky child cannot hold a section's content at that height without clipping text. Below the threshold each pinned section falls back to the static layout it already specifies for mobile. |
| 6 | §10 coda, closing paragraph and CTA inside the scrubbed scene | Below the pin, in normal flow, with the standard reveal | Same reason. The scrubbed part keeps what the section is for: the chart drawing and the number landing. |
| 7 | §14.6 GSAP in the initial bundle, under 180 kB gzipped | GSAP, ScrollTrigger and Lenis load as an async chunk | React 19 plus the Next runtime is ~100 kB gzipped before any of this site's code, so the budget is not reachable with GSAP in the initial payload. Deferring it is only safe because of Law 1, and it also serves §8.8 ("above-fold renders without JS; scroll animations attach when ready"). Home route: **134 kB** gzipped for modern browsers, 173 kB including the legacy polyfill bundle. |
| 8 | `pathLength="1"` on drawn paths | `pathLength="100"` | GSAP rounds `stroke-dashoffset` to whole units, which collapses a 0–1 range into an on/off switch. The draw is equally resolution-independent at 100. |
| 9 | §11.4 measure both toggle states on mount and lock to the taller | Both states share one CSS grid cell | The container is then always as tall as the taller state, which is the guarantee §11.4 is after, with no measurement to fall out of sync and no reflow on the first paint. |
| 10 | §01 hero phone shows its top 38% (22% mobile) | That, where the viewport is tall enough | The hero's row above the phone grows if the text needs more room, so the phone shows less rather than the two overlapping (Law 8). |
| 11 | Copy containing `Join the waitlist · Opening to…` and `**Test** — A 96-marker panel…` | The same words, as separate elements | §2.3 bans middle-dot meta strings and `WORD — fragment` labels. The dashes and dots are layout separators in the specification's markdown, not copy; §12's own visual notes describe these as separate elements. |
| 12 | §16.4 cookieless analytics | Not installed | It needs a Plausible or Fathom account. One script tag, no consent banner, listed in the launch checklist. |

Nothing in §12's copy has been reworded. Where a claim in §17 has an
unmet precondition, the copy is present and the checklist says so — the
decision to cut it is HUMAN's, not this build's.
