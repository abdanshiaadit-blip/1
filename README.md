# HUMAN

**India-first preventive healthcare and personal health intelligence platform.**

> Book your blood tests, discover what your body needs, and follow a personalized plan to stay healthier for years to come.

An investor-facing prototype of HUMAN, built as a premium native-feeling iPhone application.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build && npm run preview   # production build
```

Open on a phone for full-bleed, or on a desktop to see it inside an iPhone frame.

### Offline, no install

```bash
npm run portable
```

Produces `HUMAN-app/index.html` — a single self-contained file you open by
double-clicking. No server, no install, no network. Everything is inlined,
including the two Inter font subsets the app needs (latin, plus latin-ext for
the rupee sign).

This exists because a normal Vite build **cannot** be opened from `file://`:
browsers refuse to load ES modules over it. The portable build bundles to a
classic script, moves it to the end of `<body>` (classic scripts don't defer),
and embeds fonts as data URIs since `file://` font requests are blocked too.

## The website

The official HUMAN site lives in **`site/`** and is a second Vite root, so the app
at `./index.html` is untouched.

```bash
npm run dev:site      # http://localhost:5174
npm run build:site    # → dist-site/ (a plain static folder, deploy anywhere)
npm run preview:site
npm run portable:site # → HUMAN-website/index.html, one file, opens offline
```

`portable:site` exists for the same reason `portable` does: a normal Vite build
cannot be opened from `file://`, because browsers refuse to load ES modules
over it. Both targets share `scripts/build-portable.mjs`, which takes `--in`,
`--out` and `--readme`.

One decision shapes it: **there are no screenshots.** The site imports the real
screens, the real state container and the real sheets from `src/` and renders
them at their native 390 × 844 inside a website-owned device frame. Scrolling
the page changes the app's tab, opens its sheets, starts the booking flow and
scrolls its screens — so a visitor moves through the actual product rather than
watching a video of it. `site/src/app/LiveApp.tsx` holds the whole mechanism;
`src/` needed no changes to support it.

Two consequences worth knowing before editing:

- **The app's global CSS applies to the site**, because they share a document.
  Six class names existed in both and are prefixed `hu-` on the site side
  (`hu-hero`, `hu-sec`, `hu-btn`, `hu-spark`). `site/src/styles/device.css`
  restores the colour and typography the app inherits from `<body>`, which the
  site otherwise overrides.
- **Numbers are imported, not retyped.** `site/src/content/product.ts` pulls
  every value from `src/data`, so the site cannot quietly disagree with the
  product. There is no statistic anywhere on the site, because there is no
  sourced one in this project.

Motion is one `requestAnimationFrame` loop (`site/src/lib/scroll.ts`) that
publishes a single number per section — `--p`, running 0 → 1 as the section
passes the viewport — and every animation is a CSS expression of it. No
animation library, nothing to load. `prefers-reduced-motion` stops the
decorative movement; the scroll-driven *content* still advances, because
removing it would remove information rather than motion.

Founder copy is in `site/src/content/founder.ts`. It carries only what this
project supports; `name`, `portrait` and `reel` are empty and the section
renders correctly without them.

---

## The idea

Healthcare is good at **measuring** health and bad at helping people **continuously act on it**.
HUMAN owns the loop between measurement and outcome:

```
MEASURE → UNDERSTAND → PRIORITIZE → ACT → RE-MEASURE → LEARN → ADAPT
```

The blood test is the entry point. The membership owns the relationship. The longitudinal
record is the moat.

Full product thinking — information architecture, screen inventory, data model, design system,
interaction model, open questions — lives in **[`docs/PRODUCT-ARCHITECTURE.md`](docs/PRODUCT-ARCHITECTURE.md)**.

## Four tabs, no more

| Tab | Question it answers |
|---|---|
| **Home** | How am I doing? What matters right now? What next? |
| **Health** | What is my body doing? |
| **Action** | What should I do today? Is it working? |
| **Profile** | Identity, settings, relationships — *no health intelligence* |

## Two personas

The prototype ships with two members, switchable from the control beside the phone on desktop
(and hidden inside the device UI, because it is a demo affordance, not a product feature):

- **Aadit Rao** — 34, Bengaluru. Metabolic priority, mid-experiment. Demonstrates the Decision
  Engine, the Experiment Engine, India-native intelligence and Outcome Intelligence.
- **Meera Iyer** — 31, Mumbai. Iron and cycle priority. Demonstrates Women's Longitudinal
  Health as a first-class pillar — four systems connected across 14 months, surfaced as a
  pattern and routed to a clinician, never diagnosed.

Switching persona swaps the entire product state, not a name in a greeting.

## What to look at

| Where | What it proves |
|---|---|
| Home hero card | One number, one stage, one priority. Confidence through simplicity. |
| Action → *Not now* → **Why** | The Decision Engine showing what it is deliberately hiding, and why. |
| Action → running experiment | Structured protocol, adherence grid, tracked signals, defined end date. |
| Action → Completed → readout | Observed vs caveat vs decision. Non-causal language throughout. |
| Health → swipe the systems card | One premium object, nine panels — not nine widgets. |
| Health → any biomarker | Range band, trend, meaning, **Indian context**, influences, clinician note. |
| Health → Health Passport | The longitudinal record, back to the earliest uploaded result. |
| Home → ring → Health Intelligence | Transparent weighting, labelled a prototype construct. |
| Meera → Women's Health | Connections over time. Patterns, not diagnoses. |
| Profile → Care Circle → a member | Shared care with per-category locks on sensitive data. |
| Book a blood test → confirm | Where the loop closes: results land in a changed plan, not a PDF. |

## Stack

React 19 · TypeScript · Vite. No UI framework, no chart library, no animation library — every
component, visualization and motion curve is hand-built so the interaction model stays exactly
as designed. Inter is self-hosted; Apple devices render SF Pro first.

Light canvas with iOS 26 Liquid Glass: translucent surfaces over a near-white ground, a
floating capsule tab bar with content scrolling beneath it, capsule controls, concentric
radii, and ambient colour blooms behind the content so the glass has something to refract.

```
docs/PRODUCT-ARCHITECTURE.md   product source of truth
src/data/                      domain model + two full member profiles
src/data/validate.ts           dev-time referential integrity check
src/state/app.tsx              tab, sheet stack, modal, persona
src/components/primitives.tsx  GlassCard, Sheet, Pager, ListRow, …
src/components/viz.tsx         IntelligenceRing, TrendChart, RangeBar, LoopStrip, …
src/components/SheetHost.tsx   all level-4/5 detail sheets
src/screens/                   Home, Health, Action, Profile, Booking
src/styles/tokens.css          design system

site/                          the official website (npm run dev:site)
site/src/app/LiveApp.tsx       the real app, embedded and driven by scroll
site/src/lib/scroll.ts         the scroll engine — one --p per section
site/src/content/product.ts    every word on the site; numbers come from src/data
site/src/content/founder.ts    founder copy, name/portrait/reel optional
site/src/sections/             the twelve movements, in order
```

## Medical safety

HUMAN does not diagnose and does not replace a clinician. Copy is constrained to *may
indicate · your results suggest · worth discussing with your clinician*. Experiment readouts
state what was **observed** and carry an explicit caveat that observation is not proof of
cause. The Health Intelligence score is labelled in-product as a prototype composite, not a
validated clinical instrument.

## Prototype notes

All member data is fictional. Pricing is a planning assumption, labelled as such in-product.
Payment, lab integration and clinician workflows are simulated. Open product questions and the
assumptions taken against them are listed in §11 of the architecture document.
