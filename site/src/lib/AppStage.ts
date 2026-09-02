/**
 * The one module everything else talks to about the app. BRIEF.md Part 5.3.
 *
 * Every other component on the site calls this interface and nothing else, so
 * the mount strategy can be swapped without touching a single component. Today
 * it is Strategy 2 — the app built to a same-origin route and framed
 * (DECISIONS.md D2).
 *
 *   mount(container)        -> Promise<void>
 *   show(screenId)          -> void      // debounced, 250ms
 *   setInteractive(boolean) -> void
 *   getState()              -> 'idle' | 'ready' | 'live' | 'interactive' | 'degraded'
 *   destroy()               -> void
 *
 * Rules the brief attaches to this contract, all of them load-bearing:
 *   - show() is idempotent. Calling it with the current screen does nothing.
 *   - Fast scrolling never queues navigations; it coalesces to the latest.
 *   - The stage mounts ONCE and stays mounted for the life of the page. It is
 *     never unmounted on scroll-away.
 *
 * And the rule that governs every failure path: **no spinner, no skeleton, no
 * "loading the app…", no error state visible to the user.** Ever. Anything
 * that goes wrong degrades to a poster the visitor cannot distinguish from
 * the real thing.
 */

export type ScreenId = 'timeline' | 'score' | 'priorities' | 'plan' | 'week12'
export type StageState = 'idle' | 'ready' | 'live' | 'interactive' | 'degraded'

const EMBED_URL = '/app-embed/index.html'
const DEBOUNCE_MS = 250

let frame: HTMLIFrameElement | null = null
let state: StageState = 'idle'
let current: ScreenId | null = null
let pending: ScreenId | null = null
let timer = 0
let mounted: Promise<void> | null = null

export function getState(): StageState {
  return state
}

/**
 * Mount once. Resolves when the framed document has loaded, or degrades
 * silently if it cannot — the caller never has to handle a rejection, because
 * there is no user-visible difference between a slow mount and a failed one:
 * the poster is holding either way.
 */
export function mount(container: HTMLElement): Promise<void> {
  if (mounted) return mounted

  mounted = new Promise<void>((resolve) => {
    const el = document.createElement('iframe')
    el.src = EMBED_URL
    el.className = 'appstage__frame'
    el.title = 'The HUMAN app, running on sample data'
    // Part 5.5: before control is taken, scroll passes straight through and
    // the app cannot capture the wheel, trap touch, or steal focus.
    el.setAttribute('tabindex', '-1')
    el.setAttribute('scrolling', 'no')
    el.setAttribute('loading', 'eager')

    let settled = false
    const done = (next: StageState) => {
      if (settled) return
      settled = true
      state = next
      resolve()
    }

    el.addEventListener('load', () => done('live'))
    el.addEventListener('error', () => done('degraded'))
    // No spinner and no timeout that shows anything. If the document is slow,
    // the poster simply keeps holding; if it never arrives, DEGRADED is
    // indistinguishable to the visitor.
    window.setTimeout(() => done('degraded'), 8000)

    container.appendChild(el)
    frame = el
    state = 'ready'
  })

  return mounted
}

/**
 * Idempotent and coalescing. Scrolling the whole section in 400ms must not
 * execute five navigations — it executes the last one.
 */
export function show(screen: ScreenId) {
  if (screen === current) return
  pending = screen
  if (timer) return

  const run = () => {
    timer = 0
    if (!pending || pending === current) return
    const next = pending
    pending = null
    current = next
    if (frame?.contentWindow) {
      // Same origin, so this is a direct navigation of the real app — not a
      // postMessage handshake that can fail.
      try {
        frame.contentWindow.location.hash = `#/${next}`
      } catch {
        state = 'degraded'
      }
    }
    // Trailing edge: if more calls arrived while this one ran, take the last.
    if (pending) {
      timer = window.setTimeout(run, DEBOUNCE_MS)
    }
  }

  run()
  timer = window.setTimeout(run, DEBOUNCE_MS)
}

/** The current screen, for the poster crossfade and the progress rail. */
export function getScreen(): ScreenId | null {
  return current
}

/**
 * Part 5.5. Never auto-enabled — it is always her decision. An app that
 * becomes interactive on hover is a scroll trap.
 */
export function setInteractive(on: boolean) {
  if (!frame) return
  if (on) {
    frame.removeAttribute('inert')
    frame.setAttribute('tabindex', '0')
    frame.setAttribute('scrolling', 'yes')
    state = 'interactive'
  } else {
    frame.setAttribute('inert', '')
    frame.setAttribute('tabindex', '-1')
    frame.setAttribute('scrolling', 'no')
    state = mounted ? 'live' : 'degraded'
  }
}

export function destroy() {
  if (timer) window.clearTimeout(timer)
  frame?.remove()
  frame = null
  mounted = null
  current = null
  pending = null
  timer = 0
  state = 'idle'
}
