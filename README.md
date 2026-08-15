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
