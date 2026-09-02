# Critique

Three sentences after each session, per BRIEF.md Part 0.3: the weakest thing on
the screen, what an art director would say first, and what changed as a result.
"If you cannot find a weakness you have not looked hard enough."

---

## Session 1 — tokens, primitives, the overlap test

**The weakest thing** is that the bench proves the primitives obey Part 3 and
proves nothing about whether they look expensive: there is no composition on
screen yet, so `Rule` reads as a line appearing rather than an instrument
drawing itself, and the whole gesture is being judged on mechanics instead of
on feel. That judgement genuinely cannot happen until Session 2 puts one
composed object on screen, but it is worth naming rather than pretending the
green test means the design works.

**An art director would say** the page has no vertical music — everything sits
at one left indent with gaps chosen ad hoc, so the eight-value spacing scale
exists in `tokens.css` without being used as a rhythm anywhere. They would also
notice that at 1440px the type is floating in a great deal of unowned space,
which is a symptom of the bench having no grid discipline of its own rather
than a fault in the tokens.

**What changed as a result.** Three things, each caught by looking rather than
by reasoning: `Ticks` spaced its marks with `justify-content: space-between`,
which stretches five marks to whatever the container happens to be — fine for
the intro's five marks under five letters, wrong for graduations on a
measurement, so it now takes an optional fixed `gap` and the bench shows both.
The overlap test failed at 768px on horizontal scroll, which turned out to be
Part 2.7's desktop geometry applied below the desktop: 12 columns with 72px
gutters need 792px of gutter alone, so the grid now starts at 1024px and the
margin and gutter interpolate between the brief's two stated fixed points.
And the test itself was rewritten — it called `expect()` on every element pair,
about 200,000 times per width, and took over seven minutes; it now collects
violations and asserts once, runs all 240 checkpoints in 14.5 seconds, and was
verified against a deliberately injected overlap before being trusted.

---

## Sessions 2–10 — the lab gate, the fourteen sections, the app

**The weakest thing** is that four of the fourteen sections are still carrying
their scroll budget rather than earning it. The panel, the loop and the two
trust sections have the right content in the right place, but at 145vh and
140vh a visitor spends most of that budget looking at centred content with a
great deal of unowned space above and below it. The brief's answer would be
that the stillness is the point in 7.9–7.12 — and it is — but stillness and
emptiness are not the same thing, and right now three of those sections read
as the second.

**An art director would say** the left column is doing all the work and the
right column is doing none. On the ledger, the retest and your-own-past the
type sits at cols 1–5 and the stage at 7–12, and the stage is a hairline, a
few ticks and a lot of void. That is the brief's own frame, so it is not
wrong — but it means the page's rhythm at 1440px is a single left-aligned
column with occasional instruments beside it, and the composition never
changes shape across fourteen sections.

**What changed as a result.** The things that were actually broken, all found
by looking at renders rather than by reading code: the flowing sections used
their Part 6 budget as `min-height` with content anchored to the top, which
stranded whole sections against a screen of nothing — they now centre their
content inside the budget, which is what turns a number into rhythm. The
mobile app section put the copy above the phone; Part 5.7 says the frame is
locked in the upper portion with the copy below it, so it is. The mobile
annotation label was landing on the app screen because the layer was rendered
inside the clipped screen where no gutter exists — the layer moved out into
the device cell, and the leader now computes its own length out to the gutter
instead of assuming a fixed 64px. And the live app was rendering at the
frame's width rather than the plate's 390px, so it reflowed and the anchors
drifted off their targets in LIVE while still looking correct in DEGRADED —
precisely the failure Part 7.5.1 names. It now renders at plate size and
scales.

Two findings from the compliance audit were mine to own rather than defend:
the footer printed two sentences of the medical scope line where Part 1.4
requires three, and the three priority rows in 7.7 carried invented names.
Part 0.4 forbids inventing product capability, and the brief supplies no copy
for those rows — so they are unnamed now, and the gesture carries the argument,
which is the count rather than the contents.
