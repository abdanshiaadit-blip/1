/**
 * The single shared requestAnimationFrame loop. BRIEF.md Part 4.8, Part 10.
 *
 * Every scroll-linked sequence on the site reads from this one loop. Not one
 * listener per component — thirty components each attaching a scroll handler
 * is how a page ends up with long tasks during scroll, and Part 10 budgets
 * none over 50ms.
 *
 * The loop is not always running. It wakes on scroll or resize and puts
 * itself back to sleep once the page has been still for a few frames, which
 * is what Part 4.5 means by "nothing moves when the user is idle" — a page at
 * rest should not be burning a frame budget. That is safe here precisely
 * because every scroll-linked sequence is a pure function of scroll position
 * (Part 4.8): there is no animation state to keep ticking, so stopping the
 * loop cannot strand a sequence half-played.
 */

type Reader = (scrollY: number) => void

const readers = new Set<Reader>()

let frame = 0
let running = false
let lastY = Number.NaN
/** Frames observed with no scroll change. Three is enough to ride out the
 *  gap between a trackpad's momentum ticks without spinning at rest. */
let stillFrames = 0
const STILL_LIMIT = 3

function read() {
  const y = window.scrollY
  for (const r of readers) r(y)
  return y
}

function tick() {
  const y = read()
  stillFrames = y === lastY ? stillFrames + 1 : 0
  lastY = y

  if (stillFrames >= STILL_LIMIT) {
    running = false
    frame = 0
    return
  }
  frame = requestAnimationFrame(tick)
}

function wake() {
  if (running) {
    stillFrames = 0
    return
  }
  running = true
  stillFrames = 0
  lastY = Number.NaN
  frame = requestAnimationFrame(tick)
}

let listening = false

function listen() {
  if (listening) return
  listening = true
  // Passive: this loop never calls preventDefault, and Part 4.9 forbids
  // anything that prevents, delays, captures or redirects scroll input.
  window.addEventListener('scroll', wake, { passive: true })
  window.addEventListener('resize', wake, { passive: true })
  window.addEventListener('orientationchange', wake, { passive: true })
}

function unlisten() {
  if (!listening) return
  listening = false
  window.removeEventListener('scroll', wake)
  window.removeEventListener('resize', wake)
  window.removeEventListener('orientationchange', wake)
  if (frame) cancelAnimationFrame(frame)
  frame = 0
  running = false
}

/**
 * Register a reader. Returns an unsubscribe. The reader is called once
 * immediately so a component mounting mid-page paints its correct state
 * without waiting for the visitor to move — Part 4.5 requires that stopping
 * anywhere leaves a still, complete, correct-looking page, and that includes
 * arriving anywhere.
 */
export function subscribe(reader: Reader): () => void {
  readers.add(reader)
  listen()
  reader(window.scrollY)

  return () => {
    readers.delete(reader)
    if (readers.size === 0) unlisten()
  }
}

/** Force one synchronous pass. For layout changes the loop cannot observe,
 *  such as a disclosure opening and moving everything below it. */
export function refresh() {
  if (readers.size) read()
  wake()
}
