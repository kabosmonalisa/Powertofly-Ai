# PowerToFly AI — Design System

This is the single source of truth for building pages. **Read this before touching any page.**

The system lives in three files. You **reuse** them. You do **not** rebuild them.

| File | What it holds |
|------|---------------|
| `ds/ptf.css` | All shared styling: tokens, type, buttons, nav, footer, alert bar, forms, cards, sections, dark theme |
| `ds/ptf.js`  | All shared behavior: nav drawer, scroll, mega-flyout, fixed-header offset, marquee |
| `ds/template.html` | The page skeleton to copy when starting a new page |

---

## ⛔ The one rule that matters most

**Never rebuild what already exists. Copy the markup, change the words.**

When you need a nav, a footer, an alert bar, a button, a form, a card, a section — it is **already built**. Your job is to:
1. Copy the existing markup (from `template.html` or the page named below).
2. Link `../ds/ptf.css` and `../ds/ptf.js`.
3. Change the **copy** (text), not the CSS.

If you find yourself writing CSS for a nav, footer, button, card, form field, or section padding — **stop**. It exists. Go find it.

### Corollary: never copy shared CSS inline into a page
The biggest source of drift on this site is pages that carry their **own inline copy** of shared chrome (the nav width, the `.top-alert`, the footer). When a value is duplicated in five `<style>` blocks, they drift apart — that's why the alert heights and nav widths disagreed between pages. A page must **reference** the master (`ds/ptf.css`), not re-declare it.

- A class that lives in `ptf.css` (`.top-alert`, `.nav-inner`, `.section`, `.btn`, `.eyebrow`, the mega-nav, the footer…) must **not** be re-defined in a page `<style>` block or with inline `style=""`.
- If you spot an inline copy of a shared rule, **delete it** so the master governs — don't "fix" the copy on that one page.
- Fixing the master then fixes every page at once, and new pages match for free. Fixing one page's copy fixes nothing else and guarantees this conversation repeats.

You may only write new CSS for something that is **genuinely unique to this one page** and appears in the "Not in the system" list below.

---

## How to start a new page (the only correct way)

1. Copy `ds/template.html` to your new folder, e.g. `pricing/index.html`.
2. In `<head>`, confirm these three lines are present and the paths are correct (`../` from a subfolder):
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet">
   <link rel="stylesheet" href="../ds/ptf.css">
   <script src="../ds/ptf.js"></script>   <!-- at end of <body> -->
   ```
3. Keep the nav and footer **exactly** as copied. Only change the active-page link if needed.
4. Write your page content using the components below.
5. Put page-only CSS in the page's `<style>` block — and only for things in "Not in the system."
6. Open it in the browser. No console errors. Check 1280 / 768 / 375px.

---

## What is in the system (REUSE THESE — do not redefine)

### Design tokens — `:root`
Always use the variable, never the raw hex.

| Token | Value | Use for |
|-------|-------|---------|
| `--ink` | `#0A0A0A` | Primary text, dark backgrounds, primary button |
| `--ink-2` | `#2A2A2A` | Secondary text |
| `--ink-3` | `#5C6F69` | Muted text, captions |
| `--bg` | `#ffffff` | Page background, cards |
| `--bg-soft` | `#FAFAF6` | Soft section background, input fills |
| `--line` | `rgba(10,10,10,.08)` | Borders, dividers |
| `--shadow-card` | … | Card shadow |
| `--green` / `--green-mid` | `#0A8C66` / `#4FE8A9` | Eyebrows, success, accent on dark |
| `--purple` / `--purple-light` | `#5B4FCF` / `#EEEBFF` | "Coming soon" badges |
| `--purple-bright` | `#7B00FF` | Top-alert bar only |
| `--iri-cyan/green/lime` | … | Iridescent gradient (the `AI` badge) |
| `--r-sm … --r-pill` | 8 → 999px | Border-radius scale |

**Border-radius — what gets which (use the token, never a raw px):**
- `--r-2xl` (28px) — **large feature images & portrait cards** (hero image, `.stats-portrait`, `.how-portrait-card`, big media). This is the site's "big rounded" look — every full-width/feature image uses it.
- `--r-xl` (20px) — content **cards & panels** (`.auth-card`, `.oc-float`, `.sc-right`, why/benefit cards).
- `--r-md` (12px) / `--r-sm` (8px) — **small UI**: inputs, mock-rows, icon boxes, tiny chips.
- `--r-pill` (999px) — buttons, eyebrowless tags, avatars.
- ❌ A feature image must never use `--r-sm`/`--r-md` (looks under-rounded next to the 28px standard). When in doubt for an image, it's `--r-2xl`.

❌ Don't write `#0A0A0A` — write `var(--ink)`. ❌ Don't write `#fff` for a card — write `var(--bg)`. ❌ Don't write `28px` — write `var(--r-2xl)`.

### Typography
- `.display` — big display headlines (Inter Tight 700, tight tracking).
- `.italic-plain` — **the italic accent word in any headline.** Bold italic, same ink color.
  ❌ Never use a gradient (`.italic-accent`) on h1/h2/large display text. Banned.
- `.section-head h2` — standard section headline (clamp 32→52px). `.section-head p` — its subhead.

```html
<h1 class="display">Hire experts who already <em class="italic-plain">know</em> your industry</h1>
```

### Buttons
- `.btn` — outline button (default).
- `.btn-primary` — solid ink button (main CTA).
- `.btn-sm` — small (used in nav).
- `.btn-light` — white button for dark backgrounds.

❌ Never build a custom button. Use these + `btn-sm` as needed.

### Layout
- `.section` — standard vertical rhythm (`100px 32px`).
- `.section-tight` — tighter rhythm (`80px 32px`) — for denser pages (hire/train style).
- `.section-narrow` — centers content at max 1180px.
- `.section-head` — centered headline + subhead block.

### Navigation — **the mega-flyout nav** (the real site nav)
Copy the full nav block from **`top-alerts.html`** (lines ~150–316) — it is the canonical, most complete version (nav + mobile drawer with groups). Classes: `.nav-items`, `.nav-drop`, `.nav-btn`, `.nav-chev`, `.nav-fly`, `.mega-inner`, `.mega-left`, `.mega-right`, `.mega-right-dark`, `.fly-eyebrow`, `.fly-item`, `.fly-title`, `.fly-desc`, `.fly-badge-soon`, `.ind-grid`, `.stat-item`, `.proof-item`, `.fly-cta`, `.nav-overlay`.
**Activate it:** call `PTF.initMegaNav()` once on the page (it is not auto-run, to avoid clashing with older inline copies).
The simple `.nav-links` row in `template.html` is the legacy/basic nav — prefer the mega-flyout for real marketing pages.

### Top alert bar
Copy from **`top-alerts.html`**. Wrap nav in `.site-header` (fixed), put `.top-alert` above the nav, and call `PTF.initHeader()` so body padding tracks the header height.
Classes: `.site-header`, `.top-alert`, `.top-alert-close`, `.ta-badge`, `.ta-dot`, `.ta-title`, `.ta-count`, `.ta-box`, `.ta-thumb`.

**Fixed height — do not change it.** The bar is a **fixed 48px** on desktop/tablet (`height: 48px`, not `min-height`), single line; the `.ta-title` truncates with `…` if long. It only switches to a taller stacked layout at **≤600px**. This guarantees every alert on every page is the same height regardless of content. So: **keep alert copy to one short line.** Do NOT add `min-height`, `flex-wrap`, or per-page padding overrides — that's what made the heights drift before.

### Footer
Copy from **`ds/template.html`** (lines ~92–131). Classes: `.footer`, `.footer-inner`, `.footer-cols`, `.footer-col`, `.footer-brand`, `.footer-bio`, `.footer-bottom`. Override `.footer-cols` grid columns inline only if you need a different column count.
Mobile drawer (grouped) classes for the nav: `.drawer-group`, `.drawer-cat`, `.drawer-badge`.

### Cards
- `.t-card` (+ `.t-stars`, `.t-quote`, `.t-meta`, `.t-author`, `.t-company`, `.t-role`, `.t-logo`) — testimonial cards. Wrap in `.testimonials`.
- `.benefit-card` (+ `.benefit-eyebrow`, `.benefit-sparkle`) — benefit/feature cards.
- `.stats-grid` + `.stat-block` (+ `.stat-block-num`, `.stat-block-label`) — dark 2×N stat grid.

### Forms (sign-in, registration, lead capture)
- `.field` (+ `label`, `input`, `select`, `textarea`) — labeled field with focus ring.
- `.field-row` — two fields side by side.
- `.field-msg` + `.field.has-error` / `.field.is-valid` — validation states.
- `.id-grid`, `.id-section-label`, `.id-chips`, `.id-chip` (+ `.selected`) — multi-select identity chips.

### Steps / timeline
- `.steps` + `.step` (+ `.step-num`, `.step-content`) — numbered vertical steps with dashed connector. Add `.visible` to reveal on scroll.

### Section components (the big repeating layouts)
These are the "you describe it, here's the component" blocks. All shared in `ptf.css`.

| You say… | Component | Notes |
|---|---|---|
| "stats + portrait with the P" | `.section-stats` > `.stats-card-wrap` (`.stats-portrait` + `.stats-card-dark` with `.stat-big-num`/`.stat-unit`/`.stat-big-label`) | Set the photo via inline `background-image` on `.stats-portrait`. For a **light** photo, add `.stats-portrait--light` so the corner icon inverts. |
| "3 cards in a row" | `.benefit-card` row | see Cards above. |
| "how-it-works timeline" | `.how-inner` (2-up grid) = `.how-portrait-card` + `.steps` | Photo via inline `background-image`; corner icon `.how-portrait-icon`. |
| "alternating illustration rows" | `.experts-list` > `.expert-row` (`.sc-left` copy + `.sc-right` panel) | Every 2nd row auto-flips sides. Tint the panel with `.sc-tint-blue` / `.sc-tint-green` / `.sc-tint-amber`. Fill the panel with the `.sc-*` content utilities (`.sc-person-card`, `.sc-mock`, `.sc-badge-*`, …). `.sc-tag` is **plain green uppercase — never a pill.** |
| "one big mission / statement line" | `.section-mission` > `.mission-statement` | One large centered sentence (`<h2 class="mission-statement">`). Flips white on a `.theme-dark` page. |
| "dark final CTA band" | `.section-cta` > `.section-cta-inner` (h2 + p + `.btn-cta`) | The dark "book a call / get started" band. Replaces the old per-page `.section-book` / `.closing-cta` / `.btn-book`. |
| "4-up stat band (icon + number)" | `.section-statband` > `.statband-inner` > `.statband-item` (`.statband-icon` + `.statband-text` > `.statband-num` + `.statband-lbl`) | A hairline-separated row of stats; 4-up → 2×2 on mobile. Light by default; flips on a `.theme-dark` page. |

**Not yet a shared component:** hire's "3 cards floating around a center portrait" scroll-scene (`.hire-center-portrait` + `.hire-float-*`) is page-specific — it's an absolute-positioned sticky-scroll effect, not a reusable layout. Don't reach for it as if it were shared.

### Dark theme (opt-in) — one class does everything
**Add `class="theme-dark"` to `<body>`. That's the whole instruction for a dark page.** The entire chrome flips automatically — you never re-spec dropdowns or pills:
- Nav background, brand logo, hamburger, buttons → dark.
- **Mega-flyout dropdown** → dark panel (`#141414`) with the **solid green border**.
- Flyout titles white, descriptions muted, item hover dark, stat/proof panels dark.
- **Coming-soon pills** (`.fly-badge-soon`, `.drawer-badge`) → **solid purple** (`--purple-bright`), not transparent — looks right on dark.
- Mobile drawer, section headings → dark.
- Eyebrow → green-on-dark.

Scoped under `.theme-dark`, so light pages are never affected. This is the train-page look, now built in — no `!important` overrides, no rebuilding.

> If you ask for a dark-mode page, this is automatic. If anything in the chrome still shows light on a `theme-dark` page, that's a bug to fix in `ptf.css` — not something to patch per page.

### Interactive illustrations (the train-style mock cards) — the `.sci` kit
The dark, cursor-driven mock illustrations (like train's expert-row panels) are now a **declarative kit** — no hand-written keyframes. Build a scene from shared primitives and tag the targets; `PTF.initIllustrations()` (auto-runs) animates a cursor that glides to each `[data-sci-step]` in order and "clicks" it, toggling `.is-on`.

- **Scene:** `.sci` (relatively positioned). Put one `.sci-cursor` inside (outer = position, inner `.sci-cursor-tip` = the click scale) plus a `.sci-card` (dark mock card: `.sci-card-hd` / `.sci-card-icon` / `.sci-card-title` / `.sci-card-sub`).
- **Reactive targets** (style their `.is-on` state, the driver toggles it): `.sci-row`, `.sci-dot`, `.sci-chip`, `.sci-reveal` (hidden→shown). Tag each with `data-sci-step="N"`. **Targets sharing the same N light together on one click.**
- **Group avatars:** `.sci-avatars` > `.sci-av` (+ `.sci-av-lbl`) — always a diverse cluster, never a single individual.
- **Pacing:** `data-sci-hold` (ms per step, default 1300), `data-sci-glide` (travel ms, default 520). Honors `prefers-reduced-motion` (shows final state, no motion); starts on scroll-in.

```html
<div class="sci sci-card" data-sci-hold="1200">
  <div class="sci-cursor"><svg class="sci-cursor-tip" width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M5 3l14 7-6 1.5L10 18z"/></svg></div>
  <div class="sci-rows">
    <div class="sci-row" data-sci-step="1">RLHF eval rubric <span class="sci-chip" data-sci-step="1">Review</span></div>
    <div class="sci-row" data-sci-step="2">Dataset curation <span class="sci-dots"><i class="sci-dot" data-sci-step="2"></i><i class="sci-dot" data-sci-step="2"></i></span></div>
  </div>
</div>
```
Illustration rules (apply on every illustration): dark canvas + green (`#4FE8A9`) accents only; one cursor per scene; labels reflect the **real adjacent copy** (no lorem); group/diverse avatars; and **no two adjacent illustrations share the same archetype/composition** (don't bore the user page-to-page). *(The `/illustration` skill — Phases B/C — will pick an archetype by content and enforce variety; this kit is the foundation it builds on.)*

### Behavior — `ds/ptf.js` (`window.PTF`)
- `PTF.initNav()` — **auto-runs.** Hamburger drawer + scroll-transparency.
- `PTF.initIllustrations()` — **auto-runs.** Drives `.sci` interactive illustrations (no-op if none).
- `PTF.initMegaNav()` — call it if the page has the mega-flyout nav.
- `PTF.initHeader()` — call it if the page uses the fixed `.site-header` + alert bar.
- `PTF.initMarquee(trackEl, items)` — fill a marquee track with duplicated items.

```html
<script src="../ds/ptf.js"></script>
<script>
  PTF.initMegaNav();   // only if you used the mega nav
  PTF.initHeader();    // only if you used the alert bar / fixed header
</script>
```

---

---

## 🎯 The things Lizu keeps repeating — now hard rules

These are the recurring frustrations from past sessions. They are non-negotiable. Follow them without being asked.

### 1. Vertical spacing — ONE law (two stacked halves, neutral gap)
The #1 recurring complaint. The model:

**Every section owns a half-gap on its TOP and its BOTTOM, both equal to `var(--section-y)`.** Two adjacent sections **stack** their halves → the gap between *any* two sections is always `2 × --section-y`. Identical everywhere. That's "two stacked, both sections own the gap."

**The gap is NEUTRAL (outside the colour), not inside a coloured block:**
- The half-gap is a section's own **padding**, in the section's own (neutral) background. So a white→white boundary is neutral white space; the rhythm never changes at a colour change.
- A **coloured block must NOT bleed its colour into the gap.** Put the colour on an **inner element** that hugs its content, so the surrounding padding stays neutral. (The colour owns its content's breathing room; the *gap* stays neutral.)
- **No margins on sections. No spacer `<div>`s. No `margin-top` nudges.** A wrong gap = a rule violation; find it, don't counter-margin it.
- Denser/airier only via the variant token (`.section-tight` / `.section-loose`), never a raw px.

**ONE token, desktop AND mobile.** `--section-y` is `100px`, and shrinks to `60px` on mobile via a single `:root` media query. **Never add per-section mobile padding** — that's exactly what broke the even rhythm before. Change the token; every section follows.

**The only formal exceptions (everything else follows the law), each commented in code:**
1. **Hero** — owns its internal padding (sits against the fixed header, no "gap above").
2. **Stat-strip** — a thin band like `.section-statband` is an *attached strip* (flush, `0` vertical padding), not a rhythm section; padding here would render as an ugly band.
3. **Pinned/scroll-animation section** (e.g. hire's `.hire-scroll-outer`) — may use larger **bottom** padding so its absolutely-positioned moving cards don't crowd the next section (they're out of normal flow, so the section can't auto-size to them).
4. **Full-bleed closer** — the final `.section-cta` is a full-bleed dark band that blends into the footer (one continuous dark region). It necessarily wraps its content in its own colour (loose rhythm); the neutral gap is only *above* it, none below (it touches the footer).

### 2. Width & alignment: nav and footer share one edge; content sits *inside* it
The other recurring complaint: *"make the top nav elements align with the elements from the footer"* and *"align the top bar to the content, not the screen edge."*

The house pattern (from the train page, the most recent reference): the **shell** (nav + footer) is a touch wider than the **content**, so the nav and footer frame the content rather than line up dead-even with the screen edge.

The width ladder (tokens — use these, don't invent pixel values). **Body content is always INSET inside the shell — never as wide as the bar:**
- `--container` (**1400px**) → `.nav-inner`, `.footer-inner` ONLY. The outer shell. Nav and footer always match, so they align with each other.
- `--content-body` (**1200px**) → the **default body-section width** — the widest content blocks (expert rows, stat grids, use-case grids). Inset from the shell.
- `--content-wide` (**1180px**) → `.section-narrow`. Section heads / slightly narrower blocks.
- `--content` (**1080px**) → a comfortable column / card rows.
- `--content-narrow` (**720px**) → headlines, prose, form cards.

❌ Don't override `.section-narrow` (or any body wrapper) to `--container`/1400 — that makes text as wide as the bar, the exact thing rule 2 bans. Heroes and bespoke full-width scenes may sit at 1400 (edge); ordinary content sections may not.

So the hierarchy per page: **nav/footer 1280 → content 1180 → column 1080 → text 720.** Never make body text as wide as the nav bar. Left/right padding is always `var(--gutter)` (32px).

⚠️ **Existing-page note:** `employers/` and `talents/` were built earlier on a wider **1400px** grid (set inline, nav + footer + content together). They're internally aligned, just wider — leave them unless asked to retrofit. **New pages use the 1280 default.** If you ever change a page's width, change nav, footer, and content *together* so they never drift apart.

### 3. Eyebrows / small labels are PLAIN green uppercase text — NEVER a pill
**No pills. No background. No border-radius. No padding box.** Small green category labels (eyebrows, the expert-card `.sc-tag` labels, etc.) are plain uppercase green text. Pills on these are **not the brand** — banned.

- Use **`.eyebrow`** = plain green uppercase text above any headline. `<span class="dot"></span>` is allowed for a live/now indicator (a dot is fine; a pill is not).
- On dark sections it auto-adjusts (or add `.eyebrow-on-dark`).
- ❌ Never give a label a `background` + `border-radius: 999px` (a pill). If you see one, strip it.
- ❌ Do not invent `.hero-eyebrow`, `.book-eyebrow`, `.why-eyebrow`, etc. One class: `.eyebrow`.

```html
<span class="eyebrow"><span class="dot"></span>Now matching experts</span>
<h2>Hire experts who already <em class="italic-plain">know</em> your industry</h2>
```

### 4. Images & video: real, diverse, professional people — never stock models
*"a diverse image (not white dudes)"*, *"diverse, professional mix."*

- **Pexels is the preferred source for people photos AND video** (`pexels.com` / `videos.pexels.com`). Search for candid, real, diverse working professionals.
- **The local `photos/` library** is the curated set of hand-picked real people — varied ethnicity, gender, age, body type (filenames describe each). Use it for featured/hero faces and testimonial photos when a vetted shot beats a fresh search.
- ❌ No posed corporate stock, no glossy "model" headshots, no all-white / all-male groups. ❌ Avoid randomuser.me and generic Unsplash "office" stock for featured imagery — Pexels real-people results are better.
- Avatar treatment: round, often wrapped in the **iridescent conic-gradient ring** (see talents hero) with a subtle float animation.
- Hero/section video (like `train/hero-side.mp4`): source from Pexels video; keep it muted, looping, with a play/pause control.
- Always set meaningful `alt`. Diversity is the brand — it must be visible in every people-shot.

### 5. Icons: THE one approved recipe — MUI Outlined + gradient fill&stroke + square corners
**Lizu approved exactly one icon style for the whole site (2026-06-18). Every icon — existing or new — is built this way. No mixing filled/outline, no other libraries, no improvising.** The live proof sheet is [`ds/_icons.html`](_icons.html) — keep it the source of truth and mirror any icon change there.

**The recipe (one `<path>`):**
```html
<svg viewBox="0 0 24 24">
  <path fill="url(#ptf-grad)" stroke="url(#ptf-grad)"
        stroke-width="1.4" stroke-linejoin="miter" stroke-linecap="square"
        d="<MUI OUTLINED icon path>"/>
</svg>
```
And the gradient def once per page (canonical id `ptf-grad`):
```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="ptf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#5BCFFF"/><stop offset="50%" stop-color="#4FE8A9"/><stop offset="100%" stop-color="#D5FF66"/>
  </linearGradient>
</defs></svg>
```
- **Source = genuine MUI Material Icons, Outlined variant** (`people_outline`, `favorite_border`, `calendar_today`, `vpn_key_outlined`, `bolt_outlined`, `verified_user_outlined`, `star_border`, `schedule`, `public`, `videocam_outlined`, `lightbulb_outlined`, `attach_money`, `auto_awesome`, …). **NOT** Feather/Lucide — confirm it's really MUI before using.
- **Fill + matching gradient stroke** = fattens the thin MUI outline uniformly. `1.4` is the approved weight (bump the single number if a future ask says "fatter").
- **Square corners** — `stroke-linejoin="miter" stroke-linecap="square"` — same look as the thank-you check. Genuinely round shapes (clock/globe circles) stay round on their own; never force a curve straight.
- The thank-you check is the same family at a heavier stroke: `stroke-width="6.5"`, `stroke-linecap="square"`, `stroke-linejoin="miter"`, no fill.
- ❌ **Never** a colored bubble/circle with a flat mono icon inside it. The gradient goes ON the icon shape itself. ❌ Never thin hairline strokes, never a different icon set.
- One icon family per page (this one). Don't mix sets.

---

## 🤝 How we work together (so you stop re-specifying)

This is the workflow. You bring intent + copy. I handle the system.

**You give me:** what the page/section is for, and the words (or rough copy).
**I do, every time, without being asked:**
1. Read this file and look at the **latest built pages** (most recent first: event-register, train, hire, top-alerts) for current patterns and inspiration.
2. Map your request to **existing components** — nav, footer, eyebrow pill, section rhythm, cards, forms, steps. Reuse them. Tell you which I'm reusing.
3. Only build new CSS for what's genuinely unique, and flag it.
4. Apply rules 1–5 above automatically (spacing, width, eyebrow, images, icons).
5. Verify in the browser at 1280 / 768 / 375 and show you a screenshot.

You should never have to say "no pills on the labels" or "align the nav to the footer" or "fix the spacing" again. If you do, that's a bug in me — point at this section.

---

---

## Type scale, CTA band & the signup-flow kit (canonical — use these, don't reinvent)

### Headline / heading scale
- `.display` — standard hero headline, `clamp(36px, 5.5vw, 68px)`.
- `.display-lg` — large hero (talents/train scale), `clamp(44px, 7vw, 80px)`.
- `.section-head h2` — section headline, `clamp(32px, 4vw, 52px)`, `-0.03em`/1.05. Don't override per page.
- `.card-title` — card / sub-section heading, 20px. Replaces hardcoded 17/22/26px.
- Pick `.display` **or** `.display-lg` per page — never hand-write a hero clamp.

### Buttons
- `.btn-cta` — the big white CTA pill on dark bands (replaces the old per-page `.btn-book` / `.btn-hero`).

### Final CTA band
- `.section-cta` — the dark "book a call / get started" band (replaces `.section-book` / `.closing-cta`). Put content in `.section-cta-inner`; it already styles `h2` and `p`.

### Signup-flow kit — build any new flow by REUSING these
A new flow (summit, virtual job fair, webinar) reuses ALL of the below and only changes **copy + which steps appear**. Do not rebuild a flow from scratch.
- **Shell:** `.auth-bg` + `.auth-bg-blob.b1/.b2/.b3` (ambient glow), `.nav-brand` + `.nav-back` (minimal nav), `.auth-card` (+ `.wide` for the demographics step).
- **Heading:** `.auth-heading`, `.auth-sub`, `.auth-toggle` (sign in / sign up), `.step-indicator` ("STEP 1 OF 3").
- **Step 1 — info:** `.auth-form` + `.field` / `.field-row` / `.field-msg` (+ `.has-error` / `.is-valid`).
- **Step 2 — resume + LinkedIn:** `.upload-area` (+ `.upload-icon`, `.upload-name`) + a `.field` for the link.
- **Step 3 — demographics:** `.id-grid` (responsive) + `.id-section-label` + `.id-chips` + `.id-chip` (`.selected`).
- **Submit / thanks:** `.btn-auth`, `.btn-dashboard`, `.thanks-icon` / `.thanks-eyebrow` / `.thanks-body` / `.thanks-divider`.

**To build a new flow, copy the matching template — both are built entirely from this kit (no new CSS), steps are `data-step="1..N"`, the inline script shows one at a time:**
- **Regular signup** → [`ds/flow-signup.html`](flow-signup.html): centered card, working Sign up / Sign in toggle, gradient SVG check on the thank-you.
- **Event registration** (summit, job fair, webinar) → [`ds/flow-event.html`](flow-event.html): two-column — left **event-info panel** (`.event-card`, `.event-pill` + `.webinar`/`.workshop`/`.panel` variants, `.event-title`, host, meta) + right form card. Change only the event copy.

The **event-info panel** and the **two-column `.reg-layout` shell** are now in `ptf.css`, so a new event flow is copy-and-change-copy. The two **existing** flows (`auth.html`, `event-register.html`) still inline their own copies and are pending conversion to this kit; for a new flow, copy the templates above, not them.

---

## Not in the system (these ARE page-specific — write fresh CSS here)
These are bespoke illustrations / one-off layouts. Build them per page; don't try to force them into `ptf.css`:
- Hero "mock UI" cards (`.sc-mock*`, `.fh-card*`), the typewriter card, the animated AI orb, the floating-outcome cards (`.oc-float*`).
- Per-page hero gradients/glows.
- The booking calendar embed (`book/`) and the auth multi-step flow specifics.

If a page-specific component starts showing up on a **third** page, promote it into `ds/ptf.css` and add it above.

---

## Copy rules (PowerToFly voice)
- **Sentence case** for all headlines and buttons. Not Title Case.
- No Lorem ipsum. Real copy.
- Mark unconfirmed claims with `<!-- COPY: confirm -->`.
- Lean into: smaller scale, bigger impact. Verified domain experts. Not anonymous crowds.
- Real numbers: 80K+ experts, 6,500 AI professionals, 190 countries, 75%+ women & BIPOC, 12+ years.

---

## New-page checklist
- [ ] Started from `ds/template.html`
- [ ] Links `../ds/ptf.css` and `../ds/ptf.js` (correct relative path)
- [ ] Nav + footer copied verbatim (mega-nav from `top-alerts.html` if needed)
- [ ] Called `PTF.initMegaNav()` / `PTF.initHeader()` if those are used
- [ ] Headline italic uses `<em class="italic-plain">`, never a gradient
- [ ] No redefined tokens, resets, buttons, nav, footer, or section CSS in the page `<style>`
- [ ] Colors use `var(--token)`, not raw hex
- [ ] Sentence case throughout
- [ ] Responsive at 1280 / 768 / 375px
- [ ] Opens with no console errors

---

## Known drift to clean up (background, not blocking)
The existing pages predate this consolidation and still carry inline copies. They render fine (page `<style>` wins over the shared file), but when you next touch one of these, prefer deleting the inline copy and relying on the shared class:
- `book/index.html` and `auth.html` inline a full duplicate (including a copied token block) instead of linking `ds/ptf.css`.
- Hardcoded hex (`#0A0A0A`, `#0A8C66`, `#4FE8A9`) instead of tokens, scattered across pages.
- `train/index.html` uses ~140 `!important` dark overrides — the new `.theme-dark` class is the replacement.
