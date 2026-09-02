# tools

Four probes that answer questions about the rendered page rather than about the
source. Every number quoted in `DECISIONS.md` D14 came out of one of them, and
several of those numbers were wrong the first time — the comments in each file
record how.

The site must already be running on `http://localhost:5174` (`npm run dev`).

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
