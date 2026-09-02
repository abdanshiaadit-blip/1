/**
 * The non-overlap constitution, enforced. BRIEF.md Part 12.1.
 *
 * Six widths x forty scroll positions = 240 checkpoints per run. At every one
 * of them:
 *
 *   1. no two content elements from different frame cells intersect
 *   2. no content element extends beyond its own cell
 *   3. the document never scrolls horizontally
 *
 * "This is the answer to 'no elements should overlap.' Not vigilance.
 * Automation."
 *
 * Each width is walked in ONE in-page pass rather than 40 round trips: the
 * browser scrolls, settles two frames, and collects, forty times, then hands
 * back the whole run. The assertions happen here in Node. Same 240
 * checkpoints, a fraction of the wall clock — which matters, because this
 * runs after every session and a test nobody waits for is a test nobody runs.
 */

import { expect, test } from '@playwright/test'

const WIDTHS = [375, 390, 768, 1024, 1440, 1920]
const STEPS = 40
/** Sub-pixel rounding is real; a genuine collision is never 1px. */
const TOLERANCE = 1

interface Box {
  cell: string
  selector: string
  x: number
  y: number
  w: number
  h: number
}

interface Checkpoint {
  scrollY: number
  boxes: Box[]
  cells: Record<string, { x: number; y: number; w: number; h: number }>
  scrollWidth: number
  clientWidth: number
}

/** Runs in the page: scrolls through the whole document and collects a
 *  checkpoint at each stop. Decorative layers are excluded by definition
 *  (Part 3.1) — aria-hidden, role=presentation or pointer-events:none — since
 *  their only job is to sit behind content. */
async function walk(steps: number): Promise<Checkpoint[]> {
  const CONTROL = new Set([
    'IMG', 'SVG', 'CANVAS', 'IFRAME', 'VIDEO', 'BUTTON', 'A', 'INPUT', 'TEXTAREA', 'SELECT',
  ])

  const isDecorative = (el: Element): boolean => {
    for (let n: Element | null = el; n; n = n.parentElement) {
      if (n.getAttribute('aria-hidden') === 'true') return true
      if (n.getAttribute('role') === 'presentation') return true
      if (getComputedStyle(n).pointerEvents === 'none') return true
    }
    return false
  }

  /** Content = it holds its own text, or it is an image/frame/chart/control. */
  const isContent = (el: Element): boolean => {
    if (el.hasAttribute('data-cell')) return false
    if (CONTROL.has(el.tagName)) return true
    for (const n of Array.from(el.childNodes)) {
      if (n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim() !== '') return true
    }
    return false
  }

  const visible = (el: Element): boolean => {
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden') return false
    if (Number(cs.opacity) === 0) return false
    const r = el.getBoundingClientRect()
    return r.width > 0 && r.height > 0
  }

  const label = (el: Element): string => {
    const cls =
      typeof el.className === 'string' && el.className.trim()
        ? '.' + el.className.trim().split(/\s+/).join('.')
        : ''
    const text = (el.textContent ?? '').trim().slice(0, 28)
    return `${el.tagName.toLowerCase()}${cls}${text ? ` "${text}"` : ''}`
  }

  const collect = (scrollY: number): Checkpoint => {
    const boxes: Box[] = []
    const cells: Checkpoint['cells'] = {}

    document.querySelectorAll('[data-cell]').forEach((cellEl) => {
      const name = cellEl.getAttribute('data-cell') as string
      const cr = cellEl.getBoundingClientRect()
      cells[name] = { x: cr.x, y: cr.y, w: cr.width, h: cr.height }
    })

    document.querySelectorAll('body *').forEach((el) => {
      if (!isContent(el) || isDecorative(el) || !visible(el)) return
      const cell = el.closest('[data-cell]')?.getAttribute('data-cell') ?? '(no cell)'
      const r = el.getBoundingClientRect()
      boxes.push({ cell, selector: label(el), x: r.x, y: r.y, w: r.width, h: r.height })
    })

    return {
      scrollY,
      boxes,
      cells,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }
  }

  const twoFrames = () =>
    new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))

  const out: Checkpoint[] = []
  const total = document.documentElement.scrollHeight - window.innerHeight

  for (let i = 0; i < steps; i++) {
    const y = Math.round((total * i) / (steps - 1))
    window.scrollTo(0, y)
    // One frame for the shared rAF loop to read the new position, one to paint.
    await twoFrames()
    out.push(collect(y))
  }
  return out
}

const intersect = (a: Box, b: Box) =>
  a.x < b.x + b.w - TOLERANCE &&
  b.x < a.x + a.w - TOLERANCE &&
  a.y < b.y + b.h - TOLERANCE &&
  b.y < a.y + a.h - TOLERANCE

const r = (n: number) => Math.round(n)

for (const width of WIDTHS) {
  test(`no overlaps at ${width}px across ${STEPS} scroll positions`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    // Let webfonts settle: a reflow mid-measurement would produce a phantom
    // collision and, worse, could hide a real one.
    await page.evaluate(() => document.fonts.ready)
    await page.waitForTimeout(300)

    const run = await page.evaluate(walk, STEPS)

    /* Violations are collected, then asserted once. A page of ~100 content
       elements produces ~5,000 pairs per checkpoint and 200,000 per width;
       an expect() per pair costs minutes of wall clock and tells you nothing
       the collected list does not. Same comparisons, same reporting — only
       the assertion count changes. */
    const failures: string[] = []

    for (let i = 0; i < run.length; i++) {
      const snap = run[i]
      const where = `viewport ${width}px, scrollY ${snap.scrollY} (step ${i + 1}/${STEPS})`

      // 6. No horizontal scroll, ever, at any width.
      if (snap.scrollWidth > snap.clientWidth + TOLERANCE) {
        failures.push(
          `${where}: horizontal scroll — scrollWidth ${snap.scrollWidth} > clientWidth ${snap.clientWidth}`,
        )
      }

      // 5. No element's box extends beyond its assigned cell.
      for (const b of snap.boxes) {
        const cell = snap.cells[b.cell]
        if (!cell) continue
        if (
          b.x < cell.x - TOLERANCE ||
          b.y < cell.y - TOLERANCE ||
          b.x + b.w > cell.x + cell.w + TOLERANCE ||
          b.y + b.h > cell.y + cell.h + TOLERANCE
        ) {
          failures.push(
            `${where}: ${b.selector} escapes its cell "${b.cell}" — ` +
              `element [${r(b.x)},${r(b.y)} ${r(b.w)}x${r(b.h)}] ` +
              `vs cell [${r(cell.x)},${r(cell.y)} ${r(cell.w)}x${r(cell.h)}]`,
          )
        }
      }

      // 4. No two content elements from DIFFERENT cells intersect.
      for (let a = 0; a < snap.boxes.length; a++) {
        for (let b = a + 1; b < snap.boxes.length; b++) {
          const A = snap.boxes[a]
          const B = snap.boxes[b]
          if (A.cell === B.cell) continue
          if (!intersect(A, B)) continue
          failures.push(
            `${where}: OVERLAP between cells "${A.cell}" and "${B.cell}"\n` +
              `  A ${A.selector} [${r(A.x)},${r(A.y)} ${r(A.w)}x${r(A.h)}]\n` +
              `  B ${B.selector} [${r(B.x)},${r(B.y)} ${r(B.w)}x${r(B.h)}]`,
          )
        }
      }
    }

    // Fail loudly: the scroll position, the viewport, and both selectors.
    expect(
      failures.length,
      failures.length
        ? `\n${failures.length} violation(s) at ${width}px:\n\n` +
            failures.slice(0, 12).join('\n') +
            (failures.length > 12 ? `\n… and ${failures.length - 12} more` : '')
        : '',
    ).toBe(0)
  })
}
