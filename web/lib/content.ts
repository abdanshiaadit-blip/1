/* ==========================================================================
   Every word on the site, in one file.

   Nothing here is invented. Copy marked "approved" is taken verbatim from the
   brief's copy bank; everything else is drawn from the investor material or
   from the prototype's own screens. There is exactly one statistic on this
   site and it carries its citation.
   ========================================================================== */

export const PROTOTYPE_URL = 'https://minimum-bronze-wj3yadap.edgeone.dev/'

/** Required wherever the app is shown, and again in the footer. */
export const SCOPE_LINE =
  'HUMAN informs and supports. It does not replace a doctor. Results are reviewed against protocols approved by a registered medical practitioner.'

export const hero = {
  wordmark: 'HUMAN',
  h1: 'Understand your health before something feels wrong.',
  sub: 'Book a blood test at home. Get it explained in plain English. Know the three things worth fixing — and check they moved.',
  chip: 'Working app prototype · Built for India',
  cta: 'Explore the prototype',
} as const

export const problem = {
  label: 'The problem',
  h2: 'Illness in India builds quietly, for years.',
  support:
    'Diabetes, fatty liver, thyroid problems, PCOS, heart risk. None of them hurt at first.',
  stamp: 'You feel fine.',
  turn: 'Most people think about their health when something feels wrong.',
  closer: 'By then it has been building for years.',
  caption: 'Illustrative — example member data.',
} as const

export const idea = {
  label: 'The idea',
  centre: 'Not a report. A loop.',
  nodes: [
    { key: 'Test', line: 'A blood panel, drawn at your home.' },
    { key: 'Understand', line: 'Every marker in plain English.' },
    { key: 'Choose', line: 'The three things worth fixing this quarter.' },
    { key: 'Act', line: 'A daily plan a doctor has approved.' },
    { key: 'Track', line: 'One tap a day. Your watch syncs on its own.' },
    { key: 'Improve', line: 'We retest at week 12 and show you whether it moved.' },
  ],
} as const

export const howItWorks = {
  label: 'How it works',
  h2: 'Six steps, and the product moves with you.',
  steps: [
    {
      n: '01',
      head: 'Tell us about you',
      line: 'A few questions. Your cycle, your symptoms, what you already know.',
    },
    {
      n: '02',
      head: 'Book your test',
      line: 'A phlebotomist comes to your home, at a time you pick.',
    },
    {
      n: '03',
      head: 'Understand your results',
      line: 'Every marker in words you can read. One score for how your body is doing.',
    },
    {
      n: '04',
      head: 'Know what matters',
      line: 'We pick the three things worth fixing this quarter. Not all ninety-six.',
    },
    {
      n: '05',
      head: 'Follow your plan',
      line: 'Built on Indian food and the levels Indian bodies actually need.',
    },
    {
      n: '06',
      head: 'See it move',
      line: 'We retest at week 12 and show you the change, next to your first result.',
    },
  ],
} as const

/* --------------------------------------------------------------------------
   Section 5 — the app.

   The brief's screen list was a guess, and it says so: "Open the prototype,
   list the real screens and their real labels. Use the app's own words, not
   mine." The prototype has four tabs — Home, Health, Action, Profile — plus a
   booking flow and a set of detail sheets. Screens the brief imagined and the
   product does not have (Onboarding, Start Your Day, Training, Guidance,
   Learn, Weekly insights) are dropped. Every label below is the app's.
   -------------------------------------------------------------------------- */

export type ScreenId =
  | 'home'
  | 'intel'
  | 'booking'
  | 'health'
  | 'marker'
  | 'priority'
  | 'action'
  | 'progress'

export const appTour: {
  id: ScreenId
  tab: 'Home' | 'Health' | 'Action' | 'Profile'
  name: string
  caption: string
}[] = [
  {
    id: 'home',
    tab: 'Home',
    name: 'Home',
    caption: 'One number, and the one thing today asks of you.',
  },
  {
    id: 'intel',
    tab: 'Home',
    name: 'Health Intelligence',
    caption: 'A number you can open up and question.',
  },
  {
    id: 'booking',
    tab: 'Home',
    name: 'Choose an assessment',
    caption: 'A phlebotomist, at your door, at a time you pick.',
  },
  {
    id: 'health',
    tab: 'Health',
    name: 'Health',
    caption: 'Eight body systems, read next to each other.',
  },
  {
    id: 'marker',
    tab: 'Health',
    name: 'Metabolic',
    caption: 'Every marker in plain English, against your own last result.',
  },
  {
    id: 'priority',
    tab: 'Action',
    name: 'Your priority',
    caption: 'Ninety-six markers become three ranked jobs.',
  },
  {
    id: 'action',
    tab: 'Action',
    name: 'Action',
    caption: 'A priority becomes something you can do today.',
  },
  {
    id: 'progress',
    tab: 'Action',
    name: 'Dinner Walk Protocol',
    caption: 'Then we retest, and show you whether it moved.',
  },
]

export const app = {
  label: 'Working app prototype',
  h2: 'It is real, and you can open it yourself.',
  closing: 'Built alone, with no funding. Everything here works today.',
} as const

export const signals = {
  label: 'What we read',
  h2: 'Five signals, one picture of you.',
  items: [
    {
      key: 'Blood',
      line: 'Ninety-six markers, three times a year. The part nobody else has.',
    },
    { key: 'Sleep', line: 'How well you recover, read from the watch you already wear.' },
    { key: 'Nutrition', line: 'Built on Indian food, not a translated Western plan.' },
    { key: 'Training', line: 'What you did, and whether your body responded.' },
    { key: 'Recovery', line: 'Resting heart rate, cycle, and how hard the last week was.' },
  ],
} as const

export const india = {
  label: 'Built for India',
  h2: 'The infrastructure is already here. Nobody built the part that matters.',
  blocks: [
    {
      head: 'The labs already exist.',
      line: 'Blood gets collected at home across 2,500+ towns. We use that network instead of building our own.',
    },
    {
      head: 'Testing got affordable.',
      line: 'A full panel costs a fraction of what it did five years ago. That is the only reason a yearly membership works.',
    },
    {
      head: 'Built for Indian bodies.',
      line: 'Indian food, Indian reference levels, Indian conditions. Not a Western product translated.',
    },
  ],
  /* The only statistic on this site. */
  stat: {
    value: 101,
    unit: 'million',
    lead: 'Indians live with diabetes, and',
    pct: 43,
    tail: 'of them do not know.',
    source: 'ICMR–INDIAB, Lancet Diabetes & Endocrinology, 2023',
    href: 'https://www.thelancet.com/journals/landia/article/PIIS2213-8587(23)00119-5/fulltext',
  },
} as const

export const close = {
  philosophy: 'Healthcare shouldn’t only begin when something goes wrong.',
  tagline: 'Know earlier. Act sooner.',
  founder: {
    body: 'I’m nineteen and studying nutrition and dietetics. I built this prototype on my own, with no funding — booking through to retest. Before this I started a supplement company and shut it down after my manufacturer defrauded me twice. That is why the lab contract is the first thing this money signs.',
    name: 'Aadit Bhatt',
    role: 'Founder',
  },
  cta: {
    h2: 'See HUMAN for yourself.',
    button: 'Explore the HUMAN Prototype',
    sub: 'No signup. Two minutes. Every screen is real.',
  },
} as const

export const nav = {
  links: [
    { href: '#how', label: 'How it works' },
    { href: '#app', label: 'The app' },
    { href: '#why', label: 'Why HUMAN' },
  ],
  cta: 'Explore the prototype',
} as const
