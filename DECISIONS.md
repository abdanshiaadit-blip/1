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

**To revert:** delete `site/src/styles/ios26.css` and its one import line
in `main.tsx`. The block originally lived at the end of `sections.css`; it was
lifted out when D13 widened the direction, so that one deletion now takes the
whole of it. Nothing else depends on it.

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

## D11 · The wordmark is real Switzer outlines, generated

Part 7.0 requires the intro's wordmark as SVG outlines, single path: "As live
text it waits on the webfont and the first thing anyone sees flashes in a
fallback face."

Fontshare is unreachable here, but the outlines did not need it. The shipped
`switzer-latin-500.woff2` was decompressed with `wawoff2` and parsed with
`opentype.js` to extract the five glyph paths at 72px with the +0.12em tracking
Part 7.0 specifies, written to `site/src/config/wordmark.json` — 1KB, real
Switzer, no substitution.

Per-letter rather than a single path, because Beat 2 prints the letters one at
a time behind a mask travelling left to right, and one path cannot be wiped
letter by letter.

Regenerate with the script in the commit history if the face ever changes.

## D12 · text-3 lightened to clear the brief's own contrast floor

Part 2.2 specifies `--text-3: #5F726B`. Part 10 requires text-3 to reach
**4.5:1 at its minimum size** and says "verify, don't assume".

Verified, and the swatch fails its own floor:

```
#5F726B on --void      #05100D   3.78:1
#5F726B on --surface-1 #0A1A15   3.50:1
#5F726B on --surface-2 #0F241E   3.18:1
```

Changed to **`#748C83`** — the minimum lightening of the same hue that clears
4.5:1 on all three grounds (void 5.36:1, surface-1 4.97:1, surface-2 4.51:1).
`--text` and `--text-2` were verified too and both pass unchanged: 16.67:1 and
7.54:1 (6.34:1 on surface-2).

The accessibility floor wins over the swatch. It is a healthcare site, `text-3`
carries the sources and the sample-data labels, and Part 10 asked for the
number to be checked rather than trusted.

## D13 · The Apple compositional language — CLIENT DIRECTION, against the brief

The client asked for "exact iOS 26 effects, and like Apple made the website".
D9 was the material; this is the composition. It is the larger departure of the
two, because it changes how the page **reads**, not only how it is finished.

Everything specific to it lives in `site/src/styles/ios26.css` — one file, one
import line in `main.tsx`, revertible in a single deletion. The glass block
written for D9 was lifted out of `sections.css` into it, so the whole of the
client direction is now in one place rather than two.

**What was built**

1. **Continuous corners.** `corner-shape: superellipse(4)` on every card, panel
   and surface. This is the single most identifiable thing about Apple's
   geometry and the reason a plain `border-radius` always looks
   approximately-Apple and never Apple. Chrome 139+ ships `corner-shape`, so
   this is the real curve, not an SVG trace of one; browsers without it fall
   back to the circular radius already declared and lose nothing else.
2. **Directional lighting on the material.** D9's rim was a top-edge gradient.
   It is now one light source at 135°, consistently, on every glass surface —
   bright specular where the light falls, shadowed where it does not, so an
   edge reads as a bevel catching a room rather than as a border.
3. **True capsules on controls.** Buttons, the segmented toggle, the waitlist
   field and the floating nav are `999px`, not superellipses. Tried as
   superellipses first and reverted: a squircle applied to a pill squares off
   the very ends that make it a pill.
4. **A floating capsule navigation**, over the page rather than in it.
5. **A centred hero at ≥1024px.** Apple sets the argument in the middle of the
   screen and lets it breathe.
6. **Tighter display tracking** (`-0.038em`) and `text-wrap: balance`.

**Against the brief, explicitly.** Part 2.4: "Alignment: left by default,
everywhere, including headlines. Only two centred compositions exist on the
whole site." The hero is now a third. Part 2.6: "Border radius: exactly two
values… Nothing else on the site has a radius at all." Part 13 bans more than
two radius values under "the build has failed regardless of how good the rest
is." The instruction was explicit and repeated; it is built, and the conflict
is recorded rather than silently resolved either way.

**The device is the exception, and stays circular.** A superellipse was tried
on the phone and reverted. Two concentric superellipses whose radii differ by
the bezel width are **not** a constant distance apart: the gap widens through
the corner, so the bezel visibly thickens at each corner and the phone reads
squarer than the hardware it draws. With circular corners and
`outer = inner + bezel`, the perpendicular distance is identical everywhere —
which is exactly the concentricity D10 was built on. So the squircle is for
cards, panels and controls; **the device is round.**

**What was deliberately NOT done.** No glass, no centring and no radius on the
type, the rules, the charts, the ledger or the annotations. Part 2.3's light
model still holds: the phone remains the only lit object, and glass refracts
what is already behind it rather than emitting, so it never becomes a fourth
light source. Two knock-on corrections were needed and are marked as such in
the file: the device's height budget had to grow, because a nav that floats no
longer reserves its own space, and the waitlist underline and its calibration
ticks were removed, because a rule beneath a capsule field reads as debris
left over from an earlier design.

## D14 · Liquid Glass, and what a black page does to it — CLIENT DIRECTION

D9 put a glass recipe in the stylesheet and D13 built the Apple composition
around it. The client's answer was that the site still did not have the effect:
*"i wanted liquid glass effect in the elements and the interactive elements"*.

They were right, for two reasons, and only one of them was a mistake.

**1. The rim was dead code.** D9 defined the material as a class, `.lg`, whose
`::after` painted the directional specular rim — the one ingredient that
separates Liquid Glass from a translucent rectangle, and the thing D13's own
notes claimed was "on every glass surface". Nothing in the codebase ever
carried that class. Every surface hand-copied D9's fill, blur and shadow lines
and silently dropped the rim. Live computed style confirmed it: `::after`
returned `none` on every glass element on the page. What shipped was a
translucent fill over a blur of nothing.

The material is now applied by SELECTOR LIST rather than by a class, so a
surface cannot be given the fill and miss the lighting. That also keeps the
whole direction inside its own two files, which is what makes it revertible.

**2. The page has nothing behind the glass.** This is physics, not a bug, and
it governs everything else. Measured: behind most glass surfaces on this site
the true backdrop is a SINGLE distinct RGB triple — `#05100D`, standard
deviation exactly zero. Blur, saturate and refraction are all closed under a
constant function. You cannot bend a flat field into anything but itself.

So the material is built out of what a black page CAN carry: the edge.

```
BODY    a vertical tint, because glass has thickness and thickness is a gradient
POOL    a specular sheen at --px/--py, which the runtime slides to the pointer
RIM     ::after, a conic ring lit at 315deg — one light, upper-left, all the
        way round, arriving back where it started
BEVEL   ::before, 14px of that light bleeding inward, which is what stops the
        rim reading as a stroke
```

**Interaction, since that is half of what the client was missing.** The
specular follows the pointer (registered `@property`, so it interpolates and
trails by 90ms instead of teleporting); a press compresses the surface to 96.5%
while the light stays put, so it reads as a compliant material rather than a
shrinking button; `:focus-visible` draws a jade ring through a slot reserved in
the shadow stack. One delegated `pointermove` for the page, coalesced into one
`rAF`, mouse only — Part 10 budgets no long tasks.

**Refraction is applied to exactly one surface, and that is a finding.** Real
edge refraction is built with a generated `feDisplacementMap` per measured
element size (a bevel map with a flat plateau and a ramp only within 13px of
each edge, so the middle stays optically clean). Rendering each candidate with
and without the filter and diffing the pixels:

```
.seg__ind    26.4% of pixels move (desktop), 23.6% (mobile)
.btn--ghost   0.28%
.wl__field    0%
.inc__card    0%
.hdr__in      0%
```

The segmented indicator is the exception because it sits in a WELL. Its
backdrop is the track it slides in — a recessed fill, a dark inner wall and a
lit bottom edge, all running underneath it. (Not the labels: those paint on top
of it, by design. An earlier version of this entry said otherwise and was
wrong.) A lit groove is the only structured backdrop on the page, and bending
one is the single moment where the material behaves like a lens rather than
looking like one.

Narrowing it that way is also what makes the material free. Ten refracting
surfaces cost median frame time on a full-page scroll 16.7ms → 33.3ms — a
straight halving of the frame rate. With refraction on one surface and the
provably-useless filters removed, a full-page scroll measures identically with
the material and with every `backdrop-filter` on the page disabled:

```
1440px   no material  p50 16.7  p90 50.0  p99 100.0  frames over 50ms: 22
         with glass   p50 16.7  p90 50.0  p99  99.9  frames over 50ms: 20
 390px   no material  p50 16.7  p90 16.7  p99  33.3  frames over 50ms: 0
         with glass   p50 16.7  p90 16.7  p99  33.3  frames over 50ms: 0
```

Four surfaces carry no `backdrop-filter` at all, by the same test — each one
provably changed zero pixels: `.btn--primary` (opaque jade), a resting
`.disc__btn` (transparent), `.seg` (a groove over flat ground, max delta 2 of
765) and `.inc__card` — which at 819×637 was the largest filtered surface on
the page and therefore the most expensive one, buying nothing.

**What the no-overlap instruction changed.** The client also asked that nothing
overlap anything else or any text. Three consequences, and the first is the
important one:

- **The body is not a window** — and the first attempt at that was wrong. The
  bars were set to 88% and 92% of the page's own ink under a 30px blur, and
  this file claimed that settled it. It did not: an adversarial review found
  the headline "…the day you're diagnosed." reading straight through the bar
  with the bar's own wordmark printed on top of it, and over the app's white
  screen (backdrop luminance 158–174 against a page ground of 13) it was not
  close. A blur cannot rescue that — blurring a bright glyph leaves a bright
  shape where the glyph was. **Both bars are now solid** the moment anything is
  behind them: the header while it is over the hero is still thin glass,
  because the ground there is one flat colour, and goes to full `--void` the
  instant the page scrolls. The action bar is solid always. The material
  survives the change — the rim, the bevel and the specular were carrying the
  read anyway. Verified by sampling inside each bar at eight scroll positions:
  the interior is now numerically identical wherever it sits.
- **The top bar leaves on the way down.** Reading runs downward, so the bar
  goes with it and returns the moment you scroll up — or the moment it takes
  focus, so a keyboard visitor never tabs into something off-screen.
- **The mobile action bar was re-docked to the bottom edge.** D13 floated it
  with the rest of the chrome and that was wrong: a bar hovering 16px off the
  bottom leaves a strip of page visible underneath, so a sentence it crosses
  appears above it, vanishes and reappears below — a slab dropped on the text.
  Docked, copy simply runs off the bottom of the screen as copy always has. It
  cannot use the top bar's trick: Part 7.15 makes it scroll-POSITION driven
  precisely so it never flickers.

**Accessibility.** Text contrast is measured on the real glyph areas of the
rendered page, not against nominal tokens (`site/.shots/contrast.mjs`). Two
values moved as a result: the header tagline steps from `--text-3` to
`--text-2`, because the quietest ink on the site measures 3.82:1 on a lit
surface, and the primary button's specular was cut to 0.18 and pushed above the
cap height, because at full strength white type on the lit shoulder falls to
about 2.3:1. All ten measured surfaces now clear their floor. Four fallbacks
ship: reduced transparency (opaque, runtime off), more contrast (rims become
plain edges), reduced motion (no tracking, no press), and forced colours (every
control keeps a real border).

**What stays bare, unchanged from D13:** the type, the rules, the charts, the
ledger, the annotations and the device. Part 2.3's light model still holds —
the phone is the only lit object, and glass refracts what is behind it rather
than emitting.

**To revert:** delete `site/src/styles/ios26.css`, `site/src/lib/glass.ts` and
`site/src/components/Glass.tsx`, and their three import lines. The header's
hide-on-scroll and the docked mobile bar are the only changes outside those
files, both marked in place.

### D14 addendum · what the adversarial review found

Six reviewers went at the shipped implementation, each with an independent
skeptic told to refute what they reported. Twelve defects survived. They are
listed here because several of them were in claims this file was making.

**Mine, introduced by this work:**

1. **The overlap gate was red and I had reported it green.** The hover capsule
   for the text controls used `padding-inline` with a matching negative
   `margin-inline`, so the box could grow without taking space — and a negative
   margin does not politely lend space back, it lets a box grow *through* its
   neighbours. The three footer links overlapped by 18px (the tail of "Privacy"
   opened `/terms`), the first escaped its frame cell, and
   `tests/overlap.spec.ts` failed 40/40 at all six widths. I had run the gate
   before adding that rule and not after. Fixed by deleting both properties:
   these controls already carry a 44px minimum box, so the capsule had room
   without being given any.
2. **Copy was legible through both bars.** See above — the central claim of
   this entry was false, and is now fixed by making the bars solid.
3. **`--lg-fill-hi` no longer exists**, and `.wl__field:focus-within` still
   referenced it — through the `background` shorthand, so focusing the site's
   only text input deleted the field's entire background.
4. **Forced colours removed the focus indicator from every control.** The spec
   forces `box-shadow` to `none`, and every focus ring here is a box-shadow, so
   all twenty-five tab stops rendered zero changed pixels in High Contrast
   Mode. Real outlines are now restored inside that block, along with a border
   on the segmented control, which was otherwise invisible.
5. **`prefers-reduced-motion` did not stop the pointer-tracked specular.** The
   CSS half removed the *easing* and left the tracking, so the highlight jumped
   between positions — more movement per frame, not less. The runtime now skips
   it (refraction is not motion, and stays).
6. **The segmented indicator overshot its own track by 3px.** Its width already
   subtracts one 3px gutter and it travelled by both, so it ended outside the
   well with its lit edge on the page, 7px off the label it marks.
7. **At 320px the mobile bar's buttons no longer fit** — `.btn`'s 40px inline
   padding wrapped the label to three lines and pushed a 76.8px capsule out of
   a 64px bar and onto the paragraph above. The bar's controls keep the tighter
   padding.
8. Runtime robustness: the lens observer could not be re-armed after a remount
   (`watched` outlived the disconnected `ResizeObserver`), `scan()` never tested
   the inserted node itself, the specular stayed lit on a control the page had
   scrolled out from under, and the specular was pointed at `.seg__b`, which is
   deliberately bare — it now tracks `.seg`, which has a material to light.
9. The rim was lit from 315° while the insets were offset purely vertically —
   one object drawn with two light sources, which is the thing Part 2.3 spends
   a page forbidding. The insets are now diagonal.

**Pre-existing, found because the review looked:**

10. **Every FAQ answer was clipped to one line.** `Disclosure.tsx` read
    `scrollHeight` *during* the render that flips `open`, before React had put
    the answer into the panel, so it measured the inner padding and animated to
    24px. Measured in a `useLayoutEffect` after commit, with a `ResizeObserver`
    for the print-in and the late webfont: 78px, the full answer.
11. **"Take control" was the fifth tab stop on the page, at `opacity: 0`.** The
    browser scrolled to it, drew a focus ring on nothing visible, and Enter
    handed keyboard control to the embedded app with no visible change. The
    wrapper is now `inert` while it is transparent, as `MobileBar` already was.
12. **"Copy link" — the only control offered after conversion — was 89×20**,
    under half the 44px Part 10 requires in both directions.

**And the gate itself was too narrow.** Part 12 asks for 320 to 2560;
`tests/overlap.spec.ts` covered 375 to 1920. Widening it to 320 and 2560
immediately found three pre-existing failures at 320: the display type's
minimum no longer fits the brief's own manual line breaks (`--display-*` now
step down below 375px, because Part 2.5 says the breaks *are* the design, so
the type gives way), `.sell__item` used `width: max-content` — a definite width
that forced its column to the full unwrapped sentence and let the cell's
`overflow: hidden` cut it mid-word — and the drift chart's crossing label ran
21px past its cell. Eight widths × 40 scroll positions now pass.
