# Before this site goes live

Two lists. The first is §17 of the blueprint — every factual claim the site
makes and what has to be true before it is published. The second is the
parts of §18 that a build cannot settle on its own.

**None of the rows in the claims ledger can be confirmed from inside this
repository.** Each one depends on a contract, a hire or a shipped feature.
The rule from §17 stands: if a precondition is not met at launch, the copy
is cut, not softened. A hedged claim in a health context is worse than no
claim.

## Claims ledger

| # | Claim | Where it appears | What must be true |
|---|---|---|---|
| 1 | 101 million Indians living with diabetes | `03-scale` | ICMR–INDIAB / Lancet 2023. The citation renders beneath the figure and in the chart's text alternative. Re-check the figure against the latest publication. |
| 2 | 136 million pre-diabetic | `03-scale` | Same source. |
| 3 | 43 of every 100 undiagnosed | `03-scale` | Same source. |
| 4 | Home collection in 2,500+ towns | `04-ledger`, `13-india` | Verify against the partner lab's current published coverage. |
| 5 | A 96-marker core panel | `05-loop`, `06-panel`, `08-priorities` | Must match the panel actually contracted. The number is derived from `CORE_GROUPS` in `lib/content.ts`, so changing that list changes every occurrence at once — including the section 06 heading, which reads the total rather than hard-coding it. |
| 6 | Ferritin included for every woman | `06-panel`, `12-conditions` | Must be in the signed panel. |
| 7 | Testosterone included for every man | `06-panel`, `12-conditions` | Must be in the signed panel. |
| 8 | A hormone panel where symptoms flag | `06-panel`, `12-conditions` | Requires the onboarding symptom questionnaire to exist in the production app. |
| 9 | Retest booked and paid for on day one | `10-week12` | Requires the booking flow to exist. Do not publish this claim before it does. |
| 10 | A person messages you at weeks 10, 11 and 12 | `10-week12`, `14-people` | Requires the care coordinator to be hired. |
| 11 | A doctor approves every suggestion | `08-priorities`, `14-people` | **Requires the doctor co-founder to be in post.** The highest-risk claim on the site. Do not publish sections 08 or 14 without it. |
| 12 | The coach can only say what the doctor approved | `09-daily`, `14-people`, `/medical-disclaimer` | Requires the constrained-response system to be built and verified. |
| 13 | Blood drawn at your door | `13-india` | Must match the signed collection terms. The number of included home visits is deliberately not stated anywhere. |
| 14 | Indian reference levels used | `13-india`, `/medical-disclaimer` | Requires the clinical protocol to specify them. |
| 15 | Cycle sync | `09-daily`, `13-india` | Must exist in the production app. |

The LDL example in `10-week12` (145 mg/dL at enrolment, 125 at week 12,
118 at month 6) is an illustration, labelled as one in the chart's text
alternative. It is not a claim about typical outcomes. If it is ever
replaced with a real member's figures, it becomes a claim and needs
consent and a source note.

**Pricing:** no price appears anywhere — not in copy, not in metadata, not
in structured data. There is no `Product` or `Offer` schema; `Organization`
only. Keep it that way until the pilot opens.

## Still to do before launch

- [ ] **Point the waitlist form at a real destination.** Set
      `WAITLIST_WEBHOOK_URL`. Without it the handler fails loudly in
      production, which is deliberate. Confirm a submitted record is
      retrievable from the destination before opening the form.
- [ ] **Have a lawyer review `/privacy`, `/terms` and `/medical-disclaimer`.**
      They are drafts written against what the site actually collects. §16.3
      budgets for this.
- [ ] **Staff the two addresses the privacy policy names**,
      `privacy@humanhealth.in` and `grievance@humanhealth.in`. The deletion
      route is only real if someone reads them. The policy commits to
      confirming within 7 days and deleting within 30.
- [ ] **Install cookieless analytics** (Plausible or Fathom). One script
      tag in `app/layout.tsx`. No Google Analytics, no Meta Pixel, no
      session recording, and therefore no consent banner.
- [ ] **Replace the placeholder app screens.** Export the eight screens in
      `lib/screens.ts` at 1170 × 2532 and drop them over
      `public/app/*.png`. If dropping one in changes any layout, that is a
      bug in this build, not in the export.
- [ ] **Check section 08's zoom against the real screenshot.** It scales
      the priorities screen 1.75× about `50% 32%`. If the priorities list
      sits elsewhere on the real export, adjust the origin in
      `ProductWalkthrough.tsx` — never the scale.
- [ ] **Set `NEXT_PUBLIC_SITE_URL`** to the live origin, so canonicals, the
      sitemap and the Open Graph card resolve.
- [ ] **Confirm the founder note in `14-people` is what Aadit wants to say
      under his own name.** It is the only first-person copy on the site.

## What has been verified

Run against a production build at 1920×1080, 1440×900, 1280×720,
1024×640, 768×1024 and 390×844, at eleven scroll positions each.

- No horizontal scrollbar at any breakpoint.
- No element painted over text at any scroll position, hit-tested rather
  than eyeballed.
- No console errors.
- With JavaScript disabled: all fifteen sections render, nothing is left
  hidden, both Body states render under visible sub-headings, the toggle
  itself is hidden, and the waitlist CTA is a plain link to a working page
  whose form submits and redirects to a success page.
- Under `prefers-reduced-motion: reduce`: no pinning, no reserved scroll
  distance, no faded text, no progress bar.
- The Body toggle keeps both instances in sync, drives section 07's example
  marker, responds to arrow keys, and does not change the page height.
- The waitlist modal opens, moves focus in, traps it, closes on Escape,
  validates before posting, posts once, and replaces its own content on
  success.
- The nav swaps to light text over all four dark sections and back, hides
  on scroll down and returns on scroll up.
- The mobile menu opens, locks body scroll, closes on Escape, restores the
  scroll position and returns focus to its button.
- One `<h1>`, no skipped heading levels, one `<main>`, alt text on every
  image, no `object-fit: cover` on any app screen, only the six sanctioned
  z-index values, skip link first in the tab order.
- Scrolling to the bottom in one jump leaves nothing mid-animation.
- Home route JavaScript: 134 kB gzipped for modern browsers.

Still needs a person: a screen-reader pass, axe DevTools, Lighthouse, and
Safari and Firefox. The scripted checks run in Chromium only.
