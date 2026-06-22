# PowerToFly AI — Design rules for Claude Code and Cowork

## 📖 Read the design system first
**Before building or editing any page, read [`ds/DESIGN-SYSTEM.md`](ds/DESIGN-SYSTEM.md).** It is the single source of truth — the full component inventory, which class to use when, and the new-page / new-flow checklists. This file is only the hard rules; that file is the detail. When the two ever disagree, `DESIGN-SYSTEM.md` wins.

The system lives in three files — **reuse them, never rebuild them:**
- `ds/ptf.css` — all shared styling (tokens, type, buttons, nav, footer, alert, forms, cards, sections, dark theme)
- `ds/ptf.js` — all shared behavior (nav drawer, scroll, mega-flyout, fixed header, marquee)
- `ds/template.html` — the page skeleton; `ds/flow-signup.html` / `ds/flow-event.html` — the flow skeletons

Need a nav / footer / alert / button / card / form / section / flow? **It is already built.** Copy the markup, change the copy. Don't write CSS for it. New pages link only `../ds/ptf.css` + `../ds/ptf.js`; fonts go in `<head>` exactly as in `ds/template.html`. Never copy tokens, resets, or button styles inline.

Scaffolding tools: **`/new-page`** for a marketing page, **`/new-flow`** for a signup / event-registration flow. Use them.

---

## 🚫 Non-negotiables — apply on EVERY page, without being asked
Full detail in `DESIGN-SYSTEM.md` → "The things Lizu keeps repeating."

1. **Even spacing — two stacked halves, neutral gap.** Every section owns a `var(--section-y)` half on its top AND bottom; two adjacent sections stack → every gap = `2×--section-y`, identical everywhere. ONE token drives desktop *and* mobile (it shrinks via a single `:root` media query) — **never add per-section padding, raw px, margins, or spacer divs.** The gap is neutral: a coloured block puts its colour on an **inner element** so the colour never bleeds into the gap. Exceptions (comment them): hero, the flush stat-strip, scroll-animation sections (extra bottom), and the full-bleed CTA closer. Full detail in `DESIGN-SYSTEM.md` rule #1.
2. **Aligned widths.** Nav + footer share `--container`; content sits *inside* it — `.section-narrow`, `.content` (`--content`), `.content-narrow` (`--content-narrow`). Never make text as wide as the bar. (The exact px live in the `:root` tokens in `ptf.css` — read them there, don't hardcode a width here.)
3. **Eyebrows / small labels are PLAIN green uppercase text — NEVER a pill.** Always `.eyebrow` (a `.dot` is fine; a background/border-radius is not). Same rule for category labels like `.sc-tag`. Never invent `.hero-eyebrow` / `.book-eyebrow` / etc.
4. **Images & video = real, diverse, professional people** — Pexels preferred (photos + video), or the local `photos/` library for featured faces. Never posed stock models; never all-white / all-male.
5. **Icons = the ONE approved recipe (no exceptions, existing or new):** genuine **MUI Outlined** path, `fill="url(#ptf-grad)" stroke="url(#ptf-grad)" stroke-width="1.4" stroke-linejoin="miter" stroke-linecap="square"` (gradient fill + matching gradient stroke fattens it; square corners like the thank-you check; genuinely round shapes stay round). NOT Feather/Lucide. Proof sheet + copy-paste source = `ds/_icons.html`; full recipe in DESIGN-SYSTEM rule #5. One icon family per page.

**Headline italic accent (the one that bites most):** the italic word in any headline uses `<em class="italic-plain">` — bold italic, same ink color, no gradient. The gradient `.italic-accent` is banned from headlines (h1/h2/any display text). Gradient text is only OK on small UI on dark backgrounds.

---

## How we work
Lizu gives copy + intent. You map it to existing components, reuse them, **say which**, apply rules 1–5 automatically, and verify in the browser at 1280 / 768 / 375px with a screenshot. Lizu should never have to re-specify these — if she does, that's a bug; fix it here or in `DESIGN-SYSTEM.md`.

Copy: sentence case for headlines and buttons; real PowerToFly voice (no Lorem); mark unconfirmed claims `<!-- COPY: confirm -->`. Real numbers: 80K+ experts, 6,500 AI professionals, 190 countries, 75%+ women & BIPOC, 12+ years.
