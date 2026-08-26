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

## The primary metric

The Home hero answers one question: **am I getting healthier or less healthy over time?**

```
BIOLOGICAL AGE          32.2
Chronological age         34
                       ↓ 1.8 years younger
```

**Biological Age** is the primary outcome — immediately understandable, emotionally
meaningful, and traceable all the way down to the markers behind it. Tap it and every body
system carries its own estimate; tap a system and you get *why this estimate*, the positive
contributors, the opportunities, and the exact markers and lifestyle signals HUMAN used.

**Health Intelligence** has not gone anywhere. It answers a different question — *how
complete and actionable is my health picture* — so it moved one level down, into Health as a
supporting metric and into the Biological Age detail as supporting context.

Everything about it is framed as an **estimate**. It is not presented as a measurement, it is
never called clinically validated, and it makes no claim about disease or lifespan. The rules
are written down in §5.2 of the architecture document and enforced in the copy.

## Four tabs, no more

| Tab | Question it answers |
|---|---|
| **Home** | Am I getting healthier? What matters right now? What next? |
| **Health** | What is my body doing? |
| **Action** | What should I do today? Is it working? |
| **Profile** | Identity, settings, relationships, the AI Coach — *no health intelligence* |

## Two personas

The prototype ships with two members, switchable from the control beside the phone on desktop
(and hidden inside the device UI, because it is a demo affordance, not a product feature):

- **Aadit Rao** — 34, Bengaluru. Metabolic priority, mid-experiment. Demonstrates the Decision
  Engine, the Experiment Engine, India-native intelligence and Outcome Intelligence. His
  biological age estimate has gone from **2.6 years older** than his age at baseline to
  **1.8 years younger** — the loop working, in one number.
- **Meera Iyer** — 31, Mumbai. Iron and cycle priority. Demonstrates Women's Longitudinal
  Health as a first-class pillar — four systems connected across 14 months, surfaced as a
  pattern and routed to a clinician, never diagnosed. Her estimate is **2.3 years older** than
  her age and has risen at every assessment, and the Coach explains exactly why rather than
  softening it.

The two personas share one data model. Biological age, system ages, biomarker trends, blood
results, priorities, experiments, adherence and every Coach answer are driven by the same
profile — there are no disconnected numbers per screen.

Switching persona swaps the entire product state, not a name in a greeting.

## What to look at

| Where | What it proves |
|---|---|
| Home hero card | Biological age against chronological age. The concept lands in two seconds. |
| Home hero → **Biological Age** | The estimate crossing under the chronological line, then eight systems each with their own age. |
| Biological Age → **Metabolic** | *Why this estimate* — contributors, opportunities, and the exact markers behind it. |
| Home → **Ask HUMAN** | The AI Coach: what HUMAN can see, and what it deliberately is not using. |
| Coach → *"Why did my biological age change?"* | Longitudinal reasoning across assessments, systems and wearables — with references back into the record. |
| Coach → *"Is my Dinner Walk Protocol working?"* | Experiment + adherence + outcome, stated non-causally. The most important sentence in the product is "HUMAN needs another measurement". |
| Switch to Meera → hero | The same feature telling a member her estimate went **up**. HUMAN does not flatter the number. |
| Action → *Not now* → **Why** | The Decision Engine showing what it is deliberately hiding, and why. |
| Action → running experiment | Structured protocol, adherence grid, tracked signals, defined end date. |
| Action → Completed → readout | Observed vs caveat vs decision. Non-causal language throughout. |
| Health → swipe the systems card | One premium object, nine panels — not nine widgets. |
| Health → any biomarker | Range band, trend, meaning, **Indian context**, influences, clinician note. |
| Health → Health Passport | The longitudinal record, back to the earliest uploaded result. |
| Health → Health Intelligence → Method | Transparent weighting, labelled a prototype construct. |
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
src/state/app.tsx              tab, sheet stack, modal, persona, Coach thread
src/components/primitives.tsx  GlassCard, Sheet, Pager, ListRow, …
src/components/viz.tsx         BioAgeDial, AgeTrend, IntelligencePanel, TrendChart, …
src/components/SheetHost.tsx   all level-4/5 detail sheets, incl. Biological Age + AI Coach
src/screens/                   Home, Health, Action, Profile, Booking
src/styles/tokens.css          design system
```

## Medical safety

HUMAN does not diagnose and does not replace a clinician. Copy is constrained to *may
indicate · your results suggest · worth discussing with your clinician*. Experiment readouts
state what was **observed** and carry an explicit caveat that observation is not proof of
cause. The Health Intelligence score is labelled in-product as a prototype composite, not a
validated clinical instrument.

**Biological Age** is held to the same standard: it is always an *estimate* built from the
signals HUMAN currently holds, never a measurement, never clinically validated, and never a
claim about disease or lifespan. The **AI Coach** inherits all of it — it explains, organises
and prioritises; it does not diagnose or prescribe, it uses *coincided with* and *appears to
have improved* rather than *caused*, and concerning findings are routed to a clinician with an
offer to prepare a summary for the appointment. Coach answers are deterministic content
authored against each profile; there is no model behind this build, and the product says so
rather than implying one.

## Prototype notes

All member data is fictional. Pricing is a planning assumption, labelled as such in-product.
Payment, lab integration and clinician workflows are simulated. Open product questions and the
assumptions taken against them are listed in §11 of the architecture document.
