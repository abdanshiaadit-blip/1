# Decisions

Recorded per BRIEF.md Part 5.9 step 2. Session 0 outcomes, decided by the client.

---

## D1 · Repo layout — sibling

`/site` alongside the app, which stays at the repo root untouched. Not a workspace.

The workspace option's shared-tokens payoff does not exist here: Part 2.2's near-black
measurement chamber and the app's light Liquid Glass canvas are deliberately different
palettes, and Part 2.3's whole light model depends on them staying that way. So a
`packages/ui` would carry nothing, while the move would cost four migrations — regenerating
the root `package-lock.json` (currently the app's own, named `human`), adding `composite: true`
to `tsconfig.json`, fixing `README.md`'s `docs/` link, and re-verifying the cwd-coupled
`portable` build chain.

**Consequences.** The app's build, its `portable` single-file deliverable and its deployment
are all untouched. `/site` gets its own `package.json`, its own lockfile and its own Vite
config. Nothing at the root moves.

## D2 · Mount strategy — Strategy 2, same-origin route, iframed

The app builds to `/app-embed` in the site's deployment and the site iframes that route.

Decided by the collision test (`session0/collision-*.png`): with the app's CSS loaded, the
site's `void` ground turns white, its type loses Switzer, and `html, body { overflow: hidden }`
stops a ~2,120vh page from scrolling. That much is scopeable with effort. What is not:

> `src/styles/base.css:158` — `@media (max-width: 460px), (max-height: 880px) and (pointer: coarse)`

is how the app chooses between full-bleed phone rendering and its desktop iPhone-frame
presentation. A media query evaluates against the viewport, not against a container, so a
direct mount in a 390px box on a 1440px page draws the app's own iPhone frame inside the
site's phone frame. Fixing that means rewriting the app's responsive logic as container
queries. An iframe **is** the viewport, so it is free — along with `viewport-fit=cover`, the
safe-area insets, the 11 `backdrop-filter` glass surfaces that would otherwise sample the
site's dark page, and the `prefers-reduced-motion` block whose four `!important` universal
rules would kill every animation on the site.

**Consequences.** One extra document load, warmed during 7.4. Same origin keeps
`contentWindow` reachable, and the app already exports `setTab` and `openSheet` through
`useApp()`, so `AppStage.show(screenId)` still drives the real product — no `postMessage`
handshake, no timeout, no poster-to-iframe crossfade. The embed entry is a new
`app-embed.html` plus a small bridge component calling the existing hook. **No existing app
file changes.**

## D3 · Persona — Meera Iyer

The embedded app runs as Meera, not the default Aadit.

This is what makes two of Part 7.5's five screens truthful. On Aadit, screen 3 says "Three,
in order, this quarter" against a ranked list of **four**, and screen 5 says "Week twelve"
against an **eight**-week experiment. On Meera there are exactly three ranked priorities, and
a genuine twelve-week before-and-after (Vitamin D, 16 → 24 ng/mL) that appears both as an
experiment readout and as a Health Passport event. She is also the Part 1.5 audience.

**Consequences.** The five plates in `session0/app-screens/` and every anchor in
`session0/annotations.ts` are authored against her. The embed must set the persona before
first paint; `setPersona` is exported from `useApp()`, so the bridge can do it.

## D4 · Prices — gated in the embed build

The `/app-embed` entry suppresses the Membership sheet and the Booking flow, the only two
places the app renders a price.

Part 1.4 and Part 13 ban a price in any currency anywhere on the site, and the app shows
seven, reachable in two taps once "Take control" is active:

```
src/components/SheetHost.tsx:893  ₹9,999/year   (Membership)
src/components/SheetHost.tsx:906  ₹999/mo
src/components/SheetHost.tsx:907  ₹19,999/yr
src/components/SheetHost.tsx:908  ₹3,000–6,000
src/screens/Booking.tsx:127,162,254            (panel prices)
```

**Consequences.** "Take control" (Part 8 moment 29) stays fully working. The gate lives in
the embed entry, so the app's own build is unaffected and still shows its pricing. Needs a
test in `tests/embed.spec.ts`: walk every reachable sheet in the embed build and assert no
`₹` renders.

**Related, still open:** the Health Passport names **Redcliffe Labs** (visible in the
timeline plate), which Part 14 says may not be named publicly. Same gate mechanism could
mask it, but it is a data string rather than a whole sheet, so it needs its own answer.

## D5 · "Your HUMAN Score" and "plus your body's age" — PARTIALLY DECIDED

**Decided:** drop "HUMAN Score" as the name.

**Not yet actionable:** the decision was given as "the biological age is shown in the
starting of the home screen of the app — drop HUMAN score for this". The second half is
recorded above. The first half does not hold against this repository, and the discrepancy
needs resolving before 7.5's screen-2 copy can be written.

What the Home screen actually renders, in order (`src/screens/Home.tsx:24-73`): the HUMAN
wordmark, the promise paragraph, then the hero card — `IntelligencePanel` showing the score
and its delta, labelled **"Health Intelligence"** (`src/components/viz.tsx:114`) — then
Current stage / Next review, then Your priority. No age.

Searched exhaustively: the only `age` in the app is chronological — `age: 34` / `age: 31`
(`src/data/aadit.ts:17`, `src/data/meera.ts:18`), rendered on the Profile identity row
(`src/screens/Profile.tsx:21`) and in the persona switcher (`src/components/shell.tsx:119`),
plus "Age" listed among the influences on four biomarkers. The `HealthIntel` type carries
`score`, `delta`, `baselineScore` and `history` and no age field
(`src/data/types.ts:268`). The captured plate `session0/app-screens/screen-score@3x.png`
shows the whole hero: "HEALTH INTELLIGENCE / 76 / +6 since baseline".

The hosted prototype at `minimum-bronze-wj3yadap.edgeone.dev` could not be checked from this
environment — its network policy refuses outbound hosts (403 on CONNECT) — so if that build
is newer than this repo, that would explain the difference and I cannot see it.

Part 1.3 does list "HUMAN Score — One number, plus a biological age" as an approved
capability, so adding one to the app is legitimate. It is an app change, so it is not mine
to make unasked.

---

## D6 · Switzer weight 450 is served by the 500 cut

Part 2.5 asks for weights 400, 450 and 500. Fontshare publishes a variable
Switzer, but Fontshare is unreachable from this build environment (the network
policy refuses outbound hosts), so the site ships the static latin 400 and 500
faces from npm instead.

There is therefore no true 450 cut. Left alone, `font-weight: 450` resolves to
the 400 face under the CSS font-matching rules, which would flatten body,
heading and display to a single weight and delete the hierarchy Part 2.5 is
describing. So the 500 face is declared with `font-weight: 450 500` and serves
both.

**Consequences.** Headings and display are optically the 500 cut, one step
heavier than a true 450. Nothing is at 600 or above, so the Part 2.5 and Part
13 prohibitions hold. If the variable Switzer becomes reachable, dropping it in
and deleting the range restores a true 450 without touching any component.

## D7 · The responsive system interpolates between the brief's two fixed points

Part 2.7 gives desktop (12 columns, 72px gutters, 1280px content, 88px margins)
and mobile (one column, 20px margins) and nothing in between, while Part 3.7
requires verification at 768, 1024, 1280, 1440, 1920 and 2560 with no
horizontal scroll at any of them.

Those two cannot both hold as written. Twelve columns with 72px gutters need
792px of gutter before a single column of content; at a 768px viewport with
88px margins there are 592px available. `tests/overlap.spec.ts` caught exactly
this on its first run.

So: the 12-column grid starts at **1024px**, not 768px. Below that the layout is
a single column. `--page-margin` holds at 20px through mobile, then interpolates
40px → 88px between 768 and 1280. `--gutter` interpolates 32px → 72px between
1024 and 1456. Columns are `minmax(0, 1fr)` rather than `1fr`, so no cell's
min-content can ever push the grid wider than the viewport.

**The brief's own geometry is exact where it describes it:** at a 1456px viewport
the content is 1280px wide and the gutters are 72px, which is what makes the
device cell ~604px as Part 7.5.1 states.

**Consequence to watch:** at 1024px the device cell computes to roughly 408px.
The phone is 340px, so the annotation gutters (Part 7.5.1) are about 34px a
side rather than the ~130px the brief describes. The annotation layer will need
a narrow-desktop answer in Session 4 — most likely the mobile treatment (a
reserved lane beneath the frame) held until the gutters are wide enough.

## Open · telemetry is 11px on mobile, and Part 3.7 says nothing below 12px

Part 2.5's type table sets telemetry at 12px desktop / 11px mobile and says
"both endpoints are binding". Part 2.2 says `text-3` has a 12px minimum, and
Part 3.7's responsive checklist says "no text below 12px" at every width.

Implemented as the type table specifies — `clamp(11px, …, 12px)` — because it
is the more specific instruction. Flagging it rather than silently choosing:
if the accessibility floor is the one that matters, the fix is a one-line token
change to `clamp(12px, …, 12px)`.

## D8 · Gambetta falls back to a system serif italic

Part 2.5 specifies Gambetta Italic 400 for the founder's signature in 7.10 —
the single italic on the whole site. Fontshare is unreachable from this build
environment and Gambetta is not on npm, so the signature falls back to
`Georgia, 'Times New Roman', serif` in italic.

Falling back to Switzer italic would have been worse: the point of that one
line is that it reads as written by a person rather than a company, and a
synthesised italic of the site's own face erases the distinction entirely. A
real serif italic keeps the signal.

**To fix:** drop `gambetta-italic.woff2` into `site/public/fonts/`, add the
`@font-face`, and the existing `.know__sign` rule picks it up with no other
change.

## D9 · iOS 26 Liquid Glass — CLIENT DIRECTION, against the brief

The client asked for "exact iOS 26 glass elements in each element or button".
Implemented across buttons, the header, the mobile action bar, the segmented
toggle, the membership card, the waitlist field and the disclosure rows.

**This is a deliberate departure from the brief, not an oversight.** Part 2.6
bans frosted panels and Part 13 bans glassmorphism outright, under "If any of
these appears, the build has failed regardless of how good the rest is." The
instruction was explicit and repeated, so it is built; the conflict is
recorded here rather than silently resolved either way.

The recipe is the app's own — documented in the app's `src/styles/tokens.css`
— inverted for a near-black ground. Glass on light is a white veil; glass on
dark has to read as a surface catching light rather than one painted white:
a translucent fill in the page's own ink, a blur with a saturation boost, a
specular rim on the top edge only, a fine hairline, and a wide soft lift.

**What was deliberately NOT done:** no glass on the type, the rules, the
charts or the ledger. Part 2.3's light model still holds — the phone remains
the only lit object, and glass refracts what is already behind it rather than
emitting, so it does not become a fourth light source.

**To revert:** delete the "iOS 26 Liquid Glass" block at the end of
`site/src/styles/sections.css` and the glass tokens in `tokens.css`. Nothing
else depends on them.

## D10 · The device draws a real iPhone bezel — CLIENT DIRECTION

Part 7.5 specifies "a 1px `hairline-lit` outline at 24px radius". The client
asked for a real iPhone bezel, "uniform and rounded like on an actual iPhone".

Implemented proportionally and concentrically, which is what makes a drawn
phone read as hardware rather than as a rectangle:

```
bezel      2.8% of the frame's width, identical on all four sides
screen r   13.5% of the SCREEN's width — an iPhone's corners are far rounder
           than a normal UI radius
outer r    screen radius + bezel, so the two curves are concentric and the
           bezel keeps a constant width around the corner
```

Everything derives from one number, the frame's height, because the viewport
is what constrains it. The outer ratio of 1:2.0989 is solved from the bezel so
the screen lands at exactly 390x844 and no plate is letterboxed or cropped.

The live app is rendered at 390x844 and scaled to fit, so it lays out
identically to the authored plates. Without that the iframe becomes its own
viewport, the app reflows, and the annotation anchors drift off target in LIVE
while still looking correct in DEGRADED — the exact failure Part 7.5.1 names.

Consequence: the site now has three radius values rather than Part 2.6's two.
