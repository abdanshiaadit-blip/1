/**
 * Content controlled by the Body toggle (§11.4).
 *
 * These three data sets are the only thing on the site that changes when
 * the toggle flips: the panel (§06), the conditions (§12) and the example
 * marker named in section 07's phone caption. Everything else is
 * body-neutral and does not react (Rule A, §3.2).
 */

export type Body = 'women' | 'men'

export type PanelGroup = { name: string; count: number }

/** The core panel: the same 96 for everyone. Grouped, because 96 rows would
 *  be unreadable and would contradict "we don't drown you in numbers". */
export const CORE_GROUPS: PanelGroup[] = [
  { name: 'Blood count', count: 24 },
  { name: 'Liver', count: 12 },
  { name: 'Minerals and electrolytes', count: 10 },
  { name: 'Lipids', count: 9 },
  { name: 'Kidney', count: 9 },
  { name: 'Vitamins', count: 8 },
  { name: 'Thyroid', count: 7 },
  { name: 'Blood sugar', count: 6 },
  { name: 'Proteins', count: 6 },
  { name: 'Inflammation', count: 5 },
]

export const CORE_TOTAL = CORE_GROUPS.reduce((sum, group) => sum + group.count, 0)

export type AddedMarker = { name: string; who: string }

export const ADDED_MARKERS: Record<Body, AddedMarker[]> = {
  women: [
    { name: 'Ferritin', who: 'Every member' },
    { name: 'FSH', who: 'Where symptoms point to it' },
    { name: 'LH', who: 'Where symptoms point to it' },
    { name: 'Prolactin', who: 'Where symptoms point to it' },
    { name: 'Oestrogen', who: 'Where symptoms point to it' },
    { name: 'Progesterone', who: 'Where symptoms point to it' },
  ],
  men: [{ name: 'Testosterone', who: 'Every member' }],
}

/** §12 06-panel — copy is final, written exactly as specified. */
export const PANEL_COPY: Record<Body, { blocks: { heading: string; body: string[] }[]; note: string }> = {
  women: {
    blocks: [
      {
        heading: 'Ferritin, for every woman.',
        body: [
          'Iron deficiency is one of the most common and most missed conditions in Indian women, and you cannot find it without ferritin. It is also the marker that moves fastest once you treat it — which makes it the ideal thing to retest at week 12.',
        ],
      },
      {
        heading: 'A hormone panel, when your symptoms call for it.',
        body: [
          'PCOS and PCOD have no lab support at all without sex hormones. We ask about your cycle, skin, hair and weight when you join, and order the hormone panel — FSH, LH, prolactin, oestrogen, progesterone — for the women whose answers point to it.',
          'We don’t run it on everyone. Testing a woman with no symptoms for PCOS is over-testing, and a doctor would refuse to sign it off.',
        ],
      },
    ],
    note: 'Thyroid is already in the core panel, for everyone.',
  },
  men: {
    blocks: [
      {
        heading: 'Testosterone, for every man.',
        body: [
          'The single most-asked-for male marker, and it is not in any standard package — including our own core. Low testosterone is common, treatable, and easy to track over time.',
        ],
      },
      {
        heading: 'The markers that matter most as you get older.',
        body: [
          'Cholesterol, liver and blood sugar are all in the core panel, and they are where risk accumulates quietly through your thirties and forties.',
        ],
      },
    ],
    note: 'A full hormone workup is available where results or symptoms call for it.',
  },
}

/** §12 12-conditions — copy is final. The women's state is longer and denser
 *  than the men's. That is correct and is not artificially balanced. */
export const CONDITIONS: Record<Body, { name: string; body: string }[]> = {
  women: [
    {
      name: 'PCOS and PCOD',
      body: 'Among the most common hormonal conditions in Indian women, and among the most missed — because the symptoms arrive one at a time and each one has an easier explanation. Irregular cycles, weight that won’t move, skin and hair changes. We ask about all of it when you join, and run the hormone panel where your answers point to it.',
    },
    {
      name: 'Thyroid',
      body: 'It drifts slowly, and the early signs — tiredness, weight, cold, low mood — are the ones everyone dismisses. It is in the core panel for every member, every time.',
    },
    {
      name: 'Iron deficiency',
      body: 'Extremely common, easily treated, and almost never tested for properly. Iron studies alone won’t find it — you need ferritin, and ferritin costs a third of the price of the entire 96-marker panel on its own, which is why it isn’t in a standard package. It is in ours, for every woman.',
    },
    {
      name: 'Blood sugar, cholesterol and liver',
      body: 'The three that build for years with no symptoms at all. Everyone gets these.',
    },
  ],
  men: [
    {
      name: 'Testosterone',
      body: 'Common to run low, straightforward to treat, and absent from almost every standard package. Fatigue, weight, mood and motivation all sit downstream of it. It is included for every man.',
    },
    {
      name: 'Blood sugar and insulin resistance',
      body: 'The window where things can still turn back is years long and completely silent. This is the group the 136 million belong to.',
    },
    {
      name: 'Cholesterol and heart risk',
      body: 'The number that matters most is rarely the one people know to ask about. We show you which of yours is doing the damage.',
    },
    {
      name: 'Liver',
      body: 'Fatty liver is now extremely common in Indian men who would describe themselves as healthy, and it is reversible when you catch it early.',
    },
  ],
}

/** The one marker named as an example in section 07's phone caption (§11.4). */
export const EXAMPLE_MARKER: Record<Body, string> = {
  women: 'ferritin',
  men: 'testosterone',
}

export const BODY_LABEL: Record<Body, string> = {
  women: 'Women',
  men: 'Men',
}

/** §16.2 — the ten metros, plus an honest escape hatch. */
export const CITIES = [
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Kochi',
  'Somewhere else',
] as const

/** §6.6 — a standing component, not a footer afterthought. */
export const SCOPE_TEXT =
  'HUMAN informs and supports your care. It does not replace a doctor, and nothing here is a diagnosis.'

export const NAV_LINKS = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/what-we-test', label: 'What we test' },
  { href: '/why-preventive', label: 'Why preventive' },
  { href: '/about', label: 'About' },
] as const

/** §16.1 — one source, cited wherever its figures appear. */
export const ICMR_SOURCE =
  'Source: ICMR–INDIAB, published in The Lancet Diabetes & Endocrinology, 2023.'
