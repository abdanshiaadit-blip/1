/* ─────────────────────────────────────────────────────────────────────────────
   Every word on this site.

   spec rule 2: "Copy marked VERBATIM is final. Do not paraphrase it, expand it,
   add adjectives to it, or generate alternatives."

   It lives in one module so that it can be diffed against the specification in
   one pass, and so that no component is ever tempted to retype a sentence.
   Arrays are lines: where the spec breaks a line, the break is the design
   (spec 3.4) and each array entry is one rendered line.
   ───────────────────────────────────────────────────────────────────────────── */

import { config } from './site.config'

export const tagline = 'Know earlier. Act sooner.'
export const wordmark = 'HUMAN'
export const joinCta = 'Join the waitlist'

/* spec 1.4: present in the footer on every page, and repeated in the pricing
   section. The two sources word the final clause differently; each is used
   where its own section specifies it. */
export const medicalScopeFooter =
  'HUMAN supports your health decisions. It does not replace your doctor. If something looks urgent in your results, we will tell you to see one.'
export const medicalScopePricing =
  'HUMAN supports your health decisions. It does not replace your doctor. If something in your results looks urgent, we will tell you to see one.'

/* spec 1.4: a visible label on every chart and every app screen with numbers. */
export const sampleData = 'Sample data'

/* ── 8.1 Opening ───────────────────────────────────────────────────────────── */
export const opening = {
  h1: ['Your body has been', 'telling you for years.'],
  h1Mobile: ['Your body', 'has been telling', 'you for years.'],
  sub: [
    'HUMAN tests your blood, tells you the three things worth fixing,',
    'and tests you again twelve weeks later to show whether it worked.',
  ],
  subMobile:
    'HUMAN tests your blood, tells you what to fix, and tests you again twelve weeks later to show whether it worked.',
  primary: joinCta,
  link: 'See how it works',
  micro: config.launchMonth
    ? `150 places. Opening in ${config.launchMonth}. ${config.price.heroMicroPrice}.`
    : `150 places. Opening soon. ${config.price.heroMicroPrice}.`,
}

/* ── 8.2 The silent build ──────────────────────────────────────────────────── */
export const silentBuild = {
  headline: [
    ["Diabetes doesn’t begin", "the day you’re diagnosed."],
    ['It builds for years,', 'while you feel completely fine.'],
  ],
  chart: {
    axisLabel: 'Blood sugar, over time',
    feelFine: 'You feel fine.',
    crossing: 'Still nothing hurts.',
    years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
    feelFineYears: [2019, 2021, 2023, 2025],
    alt: 'A single line rising slowly across eight years, from an in-range band into a band marked worth attention. The same label, "You feel fine", is repeated at four points along it. Sample data.',
  },
  numerals: [
    { value: 101, unit: 'million', caption: 'Indians live with diabetes.' },
    { value: 136, unit: 'million', caption: 'more are close to it, and can still turn back.' },
    { value: 43, unit: 'in 100', caption: "have it and don’t know." },
  ],
  closing: ['A blood test would find all of this.', 'Almost nobody is looking.'],
  source: 'ICMR–INDIAB, Lancet Diabetes & Endocrinology, 2023',
}

/* ── 8.3 The ledger ────────────────────────────────────────────────────────── */
export const ledger = {
  headline: ['Four things have to happen', 'before your health actually improves.'],
  rows: [
    {
      label: 'Book a blood test',
      verdict: 'Solved.',
      detail: 'Labs collect at your home in 2,500 towns.',
      solved: true,
    },
    {
      label: 'Understand the numbers',
      verdict: 'Solved, and free.',
      detail: 'Any app does this now.',
      solved: true,
    },
    { label: 'Know what to fix first', verdict: 'Nobody does this.', detail: '', solved: false },
    {
      label: 'Come back and check it worked',
      verdict: 'Nobody does this.',
      detail: '',
      solved: false,
    },
  ],
  closing: 'We built the second half.',
}

/* ── 8.4 The loop ──────────────────────────────────────────────────────────── */
export const loop = {
  headline: ['Not a report you get once.', 'A loop that runs for a year.'],
  steps: [
    { n: 1, name: 'Test', body: 'A 96-marker panel, drawn at your home.' },
    {
      n: 2,
      name: 'Understand',
      body: 'Every marker in plain words, plus one score for how your body is doing.',
    },
    { n: 3, name: 'Choose', body: 'The three things worth fixing this quarter. Not all ninety-six.' },
    { n: 4, name: 'Act', body: 'One plan, built on Indian food and the levels Indian bodies need.' },
    { n: 5, name: 'Track', body: 'One tap a day. Your watch and cycle sync on their own.' },
    { n: 6, name: 'Improve', body: 'We test again at week twelve and show you whether it moved.' },
  ],
}

/* ── 8.5 The app ───────────────────────────────────────────────────────────── */
export const app = {
  screens: [
    {
      id: 'timeline',
      heading: 'Your results, in one place',
      body: 'Blood tests, past reports and prescriptions on one timeline you keep for years. Never a PDF you have to open.',
    },
    {
      id: 'score',
      heading: 'Your HUMAN Score',
      body: "One number for how your body is doing, plus your body’s age. A plain explainer sits behind every marker.",
    },
    {
      id: 'priorities',
      heading: 'The three things to fix',
      body: 'Not all ninety-six. Three, in order, this quarter — each one from a set our doctor has approved.',
    },
    {
      id: 'plan',
      heading: 'Start your day',
      body: "Today’s actions on one screen. One tap to confirm. Your watch and cycle sync on their own.",
    },
    {
      id: 'week12',
      heading: 'Week twelve',
      body: 'We test again and put the new number next to the old one. That is the whole point.',
    },
  ],
  /* spec 8.5 Mobile: three screens only — Results, The three things to fix, Week twelve. */
  mobileScreens: ['timeline', 'priorities', 'week12'],
}

/* ── 8.6 The retest ────────────────────────────────────────────────────────── */
export const retest = {
  headline: ['On the day you join,', 'we book your second blood test.'],
  body: [
    'Twelve weeks later. Already paid for, inside the price.',
    'Someone calls you at week ten, eleven and twelve',
    'to make sure you turn up.',
  ],
  closing: [
    "It’s the only promise on this page that costs us money.",
    "That’s why nobody else makes it.",
  ],
  rail: {
    start: 'day 0',
    marker: 'Week 12 — booked.',
    chase: [
      { week: 10, label: 'We call you.' },
      { week: 11, label: 'We call you again.' },
      { week: 12, label: 'A phlebotomist comes to your home.' },
    ],
  },
}

/* ── 8.7 The panel ─────────────────────────────────────────────────────────── */
export const panel = {
  headline: ['Ninety-six markers,', 'plus the ones your body actually needs.'],
  gridLabel: '96 markers',
  priorityLabel: '3 things to fix',
  priorities: ['Iron', 'Vitamin D', 'Blood sugar'],
  toggle: { her: 'For her', him: 'For him' },
  her: [
    'Ferritin, for every woman. Iron deficiency is one of the most common and most missed conditions in Indian women, and you cannot find it without ferritin.',
    'A hormone panel, when your symptoms call for it. We ask about your cycle, skin, hair and weight at signup, and order it only if you flag something. Running it on everybody would be over-testing.',
    'Thyroid is already inside the ninety-six.',
  ],
  him: [
    "Testosterone, for every man. The most asked-for male marker, and it isn’t in a standard package.",
  ],
  closing: "More numbers isn’t better. The right ones are.",
}

/* ── 8.8 Your own past ─────────────────────────────────────────────────────── */
export const ownPast = {
  headline: ["Normal isn’t the goal.", 'Better than last time is.'],
  body: [
    'Most reports tell you whether you sit inside a range built for everyone.',
    'We show your number next to your own last one.',
  ],
  delta: 'Falling since week 0.',
  chart: {
    week0: 'Week 0',
    week12: 'Week 12',
    previous: 'your last result',
    current: 'your now',
    alt: 'Two plotted points. The second, at week twelve, sits lower than the first, at week zero, with a line drawn between them. A quiet unlabelled band behind them shows the population range. Sample data.',
  },
}

/* ── 8.9 What we don’t sell ────────────────────────────────────────────────── */
export const dontSell = {
  headline: 'We have nothing else to sell you.',
  struck: ['A ring', 'A sensor', 'Supplements', 'Powders', 'A separate charge to explain your report'],
  paragraphs: [
    'A company that sells you a pill has a reason to find you a deficiency. We don’t sell anything you swallow or wear, so the plan can say “more dal and a walk after dinner” with nothing riding on it.',
    'We read from the watch and the cycle app you already use. Their tracking is better than ours and will stay better.',
  ],
  whoLead: 'Who this is for.',
  who: 'Women aged twenty-eight to fifty-two, and men the same age. Plenty of people join for a parent. All of it is the same price.',
}

/* ── 8.10 What we can’t tell you yet ───────────────────────────────────────── */
export const honest = {
  headline: "What we can’t tell you yet.",
  paragraphs: [
    "HUMAN hasn’t launched. There are no members, no reviews and no results to show you, and I’m not going to invent any.",
    'Here is the honest position. Nobody in Indian preventive health has published how many people actually come back for the second test. Not us, not anyone. The first hundred and fifty members are how we find out.',
    "Whatever that number turns out to be, we’ll publish it.",
  ],
  signature: 'Aadit Bhatt, founder',
}

/* ── 8.11 The price ────────────────────────────────────────────────────────── */
export const price = {
  monthly: config.price.monthly,
  annual: config.price.annual,
  includes: [
    'Three blood draws at your home, at a time you pick',
    'Ninety-six markers at signup, and the same ninety-six again at month six',
    'Ferritin for every woman, testosterone for every man',
    'A hormone panel if your symptoms call for it',
    'Your week-twelve retest, already paid for',
    'Your three priorities, re-chosen every quarter',
    'A daily plan, and a coach that answers any time',
  ],
  disclosure: 'What this costs us to run',
  /* spec 8.11 names the five cost lines but supplies no figures, and spec rule 2
     forbids inventing copy. The lines ship named and unpriced until the real
     numbers are supplied; `amount` is the only field to fill in. */
  costLines: [
    { label: 'The ninety-six marker panel', amount: null as string | null },
    { label: 'Ferritin, for every woman', amount: null as string | null },
    { label: 'Three home collections', amount: null as string | null },
    { label: 'The week-twelve retest', amount: null as string | null },
    { label: 'The month-six draw', amount: null as string | null },
  ],
  costsPending: 'Costed internally. The figures go here once the lab agreement is signed.',
  scope: medicalScopePricing,
}

/* ── 8.12 Questions ────────────────────────────────────────────────────────── */
export const questions = [
  {
    q: 'Who actually draws my blood?',
    a: "A trained phlebotomist from our partner lab, at your home, at a time you choose. You don’t go anywhere.",
  },
  {
    q: 'Is this a lab, or a doctor, or an app?',
    a: 'The lab does the testing. A doctor decides what the app is allowed to tell you. The app is where you read it, plan around it, and see whether it changed.',
  },
  {
    q: 'What if my results look bad?',
    a: "You’ll see it in plain words, not in red ink, and we’ll tell you clearly if it’s something to take to a doctor now rather than something to work on over twelve weeks.",
  },
  {
    q: 'What if I miss the second test?',
    a: "Someone calls you at week ten, eleven and twelve. That is a real person’s actual job here.",
  },
  {
    q: 'What happens to my data?',
    a: "It’s yours. It’s health data under India’s DPDP Act, we treat it that way, and we don’t sell it to anyone. You can ask us to delete it.",
  },
  {
    q: 'Can I cancel?',
    a: "Yes. You can stop the membership at any time, and you keep every result we’ve taken.",
  },
  {
    q: 'Do I need to be ill for this to be worth it?',
    a: "No. It’s most useful when nothing hurts yet — that’s the window where a number can still be changed.",
  },
  {
    q: 'Is it different for men and women?',
    a: 'Yes. Same price, different panel. Ferritin and a hormone workup on one side, testosterone on the other.',
  },
]

/* ── 8.13 The close ────────────────────────────────────────────────────────── */
export const close = {
  headline: ['150 places.', 'One intake.'],
  body: config.launchMonth
    ? [
        `We’re opening to a hundred and fifty members in ${config.launchMonth}.`,
        "Leave your WhatsApp number and we’ll message you when it opens.",
      ]
    : [
        "We’re opening to a hundred and fifty members in the first intake.",
        "Leave your WhatsApp number and we’ll message you when it opens.",
      ],
  button: joinCta,
  micro: 'No spam. One message when we open. Leave with one word.',
  tagline,
}

/* ── The waitlist form · spec 2.2, 8.13 ────────────────────────────────────── */
export const waitlist = {
  label: 'WhatsApp number',
  prefix: '+91',
  error: "That doesn’t look like a 10-digit Indian mobile number.",
  confirmHeading: "You’re on the list.",
  confirmBody:
    "We’ll message you on WhatsApp when the Founding 150 opens. No spam, and you can leave with one word.",
  share: 'Know someone this would help? Send them this page.',
  shareAction: 'Copy link',
  shareDone: 'Link copied',
}

/* ── 8.14 Footer ───────────────────────────────────────────────────────────── */
export const footer = {
  wordmark,
  line: 'Preventive health, built for India.',
  scope: medicalScopeFooter,
  /* spec 3.4 forbids middle-dot meta strings, so 8.14’s "Privacy · Terms · email"
     is set as separate items with spacing instead. */
  links: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: config.email, href: `mailto:${config.email}` },
  ],
}
