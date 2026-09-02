# Session 0 — repo discovery

Per BRIEF.md Part 5.1 and Part 15. No UI code written. No repo restructuring.
Everything below was read from source or measured in a browser; nothing is inferred.

---

## 0. Browser tooling — confirmed

Playwright drives a real Chromium here (`/opt/pw-browsers/chromium-1194`), navigates and
screenshots. Every image in `session0/` came out of it. The standing rule in Part 0.1 is
satisfiable: I can see my own work.

One environment detail for later sessions: the preinstalled browser build (1194) predates
the `playwright` npm package's pin, so scripts launch with an explicit `executablePath`
rather than `npx playwright install`. `scripts/capture-app.mjs` takes it from `CHROMIUM_PATH`.

---

## 1. Repository layout

Standalone Vite project at the repo root. Not a workspace, not a monorepo, not Next or CRA.

```
.gitignore  README.md  index.html  package.json  package-lock.json
tsconfig.json  vite.config.ts  vite.config.portable.ts
docs/  scripts/  src/
```

No `public/`. No CI, no `netlify.toml`/`vercel.json`/edgeone config, no Dockerfile, no
`.env*`, no deploy script. The only hosting-relevant setting is `base: './'` in both Vite
configs, which makes the build path-agnostic.

**Both layouts are viable. I recommend Option B (sibling).**

| | Option A — workspace | Option B — sibling |
|---|---|---|
| | `/apps/app`, `/apps/site`, `/packages/ui` | app stays at root, new `/site` |
| App deployment | Must be re-pointed | Untouched |
| Cost | Regenerate root `package-lock.json` (currently the app's own, named `human`); add `composite: true` to `tsconfig.json` for project references; fix `README.md`'s `docs/` link; re-verify the `portable` chain | Nothing |
| Shared tokens | `packages/ui` | Not needed — see below |

Option B wins because the shared-tokens argument does not apply here. Part 2.2 and the app's
`tokens.css` are *different palettes on purpose*: the site is a near-black measurement
chamber, the app is a light Liquid Glass canvas, and the brief's whole light model
(Part 2.3) depends on them staying different. There is nothing to share, so the workspace
buys structure without a payoff and costs four concrete migrations.

**What would break if the app moves** (Option A only):

1. `index.html:24` loads `/src/main.tsx` root-absolutely. Correct today only because Vite's
   root defaults to cwd. Any root-level Vite config without `root: 'apps/app'` 404s the entry.
2. The `portable` chain is cwd-coupled: Vite resolves `dist-portable` against its root while
   `scripts/build-portable.mjs:19-21` resolves it against its own file location. Split the
   cwd and it throws `ENOENT`.
3. `package-lock.json` at the root is the app's lockfile occupying the workspace-root slot.
4. `tsconfig.json` has no `composite`, so it cannot be referenced from a root tsconfig
   without editing it.

Nothing else: no absolute host paths anywhere, `.gitignore` patterns are unanchored, and
`build-portable.mjs` derives its paths from its own location.

---

## 2. Framework and build

React **19.2.8** · TypeScript **5.9.3** · Vite **7.3.6** · `@vitejs/plugin-react` 5.2.0.
Node 22.22.2. Strict TS with `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`.

Five scripts: `dev`, `build` (`tsc -b && vite build`), `preview`, `typecheck`, and `portable`
— which builds an IIFE bundle and inlines CSS, JS and two Inter woff2 subsets into a single
`HUMAN-app/index.html` that opens from `file://`.

Three runtime dependencies total: react, react-dom, `@fontsource-variable/inter`. No CSS
framework, no UI kit, no chart library, no animation library, no router, no state library.

---

## 3. The five screens — read this before writing 7.5

**None of the five website screen ids exists in the app.** There is no route, sheet kind or
state flag named `timeline`, `score`, `priorities`, `plan` or `week12`. The app is four tabs
(Home, Health, Action, Profile), a Booking modal, and a stack of 22 sheets.

All five *views* are nonetheless real and reachable — but **only on Meera Iyer, not on the
default persona.** That is the single most consequential finding in this report.

| id | What actually renders it | Reachable by | Verdict |
|---|---|---|---|
| `timeline` | `PassportSheet` — "Health Passport / Your longitudinal record" | Health tab → Health Passport card | EXISTS_ONLY_AS_SHEET |
| `score` | `IntelligencePanel` (`src/components/viz.tsx:61`), numeral at `:115` | Home hero | EXISTS_AS_STATE_WITHIN_SCREEN |
| `priorities` | `NextUpSheet` — "What HUMAN is not showing you", a ranked list | Action → "Not now" → **Why** | EXISTS_ONLY_AS_SHEET |
| `plan` | `Action` (`src/screens/Action.tsx:13`), "Today" with one-tap confirms | Action tab | EXISTS_AS_COMPONENT |
| `week12` | `ReadoutSheet` for a completed experiment | Action → Completed → Readout | EXISTS_ONLY_AS_SHEET |

Three of the five are **module-private** inside `SheetHost.tsx` — only `export default
function SheetHost` exists. They cannot be imported by a site build without exporting them
first, and they all call `useApp()`/`useLookups()`, which throw outside `AppProvider`.

### Why the persona decides whether this section can ship honestly

On **Aadit Rao** (the default), two of the brief's five screens do not exist as written:

- Part 7.5 screen 3 says *"Three, in order, this quarter."* Aadit has **four** priorities
  (`src/data/aadit.ts` ranks 1–4). The ranked list renders four rows.
- Part 7.5 screen 5 says *"Week twelve."* Aadit's only completed experiment is the
  **eight-week** Sugar-in-Chai Reduction ("across the eight weeks", "47 of 56 days").
  Every retest in his data is a future due date with no result attached.

On **Meera Iyer**, both resolve, exactly:

- **Three** priorities, ranks 1–3, rendered as a numbered list with rank 1 marked
  "Active now" (`session0/app-screens/screen-priorities@3x.png`).
- A genuine **twelve-week** before-and-after: `e_vitd_done`, `weeks: 12`, tracked signal
  `Vitamin D` `baseline '16 ng/mL'` → `now '24 ng/mL'`, readout copy *"Vitamin D rose from
  16 to 24 ng/mL across the 12 weeks"* (`src/data/meera.ts:709-736`).

Meera is also the brief's own audience (Part 1.5: a woman 28–52 managing iron, thyroid or
cycle issues). **Recommendation: the embedded app runs as Meera.** The captured plates and
the annotation anchors in `session0/annotations.ts` are authored against her.

### Two claims in Part 7.5 that no persona fixes

1. **"Your HUMAN Score."** The app never uses that name. The numeral is labelled
   **"Health Intelligence"** (`src/components/viz.tsx:114`). The heading sits beside a
   screenshot that visibly says something else.
2. **"plus your body's age."** There is no biological, body or metabolic age anywhere in the
   app. The only age is chronological, on the Profile identity row.

Part 7.5's copy is marked VERBATIM and Part 1.4 governs what may be claimed, so I have not
reworded either. Both need your decision — see Blocking questions.

### Annotation anchors — all six verified

`session0/annotations.ts` (staged; its home is `src/config/annotations.ts`). Coordinates were
**measured from the live DOM**, not estimated, then pulled toward the region edge the gutter
rule needs. Check plates render every dot over its plate in
`session0/app-screens/_annotation-check/`, and all six land on their intended element.

| Screen | Label | Anchors to |
|---|---|---|
| `timeline` | Every test, kept | The list of past results |
| `score` | One number | The numeral (a 99×79 box — a generous region) |
| `priorities` | Fix this one first | Rank 1, "Iron & Energy Restore / Active now" |
| `plan` | One tap to confirm | The 32×32 confirm control on row 1 |
| `week12` | Your first result / Twelve weeks later | "from 16 ng/mL" and "24 ng/mL" |

One caveat on the check renderer: it draws labels inline beside each dot, so on `week12` the
two labels collide in the image. In the real layout they go to opposite gutters outside the
phone (Part 7.5.1), so this is an artefact of the check plate, not of the design.

---

## 4. Routing

**There is no router.** No React Router, no hash router — nothing in `src/` imports one. The
app never reads or writes `location`, `history` or the hash. Navigation is one React context.

`src/state/app.tsx` exposes, through the exported `useApp()` hook:

```
tab, setTab(TabId)                       'home' | 'health' | 'action' | 'profile'
sheets, openSheet(kind, id?), closeSheet(), closeAllSheets()
booking, openBooking(panelId?), closeBooking()
persona, setPersona(PersonaId)
done, toggleAction(id)
```

This is better news than a router would have been. **Every one of the five website screens is
reachable through two exported calls** — `setTab` and `openSheet` — which means the
`AppStage.show(screenId)` contract in Part 5.3 maps onto the app without touching a single
existing app file. A new bridge component that calls `useApp()` and reacts to a hash or a
`postMessage` is purely additive.

A screen component rendered outside `AppProvider` throws (`src/state/app.tsx:145`).
The minimal wrapper is `<AppProvider>` alone — verified: the collision test mounted
`<AppProvider><Home /></AppProvider>` with zero console errors.

---

## 5. Styling — this is what decides the strategy

Plain hand-written CSS. No Tailwind, no CSS Modules, no styled-components, no PostCSS, no
`@layer`. BEM-ish global class names. Four stylesheets: `tokens.css` (132), `base.css` (250),
`app.css` (3,250), `intro.css` (81).

The global blast radius is small but decisive. **Every unscoped selector that ships:**

```
src/styles/base.css:5    *, *::before, *::after { box-sizing: border-box }
src/styles/base.css:11   * { margin: 0; padding: 0; -webkit-tap-highlight-color: transparent }
src/styles/base.css:17   html, body { height: 100%; overflow: hidden }
src/styles/base.css:23   body { font-family: var(--font); background: var(--bg-base);
                                color: var(--text-1); -webkit-font-smoothing: antialiased;
                                font-variant-numeric: tabular-nums; overscroll-behavior: none }
src/styles/base.css:34   button { font: inherit; color: inherit; background: none;
                                  border: none; cursor: pointer }
src/styles/base.css:42   #root { height: 100% }
src/styles/base.css:241  @media (prefers-reduced-motion: reduce) { *, *::before, *::after {
                                animation-duration: .001ms !important; ... } }
src/styles/tokens.css:13 :root { --bg-base … 72 custom properties }
```

Plus one rule that is not a selector problem but is worse:

```
src/styles/base.css:50   .stage { position: fixed; inset: 0; … }
```

The app's own root container is `position: fixed; inset: 0`. It escapes any wrapper and
covers the host viewport.

Well-behaved elsewhere, and worth saying: no `createPortal`, no `document.body` mutation, no
`@font-face` of its own beyond the Inter package, and every overlay (sheets, booking modal,
launch intro) is `position: absolute` inside `.screen`. The 3,250 lines of `app.css` are
entirely class-scoped and would travel safely.

Token names that would collide with a site design system in both directions:
`--surface`, `--track`, `--gutter`, `--font`, `--rim`, `--blur`, `--hairline`, `--text-1..4`.
Note `--hairline` and `--text-2`/`--text-3` are also Part 2.2 token names.

---

## 6. Global state and environment

One context (`AppProvider`) holding six `useState` values. No store, no reducer, no
`localStorage`, no IndexedDB, no service worker, no data fetching — every profile is a static
fixture imported from `src/data/`. `src/data/validate.ts` runs a referential-integrity check
**only under `import.meta.env.DEV`** (`src/main.tsx:13`), dead-code-eliminated in production.

One thing an embed must handle: `LaunchIntro` is a ~5s overlay on first load, gated on
`sessionStorage['human.intro.played']` and forceable with `?intro=true`
(`src/components/LaunchIntro.tsx:24-33`). It would fire inside an embedded mount. The capture
script sets the key before first paint; the site embed must do the same, or the visitor
watches the app's intro play inside the phone frame during 7.5 Beat 2.

---

## 7. The collision test — it bled, comprehensively

Method: one page, `void` ground, the site's real hero type, and `<AppProvider><Home /></AppProvider>`
in a 390×844 box beside it. Captured twice at 1440×900 — once without the app's CSS (A),
once with it imported exactly as `main.tsx` imports it (B).

`session0/collision-A-site-only.png` · `session0/collision-B-with-app.png`

| Measured | A (site only) | B (+ app CSS) |
|---|---|---|
| `body` background | `rgb(5,16,13)` — void | **`rgb(245,248,247)` — the app's light canvas** |
| `body` color | `rgb(232,240,236)` | `rgb(6,35,31)` |
| Heading font-family | `Switzer, "Helvetica Neue", …` | **the app's `-apple-system … Inter` stack** |
| `box-sizing` | `content-box` | `border-box` |
| `html`/`body` overflow | `visible` | **`hidden`** |
| Page can scroll | **true** | **false** |
| `font-variant-numeric` | `normal` | `tabular-nums` |
| `overscroll-behavior` | `auto` | `none` |

The screenshot is unambiguous: the dark measurement chamber turns white and the headline
becomes pale-green-on-white, barely legible. The page also stops scrolling — on a site with a
~2,120vh scroll budget, that alone is fatal.

The mount itself was clean: the screen component rendered correctly, one child under
`#mount`, **zero console errors**. The app's *code* is embeddable. Its *CSS* is not.

---

## 8. Recommendation — Strategy 2, and not reluctantly

**Strategy 2: build the app to a same-origin route (`/app-embed`) and iframe it.**

The CSS bleed above is scopeable with effort — rewrite the seven global rules in `base.css`
to be wrapper-scoped, move the 72 `:root` tokens onto the wrapper, change `.stage` from
`fixed` to `absolute`. Call it a day's careful work. But it requires **editing the app's own
stylesheets**, which changes how the app renders standalone and in its deployed prototype, and
Part 5.1 is explicit that this repo is not to be disturbed lightly.

And there is one failure that scoping cannot fix:

> `src/styles/base.css:158` — `@media (max-width: 460px), (max-height: 880px) and (pointer: coarse)`

This is how the app chooses between full-bleed phone rendering and the desktop iPhone-frame
presentation. **A media query evaluates against the viewport, not against your container.**
Mount the app in a 390px box on a 1440px page and the query does not match, so the app draws
its own iPhone hardware frame — bezel, shadow, entrance animation — *inside* the site's phone
frame. A phone inside a phone. Fixing it means rewriting the app's responsive logic as
container queries.

An iframe fixes it for free, because the iframe **is** the viewport. The same is true of
`index.html`'s `viewport-fit=cover` and safe-area insets, the 22 `backdrop-filter` surfaces
that would otherwise sample the site's dark page through the app's glass, and the
`prefers-reduced-motion` block whose four `!important` universal rules would kill every
animation on the site for reduced-motion visitors — precisely the users Part 4.10 promises a
complete poster version to.

What Strategy 2 costs: one extra document load, invisible if warmed during 7.4.

What it keeps, which the brief assumed it would lose: **same origin means `contentWindow` is
directly accessible, and the app exposes `setTab` and `openSheet` through `useApp()`.** So
`AppStage.show(screenId)` still drives the real product — no `postMessage` handshake, no
2,500ms timeout, no poster-to-iframe crossfade needed. The embed entry is a new
`app-embed.html` + a small bridge component that calls the existing exported hook. **No
existing app file changes.**

`DECISIONS.md` gets written once you confirm.

---

## 9. Blocking questions

**1. Repo layout — workspace or sibling?** I recommend sibling (`/site`). Part 14 lists this
as yours to answer, and I have moved nothing.

**2. The persona.** Do you agree the embedded app runs as Meera? It is what makes
`priorities` and `week12` truthful. If it must be Aadit, then Part 7.5's screen-3 and
screen-5 copy needs rewriting and I should stop rather than annotate around it.

**3. "Your HUMAN Score" and "plus your body's age."** Neither exists in the app. Options:
change the app (add a body age, rename the label), change the VERBATIM copy, or drop the
half-sentence. I have not chosen.

## 10. Conflicts found that Part 7 does not anticipate

These are not blockers for Session 1, but they are decisions someone has to make before 7.5
ships, because they are all things a visitor sees *on the site* once she takes control.

**Prices.** Part 1.4 and Part 13 ban a price in any currency anywhere on the site. The app
displays seven, reachable in two taps from the embedded frame:

```
SheetHost.tsx:893  ₹9,999/year        (Membership)
SheetHost.tsx:906  ₹999/mo
SheetHost.tsx:907  ₹19,999/yr
SheetHost.tsx:908  ₹3,000–6,000
Booking.tsx:127,162,254  panel prices
```

Profile → Membership, or any Book-a-test flow. Options: keep the app non-interactive
(contradicts "Take control", the brief's own centrepiece), gate those sheets in the embed
build, or accept prices on the site. Worth noting the brief contradicts itself here —
Part 12.6 says "Every price display shows GST at readable size", which cannot be true if no
price appears.

**The lab partner is named.** The Health Passport says *"Fasting sample collected at 7:10am,
Indiranagar. **Redcliffe Labs**."* Part 14: the partner "currently must not be" named
publicly. It is visible in `screen-timeline@3x.png` on Aadit.

**Purple.** Part 2.2: "No purple." `--accent-violet: #6d54e8` (`tokens.css:56`) renders the
"What this does not tell us" caveat card and the milestone ticks — visible in
`screen-week12@3x.png`. The favicon gradient in `index.html` also ends at `#a97bff`.

**Weights.** Part 2.5 forbids 600+. The app's type scale runs 730/690/640. Fine inside the
frame — the app is a separate design system — but do not let it leak into the site's tokens.

**What is *not* a problem:** I checked the app's copy against Part 1.7's banned-word list. The
only hits are false positives — "elevated" in its clinical sense (elevated ApoB, Lp(a)) and
"unlock" describing a privacy permission. No exclamation marks, no emoji.

---

## Artefacts

```
session0/DISCOVERY.md                      this report
session0/annotations.ts                    staged anchors -> site/src/config/annotations.ts
session0/annotations.json                  machine-readable mirror, read by the capture script
session0/collision-A-site-only.png         the collision test, without the app's CSS
session0/collision-B-with-app.png          the collision test, with it
session0/app-screens/screen-{id}@3x.png    the five plates, 390x844 @3x, Meera
session0/app-screens/_annotation-check/    every dot rendered over its plate
scripts/capture-app.mjs                    re-runnable; re-verifies anchors on every run
```

`scripts/capture-app.mjs` defaults its output to `public/app` as Part 5.1 item 8 specifies.
I ran it with `--out session0/app-screens` deliberately: `public/` does not exist in this repo,
and creating it would put five unused PNGs into the *app's* production build. The plates move
to the site's `public/app/` the moment the layout question is answered — it is a flag, not a
code change.
