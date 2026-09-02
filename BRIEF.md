# HUMAN — Website Build Brief

**Final. For Claude Code. Read the whole document before writing a single line.**

You are building the public website for HUMAN, a preventive healthcare membership for India. It is dark, instrument-grade, heavily interactive, and it embeds the company's **actual live app** — not screenshots of it.

Four things get this build rejected no matter how good everything else is:

1. **Any two content elements overlapping**, at any scroll position, at any viewport width. Part 3 is a constitution and Part 12.1 is an automated test that will catch you.
2. **A generic dark SaaS look** — glassmorphism, glowing borders, aurora blobs, purple-blue gradients, neon. Part 2 defines what futuristic means here, and it is not that.
3. **Fade-up entrances.** The site has exactly one reveal gesture (Part 4) and every animation on the page is a variation of it.
4. **Building the whole site in one pass.** Part 11 is a session plan. Follow it in order.

**Setup before you start.** Put this file in the project root as `BRIEF.md`, and create `CLAUDE.md` containing:

```
Read BRIEF.md in full before doing anything. It overrides your defaults.

Every session:
- Never write UI code without screenshotting the result and looking at it.
- Never report a section done without showing me 12 screenshots
  (6 scroll positions x 390px and 1440px).
- Never modify anything in src/sections/locked/.
- Follow the session plan in BRIEF.md Part 11. One session per row.
- Run tests/overlap.spec.ts after every session.
```

---

# PART 0 — How you must work

## 0.1 You must be able to see your own work

Before building anything, confirm you have a browser tool that can navigate and screenshot — Playwright MCP, Chrome DevTools MCP, or equivalent. **If you do not, stop and tell me.** Building this site blind is the single reason the previous attempt came out generic.

Standing rule for every section:

> Start the dev server. Navigate to the section. Capture screenshots at 0%, 20%, 40%, 60%, 80% and 100% of that section's scroll, at 390px and 1440px. **Look at all twelve.** If any one is not something you would put in a design portfolio, fix it before you say the section is done. Show me the screenshots when you report.

"It should work" is not a status.

## 0.2 One section per session, then lock it

Build → screenshot → self-critique → fix → **lock** → next.

Once I approve a section, move its files to `src/sections/locked/` and add it to `LOCKED.md`. **Do not modify anything in `locked/` for any reason** — not to refactor, not to share a utility, not to fix a lint warning. If a locked section genuinely must change, ask first.

This prevents the failure where session 7 quietly degrades section 2's animation while "cleaning up," and nobody notices for a week.

## 0.3 Self-critique before you report

After each section write three sentences in `CRITIQUE.md`: the weakest thing on this screen, what an art director would say first, and what you changed as a result. If you cannot find a weakness you have not looked hard enough.

## 0.4 Never invent product capability or proof

Part 1.3 is the complete list of what HUMAN does. If something is not on it, it does not appear on this site. Part 1.4 lists what may never be claimed. Both are legal and reputational constraints, not editorial preferences.

---

# PART 1 — What HUMAN is

## 1.1 The product

A preventive healthcare membership for India. One loop, running for a full year:

**Test → Understand → Choose → Act → Track → Improve.**

A phlebotomist from a partner lab draws blood at your home. A 96-marker panel comes back, plus the markers your specific body needs. The app explains every marker in plain words, gives you one score, then names the **three** things worth fixing this quarter, gives you a daily plan built on Indian food — and **retests you at week twelve to show whether it moved.**

The retest is booked on the day you join, is already paid for inside the price, and a real person calls at weeks ten, eleven and twelve to make sure you turn up.

## 1.2 The thesis — the spine of the site

Four things must happen for preventive health to work: you book a test, you understand the numbers, you know what to fix first, and you come back to check it worked.

**The first two are solved and largely free.** Labs collect blood at home in 2,500+ towns. Any free AI tool explains a report.

**The last two are solved by nobody.** HUMAN is the second half.

## 1.3 Complete capability list — nothing outside this

| Capability | What may be said |
|---|---|
| Home collection | Three visits a year, at your home, at a time you choose, by a partner lab's phlebotomist |
| Core panel | 96 parameters at signup, the same 96 again at month six |
| Panel by body | Ferritin for every woman. Testosterone for every man. A hormone panel (FSH, LH, prolactin, oestrogen, progesterone) **only when onboarding flags symptoms** |
| Week-12 retest | Booked day one, paid for inside the price, focused on priority markers |
| Plain-English results | Every marker explained without jargon, in the app, never as a PDF |
| HUMAN Score | One number, plus a biological age |
| Priorities | Top three to fix this quarter, ranked, from a doctor-approved set |
| Daily plan | Today's actions on one screen, one tap, built on Indian food. Reminders, streaks |
| Sync | Reads from the watch and cycle app she already uses. HUMAN sells no device |
| Timeline | Tests, past reports, prescriptions in one record kept for years |
| Comparison | Every number shown against her own previous result |
| AI coach | Answers any time, constrained to doctor-approved content |
| Named doctor | **Advanced plan only.** Never imply one on the entry plan |
| Care coordinator | A real person handles booking and the week 10 / 11 / 12 chase |

## 1.4 Claim rules — non-negotiable

**Never on this site:** testimonials · member counts · ratings · avatars · "trusted by" · partner, press or investor logos · any statistic about HUMAN's own performance (retention, improvement, satisfaction — none exist, the company has zero members) · cure / reverse / prevent / treat / diagnose / guarantee · "clinically proven" · "doctor recommended" · countdown timers · fake scarcity.

**And, specific to this build:** **no price, in any currency, anywhere on the site** · **no launch date, month, quarter or year** · no "launching soon", "coming in spring", or any timeline commitment. Pricing and timing are not settled, and a website is the worst place to discover you committed to either. If a section feels like it needs a price to make sense, it needs better copy, not a number.

**One number is permitted, because it is true: 150.** The first batch is capped at a hundred and fifty members. That is a real operational limit, not a marketing device, and it may be stated plainly. It appears in exactly four places — the hero micro line (7.1), the founder's note (7.10), one question (7.12), and the close (7.13) — and nowhere else.

**What is still banned around it:** a live counter · "only N left" · "N people joined today" · a progress bar toward 150 · a countdown · any implication that the batch is filling. **Unless a number is wired to real data, it is a lie**, and a fabricated counter would undo the credibility that 7.10 exists to build. State the cap once, explain why it is 150, and let it sit there.

**Always on this site:**

- The medical scope line, in the footer and in the pricing section, VERBATIM: *"HUMAN supports your health decisions. It does not replace your doctor. If something in your results looks urgent, we will tell you to see one."*
- A permanent **`Sample data`** label on every chart and on the app frame. None of the numbers shown belong to a real member.
- The prototype is always described as a prototype running on sample data. Never a demo, a beta, a preview, or "early access".
- A source on every disease statistic: *ICMR–INDIAB, Lancet Diabetes & Endocrinology, 2023.*

**The only permitted external statistics:** 101 million Indians live with diabetes · 136 million more are in the reversible window before it · 43 in 100 who have it don't know.

## 1.5 Audience

A woman aged 28–52, top-ten metro, household income ₹12L+, probably managing or suspecting PCOS, a thyroid condition, or low iron. **She arrives from Instagram, from a creator she trusts, on a phone, at night, with the sound off.**

Assume 80%+ mobile. **Mobile is the primary design, not the small version.** Design and review it first.

Secondary: men the same age (same price, different panel), and adult children buying for a parent.

## 1.6 The two actions

There are exactly two things a visitor can do, and no third.

**Primary — Join the waitlist.** One field, asking for a **WhatsApp number**. Nothing else. No email, no name, no city, no "how did you hear about us". This is not minimalism for taste — the funnel needs a 12% click-to-waitlist rate, and a two-field form does not reach it.

**Secondary — Try the prototype.** Opens the real app, full screen, in a new tab: `https://minimum-bronze-wj3yadap.edgeone.dev/`. Always labelled honestly (Part 5.6).

The pairing is the whole conversion argument: *look at what we built, then tell us where to reach you.* One asks for nothing and gives everything; the other asks for ten digits.

**There is no third action.** No "book a demo", no "talk to us", no newsletter, no blog, no careers link, no login button, no pricing page.

## 1.7 Voice

A trusted doctor explaining something simply. Calm, precise, warm, unhurried. Short declaratives, one idea per sentence, second person, active voice, sentence case everywhere including buttons.

**No exclamation marks. No emoji. Anywhere.**

**Banned words:** journey · holistic · wellness · unlock · empower · revolutionise · cutting-edge · seamless · ecosystem · game-changing · transform · optimise · biohack · longevity · supercharge · effortless · elevate · curated · bespoke · world-class · next-generation · "AI-powered" as a boast.

**Tagline:** *Know earlier. Act sooner.* Appears exactly twice — the header lockup, and the final line above the footer.

---

# PART 2 — Art direction: instrument-grade dark

## 2.1 What futuristic means here

**The reference is a scientific instrument, not science fiction.**

A high-end diagnostic machine in a dark lab: matte black housing, one illuminated readout, calibration marks etched at precise intervals, thin white strokes, live telemetry in a corner. Precision as luxury.

**It does not mean** cyberpunk, neon, HUD corner brackets, glitch, scanlines, holograms, wireframe globes, Matrix rain, purple-to-blue gradients, or "AI startup dark mode."

The one sentence that resolves almost every judgment call:

> **The page is a dark measurement chamber. The app is the only lit object in it.**

HUMAN's app has a light UI. On a near-black page the embedded phone becomes the single light source — the product literally glows. That one decision solves premium-ness and app-prominence together.

## 2.2 Palette

| Token | Hex | Role | Rules |
|---|---|---|---|
| `void` | `#05100D` | The page | Near-black with a green undertone. **Never `#000000`, never `#0B0B0B`.** |
| `surface-1` | `#0A1A15` | Raised surfaces, pricing card | |
| `surface-2` | `#0F241E` | The only second elevation step | There is no third |
| `hairline` | `#1C332B` | Structural 1px rules | The workhorse — 90% of structure is drawn with this |
| `hairline-lit` | `#2B4A3F` | Active rules, drawing rules, focus | |
| `text` | `#E8F0EC` | Primary text | **Never pure white** — it is fatiguing on near-black and reads cheap |
| `text-2` | `#93A69E` | Secondary text | Minimum 15px |
| `text-3` | `#5F726B` | Telemetry, sources, ticks | Minimum 12px, never a full sentence |
| `jade` | `#7FE3C0` | The one bright accent — live, improved, in-range | **Fewer than 12 elements site-wide.** Scarcity is what makes it read expensive |
| `jade-deep` | `#125F4B` | Chart fills, in-range bands, primary button | |
| `amber` | `#E0A458` | Worth attention, out of range | **Never red.** HUMAN does not frighten people |
| `ice` | `#A8D8E8` | Data ink only — chart axes, ticks | Max 30% opacity. **Never for text** |

Nothing outside this table appears anywhere. No purple. No red. No neon. No second green.

## 2.3 The light model

Exactly **three** light sources exist on this page:

1. **The phone screen** — the brightest thing on the site by a wide margin.
2. **One jade glow behind the phone** — radial, 900px, `#7FE3C0` at 8%, blurred 120px, behind the frame only. The only glow on the site.
3. **A section wash** — a barely perceptible radial from `#0A211B` at 40% viewport height to `void` at the edges. Under 10% luminance range across a full viewport. It should be almost impossible to point at.

**Everything else is unlit.** No glowing borders, no text shadows, no glow on buttons, cards, icons or rules. If you are adding a fourth light source, you are building the generic dark site.

**Elevation is surface lightness and hairline brightness — never shadow.** Drop shadows are invisible on dark and their presence is a tell that the designer was working in light mode. One shadow token exists, used on one element (the phone frame): `0 40px 120px -30px rgba(0,0,0,0.9)`.

## 2.4 Banding — the detail that decides whether dark looks expensive

Dark gradients band on 8-bit displays, and banding is the commonest reason a dark site looks cheap.

**Required:** a tiled noise overlay across the entire page at **2.5% opacity**, `mix-blend-mode: overlay`, `pointer-events: none`, `z-index: 300`, generated once as a 128×128 SVG `feTurbulence` or small PNG and repeated. Every gradient must be dithered by it. Verify by screenshotting a gradient region and inspecting for stepping.

## 2.5 Typography

**One family: Switzer** (Fontshare, Indian Type Foundry, free for commercial use). Self-hosted WOFF2, subset to Latin. Weights 400, 450, 500 only.

**One exception, used exactly once on the whole site: Gambetta Italic 400** (also Fontshare) — the founder's signature in 7.10. Nowhere else.

**Do not substitute** Inter, Poppins, Manrope, DM Sans, Space Grotesk, or a system stack. Fallback only if Fontshare is unreachable: `"Switzer", "Helvetica Neue", Arial, sans-serif`, with a metric-matched fallback so headlines never reflow on font load.

**Weight compensation.** Light text on dark optically bolds. Every weight drops one step from what you would use on white: body 400, headings 450, display 450. **Never 600 or 700 anywhere.**

| Style | Desktop | Mobile | Weight | Tracking | Line height |
|---|---|---|---|---|---|
| `display-xl` | 104px | 44px | 450 | -0.035em | 0.94 |
| `display-l` | 72px | 34px | 450 | -0.03em | 1.0 |
| `display-m` | 48px | 28px | 450 | -0.025em | 1.08 |
| `heading` | 28px | 22px | 450 | -0.01em | 1.2 |
| `body-l` | 22px | 18px | 400 | 0 | 1.5 |
| `body` | 17px | 16px | 400 | 0 | 1.6 |
| `caption` | 14px | 13px | 400 | 0 | 1.45 |
| `telemetry` | 12px | 11px | 450 | **+0.08em** | 1.3 |
| `numeral-xl` | 160px | 76px | 450 | -0.04em | 0.9 |
| `numeral-l` | 64px | 40px | 450 | -0.03em | 1.0 |

Use `clamp()` between the two endpoints; both endpoints are binding.

**Telemetry is not monospace.** Every dark technical site reaches for JetBrains Mono or Space Mono for small data labels, and it is the fastest way to look like all of them. Switzer 450 at 11–12px with +0.08em tracking and **tabular lining figures**. All figures everywhere are tabular so nothing jitters during a count-up.

**Prohibitions.** No all-caps labels anywhere · no tracked-out eyebrows · no accenting one word of a headline in a different colour or weight · no middle-dot meta strings · no arrows on buttons or links · no text over imagery · no italics except the one signature · body line length capped at 62 characters, display at 34.

**Every display line break is manually placed.** Where copy in Part 7 is written across two lines, those two lines are the design. Set explicit breaks per breakpoint; headlines never reflow arbitrarily.

## 2.6 Geometry and material

- **Border radius: exactly two values.** `2px` for controls, chart elements and telemetry chips. `24px` for the phone frame and the pricing card. **Nothing else on the site has a radius at all.**
- **Structure is drawn with hairlines, not boxes.** There is no `Card` component on this project. Content is separated by 1px rules, alignment and space. The only two boxed objects on the page are the phone frame and the pricing card.
- **Calibration marks** are the one permitted decorative motif: short 1px ticks at regular intervals along a rule, like graduations on an instrument. Never as a background pattern, never animated on their own.
- **No icons.** Four permitted glyphs total: a hairline check (solved), an open circle (not solved), a chevron (disclosure), a share glyph (post-submit). Nothing larger than 20px.
- **No imagery.** No stock photography, no illustration, no 3D, no DNA helices, no molecules. Permitted visuals: the live app, four hand-built SVG charts, one optional founder portrait.

## 2.7 Layout and spacing

- **Desktop:** 12 columns, 72px gutters, max content width 1,280px, page margin 88px.
- **Mobile:** single column, 20px margin, no exceptions.
- **Alignment:** left by default, everywhere, including headlines. Only two centred compositions exist on the whole site: the full-bleed statement panels, and the final waitlist form.
- **Spacing scale — these eight values only:** 8, 16, 24, 40, 64, 104, 168, 264px. Nothing in between. Section padding 168px desktop / 88px mobile.
- Vertical rhythm is 8px. Every margin and padding is a multiple of 8.

---

# PART 3 — The non-overlap constitution

This is the part that failed last time. Read it twice. Every rule has a test attached in Part 12.

## 3.1 Definitions

**Content element** = anything containing text, an image, the app frame, a chart, or an interactive control.

**Decorative layer** = the noise overlay, section wash, jade glow, calibration marks, telemetry field. Non-interactive, `aria-hidden`, `pointer-events: none`.

> **Two content elements may never intersect. Ever. At any scroll position, at any viewport width, during any animation.**
> Decorative layers may sit behind content freely — that is their only job.

## 3.2 The Frame System

The structural idea that prevents overlap:

> **At every breakpoint, each section is divided into a fixed set of named, non-intersecting rectangular cells. Every content element is assigned to exactly one cell. An element may never render outside its cell. Cells never intersect.**

```
┌─ SECTION ────────────────────────────────────────────────────┐
│  ┌─ CELL: text ──────────┐ ┌gap┐ ┌─ CELL: stage ──────────┐  │
│  │ cols 1–5              │ │ 1 │ │ cols 7–12              │  │
│  │ overflow: hidden      │ │col│ │ overflow: hidden       │  │
│  │ ONLY type             │ │DEAD│ │ ONLY the animation    │  │
│  │ never moves laterally │ │    │ │ clipped to this box   │  │
│  └───────────────────────┘ └───┘ └────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

**Binding rules:**

- Every cell is a CSS Grid area with a declared `overflow: hidden`. An animation that would leave its cell is clipped, not permitted to escape.
- There is always **at least one full column of dead space** between adjacent cells on desktop, and **at least 40px** between stacked cells on mobile. The gap is a collision buffer, not decoration.
- The **text cell never contains anything that moves laterally.** Text may crossfade in place. It may never slide, and nothing may ever enter the text cell from outside. This one rule permanently eliminates "the animation slid over the headline."
- On mobile the split is always horizontal (text above, stage below), never side by side, and the text cell has a **fixed height reserved for its longest state** so changing copy cannot resize it and push the stage.

## 3.3 The Reserved Space Doctrine

> **Every element occupies its final layout box from the first paint. Motion happens only in `transform`, `opacity` and `clip-path`.**

- **Nothing animates `width`, `height`, `top`, `left`, `margin`, `padding`, `font-size` or `gap`.** The only exception is the two disclosure components (pricing breakdown, FAQ), which animate a height on a container that already reserves its maximum and cannot push anything below.
- Every image, chart and iframe declares an explicit `aspect-ratio` so its box exists before the asset loads.
- Fonts use `font-display: swap` **plus** a metric-matched fallback. A headline must not reflow on font load.
- **Target CLS: 0.00.** Not "under 0.1". Zero.

## 3.4 The Sticky Contract

Every sticky stage uses this exact structure and no other:

```
SECTION   position: relative; height: N × 100vh      ← the scroll budget
└── STAGE   position: sticky; top: 0; height: 100vh; overflow: hidden
    ├── CELL: text     (fixed box, crossfade only)
    └── CELL: stage    (fixed box, clipped, animates)
```

- A sticky stage is **exactly one viewport tall**. Never taller. Never `min-height`.
- **No ancestor of a sticky element may have `overflow: hidden`, `overflow: clip`, or a `transform`.** This is the number-one cause of "the sticky section broke." If you use a smooth-scroll library, configure it so it does not create a transform ancestor of any sticky stage — **verify this explicitly and tell me you verified it.**
- Sticky stages never nest.
- **Minimum 40vh of ordinary flowing page between the end of one sticky stage and the start of the next.** The visitor must feel the page land between set pieces. Do not remove this to save length.
- The section height *is* the animation's scroll budget. If a sequence needs more room, **increase the section height** — never compress the sequence.

## 3.5 The z-index scale

Seven values. No other z-index exists anywhere in the codebase.

| Layer | z | Contents |
|---|---|---|
| `wash` | -1 | Section wash, jade glow, calibration field |
| `base` | 0 | Page content in normal flow |
| `stage` | 10 | Sticky stage contents |
| `raised` | 20 | Phone frame, chart tooltips |
| `header` | 100 | Fixed header |
| `bar` | 110 | Mobile sticky action bar |
| `intro` | 250 | The intro overlay (Part 7.0) |
| `grain` | 300 | The noise overlay, `pointer-events: none` |

## 3.6 Positioning rules

- **Content is never absolutely positioned.** Grid and flex only.
- Absolute positioning is permitted only for decorative layers *inside* a `position: relative; overflow: hidden` cell.
- **No negative margins to create overlaps.** If two things must visually stack, they are explicit children of the same grid cell with the stacking declared.
- No `100vh` on anything except a sticky stage. The hero uses `100svh` so mobile browser chrome cannot cause a jump.
- **Only frame cells may have `overflow: hidden`.** Everywhere else, overflowing content means the container is wrong — fix the container, don't clip.

## 3.7 Responsive integrity

Breakpoints: `<480`, `480–767`, `768–1023`, `1024–1439`, `≥1440`. Verify at **375, 390, 430, 768, 1024, 1280, 1440, 1920, 2560px**.

At every width: no horizontal scroll ever · no text below 12px · no tap target below 44×44px · nothing clipped · every sticky stage exactly 100vh · every frame cell still non-intersecting.

---

# PART 4 — Motion: The Print Language

## 4.1 One gesture, used everywhere

The intro sequence is not a special effect. It is **the site's only reveal gesture**, and every appearance of every element is a variation of it.

> **A rule draws. Content prints onto it. Ticks calibrate it. Everything settles.**

The whole website is one instrument drawing itself, section by section, as she scrolls. That coherence is what makes it feel designed rather than assembled, and it is what the previous build was missing. **There is no "fade up." There is no "slide in." There is one gesture, at different scales, in different orientations.**

## 4.2 The four moves

Every animation on the site is built from these four and nothing else.

### G1 · RULE — a line draws itself

A 1px `hairline-lit` stroke draws from an origin. Three origins permitted: **centre-out**, **left-to-right**, **top-down**.

| Property | Value |
|---|---|
| Duration | 680ms standard · 1,400ms for a full-width or charted rule |
| Easing | `ease-instrument` |
| Technique | `stroke-dashoffset` for SVG; `transform: scaleX/scaleY` with `transform-origin` for DOM |
| Scroll-linked variant | `dashoffset` bound directly to stage progress — fully reversible |

**A rule never fades in. It always draws.**

### G2 · PRINT — content revealed by a mask travelling along the rule

Not a fade. Not a slide. A hard-edged mask wipes in the rule's direction, leaving content behind it, as though laid down by a print head.

| Property | Value |
|---|---|
| Duration | 260ms per unit (letter, word, row, label) |
| Stagger | 55ms · **maximum 5 units**, then units group |
| Easing | `ease-entrance` |
| Overlap with G1 | Print begins at 55% of the rule's draw, so the two read as one gesture |
| Technique | `clip-path: inset()` or an SVG mask |
| Travel | **Content itself does not move. Only the mask moves.** |

That last line is the discipline that keeps the site stable: a reveal costs zero layout, zero position change, and cannot collide with a neighbour.

### G3 · TICK — calibration marks confirm the measurement

After content lands, 3–5 short 1px `text-3` ticks appear along the rule at regular intervals. 40ms apart, 160ms each, opacity only.

This is the move that makes everything look like an instrument, and it is the cheapest of the four. Use it on every rule that carries a measurement or a set of items — **never** on a purely structural rule, or it becomes wallpaper.

### G4 · SETTLE — it stops, permanently

Every sequence ends in absolute stillness. No residual drift, no idle loop, no hover shimmer. The composition becomes a poster and stays one.

## 4.3 Tokens

| Token | Value | Used for |
|---|---|---|
| `ease-entrance` | `cubic-bezier(0.16, 1, 0.3, 1)` | G2, anything appearing |
| `ease-move` | `cubic-bezier(0.4, 0, 0.2, 1)` | Anything repositioning |
| `ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Anything leaving |
| `ease-instrument` | `cubic-bezier(0.7, 0, 0.2, 1)` | G1, toggles, screen advances |
| `dur-micro` | 160ms | Hover, focus, fills, G3 ticks |
| `dur-print` | 260ms | One G2 unit |
| `dur-rule` | 680ms | One G1 rule |
| `dur-composition` | 820ms | A group resolving |
| `dur-draw` | 1400ms | A full-width or charted rule |
| `dur-boot` | 1800ms | The intro sequence, once |
| `stagger` | 55ms | Between print units, max 5 |
| `travel-object` | 28px | The only distance an object moves on entrance |
| `scale-in` | 0.985 → 1.0 | The only entrance scale permitted |

Nothing animates longer than 1,400ms except the intro. Nothing travels further than 28px.

## 4.4 Composition rules — density without chaos

You are running this gesture 30+ times across the page. Four rules keep that from becoming noise.

1. **One rule draws at a time within a section.** Sequential, never parallel. Two rules drawing simultaneously reads as a loading screen.
2. **Maximum three G1→G2→G3 cycles per section.** If a section needs more, it is two sections.
3. **Print units cap at five.** A six-item list prints as two groups of three. Long lists print as a single block.
4. **The gesture always completes.** A half-drawn rule at rest is a bug. If the visitor stops scrolling mid-sequence, the sequence finishes on its own within 400ms rather than freezing partway.

## 4.5 The choreography law

> **At any moment at most one composition is animating — and the user must be able to stop scrolling at any point and find a still, complete, correct-looking page.**

- Two adjacent sections never animate simultaneously.
- Every sequence has a defined rest state at 0% and 100% scroll progress, and **both must be valid poster frames.**
- **No looping ambient animation anywhere.** Nothing pulses, breathes, floats or drifts on its own. Three exceptions, each firing exactly once: the intro, the loop-circuit pulse (7.4), and the phone glow ignition (7.5).

## 4.6 The horizon rule — section boundaries

Every section boundary is marked by a **full-width G1 rule, left-to-right, 900ms**, drawn as the section enters at 85% of viewport height. It sits in the section's top padding, is `hairline` at 40% opacity, and carries no ticks.

This is the connective tissue. Fourteen of them across the page, identical. **Do not vary them.** Their sameness is what makes the site read as one continuous document rather than stacked blocks.

## 4.7 Where each section uses the gesture

Every section already has a natural rule inside it. **Use the real one — do not add a decorative line next to it.**

| Section | The rule (G1) | What prints (G2) | Ticks (G3) |
|---|---|---|---|
| 7.0 intro | Centre-out baseline, 360px | HUMAN, letter by letter | 5, one per letter |
| 7.1 hero | Inherited from the intro, splits | Headline lines, then sub, button, micro | 5 along the right edge |
| 7.2 silent build | **The drift line itself**, scroll-linked | "You feel fine" ×4, then "Still nothing hurts" | The x-axis year marks |
| 7.3 ledger | **Each row's hairline**, sequential | The verdict at each rule's end | None — checks and circles do that job |
| 7.4 loop | **The circuit**, one closed stroke | Each node label as the stroke passes | The 6 nodes are the ticks |
| 7.5 app | **The phone frame outline** | The screen prints into the frame | The 5-mark progress rail |
| 7.6 retest | **The timeline rail**, top-down | The three chase labels | Weeks 1–11 |
| 7.7 panel | Rule under each of the 3 priorities | Priority text | The 96 dots are a calibration field |
| 7.8 your own past | **The x-axis**, left-to-right | The two values, the delta | Week markers |
| 7.9 don't sell | **The strike-through on each item** | Nothing — the strike is the move | None |
| 7.10 don't know | One short rule above the block | Paragraphs as one unit, then the signature alone | 3 |
| 7.11 price | **The card's border**, one continuous rule | Price, then inclusions as one block | None |
| 7.12 questions | **Each divider**, left-to-right | The answer, on open | None |
| 7.13 close | **The form's underline**, centre-out | Headline, then the field | 3 under the field |

In eleven of fourteen sections the rule is a line that **had to exist anyway** — an axis, a border, a divider, a rail. Nothing decorative is added. The site's structure and its motion are the same thing.

## 4.8 Scroll-linked vs scroll-triggered

Two mechanisms. Never mixed inside one element.

**Scroll-triggered** (~70% of the site): fires once when the element crosses 78% of viewport height, plays a fixed-duration sequence, rests permanently. Never replays, never reverses.

**Scroll-linked** (six sequences only — 7.2, 7.3, 7.5, 7.6, 7.8, and the horizon rules): state is a pure function of scroll position within a sticky stage. Must be **reversible and idempotent** — scrolling back retraces exactly, and jumping to a position produces the correct state without playing intermediate frames.

All scroll-linked work happens in **one shared `requestAnimationFrame` loop**, not one listener per component. All listeners `passive`. `will-change` applied only while a stage is in view.

## 4.9 Smooth scroll

A light inertial layer (Lenis or equivalent), duration ~0.9. It must never prevent, delay, capture or redirect scroll input · be **disabled entirely on touch devices** · be disabled under `prefers-reduced-motion` · not create a transform ancestor of any sticky stage.

**Scroll hijacking, snapping and section locking are banned outright.** If the user flicks hard, the page moves as far as they flicked.

## 4.10 Reduced motion

Under `prefers-reduced-motion: reduce` the site becomes **the poster version**, not a broken skeleton:

- Every sticky stage collapses to a single viewport rendering its **final** state, statically.
- Rules render fully drawn. Print masks render fully open. Counters render final values.
- The live app iframe is replaced by a static screenshot.
- The intro shows the wordmark and rule statically for 300ms, then fades over 300ms.
- The page remains completely legible and the argument is unchanged.

This is a first-class shippable output. Screenshot and review it like any other state.

## 4.11 What breaks the language

If any of these appear, coherence is gone and the site reverts to generic:

Fade-up entrances · opacity-only reveals with no rule · elements sliding in from off-screen · scale-up entrances · blur-in · rotation · bounce or overshoot easing · staggering more than five units · two rules drawing at once · a rule that fades instead of drawing · ticks on a purely structural rule · a rule that redraws on every scroll pass · any easing outside the four tokens.

---

# PART 5 — The app, mounted from source

**The HUMAN app already exists in this repository.** It was built with Claude Code. You have its source.

That changes everything about this section. There is no cross-origin problem, no `frame-ancestors` header to negotiate, no `postMessage` handshake, no 2,500ms timeout, no poster-to-iframe crossfade. You can read the app's components, import them, and render them directly inside the phone frame. The product on the website is **the product**, not a recording of it.

The hosted prototype at `https://minimum-bronze-wj3yadap.edgeone.dev/` remains in play for one purpose only: the **"Try the prototype"** link, which opens the full app in a new tab so a visitor can actually use it on her own screen. It is never iframed.

## 5.1 Session 0 — repo discovery

Read the repository before you write anything. Report all eight.

**1. Repository layout.** What is at the root today? Is the app a standalone Vite/Next project, or already structured as a workspace? Propose one of two layouts and wait for my answer:

```
Option A — workspace           Option B — sibling app
/apps/app      (existing)      /            (existing app, untouched)
/apps/site     (new website)   /site        (new website, own package.json)
/packages/ui   (shared tokens) 
```

**Do not restructure my repo without asking.** If moving the app breaks its deployment, say so.

**2. Framework and build.** React or something else? Vite, Next, CRA? Version? TypeScript?

**3. Where are the screens?** Find the components that render each of the five screens. Give me the file path and the export name for each. Map them to these ids: `timeline`, `score`, `priorities`, `plan`, `week12`. **If a screen doesn't exist, say so — do not substitute another one.**

**4. Routing.** React Router? A hash router? Its own state machine? Can a single screen component be rendered standalone, outside the router, without crashing?

**5. Styling.** Tailwind, CSS modules, styled-components, plain CSS? Is there a global stylesheet, a Tailwind preflight, or anything that sets styles on `html`, `body` or `*`? **This is the question that decides Strategy 1 vs Strategy 2.**

**6. Global state.** Context providers, stores, `localStorage`, service workers, viewport meta manipulation — anything the app assumes it owns. List what a screen needs wrapped around it to render.

**7. The collision test.** Thirty minutes, and it settles the architecture. Create a throwaway page: `void` background, one dark heading, and one app screen component mounted beside it inside a 390×844 box. Screenshot it. Then answer:

- Does the app screen render correctly?
- Did anything about the dark heading change — font, colour, size, spacing?
- Did the page background change?
- Any console errors?

**Report the screenshot.** Clean render, no bleed → Strategy 1. Any bleed you cannot scope in under an hour → Strategy 2.

**8. Screenshots.** Write `scripts/capture-app.mjs` — Playwright against the **local dev server**, 390×844, `deviceScaleFactor: 3`, one PNG per screen to `public/app/screen-{id}@3x.png`. These are the mobile experience, the reduced-motion state, and the annotation authoring reference. Run it, commit the output, and from those images author the annotation anchors (7.5.1).

## 5.2 Three strategies, in priority order

### Strategy 1 — direct component mount. **The target.**

Import the five screen components into the site and render the active one inside the phone frame. No iframe anywhere.

- Screen changes are a React state change: instant, no navigation, no reload, no flash.
- The app is mounted inside a `MemoryRouter` (or the equivalent isolated router) so its routing never touches the site's URL.
- Whatever providers discovery step 6 identified are wrapped around the mount point, and nowhere else.
- Sample data is passed in explicitly as props or a fixture module, never fetched.

**Style isolation is mandatory and non-negotiable:**

- The mount point is a single wrapper element carrying `contain: layout style paint` and `isolation: isolate`.
- The app's CSS is loaded **scoped to that wrapper**, never globally. If it is Tailwind with preflight, disable preflight for the app's build and scope its utilities with a prefix or a wrapper selector.
- No app stylesheet may contain a selector for `html`, `body`, `:root` or `*` once scoped. Grep for these and report what you find.
- The site's own tokens must not leak inward either. The wrapper resets inherited typography so the app renders exactly as it does standalone.

**Verification:** screenshot the site's hero and the app's screen side by side against standalone renders of each. Both must be pixel-identical to their originals. If either shifted, isolation has failed — fix it or fall back.

### Strategy 2 — same-origin route, iframed. **The safe answer.**

Build the app to a route in the same deployment — `/app-embed` — and iframe that route.

- **Same origin**, so `contentWindow` is directly accessible. No `postMessage` handshake needed; call the app's navigation directly, or set a hash.
- Perfect CSS and JS isolation, for free.
- No `frame-ancestors` problem, because the site is framing itself.
- Costs one extra document load, which is invisible if it is warmed during section 7.4.

**Take this if the collision test shows any bleed.** It gives you 95% of Strategy 1's result with none of its risk, and shipping it is not a defeat.

### Strategy 3 — external iframe to the hosted prototype. **Fallback only.**

Only if the app cannot be built inside the site's pipeline at all. Report why before doing it.

## 5.3 The `AppStage` contract

Whichever strategy ships, everything else in the site talks to one module — `src/lib/AppStage.ts` — so the strategy can be swapped without touching a single component.

```
AppStage.mount(container)        → Promise<void>
AppStage.show(screenId)          → void      // debounced, 250ms
AppStage.setInteractive(boolean) → void
AppStage.getState()              → 'idle' | 'ready' | 'live' | 'interactive' | 'degraded'
AppStage.destroy()               → void
```

Rules: `show()` is idempotent — calling it with the current screen does nothing. Fast scrolling must never queue navigations; it coalesces to the latest. The stage mounts **once** and stays mounted for the life of the page; never unmount on scroll-away.

## 5.4 The five states

The frame renders something correct in every state. Never an empty box, never a spinner, never a visible error.

| State | Trigger | What she sees |
|---|---|---|
| `IDLE` | Page load | Nothing mounted. Poster preloading. |
| `READY` | Section within 1.2 viewports | App mounted behind a static poster of screen 1. **No visual change.** |
| `LIVE` | Frame locks (7.5 Beat 1 completes) | 240ms crossfade poster → live app, zero layout change. Telemetry reads `live`. |
| `INTERACTIVE` | "Take control" activated | `pointer-events: auto`, 1px `jade` ring, telemetry reads `you have control` |
| `DEGRADED` | Mobile, reduced motion, or mount failure | Posters driven by the same scroll sequence. She sees a working demo and never knows. |

With Strategy 1 the mount is fast enough that `READY → LIVE` may be imperceptible. That is the correct outcome — do not add a delay to make the transition visible.

## 5.5 Scroll integrity and taking control

**Before control is taken:** `pointer-events: none` on the whole app wrapper. Scroll passes straight through. The app cannot capture the wheel, trap touch, or steal focus. Under Strategy 1 also ensure no app element is focusable — set `inert` on the wrapper.

**Taking control.** At 92% of the section's scroll progress, a control prints in beneath the frame: **"Take control"**. Activating it:
- sets `pointer-events: auto` and removes `inert`
- draws a 1px `jade` ring around the frame (G1, centre-out, 400ms)
- changes telemetry to `you have control`
- sets `overscroll-behavior: contain` so scrolling inside the app never chains to the page
- clears all annotations (7.5.1)
- shows a quiet **"Release"** control beside it

**Releasing.** Release, Escape, or scrolling the section out of view all return to `LIVE`. Focus returns to the Release control's previous sibling, never to `<body>`.

**Never auto-enable control.** It is always her decision. An app that becomes interactive on hover is a scroll trap.

## 5.6 "Try the prototype"

The one place the hosted URL is used. It appears in three places — the hero (ghost button), beneath the phone frame in 7.5, and in the close (7.13) — and it always does the same thing: opens `https://minimum-bronze-wj3yadap.edgeone.dev/` in a new tab, `rel="noopener"`.

It is always labelled honestly. Adjacent micro copy, VERBATIM: *"It's a prototype, running on sample data."*

Never call it a demo, a beta, a preview, or "early access". It is a prototype and saying so plainly is worth more than the alternative.

## 5.7 Mobile

**Do not mount the live app on mobile.** Below 768px the section runs `DEGRADED` by design — real screenshots, same scroll choreography, three screens (`timeline`, `priorities`, `week12`). Beneath the frame: **"Try the prototype"**, opening the real thing full-screen in a new tab.

This is not a compromise. On a phone, the full-screen real app is a better demo than a postage-stamp embed, and it costs her nothing to come back.

## 5.8 Failure paths — every one silent

| Failure | Behaviour |
|---|---|
| Style bleed found in the collision test | Strategy 2. **Tell me** — do not ship a site with the app's CSS leaking into it |
| A screen component throws on mount | Error boundary → `DEGRADED` for that screen only. Console log. Others stay live |
| The whole mount fails | `DEGRADED`. Posters are local, so the section is unaffected |
| Slow first render | Poster holds. She sees a correct screen the entire time |
| Reduced motion | `DEGRADED`, no transitions, final screen static |
| JS disabled | Poster of screen 1 renders from markup. Section still reads |
| The hosted prototype is down | Only affects "Try the prototype". The embedded app is local and unaffected |

**No spinner. No skeleton. No "loading the app…". No error state visible to the user.** Ever.

## 5.9 Build sequence for this part

| Step | Deliverable |
|---|---|
| 1 | Discovery report (5.1, all eight, including the collision screenshot) |
| 2 | Chosen strategy, with the reason, in `DECISIONS.md` |
| 3 | `scripts/capture-app.mjs` run, five screenshots committed, annotation anchors authored |
| 4 | `/lab` route: dark page, frame, glow, **poster only** — no live app yet |
| 5 | `AppStage.ts` implementing the chosen strategy, plus the isolation proof screenshots |
| 6 | The five states, each one screenshot |
| 7 | Scroll-driven screen changes, debounced |
| 8 | Annotations (7.5.1) |
| 9 | Take control / release |
| 10 | Mobile `DEGRADED` path |
| 11 | `tests/embed.spec.ts`, all passing (Part 12.5) |

**Do not proceed past step 4 until that single screen — dark page, phone, glow, one static app screen inside it — looks like something you would put in a portfolio.** If the poster version doesn't look expensive, the live version won't either.

---

# PART 6 — Page map and scroll budgets

Total: **~2,120vh desktop / ~1,570vh mobile.**

| # | Section | Desktop | Mobile | Type | Set piece |
|---|---|---|---|---|---|
| 7.0 | Intro sequence | overlay, 1800ms | overlay, 1400ms | Overlay | ● |
| 7.1 | Boot + opening | 130vh | 105vh | Flow | ● |
| 7.2 | The silent build | 180vh | 130vh | Sticky | ● |
| 7.3 | The ledger | 165vh | 115vh | Sticky | ● |
| 7.4 | The loop | 140vh | 110vh | Flow | — |
| 7.5 | **The app** | 400vh | 280vh | Sticky | ●●● |
| 7.6 | The retest | 165vh | 105vh | Sticky | ● |
| 7.7 | The panel | 145vh | 105vh | Flow | — |
| 7.8 | Your own past | 165vh | 115vh | Sticky | ● |
| 7.9 | What we don't sell | 110vh | 90vh | Flow | — |
| 7.10 | What we can't tell you yet | 100vh | 80vh | Flow | — |
| 7.11 | The price | 115vh | 95vh | Flow | — |
| 7.12 | Questions | 140vh | 100vh | Flow | — |
| 7.13 | The close | 105vh | 90vh | Flow | ● |
| 7.14 | Footer | 60vh | 60vh | Flow | — |

**The narrative spine.** Thirteen beats, each earning the next:

| Beat | What she should be able to say afterwards |
|---|---|
| Opening | "This is about what's happening inside me right now." |
| Silent build | "Serious things build for years without hurting." |
| Ledger | "Two of the four steps are solved. Two aren't. That's a real gap." |
| Loop | "HUMAN is a loop, not a report." |
| App | "I can see exactly what I'd get — I just used it." |
| Retest | "They come back and check. Nobody else does that." |
| Panel | "They test what my body actually needs." |
| Your own past | "I'd be compared to myself, not a textbook." |
| Don't sell | "They have nothing to sell me, so I can trust the advice." |
| Don't know | "They're being honest about what they haven't proven." |
| What's included | "I know exactly what I'd be getting." |
| Questions | "My obvious worry has been answered." |
| Close | "Only 150 get in. I want to be one of them." |

**Emotional and motion curve.** Unease (7.1–7.2) → clarity (7.3–7.4) → desire (7.5–7.8) → trust (7.9–7.10) → decision (7.11–7.13). Motion intensity follows the same arc **and then drops**: 7.9 through 7.12 have the least animation on the page. Decisions get made in stillness. **Do not "liven up" the trust sections.**

---

# PART 7 — Section by section

Each section gives: job · budget · frame · copy (**VERBATIM — do not paraphrase, expand, or generate alternatives**) · what stays still · what moves · mobile · failure modes.

---

## 7.0 The intro sequence

**Job.** The first thing anyone sees. It must earn its 1.8 seconds and never cost a conversion.

**The concept.** An instrument powering on, printing its name, and getting out of the way. The wordmark is not faded in and is not typed — it is **printed onto a baseline** by a mask wiping left to right, the way a plotter lays down a trace. Then the wordmark goes, and **the baseline stays.**

That surviving rule is the whole idea. It is not an intro that ends and a site that begins — the rule the instrument drew is handed to the hero, where it splits into the header underline and the headline's baseline. She never sees a seam.

**Beat sheet — desktop, 1,800ms.** The hero is fully painted underneath from ~200ms; the intro is an opaque overlay that dissolves, never a gate on rendering.

| Beat | Time | What happens |
|---|---|---|
| 0 | 0–120ms | Pure `void`. Nothing. A held black beat before the instrument wakes. This silence is what makes the rest feel deliberate. |
| 1 | 120–800ms | **G1**: a 1px `hairline-lit` rule draws **centre-out**, both directions, to 360px, centred. `ease-instrument`, 680ms. |
| 2 | 500–1150ms | **G2**: the letters of **HUMAN** print onto the rule, mask wiping left to right. Stagger 55ms, 260ms each. `display-l`, weight 450, tracking **+0.12em** — wider than anywhere else on the site, because a wordmark is not a headline. Overlaps Beat 1 by 300ms so the two read as one gesture. |
| 3 | 1150–1400ms | **G3**: five ticks appear on the rule, one beneath each letter, 40ms apart, `text-3`. |
| 4 | 1400–1800ms | Wordmark and ticks fade to 0 over 400ms. The overlay fades to 0 in the same 400ms, revealing the hero already sitting there. **The rule does not fade.** |
| 5 | 1800ms → | The surviving rule is handed to the hero boot (7.0.6). It splits and travels apart to become the header underline and the type-cell baseline. The headline prints beneath it. |

**Nothing scales. Nothing rotates. Nothing moves more than 28px.** The letters do not fly in. The wipe is the movement.

**Mobile — 1,400ms.** Same beats, compressed. Rule 220px, wordmark at `display-m`, **three ticks not five**, Beat 0 shortens to 80ms, Beat 1 to 500ms, stagger 45ms. She is arriving from a reel with no patience; 1.4s is the ceiling.

**Rules that stop this costing conversions.**

- **Once per session**, gated on `sessionStorage`. A reload, or coming back from the app tab, goes straight to the settled hero. Never replay on route change, back-navigation or hash change.
- **Skippable by anything.** A scroll, tap, click, keypress or wheel at any point aborts immediately — overlay fades in 200ms, hero renders settled with its boot already complete. Do not require a skip button; do not show one.
- **Never a gate on loading.** Fixed duration; assets load in parallel behind it. **Do not build a real preloader** — coupling the intro to network state produces an intro that is sometimes four seconds long on 4G, the worst possible outcome.
- **The wordmark is an SVG path, not live text.** As live text it waits on the webfont and the first thing anyone sees flashes in a fallback face. Export HUMAN as outlines, single path, animate the mask over it.
- **LCP protection.** The hero renders underneath from the start; the overlay is an opacity layer above it. Measure LCP against Part 10's 2.0s budget — do not assume.
- **Reduced motion:** wordmark and rule static at full opacity for 300ms, then fade over 300ms. Total 600ms.
- **Accessibility:** overlay is `aria-hidden="true"`, `role="presentation"`, `pointer-events: none` once Beat 4 begins, **never in the tab order**, focus never trapped. A screen reader reaches the hero immediately.

**What this must not be.** No percentage counter · no progress bar · no spinner · no "loading" text · no typewriter effect · no letters flying in from off-screen · no curtain or slide-up panel reveal · no particle burst · no sound · **no logo that draws itself with a stroke-dashoffset outline** — that is the most overused agency intro of the last five years and it will read as a template.

The wipe-onto-a-baseline is the idea. Do not add a second idea on top of it.

**7.0.6 Integration with 7.1 — read this or you will build two competing sequences.**

7.1's boot describes its own rule draw. **When the intro plays, that draw does not run** — the intro's rule *is* that rule, the same DOM element, handed across. 7.1 resumes at the split, using the element the intro left behind.

**When the intro is skipped or suppressed** (returning session, reduced motion, aborted by input), 7.1 runs its boot in full from its own rule draw.

Implement as **one state machine with two entry points**, not two independent animations that happen to look similar. If both run you get two rules on screen and a visible overlap — exactly the failure Part 3 exists to prevent.

**Acceptance.** ≤1,800ms desktop / ≤1,400ms mobile from first paint · scrolling at 300ms aborts cleanly with no half-state and no double rule · reload shows no intro, new session shows it · reduced-motion 600ms version reviewed as its own screenshot · LCP still under 2.0s on throttled 4G · screenshots at 0, 150, 600, 1000, 1300, 1600, 1900 and 2400ms all portfolio-grade · **the overlap test passes at t=1750ms**, during the handover — the highest-risk moment on the page.

---

## 7.1 Boot + opening — 130vh

**Job.** In four seconds, on a phone, establish that this is an instrument and give her a small, specific unease about her own body. Not fear. Unease.

**Frame (desktop).**

```
┌ HEADER (fixed, 64px) ────────────────────────────────────────┐
│ HUMAN     Know earlier. Act sooner.        [Join the waitlist]│
├──────────────────────────────────────────────────────────────┤
│ ┌ CELL: type (cols 1–7) ──────┐ ┌ CELL: field (cols 9–12) ─┐ │
│ │ Your body has been          │ │  ·  ·   ·    ·   ·  ·    │ │
│ │ telling you for years.      │ │ ·   ·  ·   ·    ·   ·  · │ │
│ │                             │ │   calibration field      │ │
│ │ HUMAN tests your blood,     │ │   (decorative, z:-1)     │ │
│ │ tells you the three things  │ │                          │ │
│ │ worth fixing, and tests you │ │                          │ │
│ │ again twelve weeks later    │ │                          │ │
│ │ to show whether it worked.  │ │                          │ │
│ │                             │ │                          │ │
│ │ [ Join the waitlist ]  [ Try the prototype ]             │ │
│ │                             │ │                          │ │
│ │ The first batch is 150      │ │                          │ │
│ │ people. We're not open yet. │ │                          │ │
│ └─────────────────────────────┘ └──────────────────────────┘ │
│                                            ╷ scroll rule      │
└──────────────────────────────────────────────────────────────┘
```

Everything in the type cell aligns to one optical left edge — headline, sub, buttons, micro. **One vertical axis.** This single decision does more for "expensive" than any animation on the page.

**Copy — VERBATIM.**

> Your body has been
> telling you for years.
>
> HUMAN tests your blood, tells you the three things worth fixing,
> and tests you again twelve weeks later to show whether it worked.
>
> **Primary button:** Join the waitlist
> **Ghost button:** Try the prototype
> **Micro:** The first batch is 150 people. We're not open yet — the prototype is live, running on sample data.

**Approved alternate H1** (use one or the other, never both, and do not edit either):
> Know what's happening inside you.
> Before it becomes a problem.

**What stays still.** Everything, after the boot. The hero does not have a moving headline. Stillness after arrival is the point.

**What moves.**

*Beat 1 — Boot.* Inherits the intro's rule (7.0.6). The rule splits and travels apart, 500ms `ease-instrument`, to become the header underline and the type-cell baseline. Then headline line 1, then line 2 **print** (G2, mask wipe, 55ms stagger). Then sub, button, micro at 55ms intervals. Then five G3 ticks along the right edge, capped at 5. Then stillness — no replay, ever.

*Beat 2 — Calibration field (continuous, pointer-driven, desktop only).* Sparse 1px `hairline` ticks of varying length on an irregular grid at 4% opacity. Ticks within ~180px of the cursor lengthen slightly and rise to 14%, soft falloff, ~400ms trailing decay. It should read as *an instrument noticing you.*

Hard limits: no colour, no glow, no blur, no connecting lines, no particles, no physics, and **no `requestAnimationFrame` running when the pointer is idle**. One SVG layer, clipped to its cell, absent on touch and under reduced motion.

*Beat 3 — Telemetry HUD (continuous, subtle).* Bottom-left, `telemetry`, `text-3`: a live readout of section and scroll percentage — `01 / 14 — opening — 04%`. Updates on scroll, never animated on its own, hidden below 768px. The most instrument-grade detail on the site, and nearly free.

*Beat 4 — Scroll-out (110–130vh).* Type cell fades to 0 and rises 40px. Field fades faster. Nothing scales or blurs.

**Scroll cue.** One 40px vertical rule, bottom centre, drawing downward over 900ms, holding 600ms, fading — **once, never again.** No mouse icon, no bouncing chevron, no "scroll" label.

**Mobile.** 105vh using `100svh`. Calibration field and telemetry HUD removed. Headline breaks to three lines. Sub shortens to: *"HUMAN tests your blood, tells you what to fix, and tests you again twelve weeks later to show whether it worked."* Both buttons stay, stacked full width — the prototype link is too valuable to drop on the device most people arrive on.

**Failure modes.** Headline reflowing on font load · boot replaying on re-entry · `100vh` putting the button under mobile browser chrome · the field bleeding into the type cell · two rules on screen because 7.0 and 7.1 both drew one.

---

## 7.2 The silent build — 180vh sticky

**Job.** Serious things build for years while you feel completely fine. The only place on the site that should feel close to fear — and it must come from *data*, not language.

**Frame.** Full-bleed. Text cell cols 1–5, stage cell cols 7–12, one dead column between.

**Copy — VERBATIM.**

> Diabetes doesn't begin
> the day you're diagnosed.
>
> It builds for years,
> while you feel completely fine.

Then, in the stage cell after the chart resolves:

> **101 million** — Indians live with diabetes.
> **136 million** — more are close to it, and can still turn back.
> **43 in 100** — have it and don't know.
>
> A blood test would find all of this.
> Almost nobody is looking.
>
> *ICMR–INDIAB, Lancet Diabetes & Endocrinology, 2023*

**What stays still.** The text cell. The headline is set when the stage locks and does not move, fade or reposition for the entire 180vh. It is the anchor she reads while the data moves beside it.

**What moves.**

*Beat 1 — The drift (0–45%).* **G1, scroll-linked:** the chart line itself draws left to right across eight years via `stroke-dashoffset` bound to scroll progress — perfectly reversible. It starts inside a `jade-deep` band at 6% and climbs, gradually, without drama. **G3:** x-axis years appear as the line passes them.

**G2** at four points: a small `text-2` label prints — **"You feel fine."** at 2019, 2021, 2023, 2025. Identical every time. The repetition is the whole idea.

*Beat 2 — The crossing (45–58%).* The line crosses into the `amber` band, which rises from 6% to 22% opacity. One label prints: **"Still nothing hurts."** That is the emotional peak, delivered by a 16% opacity change and four words. Nothing else happens.

*Beat 3 — The cascade (58–100%).* The chart drops to 8% and recedes. Three numerals arrive ~14% of scroll apart, each `numeral-xl`, counting up from zero over 900ms with **odometer digit rolls** on tabular figures. Each holds; the previous fades to 20% rather than disappearing, so all three end as a column with the last one live.

**Chart rules.** No shadow, no gradient fill under the line, no data-point dots, no legend, no y-axis numbers. A line, two bands, and years. **Do not name the marker** — label the axis only as *"Blood sugar, over time"* and carry a permanent `Sample data` label bottom-right.

**Mobile.** 130vh, **not sticky**. Static composition: chart at final state with all four labels and the crossing visible, then three numerals stacked, each scroll-triggered. The emotional content survives; the mechanism does not.

---

## 7.3 The ledger — 165vh sticky

**Job.** Deliver the thesis. Afterwards she can explain HUMAN to someone else in one sentence. Second most important section on the page.

**Frame.** Single wide cell, cols 1–12, four full-width rows.

**Copy — VERBATIM.**

> Four things have to happen
> before your health actually improves.
>
> Book a blood test — Solved. Labs collect at your home in 2,500 towns.
> Understand the numbers — Solved, and free. Any app does this now.
> Know what to fix first — Nobody does this.
> Come back and check it worked — Nobody does this.
>
> We built the second half.

**What stays still.** The headline, and **all four row labels**, at full opacity, from the moment the stage locks. Nothing fades in one row at a time — she sees the whole argument immediately. What resolves is the *verdict* on each row.

**What moves.**

*Beat 1 — Rows 1 and 2 resolve (0–30%).* **G1**: row 1's hairline draws left to right. **G2**: at its end a `jade` check and "Solved" print. 200ms later, row 2 the same.

*Beat 2 — Rows 3 and 4 stay open (30–55%).* Same G1 draw — but ending in an **`amber` open circle** and "Nobody does this". Then rows 3 and 4 step from `text-2` to `text` and weight 400 → 450. That weight change is the entire "these two matter" signal.

*Beat 3 — The claim (55–100%).* Rows 1 and 2 drop to 35% opacity. A `surface-2` field with a `jade` top hairline fills the lower half from the bottom up over 600ms, containing rows 3 and 4. The closing line prints: **"We built the second half."**

The page literally divides into what is solved and what HUMAN owns, and she watches the company claim its territory.

**Failure modes.** Turning this into four cards — it is a **ledger**: hairline rules, aligned columns, no boxes, no radius, no icons beyond the check and circle · animating rows in one at a time (reads as a generic feature list and destroys the argument) · using red for the open rows.

**Mobile.** 115vh, sticky retained, verdicts stack beneath labels. The fill still happens — it is the payoff.

---

## 7.4 The loop — 140vh flow

**Job.** Make the cycle concrete and memorable. A deliberate quiet section between two set pieces.

**Copy — VERBATIM.**

> Not a report you get once.
> A loop that runs for a year.
>
> **Test** — A 96-marker panel, drawn at your home.
> **Understand** — Every marker in plain words, plus one score for how your body is doing.
> **Choose** — The three things worth fixing this quarter. Not all ninety-six.
> **Act** — One plan, built on Indian food and the levels Indian bodies need.
> **Track** — One tap a day. Your watch and cycle sync on their own.
> **Improve** — We test again at week twelve and show you whether it moved.

Numbering 1–6 is permitted here because this genuinely is a sequence. It is the **only** place on the site where numbered markers appear.

**What moves.** One beat. At 70% viewport, **G1**: the circuit draws itself as a single continuous 1.5px `hairline-lit` stroke — from Test, through all six nodes, closing back into Test. 1,400ms, `ease-move`, one pass. **G2**: as the stroke passes each node, that node's label prints. When the circle closes, a single `jade` pulse travels the full path once in 600ms and stops.

That closing pulse is one of only three things on this site that moves without the user causing it, and it happens exactly once.

**Plus one user interaction:** hovering a node raises its caption from `text-2` to `text` and brightens that arc segment. 160ms. No movement.

**Mobile.** 110vh. The circuit becomes a vertical closed loop — six nodes down the left, return path curving from node 6 back to node 1 along the right. Same single draw, same single pulse.

---

## 7.5 The app — 400vh sticky · THE CENTREPIECE

**Job.** The largest moment on the site. She must finish knowing exactly what she would open each morning — because she has watched the real app work, and then used it herself.

**Frame (desktop).**

```
┌ SECTION 400vh ───────────────────────────────────────────────┐
│ ┌ STAGE (sticky, 100vh, overflow hidden) ──────────────────┐ │
│ │ ┌ CELL: copy (cols 1–5) ─┐ ┌gap┐ ┌ CELL: device (7–12) ┐ │ │
│ │ │  02 / 05               │ │   │ │   ╭──── glow ────╮   │ │ │
│ │ │  ▍▍▎▎▎  rail           │ │   │ │   │┌───────────┐│   │ │ │
│ │ │                        │ │DEAD│ │   ││           ││   │ │ │
│ │ │  Your HUMAN Score      │ │   │ │   ││ LIVE APP  ││   │ │ │
│ │ │                        │ │   │ │   ││  iframe   ││   │ │ │
│ │ │  One number for how    │ │   │ │   ││ 390×844   ││   │ │ │
│ │ │  your body is doing,   │ │   │ │   ││           ││   │ │ │
│ │ │  plus your body's age. │ │   │ │   │└───────────┘│   │ │ │
│ │ │                        │ │   │ │   ╰─────────────╯   │ │ │
│ │ │  FIXED HEIGHT BOX      │ │   │ │    Sample data      │ │ │
│ │ │  crossfade only        │ │   │ │   [ Take control ]  │ │ │
│ │ └────────────────────────┘ └───┘ └─────────────────────┘ │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

**The device.** Dead upright. No tilt, no perspective, no reflection, no hand, no second device. A 1px `hairline-lit` outline at 24px radius with the one shadow token. Behind it, the single jade glow. The screen area is hard-clipped — **nothing ever renders outside the frame.**

**Screen sequence and copy — VERBATIM.**

| # | screen id | Heading | Body |
|---|---|---|---|
| 1 | `timeline` | Your results, in one place | Blood tests, past reports and prescriptions on one timeline you keep for years. Never a PDF you have to open. |
| 2 | `score` | Your HUMAN Score | One number for how your body is doing, plus your body's age. A plain explainer sits behind every marker. |
| 3 | `priorities` | The three things to fix | Not all ninety-six. Three, in order, this quarter — each one from a set our doctor has approved. |
| 4 | `plan` | Start your day | Today's actions on one screen. One tap to confirm. Your watch and cycle sync on their own. |
| 5 | `week12` | Week twelve | We test again and put the new number next to the old one. That is the whole point. |

Copy caps at 34 words per screen. The copy cell has a **fixed height reserved for the longest of the five.**

**What stays still.** **The phone.** From 12% scroll progress to 100% the frame does not move, scale, rotate or drift by a single pixel. Everything that changes, changes *inside* it. This discipline is what makes it read as a product demonstration rather than a scroll animation.

**What moves.**

*Beat 1 — Rise and ignition (0–12%).* **G1**: the frame's outline draws as a rule, centre-out, 680ms. The frame then enters from 28px below over 820ms, `ease-entrance`, fading 0→1, scaling 0.985→1.0. As it locks, the jade glow **ignites** — 0 to 8% over 900ms — and the poster brightens from 40% to 100%. This is the moment the only light on the page turns on. Then it locks and never moves again.

*Beat 2 — Live boot (12–18%).* The iframe, already created, completes its handshake and crossfades over the poster in 320ms with zero layout change. A `telemetry` line beneath reads `live` in `jade`. If the handshake fails this beat is silently skipped and `DEGRADED` continues — she must never see an empty frame or a spinner.

*Beat 3 — Screen advance (18–92%, five equal bands).* Within each band the screen holds for the first 70%, then advances during the remaining 30%.

The bridge sends `navigate` with the band's screen id, debounced to one per 250ms. Inside the app that is a real navigation — **the actual product responding to her scroll.**

Simultaneously, and **only** in the copy cell: heading and body **crossfade** — 320ms out, 100ms gap, 320ms in. **The copy never slides.** Two things sliding at once is what makes a site feel cheap.

The progress rail (five 2px marks, `hairline`, active `jade`) and the `02 / 05` counter update in the same beat.

*Beat 4 — Take control (92–100%).* The scroll sequence ends and the control prints in beneath the frame: **"Take control"**. Behaviour per Part 5.6.

**Screen-internal life.** In `DEGRADED` only two of five carry internal motion: `score` counts up once over 800ms; `week12` draws its delta once. Screens 1, 3, 4 are static. In `LIVE` the real app supplies its own.

### 7.5.1 The annotation layer

**Job.** Connect a sentence to a pixel. The copy cell explains what a screen *does*; the annotation points at the exact thing on screen that proves it. Without this, she reads about the app and then looks at the app. With it, she is taught.

**The rule that keeps it safe.** Annotations live **entirely inside the device cell**, clipped to it. Nothing crosses into the copy cell — a leader line running from text into the device frame is precisely the overlap Part 3 forbids, and it is the obvious wrong way to build this.

**Anatomy — three parts, nothing more.**

| Part | Spec |
|---|---|
| **Anchor dot** | 6px `jade` ring, 1.5px stroke, transparent centre, sitting on the app screen at an authored coordinate |
| **Leader** | A 1px `hairline-lit` rule, **horizontal only**, from the dot to the cell gutter. Never diagonal, never curved, never elbowed. |
| **Label** | 2–5 words, `telemetry` style, `text-2`, max two lines, sitting in the gutter |

**Placement.** The device cell is ~604px wide and the phone is ~340px, leaving roughly 130px of gutter on each side **inside the same cell**. That gutter is the annotation lane.

```
┌ CELL: device ────────────────────────────────────┐
│  ┌ gutter ┐  ┌── phone 340px ──┐  ┌ gutter ────┐ │
│  │  130px │  │                 │  │  130px     │ │
│  │        │  │   ○─────────────┼──┤ One number │ │
│  │        │  │                 │  │            │ │
│  │        │  │                 │  │            │ │
│  └────────┘  └─────────────────┘  └────────────┘ │
│                    Sample data                   │
│                  [ Take control ]                │
└──────────────────────────────────────────────────┘
```

The label goes in the gutter **opposite** the anchor's horizontal half — anchor on the screen's left half → label right, and vice versa — so the leader always has room to run and never crosses back over the screen.

**One per screen.** Five annotations on the entire website. `week12` is the single permitted exception and may have two, because the whole point of that screen is two numbers side by side. **Do not add a sixth.** Scarcity is what stops this cluttering the cleanest moment on the site.

**The five — copy is VERBATIM, anchors are intent.**

| Screen | Label | Anchors to |
|---|---|---|
| `timeline` | Every test, kept | The list of past results |
| `score` | One number | The score numeral itself |
| `priorities` | Fix this one first | The **first** priority row, not the list |
| `plan` | One tap to confirm | A single action row's confirm control |
| `week12` | Your first result **/** Twelve weeks later | The two values, one dot each |

**Anchors are intent, not coordinates.** During Session 0 you capture the real screenshots; from those, author the actual coordinates (5.1 item 7). **If a screen does not contain the element the annotation describes, say so and stop** — do not re-point the annotation at something else or reword it to fit. Part 1.3 governs what may be claimed, and an annotation is a claim.

**Timing.** Annotations do not compete with the screen change.

- The screen advances and **settles**. Nothing else happens.
- At **40% into the band's hold phase**, the anchor dot appears (160ms, opacity only), then the leader **draws** toward the gutter (G1, 340ms), then the label **prints** (G2, 260ms). Total 760ms, one sequence, in that order.
- At the **first frame of the next screen's transition**, the whole annotation fades out over 200ms — dot, leader and label together, no stagger.
- The annotation is **never on screen while the screen is changing.** Two things moving at once is the thing this site does not do.
- On `week12`, the two annotations are staggered 220ms apart. That is the only stagger permitted in this layer.

**Hover (desktop).** Hovering the label brightens the dot to full `jade` and the leader to `hairline-lit`, 160ms, opacity only. Nothing moves.

**Take control clears them.** Entering `INTERACTIVE` fades every annotation out over 200ms and they do not return until control is released. She is using the real product now — the training wheels come off. This is a small detail that will feel considered.

**Mobile.** There is no gutter — the phone is 78% of viewport width. So:

- **One annotation per screen, no exceptions**, including `week12` (use "Twelve weeks later" only).
- The dot sits on the screen as normal. The leader runs **vertically** down to a reserved **40px lane directly beneath the frame**, inside the device cell, and the label sits in that lane, centred, one line.
- The lane's height is reserved from first paint whether or not an annotation is present, so nothing below it ever shifts.

**Coordinates.** Authored, never measured. A cross-origin iframe cannot be queried for element positions, and it must not be.

- Store as normalised `{ x, y }` in `0–1`, relative to the **390 × 844 screen area**, in `src/config/annotations.ts` — one entry per screen id.
- Rendered position = normalised coordinate × the frame's current scaled size. This keeps annotations correct at every viewport without re-authoring.
- **Anchor to regions, not to 1px targets.** Point at the middle of a card, not at the edge of a glyph. A generous anchor survives the app being tweaked; a precise one does not.
- Coordinates are **re-verified every time `scripts/capture-app.mjs` is re-run.** Add that to the script's output: render the dots over the fresh screenshots and save them to `public/app/_annotation-check/` for a human to glance at.

**Failure modes.**

- A leader crossing into the copy cell. It cannot — the cell is clipped — but if you find yourself wanting more room, the answer is a shorter label, not a wider reach.
- The live app rendering slightly differently from the screenshot (fonts, safe-area insets, dynamic content) and the dot drifting off its target. Mitigated by generous region anchors and the small dot size. If drift is visible in `LIVE` but not in `DEGRADED`, **report it** rather than nudging coordinates until it looks right in one state and wrong in the other.
- An annotation overlapping the `Sample data` label or the "Take control" control. Both sit below the frame; the gutter lanes stop 40px above them.
- Annotations appearing during a screen transition. They must not.
- Adding a sixth.

**Acceptance.**

- Overlap test passes with annotations visible on all five screens, at every viewport.
- No annotation is on screen at any moment when a screen transition is in progress — verify by screenshotting mid-transition.
- Entering `INTERACTIVE` clears all annotations within 200ms.
- Mobile: exactly one per screen, the lane's height is reserved, CLS still 0.00.
- The annotation check images in `public/app/_annotation-check/` show every dot landing on its intended element.

**Mobile.** 280vh, **three screens only** — `timeline`, `priorities`, `week12`. Screenshots, not iframe. Frame at 78% viewport width, locked in the upper portion; copy in a **fixed-height cell below** it, never beside it. One control below: **"Open the app"** → full-screen new tab.

**Failure modes.** The phone drifting during screen changes — pixel-lock it · assets loading late and shifting layout — preload all five during 7.4, declare aspect ratios · a screen cropped by the frame — frame dimensions derive from the 390×844 ratio, never the reverse · the iframe trapping scroll — `pointer-events: none` until activation, no exceptions · two iframes existing at once.

---

## 7.6 The retest — 165vh sticky

**Job.** Land the single differentiator. If she remembers one thing from this page, it must be this.

**Copy — VERBATIM.**

> On the day you join,
> we book your second blood test.
>
> Twelve weeks later. Already paid for, inside the price.
> Someone calls you at week ten, eleven and twelve
> to make sure you turn up.
>
> It's the only promise on this page that costs us money.
> That's why nobody else makes it.

**What stays still.** The text cell — and, critically, **the week-12 marker.** It is placed at the very start and never moves, never pulses, never glows, while eleven weeks scroll past it. **The stillness of that one mark is the argument.**

**What moves.**

*Beat 1 — The mark is set (0–20%).* **G1, top-down:** the timeline rail draws downward from "day 0". Immediately — before anything else — a `jade` marker is placed at week 12, labelled **"Week 12 — booked."** One 520ms entrance, then it holds at full brightness for the rest of the section.

*Beat 2 — The weeks pass (20–70%).* **G3:** markers 1 through 11 appear in sequence as small dim `hairline` ticks with just a number. Deliberately unremarkable. Week 12 stays brighter than all of them the entire time.

*Beat 3 — The chase (70–100%).* **G2:** three labels print, 140ms apart — **"We call you." / "We call you again." / "A phlebotomist comes to your home."** Then the closing two lines fade in beneath the existing copy — the only movement in the text cell in the whole section, and it is a fade with no travel.

**Failure modes.** Making the week-12 marker animate · adding a calendar UI (this is a rail, not a date picker) · overclaiming: *someone* calls, not *your doctor* — the care coordinator is not a clinician.

**Mobile.** 105vh, **not sticky**. Static composition at end state, all markers present, week 12 highlighted, chase labels attached. The idea is spatial, not temporal, so it survives intact.

---

## 7.7 The panel — 145vh flow

**Job.** Prove the panel is built for her specifically, and defuse the marker-count arms race before a competitor comparison occurs to her.

**Copy — VERBATIM.**

> Ninety-six markers,
> plus the ones your body actually needs.
>
> **For her**
> Ferritin, for every woman. Iron deficiency is one of the most common and most missed conditions in Indian women, and you cannot find it without ferritin.
> A hormone panel, when your symptoms call for it. We ask about your cycle, skin, hair and weight at signup, and order it only if you flag something. Running it on everybody would be over-testing.
> Thyroid is already inside the ninety-six.
>
> **For him**
> Testosterone, for every man. The most asked-for male marker, and it isn't in a standard package.
>
> More numbers isn't better. The right ones are.

**What moves.**

*Beat 1 — Condensation (scroll-triggered, once).* 96 uniform 4px `hairline` dots on a 12×8 grid, all present, all equal — a calibration field. On trigger, 93 fade to 12% over 700ms while **3 travel** — `ease-move`, 900ms, staggered 80ms — to become the three ranked priority rows, each printing onto its own G1 rule, each carrying a `jade` fill.

**Ninety-six becomes three.** This is the visual argument of the entire company in one gesture. It should be the cleanest animation on the site.

*Beat 2 — Toggle (user-triggered).* Two segments, "For her" / "For him", default **For her**. Switching crossfades content over 240ms **with no height change** — the container is fixed to the taller state so nothing below ever moves. Indicator slides 160ms, `ease-instrument`.

*Beat 3 — Dot hover (desktop).* Hovering a dim dot brightens it to 30% and shows a `telemetry` chip with its **category only** — "Metabolic", "Thyroid", "Liver", "Vitamins". **Never individual marker names** — naming them turns the site into a lab menu.

**Mobile.** 105vh. Grid becomes 8×12. Priorities stack below. Toggle full width, two equal segments. Dot hover removed.

---

## 7.8 Your own past — 165vh sticky

**Job.** Land the second differentiator — she is measured against herself, not a textbook — and show the payoff of the loop.

**Copy — VERBATIM.**

> Normal isn't the goal.
> Better than last time is.
>
> Most reports tell you whether you sit inside a range built for everyone.
> We show your number next to your own last one.
>
> Falling since week 0.

**What moves.**

*Beat 1 — The first result (0–30%).* **G1:** the x-axis draws left to right. One point plots at Week 0 with its value printed. A `surface-2` reference band sits behind, unlabelled and quiet.

*Beat 2 — The wait (30–55%).* The axis extends to Week 12. **Nothing else happens for a quarter of the section.** This pause is the design — she feels the twelve weeks. **Do not fill it.**

*Beat 3 — The second result (55–85%).* The second point plots, lower. A line draws between the two over 900ms. The delta prints in `jade`. The reference band stays exactly where it was and is never highlighted, because it is not the point.

*Beat 4 — The range bar (85–100%).* Below the chart, one horizontal bar resolves: a `surface-2` track, a `hairline` tick for "your last result", and a `jade` tick settling into position with 28px travel. **One bar.** Not a dashboard of six.

**Failure modes.** Stating an improvement percentage as if it were a HUMAN result — the chart carries `Sample data` permanently and the copy never says "our members improved by X" · adding a numeric y-axis: there is no y-axis, there are two points and a direction.

**Mobile.** 115vh, sticky retained. Chart upper 60%, copy below. Pause compresses to 15%.

---

## 7.9 What we don't sell — 110vh flow

**Job.** Convert product restraint into trust. The stiller half of the page begins here.

**Copy — VERBATIM.** (The five items are five separate lines.)

> We have nothing else to sell you.
>
> A ring
> A sensor
> Supplements
> Powders
> A separate charge to explain your report
>
> A company that sells you a pill has a reason to find you a deficiency. We don't sell anything you swallow or wear, so the plan can say "more dal and a walk after dinner" with nothing riding on it.
>
> We read from the watch and the cycle app you already use. Their tracking is better than ours and will stay better.
>
> **Who this is for.** Women aged twenty-eight to fifty-two, and men the same age. Plenty of people join for a parent. All of it is the same price.

**What moves.** One beat. **G1** on each item: a 1px `hairline` strike draws through it left to right, 340ms each, staggered 90ms, while the text drops from `text` to `text-3`. The strike *is* the rule. That is the section's only animation.

**Failure modes.** Naming competitors · saying "unlike others". The strike-through does the comparison silently and is far stronger for it.

---

## 7.10 What we can't tell you yet — 100vh flow

**Job.** The section no other health startup will run. It turns the company's biggest gap — zero proof — into its most credible asset.

**Copy — VERBATIM.**

> What we can't tell you yet.
>
> HUMAN hasn't launched. There are no members, no reviews and no results to show you, and I'm not going to invent any.
>
> Here is the honest position. Nobody in Indian preventive health has published how many people actually come back for the second test. Not us, not anyone. The first hundred and fifty members are how we find out.
>
> Whatever that number turns out to be, we'll publish it.
>
> *Aadit Bhatt, founder*

The signature is the **single appearance of Gambetta Italic** on the whole site. It signals that one sentence was written by a person, not a company.

**What moves.** One short G1 rule above the block, then the paragraphs print as a **single unit** (not staggered), then the signature prints alone after a 400ms gap. Three G3 ticks. **Nothing else.** There is no button in this section.

**Failure modes.** Softening it into marketing · turning it into a founder-story timeline · adding a CTA.

---

## 7.11 What a membership includes — 115vh flow

**Copy — VERBATIM.**

> What a membership includes.
>
> Three blood draws at your home, at a time you pick
> Ninety-six markers at the start, and the same ninety-six again at month six
> Ferritin for every woman, testosterone for every man
> A hormone panel if your symptoms call for it
> Your week-twelve retest
> Your three priorities, re-chosen every quarter
> A daily plan, and a coach that answers any time
>
> We haven't announced pricing. The waitlist hears first.
>
> HUMAN supports your health decisions. It does not replace your doctor. If something in your results looks urgent, we will tell you to see one.

**No price appears here or anywhere else on the site.** The line *"We haven't announced pricing. The waitlist hears first."* is doing two jobs: it answers the question honestly, and it converts the absence of a price into a reason to leave a number. That is the strongest use available for a fact we would otherwise have to dodge.

**One card**, `surface-1`, 1px `hairline`, 24px radius, no shadow, no glow. **No tiers. No comparison table. No "from ₹…". No placeholder price. No "most popular" badge.**

**What moves.** **G1:** the card's border draws as one continuous rule, 1,400ms. Then the heading prints, then the inclusions as a single block, then the pricing line alone after a 300ms gap. No disclosure, no expander — there is nothing to hide.

## 7.12 Questions — 140vh flow

Hairline-separated disclosure rows. No cards. Multiple may be open at once — forcing accordion behaviour makes people lose their place.

**Copy — VERBATIM.**

> **Who actually draws my blood?** A trained phlebotomist from our partner lab, at your home, at a time you choose. You don't go anywhere.
>
> **Is this a lab, or a doctor, or an app?** The lab does the testing. A doctor decides what the app is allowed to tell you. The app is where you read it, plan around it, and see whether it changed.
>
> **What if my results look bad?** You'll see it in plain words, not in red ink, and we'll tell you clearly if it's something to take to a doctor now rather than something to work on over twelve weeks.
>
> **What if I miss the second test?** Someone calls you at week ten, eleven and twelve. That is a real person's actual job here.
>
> **What happens to my data?** It's yours. It's health data under India's DPDP Act, we treat it that way, and we don't sell it to anyone. You can ask us to delete it.
>
> **Can I cancel?** Yes. You can stop the membership at any time, and you keep every result we've taken.
>
> **Do I need to be ill for this to be worth it?** No. It's most useful when nothing hurts yet — that's the window where a number can still be changed.
>
> **Why only 150 people?** Because the first batch is how we find out whether this works, and we want to run it with a group small enough that someone here can call every single one of them by name. Once we know what we're doing, we'll open it wider.
>
> **How much will it cost?** We haven't announced pricing. The waitlist hears first, before anyone else.
>
> **When does it open?** We're not putting a date on it until the lab agreement and the first group of members are settled. Rather than guess publicly, we'll message the waitlist.
>
> **Can I see it before I sign up?** Yes. The prototype is live and open to anyone — it runs on sample data, so nothing in it is a real person's result.
>
> **Is it different for men and women?** Yes. Same membership, different panel. Ferritin and a hormone workup on one side, testosterone on the other.

**What moves.** Each divider is a G1 rule drawing left to right as the list enters. On open, the answer **prints** (G2) over 280ms; chevron rotates 180°.

**Do not** answer questions HUMAN can't answer yet (turnaround depends on an unsigned lab SLA). **Do not** name the lab partner — the agreement is not signed.

---

## 7.13 The close — 105vh flow

Full-bleed statement panel. One of only two centred compositions on the site.

**Copy — VERBATIM.**

> 150 places
> in the first batch.
>
> We're not open yet. Have a look at what we've built,
> and leave your number — we'll message you when it opens.
>
> **Primary button:** Join the waitlist
> **Ghost button:** Try the prototype
> **Micro:** No spam. One message when we open. Leave with one word.
>
> Know earlier. Act sooner.

**The scarcity is real, so state it flatly.** A hundred and fifty is a hard operational cap on the first batch, which is why it is allowed to appear here when nothing else on this site pretends to be urgent.

**Deliver it with no pressure at all.** No date, no counter, no "filling fast", no progress bar, no countdown. Set `150 places` at `display-l` and leave enormous space around it. The number is doing the work; anything added to it reads as a tactic and costs you the credibility 7.10 just bought.

**And keep "We're not open yet" in the sub.** The pairing is what makes it land — a real limit alongside a plain admission that nothing has launched. That is a combination almost no company will run, and it is more persuasive than either line alone.

The two buttons sit side by side on desktop and stacked on mobile, primary first.

**The form. One field.** `inputmode="tel"`, `+91` prefixed and non-editable, 10 digits. **No email, no name, no city, no checkbox.** Validation on blur, never on keystroke. Error copy: *"That doesn't look like a 10-digit Indian mobile number."*

This is not minimalism for taste. The business plan needs a 12% click-to-waitlist rate to reach 839 signups from 6,990 creator clicks. A two-field form does not hit 12%.

**Interaction.** **G1:** the field's underline draws centre-out as the section enters, with three G3 ticks beneath. On focus the underline brightens to `jade` over 160ms — the only place a form element uses the accent. On submit, field and button are **replaced in place** — no modal, no redirect, no navigation — crossfading over 320ms to:

> You're on the list.
> We'll message you on WhatsApp when the first batch opens.

Then 600ms later one quiet line prints: *"Know someone this would help?"* with a copy-link control. The only place a second action is offered, and only after conversion.

---

## 7.14 Footer — 60vh

> HUMAN
> Preventive health, built for India.
>
> HUMAN supports your health decisions. It does not replace your doctor.
>
> Privacy · Terms · hello@\<domain\>
> © 2026 \<Registered entity name\>

Scope line is permanent, not a hover or disclosure. **No social icons** unless the accounts exist and are active. **No newsletter field** — there is already a waitlist.

## 7.15 Mobile sticky action bar

Appears after 7.2, hides inside 7.13. 64px, pinned bottom, `void` at 92% with 12px blur, `hairline` top border. Left: a ghost **"Try the prototype"**. Right: a primary **"Join the waitlist"**. Both are real tap targets at ≥44px; the ghost is narrower.

Enters by fading and rising 12px over 300ms. **Scroll-position driven, not scroll-direction driven**, so it never flickers. Never bounces. Tapping scrolls to 7.13 with the field focused.

## 7.16 The header

64px fixed, `void` at 88% with 12px backdrop blur, `hairline` bottom border appearing only after 40px of scroll — and it is **the rule the intro left behind**, not a new element.

Left: wordmark **HUMAN**, 18px, weight 450, tracking 0.06em — the only place with tracking this wide. Beside it the tagline in `telemetry` `text-3`, hidden below 900px. Right: one button.

The button is ghost (transparent, `hairline` border, `text`) until the hero has passed, then fills to `jade-deep`. A 240ms crossfade of `background-color` and `color` only. **Nothing moves.**

**No navigation menu. No hamburger.** There are no other pages.

---

# PART 8 — The complete interaction inventory

Thirty-seven designed moments. This is the full list. **If it is not here, do not build it.**

| # | Moment | Section | Type | Mobile |
|---|---|---|---|---|
| 1 | Held black beat before anything | 7.0 | Load | Yes |
| 2 | Baseline rule draws centre-out | 7.0 | Load | Yes |
| 3 | HUMAN prints onto the baseline, letter by letter | 7.0 | Load | Yes |
| 4 | Five calibration ticks appear beneath | 7.0 | Load | 3 ticks |
| 5 | Wordmark fades, **the rule survives** | 7.0 → 7.1 | Load | Yes |
| 6 | Rule splits into header underline + headline baseline | 7.1 | Load | Yes |
| 7 | Headline prints, line by line | 7.1 | Load | Yes |
| 8 | Calibration field responds to cursor | 7.1 | Pointer | Removed |
| 9 | Telemetry HUD — live section and scroll % | global | Scroll | Removed |
| 10 | Scroll cue rule draws once | 7.1 | Load | Yes |
| 11 | Header button ghost → filled | global | Scroll state | Yes |
| 12 | Horizon rule at every section boundary | global ×14 | Triggered | Yes |
| 13 | Drift line draws across eight years | 7.2 | Scroll-linked | Static |
| 14 | "You feel fine" prints ×4 | 7.2 | Scroll-linked | Static |
| 15 | Amber band luminance rise on crossing | 7.2 | Scroll-linked | Static |
| 16 | Odometer numeral cascade ×3 | 7.2 | Scroll-linked | Triggered |
| 17 | Ledger rows resolve — 2 checks, 2 open circles | 7.3 | Scroll-linked | Yes |
| 18 | Ledger weight step on rows 3–4 | 7.3 | Scroll-linked | Yes |
| 19 | Territory fill — the lower half claims itself | 7.3 | Scroll-linked | Yes |
| 20 | Loop circuit draws as one closed stroke | 7.4 | Triggered | Yes |
| 21 | Single jade pulse traverses the loop, once | 7.4 | Triggered | Yes |
| 22 | Loop node hover raises its caption | 7.4 | Hover | Removed |
| 23 | Phone frame outline draws, then rises and locks | 7.5 | Scroll-linked | Yes |
| 24 | Glow ignition — the page's light turns on | 7.5 | Scroll-linked | Yes |
| 25 | Poster → live app crossfade (mounted from source) | 7.5 | Mount | Poster only |
| 26 | **Scroll drives the real app, component-level** | 7.5 | Scroll-linked | Screenshots |
| 27 | Copy cell crossfades per screen | 7.5 | Scroll-linked | Yes |
| 28 | Progress rail + `02 / 05` counter | 7.5 | Scroll-linked | Yes |
| 29 | **"Take control" — the app becomes usable in the page** | 7.5 | Click | "Try the prototype" |
| 30 | Week-12 marker set, then held perfectly still | 7.6 | Scroll-linked | Static |
| 31 | Weeks 1–11 tick past; chase labels print | 7.6 | Scroll-linked | Static |
| 32 | 96 dots condense into 3 priorities | 7.7 | Triggered | Yes |
| 33 | For her / For him toggle; dot category chips | 7.7 | Click / hover | Toggle only |
| 34 | Two-point comparison with the deliberate pause | 7.8 | Scroll-linked | Yes |
| 35 | **Annotation prints: dot, leader draws, label lands** | 7.5 | Scroll-linked | 1 per screen |
| 36 | **Annotations clear when she takes control** | 7.5 | Click | N/A |
| 37 | Strike-throughs, disclosures, form focus + confirm-in-place | 7.9–7.13 | Click / form | Yes |

**Balance:** 16 scroll-linked, 9 scroll-triggered, 12 user-triggered. **A third of the delight is under her own finger** — that is what separates "interactive" from "animated".

---

# PART 9 — Components

| # | Component | Notes |
|---|---|---|
| 1 | `Rule` | The G1 primitive. Origin, length, duration, scroll-linked or triggered. **Used by almost every section.** Build it first. |
| 2 | `Print` | The G2 primitive. Wraps content, animates a mask, never moves the content. |
| 3 | `Ticks` | The G3 primitive. Count, spacing, stagger. |
| 4 | `FrameCell` | The non-overlap primitive: a named grid area with `overflow: hidden`. **Every content element lives inside one.** |
| 5 | `StickyStage` | The single sticky implementation. Built once, used five times. Owns the scroll-progress hook. |
| 6 | `TextCell` | Fixed-height cell that crossfades only. Never slides. |
| 7 | `DeviceFrame` | Aspect-locked, screen-clipped, glow behind, one shadow. Hosts iframe or poster. |
| 8 | `AppStage` | Mounts the app from source. Strategy 1/2/3 behind one interface. `mount` · `show` · `setInteractive` · `getState` · `destroy` |
| 9 | `Button.primary` | `jade-deep` fill, `text` label, 2px radius, 48px tall. Hover: fill lightens 8%. **No lift, no scale, no glow, no shadow, no arrow.** |
| 10 | `Button.ghost` | Transparent, `hairline` border. Hover: border → `hairline-lit` |
| 11 | `TextLink` | 1px underline at 4px offset, thickens on hover. No arrow. |
| 12 | `LedgerRow` | Label · rule · verdict · description |
| 13 | `NumeralBlock` | Tabular odometer count-up + caption |
| 14 | `Chart` | Four variants on one shell, with `Sample data` baked in |
| 15 | `Disclosure` | Height-reserved expander, chevron only |
| 16 | `Toggle` | Two segments, fixed-height content below |
| 17 | `Telemetry` | The small tracked readout style |
| 18 | `WaitlistForm` | Single field, in-place confirmation |
| 19 | `Grain` | The global noise overlay |
| 20 | `Intro` | The 7.0 overlay, session-gated, abortable |
| 21 | `Annotation` | Dot, horizontal leader, gutter label. Normalised coordinates, clipped to the device cell, cleared on `INTERACTIVE` |

**There is no `Card` component.** This is the main thing separating this site from a template.

**Charts.** No chart library. Four hand-built SVGs — the drift (7.2), the circuit (7.4), the condensation (7.7), the two points (7.8). Universal rules: 1.5px data strokes, 1px everything else · horizontal gridlines only, max 3 · x-axis labels only, **never a numeric y-axis** · no fills under lines · no shadows or glow · no legends — label the line directly · rounded caps · `Sample data` in `telemetry` `text-3`, bottom right, permanently.

---

# PART 10 — Performance and accessibility

| Metric | Budget (mobile, throttled 4G, mid-tier Android) |
|---|---|
| LCP | < 2.0s |
| CLS | **0.00** |
| INP | < 200ms |
| First-load transfer | < 1.6 MB |
| Fully scrolled | < 3.5 MB (excluding the iframe) |
| JS gzipped | < 190 KB |
| Fonts | ≤ 4 files, ≤ 180 KB, self-hosted, preloaded |
| Long tasks during scroll | none > 50ms |

Everything below 7.5 lazy-loads. App posters preload during 7.4. Animate only `transform`, `opacity` and `clip-path`. One shared rAF loop. All listeners `passive`. `will-change` only while a stage is in view.

**Stack.** React + Vite, or Next.js static export. Tailwind acceptable **only** if the Part 2 tokens are configured as the theme and arbitrary inline values are not used. Motion: GSAP + ScrollTrigger, or Framer Motion with a scroll-progress hook. Smoothing: Lenis, subtle, configured per Part 3.4.

**Do not use:** a chart library · a UI kit (shadcn, MUI, Chakra) · an animation preset library (AOS, WOW.js) · a carousel library · a parallax library · Three.js · Lottie · any dependency whose main purpose is decoration.

**Accessibility.**
- `text` on `void` ≈ 14:1 · `text-2` ≥ 6:1 · `text-3` ≥ 4.5:1 at its minimum size — **verify, don't assume.**
- Visible focus ring on every interactive element: 2px `jade`, 2px offset. Never `outline: none`.
- Tap targets ≥ 44×44px.
- Full keyboard path: header CTA → hero CTA → toggle → disclosures → take control → form → footer. Test with keyboard only.
- The iframe has a `title`. Charts have text alternatives. Decorative SVG is `aria-hidden`.
- The form field has a real `<label>` — a placeholder is not a label.
- The intro overlay is never in the tab order and never traps focus.
- `prefers-reduced-motion` produces the complete poster version (Part 4.10), reviewed as its own deliverable.

---

# PART 11 — Build order

**Do not build top to bottom.** Build the system, then the hardest thing, then the rest. One session per row.

| Session | Deliverable | Gate |
|---|---|---|
| **0** | Browser tooling confirmed. **Repo discovery, Part 5.1, all eight — including the collision test screenshot.** Repo layout proposed. Screenshots captured, annotation anchors authored. | **Report the collision test and wait for my answer on repo layout before writing any UI code** |
| **1** | Tokens, fonts + metric fallback, grain overlay, section wash, `Rule` / `Print` / `Ticks` primitives, `FrameCell`, `StickyStage`, shared rAF loop, reduced-motion strategy, `tests/overlap.spec.ts` | The three motion primitives and the sticky primitive tested in isolation against every rule in Part 3 |
| **2** | `/lab` route: dark page, phone frame, glow, **poster only**. Nothing else. | **If this one screen doesn't look expensive, stop. Nothing else will save it.** |
| **3** | Full skeleton — all 14 sections at correct budgets, final copy, final layout, **zero animation** | Review as a static document at 390px. If it isn't good static, motion won't fix it |
| **4** | Section 7.5 complete: `AppStage` with the chosen strategy, isolation proof, live app in the frame, scroll-driven screens, annotations, take control, mobile path, `tests/embed.spec.ts` | The centrepiece, built first because it is the highest risk |
| **5** | 7.3 the ledger | |
| **6** | 7.2 the silent build | |
| **7** | 7.8 your own past | |
| **8** | 7.6 the retest | |
| **9** | 7.4 the loop + 7.7 the panel | |
| **10** | 7.9–7.14 (the still half) + header + mobile bar | |
| **11** | **7.0 intro + 7.1 boot, built as ONE state machine** (7.0.6) + calibration field + telemetry HUD | Deliberately late — the intro must hand off to a hero that already exists |
| **12** | Horizon rules across all boundaries · reduced-motion pass · performance pass · all quality gates | |

After every session: twelve screenshots, a `CRITIQUE.md` entry, `tests/overlap.spec.ts` green, then lock the section.

---

# PART 12 — Quality gates

Not aspirations. Tests. Every one must pass.

## 12.1 The automated overlap test — build this in session 1

Write `tests/overlap.spec.ts` (Playwright). It must:

1. Load the page at **375, 390, 768, 1024, 1440, 1920px** width.
2. At each width, step through **40 evenly spaced scroll positions** across the full page height.
3. At every position, query every **content element** (text nodes, images, the app frame, charts, controls) and read its bounding box.
4. Assert **no two content elements from different frame cells intersect**, with a 1px tolerance for sub-pixel rounding.
5. Assert no element's box extends beyond its assigned cell.
6. Assert `document.documentElement.scrollWidth <= clientWidth`.
7. Fail loudly with the scroll position, the viewport, and the two offending selectors.

**240 checkpoints per run.** Run after every session. Additionally run it at **t=1750ms during the intro handover** — the single highest-risk moment on the page.

This is the answer to "no elements should overlap." Not vigilance. Automation.

## 12.2 The twenty-screenshot test

Screenshot the page at 20 evenly spaced scroll positions, at 390px and 1440px. **Every single one must look like a finished poster.** This is the best single test of whether the site is done. If three of forty are ugly, it is not done.

## 12.3 Structural

- Scroll the full page at three speeds including a hard flick. Nothing overlaps at any point.
- Drag the scrollbar rapidly top to bottom and back. Every sticky stage lands correct. No half-rendered frames.
- Reload at 12 random scroll positions. Every one is a correct, complete composition.
- Resize continuously 320 → 2560px at mid-page. Nothing overflows, clips, or produces a horizontal scrollbar.
- Zoom to 200%. Usable, nothing cut off.
- CLS measured at 0.00 on a cold load over throttled 4G.

## 12.4 Motion

- At no point are two compositions animating at once, or two rules drawing at once.
- Nothing exceeds 1,400ms (except the intro) or travels more than 28px on entrance.
- **Nothing moves when the user is idle** — except the three one-time exceptions in Part 4.5.
- Reverse-scroll every sticky stage: each retraces exactly.
- No fade-up entrance exists anywhere in the codebase. Grep for it.
- `prefers-reduced-motion` produces a complete, beautiful static page.
- Intro: aborts cleanly on any input, plays once per session, never produces a double rule.

## 12.5 The app

1. **Isolation proof.** Screenshot the site's hero and an app screen standalone, then screenshot both together. Both must be pixel-identical to their originals. Any drift = isolation has failed.
2. Grep every stylesheet that ships with the app for `html`, `body`, `:root` and `*` selectors. Report every hit.
3. Happy path: mounts, walks all five screens on scroll, reaches `INTERACTIVE`.
4. Force a screen component to throw → error boundary catches it, that screen degrades to its poster, the other four stay live, nothing visible breaks.
5. Scroll 7.5 top to bottom in 400ms → assert **≤ 4 screen changes** actually executed, and no queue backlog.
6. Wheel over the frame in `LIVE` → the page scrolls, the app does not. Tab key → focus skips the app entirely (`inert`).
7. Wheel over the frame in `INTERACTIVE` → the app scrolls, the page does not, no scroll chaining.
8. Escape in `INTERACTIVE` → returns to `LIVE`, focus lands correctly, annotations return.
9. Scroll away and back → the app is **still mounted**, still on the right screen, never remounted.
10. "Try the prototype" opens the hosted URL in a new tab with `rel="noopener"`, and is never rendered as an iframe.
11. Annotations: present on all five screens, never on screen during a transition, cleared within 200ms of entering `INTERACTIVE`, every dot landing on its intended element in `public/app/_annotation-check/`.
12. Run the overlap test with the frame in every one of the five states.

## 12.6 Content and compliance

- No testimonial, member count, rating, logo or HUMAN performance statistic anywhere.
- Every chart and the app frame carry `Sample data`.
- The medical scope line appears in the footer and in 7.11.
- Every price display shows GST at readable size.
- No banned word from Part 1.6 appears in any copy.
- Every disease statistic carries its source.
- Copy matches the VERBATIM blocks in Part 7 exactly — diff it.

## 12.7 Conversion

- The primary CTA is reachable within one thumb-scroll from any point on mobile.
- The form submits, confirms in place, and never navigates away.
- Works with autofill, a pasted number, and a user-typed `+91`.
- The form has exactly one input.

---

# PART 13 — Banned list

If any of these appears, the build has failed regardless of how good the rest is.

**Visual.** Pure black `#000` · glassmorphism · frosted panels · glowing borders · neon · aurora or gradient blobs · purple-to-blue gradients · animated grid or dot backgrounds · scanline overlays · HUD corner brackets · glitch effects · wireframe globes · particle fields · connecting-line networks · 3D objects · Three.js · Lottie · stock photography · illustration of any kind · DNA helices, molecules, pills, stethoscopes, heartbeat lines · icon sets · emoji · badges · pills · ribbons · logo walls · "as featured in" · **a card component** · more than two radius values · drop shadows on anything but the phone · a fourth light source.

**Typography.** All-caps labels · tracked-out eyebrows · one word of a headline coloured or bolded · middle-dot meta strings · arrows on buttons or links · monospace for data labels · weights 600+ · text below 12px · more than two typefaces · italics beyond the one signature · exclamation marks.

**Motion.** **Fade-up entrances** · opacity-only reveals with no rule · scroll hijacking · scroll snapping · anything that captures the wheel · looping ambient animation · parallax on more than one element · everything animating at once · two rules drawing at once · animating width/height/margin/padding/font-size · entrance travel over 28px · animations over 1,400ms · cursor followers · custom cursors · magnetic buttons · marquees · typewriter effects · counters that re-trigger on every pass · hover effects that move an element · **loading spinners visible to the user** · a logo that draws itself as a stroked outline.

**Content.** **A price, in any currency** · **a launch date, month, quarter or year** · "launching soon" · a live waitlist counter · "only N left" · a progress bar toward 150 · "N people joined today" · testimonials · member counts · star ratings · "trusted by" · any statistic about HUMAN's own performance · cure / reverse / prevent / treat / diagnose / guarantee · "clinically proven" · "doctor recommended" · partner, press or investor logos · countdown timers · fake scarcity · a blog · a careers link · an about page · a login button · social icons for accounts that don't exist · a newsletter field alongside the waitlist · a second form field.

---

# PART 14 — Assets and decisions still needed

Build around these as tokens. **Do not invent values.**

| Item | Status |
|---|---|
| Repo layout decision — workspace or sibling (Part 5.1 item 1) | **Blocking — I answer this** |
| Chosen mount strategy, recorded in `DECISIONS.md` | Output of the collision test |
| Registered entity name and domain → footer | **Required** |
| Whether the lab partner may be named publicly | **Currently must not be** |
| Privacy policy and terms, DPDP-aware | Required before launch |
| Wordmark as SVG outlines, single path | **Required for the intro** |
| App screen exports ×5 | Generated by `scripts/capture-app.mjs` against the local dev server, session 0 |
| Annotation anchor map, `src/config/annotations.ts` | Authored in session 0 from the screenshots |
| Founder portrait for 7.10 | Optional — **omit the image entirely rather than use a poor one** |
| OG share image, 1200×630, `void` ground, wordmark + one line, no photograph | Required |
| Favicon / touch icon, 32 / 180 / 512px | Required |

**Decisions already taken, reversible:** this is a **waitlist + prototype** site, not a checkout · **no price and no date appear anywhere** · **150 is the one permitted number, stated four times, never counted down** · section 7.10 stays, in the founder's voice · men get a toggle in 7.7 and a line in 7.9, not a separate page.

---

# PART 15 — Start here

Paste this as your first instruction:

> Read BRIEF.md completely before responding.
>
> This is Session 0. **Do not write any UI code and do not restructure the repo.** Five tasks:
>
> 1. Confirm you have a browser tool that can navigate and screenshot. If not, stop and tell me.
>
> 2. Run the repo discovery checklist in Part 5.1, items 1–6. I especially need: where the five screen components live, how the app routes, and exactly what global CSS it ships.
>
> 3. Run the collision test (Part 5.1 item 7). Show me the screenshot and tell me whether anything bled.
>
> 4. Recommend Strategy 1 or Strategy 2, with your reason, and propose a repo layout — workspace or sibling. **Wait for my answer before moving anything.**
>
> 5. Write and run `scripts/capture-app.mjs` against the local dev server. Show me the five screenshots.
>
> Report all five. Write nothing else.

Then Session 1. Then **stop at Session 2** and look hard at that one screen — a dark page, a phone, a glow, one static app screen inside it — before building anything else.

*End of brief.*
