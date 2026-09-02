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
