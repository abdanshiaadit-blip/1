# tools

Four probes that answer questions about the rendered page rather than about the
source. Every number quoted in `DECISIONS.md` D14 came out of one of them, and
several of those numbers were wrong the first time — the comments in each file
record how.

The site must already be running (`npm run dev`, which serves it on
`http://127.0.0.1:5174`). Point them elsewhere with `SITE=…`.

They drive a real browser through Playwright, so on a fresh machine run
`npx playwright install chromium` once. Set `CHROMIUM_PATH` only if you have a
Chromium that Playwright cannot download for itself — which is the case in the
container this was built in, and almost nowhere else.

| | |
|---|---|
| `contrast.mjs` | Worst-case text contrast, measured on the real glyph rects of the rendered page. Not against nominal tokens, and not against the worst pixel anywhere in a control — on a bevelled surface that is always the rim and never the type. Exits non-zero on a failure, so it can gate. |
| `filter-ab.mjs` | Does a `backdrop-filter` change any pixels on a given surface? Applies the filter explicitly and diffs, with a stability control that shoots the same state twice first — the section entrance animations will otherwise impersonate a result. |
| `contact-sheet.mjs` | Six scroll positions at 1440 and 390, composed into two sheets. What `CLAUDE.md` asks for before any section is called done. |
| `scroll-perf.mjs` | Frame timings across a full-page scroll, with the material and without it. |

```
node tools/contrast.mjs                      # all glass surfaces
node tools/contrast.mjs ".btn--primary,.hdr__in"
node tools/filter-ab.mjs
node tools/contact-sheet.mjs
node tools/scroll-perf.mjs 390
```

## Running the whole check

```
npm run dev &                                  # the site, on :5174
npx playwright test tests/overlap.spec.ts      # 6 widths x 40 scroll positions
node tools/contrast.mjs                        # exits non-zero on a failure
node tools/scroll-perf.mjs 1440
node tools/scroll-perf.mjs 390
node tools/contact-sheet.mjs                   # then look at the two sheets
```
