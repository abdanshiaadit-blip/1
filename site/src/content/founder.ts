/* ==========================================================================
   The founder.

   Only what the project materials actually support. The website blueprint
   supplied four facts and nothing else: nineteen, studying nutrition and
   dietetics, built the prototype alone with no funding, and shut down a
   supplement company before this.

   No name, portrait or reel exists anywhere in this project, so none is
   invented here. Fill `name`, `portrait` and `reel` in and the section will
   render them; leave them empty and it renders correctly without.
   Put media in site/public/ and reference it as '/founder.jpg'.
   ========================================================================== */

export const founder = {
  /** e.g. 'Aadit Sharma'. Empty renders the section without a byline. */
  name: '',
  /** e.g. 'Founder, HUMAN'. */
  role: 'Founder',
  /** e.g. '/founder.jpg' — a still portrait. */
  portrait: '',
  /** e.g. '/founder-reel.mp4' — plays when in view, pauses when it leaves. */
  reel: '',
  /** Poster frame for the reel. */
  reelPoster: '',

  eyebrow: 'Who is building this',
  title: 'One person, so far.',

  lines: [
    'I am nineteen, and I am studying nutrition and dietetics.',
    'I built this prototype on my own. No team, no funding, no agency — every screen, every number and every line of copy in it.',
    'Before HUMAN I started a supplement company and shut it down. I learned what a supplier can do to you, and I learned that selling people a product is not the same as helping them get healthier.',
    'HUMAN is the thing I wanted to build instead.',
  ],

  /** Presented as previous experience and what it taught — never as a HUMAN product. */
  previous: {
    label: 'Before HUMAN',
    name: 'House of Kings',
    what: 'A supplement company. Started, then closed.',
    learned:
      'That the hard part of health is not selling someone something. It is helping them understand what is actually happening, and staying with them long enough for it to change.',
  },
}
