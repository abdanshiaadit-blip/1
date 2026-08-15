# HUMAN — Product Architecture

**India-first preventive healthcare & personal health intelligence platform**

> Book your blood tests, discover what your body needs, and follow a personalized plan to stay healthier for years to come.

This document is the source of truth for the product. Code implements this; it does not redefine it.

---

## 0. The one-sentence thesis

Healthcare is good at **measuring** health and bad at helping people **continuously act on it**.
HUMAN owns the loop between measurement and outcome.

```
MEASURE → UNDERSTAND → PRIORITIZE → ACT → RE-MEASURE → LEARN → ADAPT
```

The blood test is the **entry point**. The membership owns the **relationship**.
The loop creates **ongoing value**. The longitudinal record creates the **moat**.

Every screen must be traceable to one of four user questions:

| # | Question | Owned by |
|---|---|---|
| 1 | What is happening with my health? | HEALTH |
| 2 | What matters most right now? | HOME (surface) + ACTION (depth) |
| 3 | What should I do about it? | ACTION |
| 4 | Is what I'm doing actually working? | ACTION (readout) + HEALTH (trend) |

**If a proposed feature does not answer one of these four questions, it does not ship.**

---

## 1. Product hierarchy (applies to every screen)

This is the single most important design rule in HUMAN. It governs vertical order,
type scale, and what lives behind a tap.

| Level | Question | Treatment |
|---|---|---|
| L1 | What matters right now? | Always visible, largest type, hero position |
| L2 | What should I do? | Visible, one clear action, never a list of 20 |
| L3 | How am I progressing? | Visible but secondary — progress, adherence, trend |
| L4 | Why? | One tap — "Why this?" sheet |
| L5 | Show me the data | Two taps — biomarker values, ranges, history |

**The product feels intelligent because it knows what NOT to show.**
Everything below L3 is progressive disclosure.

---

## 2. Information architecture — four tabs, no more

```
┌──────────────────────────────────────────────────────────────┐
│                          HUMAN                               │
├──────────────┬──────────────┬──────────────┬─────────────────┤
│    HOME      │    HEALTH    │    ACTION    │    PROFILE      │
│              │              │              │                 │
│ How am I     │ What is my   │ What do I    │ Who am I &      │
│ doing?       │ body doing?  │ do today?    │ my settings     │
│              │              │              │                 │
│ L1 + L2      │ L4 + L5      │ L2 + L3      │ Identity        │
└──────────────┴──────────────┴──────────────┴─────────────────┘
```

**HOME** is the intelligence surface. **HEALTH** is the evidence. **ACTION** is the behaviour.
**PROFILE** is identity and control — *no health intelligence lives here.*

### 2.1 Feature → tab map (every feature has exactly one home)

| Feature / differentiator | Primary tab | Surface | Notes |
|---|---|---|---|
| **Health Action Loop** (5.1) | Cross-cutting | Hero stage chip on HOME; `LoopStrip` component; loop explainer sheet | It is the *spine*, never a menu item |
| **Health Decision Engine** (5.2) | ACTION | HOME shows only the #1 output; ACTION shows priority + ranked-but-suppressed alternatives | "Why this, and not that" sheet is the proof |
| **Personal Health Experiments** (5.3) | ACTION | Experiment card → protocol → adherence → readout | Readout uses observational, non-causal language |
| **Women's Longitudinal Health** (5.4) | HEALTH | A first-class panel in the unified Health card → dedicated Women's Health space | Also a contextual HOME shortcut when relevant |
| **India-native Intelligence** (5.5) | Cross-cutting | Content layer inside actions, insights, biomarker meaning | Never a tab, never a badge — it's the *voice* |
| **Health Passport** (5.6) | HEALTH | Timeline + records, reachable from HOME | Longitudinal timeline, not a document vault |
| **Outcome Intelligence** (5.7) | HEALTH + ACTION | "What we've learned about you" module; experiment readouts | Explicit non-causal framing everywhere |
| **HUMAN Care Circle** (5.8) | PROFILE | Members, per-category sharing, sensitive locks | Relationship layer, not a social feed |
| **Blood test booking** | Modal flow | Enterable from HOME, HEALTH, ACTION | Full-screen stack, not a tab |
| Membership / billing | PROFILE | | |
| Devices / wearables | PROFILE | Signals feed HEALTH + ACTION | |
| Medical history, meds, family history | PROFILE | Feeds Decision Engine context | |

### 2.2 What deliberately does NOT exist

No "Insights" tab. No "Labs" tab. No "Chat" tab. No AI assistant persona.
No feature directory on HOME. No hamburger menu. No dashboard of everything.

---

## 3. Screen inventory

### HOME — `/home`

Answers: *How am I doing? What matters right now? What next?*
Calm, premium, intentional. It is **not** a feature directory.

| Order | Block | Level | Content |
|---|---|---|---|
| 1 | Brand header | — | `HUMAN` wordmark + one-line promise |
| 2 | **Hero Card** | L1 | Health Intelligence ring (81) · `↑ +11 since baseline` · stage `ACT` · priority `Metabolic Reset` · one-line description · current experiment · next review date |
| 3 | Today | L2 | The single most important action + why + streak progress |
| 4 | Loop strip | L1 | 7-stage spine, current stage lit, tappable → explainer |
| 5 | Movement | L3 | 2–3 key signals trending, sparklines |
| 6 | One insight | L4 | A single rotating observation, never a wall |
| 7 | Contextual: Women's health | L1* | Cycle phase / day, only when relevant to the profile |
| 8 | Upcoming | L3 | Next review, next retest → booking entry |
| 9 | Care Circle | — | Small, quiet, one line |
| 10 | Passport | — | "Your health since 2021" — one line into the timeline |

**Hero Card rules (non-negotiable):**
- The ring is the visual identity of HUMAN — large, animated stroke, soft gradient, glass reflection, subtle glow, count-up number.
- It carries **only**: score, delta, stage, priority, one description line, experiment, next review.
- It carries **none** of: the eight differentiator names, feature lists, biomarker counts, marketing copy.
- Confidence through simplicity.

### HEALTH — `/health`

Answers: *What is my body doing?* Evidence and history.

| Order | Block | Content |
|---|---|---|
| 1 | **Unified Body Systems card** | ONE premium swipeable object. Nine panels: Metabolic · Cardiovascular · Hormonal · Nutritional · Liver · Thyroid · Women's Health · Recovery · Sleep. Scroll-snap paging, dots, per-panel state + key markers + mini visualization. **Not** nine separate cards. |
| 2 | Health Intelligence trend | Score over time with test events marked |
| 3 | Biomarker trends | Grouped by system, state dot + value + direction → detail sheet |
| 4 | What we've learned | Outcome-intelligence module, non-causal language |
| 5 | Health Passport | Timeline preview → full passport |
| 6 | Reports & records | Lab reports, prescriptions, imaging |
| 7 | Retest | What's due, when, why |

**Sub-screens:** System detail · Biomarker detail (chart, range band, meaning, India context, influences, linked action) · Health Passport (full timeline + filters) · Women's Health space · Report viewer.

### ACTION — `/action`

Answers: *What should I do today? Is it working?*

| Order | Block | Content |
|---|---|---|
| 1 | Today | Checkable daily actions with why-lines |
| 2 | Current priority | Decision Engine output: why it matters, what to do, what we track, review date |
| 3 | Active experiment | Protocol, week N of 6, adherence grid, tracked signals |
| 4 | Upcoming | Review date, retest recommendation → booking |
| 5 | Next up | The priorities the engine is deliberately holding back |
| 6 | History | Past priorities and experiments with outcomes |

**Sub-screens:** Priority detail (evidence, clinician-discussion trigger) · Experiment detail (protocol, adherence, weekly readout) · Experiment readout.

### PROFILE — `/profile`

Identity, settings, account, relationships. **No health intelligence.**

Identity card · Health goals · Medical history · Family history · Medications & supplements ·
Connected devices · **Care Circle** · Privacy & data · Membership · Notifications · Account.

### BLOOD TEST FLOW — modal stack

```
DISCOVER → PANEL DETAIL → SLOT & LOCATION → CONFIRM → COLLECTION TRACKING
   → RESULTS → INTERPRETATION → PRIORITIZATION → NEW PLAN
```

The last three steps are the demo's most important moment: results do not land in a PDF,
they land in a **changed plan**. This is where the business thesis becomes visible.

---

## 4. User journey (the spine of the demo)

```
Day 0     Baseline blood assessment booked (home collection)
Day 2     Results land → HUMAN interprets → 9 systems scored
Day 2     Decision Engine: 14 candidate findings → 1 priority (Metabolic Reset)
Day 3     Plan: dinner walk protocol, 6 weeks, tracked signals defined
Day 3–45  ACT: daily action, adherence, wearable signals
Day 45    Review: readout — what moved, what didn't, stated non-causally
Day 45    RE-MEASURE: targeted retest (not the whole panel — the relevant markers)
Day 48    LEARN: comparison vs baseline → a durable "learning" about this person
Day 48    ADAPT: continue, modify, or promote the next priority
Year 2+   Trends. Year 3+ intervention history. Year 4+ personal patterns.
```

The prototype opens at **Day 45** — mid-loop, ACT stage, week 5 of 6 — because that is the
only state that shows the whole system working at once.

---

## 5. Data model

```
User          id, name, sex, age, city, membership, since, goals[], conditions[],
              medications[], supplements[], familyHistory[], devices[]

HealthIntel   score, delta, baselineScore, history[{date, score, event?}],
              contributions[{systemId, weight, state}], methodNote

LoopState     stage, stageSince, priorityId, experimentId, nextReviewDate

BodySystem    id, name, state, score, headline, summary, markerIds[], viz, accent

Biomarker     id, name, systemId, value, unit, range{low, high, optLow, optHigh},
              state, history[{date, value}], meaning, indiaContext,
              influences[], relatedPriorityId

Priority      id, rank, title, systemId, whyShort, whyDetail, evidenceMarkerIds[],
              actionIds[], trackedSignals[], reviewDate, retest{panelId, dueDate},
              clinicianNote, suppressedReason  ← for "next up"

Experiment    id, title, question, protocol[], weeks, startDate, trackedSignals[],
              adherence[{date, done}], readout{observed[], caveat, decision}

DailyAction   id, title, why, priorityId, target, streak, completedDates[]

TimelineEvent id, date, type(test|result|diagnosis|prescription|imaging|symptom|
              intervention|milestone|note), title, summary, systemId?

CycleEntry    date, phase, flow?, symptoms[]            ← women's health
CycleInsight  statement, linkedMarkerIds[], caveat

CareMember    id, name, relation, shares[], sensitiveLocked[], lastActive

Panel         id, name, markerCount, price, turnaround, forWhom, includes[]
Booking       id, panelId, date, slot, mode(home|lab), status

Learning      id, statement, basis, caveat            ← outcome intelligence
```

### 5.1 Relationships that make HUMAN one system

```
Biomarker ──belongs to──▶ BodySystem ──contributes to──▶ HealthIntelligence
    │                                                          │
    └──is evidence for──▶ Priority ◀──ranked by── Decision Engine
                             │
                             ├──produces──▶ DailyAction  (what to do today)
                             ├──produces──▶ Experiment   (structured test)
                             └──schedules──▶ Retest      (re-measure)
                                                │
Experiment ──tracks──▶ Signals ──compared at──▶ Review ──▶ Readout
                                                              │
                                                              ▼
                                                          Learning
                                                              │
                                          everything ────▶ Timeline (Passport)
```

**Nothing in the app is an orphan.** Every card links backward to evidence and
forward to an action. That is what makes it feel like one system rather than a feature list.

---

## 6. Component hierarchy

```
App
└── PhoneFrame                    desktop: physical iPhone shell · mobile: full-bleed
    ├── StatusBar + DynamicIsland
    ├── ScreenHost                cross-fade + 8px rise between tabs
    │   ├── HomeScreen
    │   ├── HealthScreen
    │   ├── ActionScreen
    │   └── ProfileScreen
    ├── TabBar                    4 items, glass, blur, active-state spring
    ├── SheetHost                 stackable spring bottom sheets, drag-to-dismiss
    ├── ModalHost                 full-screen flows (booking)
    └── HomeIndicator
```

**Primitives** `GlassCard` `SectionHeader` `Chip` `Button` `ListRow` `StateDot` `Sheet`
`Pager` `PageDots` `Reveal` `Divider` `Stat`

**Visualization** `IntelligenceRing` `ProgressRing` `Sparkline` `TrendChart` `RangeBar`
`AdherenceGrid` `SystemViz` `CycleWheel` `LoopStrip` `TimelineRail`

**Composites** `HeroCard` `TodayCard` `PriorityCard` `ExperimentCard` `BodySystemsCard`
`BiomarkerRow` `InsightCard` `CareCircleRow` `PassportPreview` `PanelCard`

---

## 7. Design system

### 7.1 Foundation
Premium **native iPhone** application. Not a web dashboard, not responsive marketing.
Reference points: Apple Health data clarity + Apple product polish + iOS 26 Liquid Glass
+ premium healthcare restraint + human warmth.

**Light canvas.** A near-white ground (`#f5f8f7`) with colour carried by the content, not by
the background. Health data reads more clinical and more trustworthy on white, and the green
and teal palette stays lively without tipping into decoration.

**Liquid Glass.** Every floating surface uses the same four-part recipe, because on a light
ground any one of them alone reads as a flat white panel:

1. a translucent white fill (`--glass-1/2/3`)
2. a strong backdrop blur with a saturation boost (`--blur`, `--blur-heavy`)
3. a bright specular rim on the top edge (`--rim`)
4. a fine dark hairline plus a wide, soft shadow to lift it off the canvas

Two low-opacity colour blooms sit behind the content (`.screen::before/after`). They exist so
the glass has something to refract — without them the material is invisible.

**iOS 26 specifics implemented:** a detached floating capsule tab bar with content scrolling
visibly beneath it; capsule controls throughout (`--r-cap`); concentric corner radii; bold
large titles; glass sheets with 38px top radii.

### 7.2 Colour as a communication system

| Role | Meaning | Token |
|---|---|---|
| Optimal | healthy / improving | `--state-optimal` mint |
| Stable | in range / holding | `--state-stable` blue |
| Monitor | watch this | `--state-monitor` amber |
| Attention | needs focus now | `--state-attention` orange |
| Clinical | discuss with a clinician | `--state-clinical` coral |
| Women's health | pillar accent | `--accent-women` rose |
| Brand | intelligence ring | green → teal → sky gradient |

Colour always carries meaning. No decorative gradients, no neon, no rainbow, no gaming
aesthetic, no "AI" visuals.

Two tones of the brand exist because white demands it: `--accent-brand` (#00bd9c) for fills
and strokes, and `--accent-brand-ink` (#007a66) for text, which needs the extra contrast.

### 7.2b Women's health visual language

The pillar gets its own treatment rather than inheriting the generic card language:

- **Cycle arc** — a phase-segmented ring (menstrual · follicular · ovulatory · luteal) whose
  geometry is derived from *this member's* cycle length, ovulation ≈ length − 14. A 38-day
  cycle draws its own arcs rather than a generic 28-day template. The current phase is at full
  opacity, the rest recede, and a live day marker sits on the ring.
- **Connection chart** — two series that moved together, each normalised to its own range and
  labelled *"Shapes compare; values do not."* This is the differentiator made visible: the
  claim is drawn, not asserted, and the honesty about independent axes is part of the design.
- **Cycle-length chart** — bars against a drawn 35-day clinical reference line, so the
  threshold the copy mentions is something you can see.

### 7.3 Type
System stack (`-apple-system, "SF Pro Display", Inter`).
Scale: `44 / 34 / 28 / 22 / 17 / 15 / 13 / 11`. Negative tracking on display sizes.
Numerals: tabular for data, and `font-variant-numeric` locked so animated counts don't jitter.

### 7.4 Space, radius, elevation
4pt base grid · 20px screen gutter · radii `12 / 16 / 20 / 28 / 34` · card radius 28.
Glass = translucent fill + backdrop blur + hairline top highlight + soft ambient shadow.

### 7.5 Motion
Spring `cubic-bezier(.22, 1, .36, 1)`. Hero 600–900ms · card reveal 380ms · micro 180ms.
Ring stroke and number animate together on entry. Charts animate on viewport entry.
Motion should feel like a first-party Apple app — never like a marketing site.
Full `prefers-reduced-motion` support.

---

## 8. Interaction model

| Interaction | Behaviour |
|---|---|
| Tab switch | Cross-fade + 8px rise, scroll position preserved per tab |
| Hero ring | Stroke draws + number counts 0 → score on first view |
| Body Systems card | Native horizontal scroll-snap, dots, panel scales in on snap |
| Any card | Tap → spring bottom sheet; sheets stack; drag handle; drag-to-dismiss |
| Daily action | Tap to complete: spring check + glow, streak increments |
| Charts | Draw on viewport entry via IntersectionObserver |
| Booking | Full-screen modal stack with step progress, native back |
| Scroll | Header condenses; glass tab bar blurs content beneath |

---

## 9. Medical safety (binding on all copy)

Permitted language: *may indicate · your results suggest · worth discussing with your
clinician · consider reviewing · this is a pattern, not a diagnosis.*

Forbidden: diagnosis, causal claims from observational data, guarantees, fake certainty,
"HUMAN detected that X caused Y".

Every experiment readout must state what was **observed** and carry an explicit caveat that
observation is not proof of cause. The Health Intelligence score must be labelled a
**prototype composite**, not a validated clinical instrument. Any finding above a defined
threshold must surface a clinician-discussion prompt. Emergency-grade findings recommend
immediate care.

---

## 10. Business model (surfaced in PROFILE → Membership)

```
BLOOD TEST  →  MEMBERSHIP  →  CONTINUOUS HEALTH RELATIONSHIP
(baseline)     (relationship)   (compounding value)
```

Planning assumptions — **not validated facts**, and labelled as such in-product:
Annual ₹9,999 · Monthly ₹999 · Baseline assessment ₹2,999–₹4,999 ·
Family ₹19,999/yr · Corporate ₹3,000–₹6,000 per employee/yr.

---

## 11. Open questions and assumptions

These are genuinely underspecified. The prototype proceeds on the stated assumption;
each is cheap to change because it is isolated in content or a single component.

| # | Ambiguity | Assumption taken |
|---|---|---|
| 1 | How is the Health Intelligence score computed? | Transparent weighted composite of nine system states; explainer sheet shows contributions and labels it a prototype construct |
| 2 | "+11 since baseline" over what window? | Since the Day-0 baseline assessment, ~14 months ago |
| 3 | Does HUMAN employ clinicians? | No in-app consult in the prototype; HUMAN *routes to* a clinician and prepares the conversation. Consult is shown as a future surface, not a fake one |
| 4 | Own labs or partner labs? | Partner/aggregator model; lab brand shown at booking for trust |
| 5 | Regulatory posture | India DPDP Act 2023 framing; explicit consent surfaces in Privacy and Care Circle |
| 6 | Wearable integrations at launch | Apple Health + Google Fit as primary; Oura/Whoop shown as connectable |
| 7 | Onboarding before first test | Out of prototype scope; the empty state is documented but the demo opens mid-loop |
| 8 | ABHA / national health ID integration | Flagged as a major India-native opportunity in Passport; not implemented |
| 9 | Are Care Circle members HUMAN users? | Invited viewers with scoped access; seats not modelled |
| 10 | Who signs off retest cadence clinically? | Prototype uses conservative published intervals; real product needs clinical governance |
| 11 | Pricing GST treatment | Shown inclusive, labelled as planning assumption |
| 12 | Localisation | English only in prototype; Hindi + regional flagged as roadmap |

---

## 12. Definition of done

An investor opening the app should, without explanation, understand:

1. HUMAN understands my health.
2. HUMAN knows what matters.
3. HUMAN tells me what to do.
4. HUMAN helps me track it.
5. HUMAN learns over time.
6. HUMAN can become my long-term health system.

And it must never feel like a collection of features.
It must feel like **one intelligent health system**.
