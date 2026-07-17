# PowerToFly AI — Design rules for Claude Code and Cowork

## 📖 Read these first — EVERY time you start or edit a page
1. **[`ds/COMPONENT-INVENTORY.md`](ds/COMPONENT-INVENTORY.md) — READ IN FULL, NO EXCEPTIONS.** The closed list of every component + the strict build contract. When Lizu gives you copy for a page, you **map her copy to components in that inventory and copy their markup — you never invent, rebuild, or write component CSS.** If a block of copy has no matching component, you STOP and ask her — you do not improvise. If a class isn't in that file, it doesn't exist.
2. **[`ds/DESIGN-SYSTEM.md`](ds/DESIGN-SYSTEM.md)** — the rules & detail behind the inventory (spacing law, widths, eyebrow rule, icon recipe, dark theme). When docs disagree, DESIGN-SYSTEM wins on rules; COMPONENT-INVENTORY wins on "what exists."

This file is only the hard rules; those two are the detail.

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
5. **Icons = ONE family (genuine MUI Outlined, NOT Feather/Lucide), treatment by SIZE:** **big ≥40px** (feature/hero icons + thank-you check) → gradient recipe `fill="url(#ptf-grad)" stroke="url(#ptf-grad)" stroke-width="1.4" stroke-linejoin="miter" stroke-linecap="square"`. **Small <40px** (list bullets, chips, inline, fields, buttons, stepper — anything repeated) → **plain single-color ink, NO gradient** (`<path d="…">` coloured with `fill:var(--ink)` in CSS). A gradient icon at 16–24px is mush — never do it. Proof sheet + copy-paste source = `ds/_icons.html`; full recipe in DESIGN-SYSTEM rule #5. One icon family per page.

**Headline italic accent (the one that bites most):** the italic word in any headline uses `<em class="italic-plain">` — bold italic, same ink color, no gradient. The gradient `.italic-accent` is banned from headlines (h1/h2/any display text). Gradient text is only OK on small UI on dark backgrounds.

---

## How we work
Lizu gives copy + intent. You map it to existing components, reuse them, **say which**, apply rules 1–5 automatically, and verify in the browser at 1280 / 768 / 375px with a screenshot. Lizu should never have to re-specify these — if she does, that's a bug; fix it here or in `DESIGN-SYSTEM.md`.

Copy: sentence case for headlines and buttons; real PowerToFly voice (no Lorem); mark unconfirmed claims `<!-- COPY: confirm -->`. Real numbers: 80K+ experts, 6,500 AI professionals, 190 countries, 75%+ women & BIPOC, 12+ years.

---

## 🔁 Design Opportunities — the rule, every time
Every opportunity in the storybook **ships with a working Accept & apply.** Lizu looks, decides, clicks — and the code changes on every page. A card that only records a decision is not a card; fix the apply or leave the finding out. "Needs judgement" is never cover for ops you didn't write. This is standing — she must never ask for it again, including for anything from **Find new opportunities**.

**An audit looks for what's MISSING, not only what differs.** Two greens a few hex apart, a colour typed straight into a page, a block she keeps rebuilding on three pages that the inventory never claimed — those are opportunities too, and they end in *add this to the system*, not *merge these*. `ds/usage-data.json` → `hex` lists every raw colour; `meta.pageOwn` lists every class a page styles itself that the system doesn't define. **A name appearing in several pages' `pageOwn` is the system telling you what it's missing** — if FAQs are on three pages, the FAQ is a component whether or not anyone wrote it down.

**Check `ds/requests.json` at the start of every session.** When neither of my answers fits an opportunity, Lizu picks *"Something else"* and writes what she actually wants. It lands there, in her words, with the finding it belongs to. Nothing in a web page can start a Claude session, so that file IS the handoff — if I don't read it, the button is a lie. Open asks (`done: false`) come first, before anything else I was going to suggest. When one is done, build the finding's real `options`/`apply` from what she asked for, mark it `done: true`, and tell her.

**`ds/audit-findings.json` is append-only.** It is Lizu's work, not scratch. A re-audit ADDS findings; it never rewrites, reorders, re-words, regenerates or "cleans up" existing ones. Every existing id keeps its wording and its apply/options ops. Think one is wrong? Say so in chat and let her decide — never silently drop it. Never delete a finding for being obsolete: obsolescence is **computed** from archived pages and already hides it on its own, and it must return if she un-archives. Back the file up before touching it and confirm every id survived.

To make that true:
- Record **where the rule lives** per variant (file + line + selector + the literal declaration), not just what it looks like — a look can't be edited. `where` = the pages the look appears on; the rule itself is often `ds/ptf.css`, not the page. Both matter.
- **Verify every address** by opening the file. Findings hold *computed* values (`#FAFAF6`); the source says `var(--bg-soft)`. Match on meaning, never guess — a wrong guess edits a page that never had the problem.
- Ops use `css-set` with `in` (`css` | `pages` | `all`) and `expect` (the measured value), so a rule that has changed since is skipped, not clobbered.
- Real alternatives (which two sizes? 700 or 800?) ship as **`options`**, each with its own apply ops — never one ambiguous Accept.
- **Prove it:** apply → diff → undo → byte-identical. An unproven apply is a bug with a button on it.
- One finding = one `/api/apply {"ops":[…]}` = one backup = one undo.
