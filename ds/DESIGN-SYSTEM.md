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

❌ Don't write `#0A0A0A` — write `var(--ink)`. ❌ Don't write `#fff` for a card — write `var(--bg)`.

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

### Behavior — `ds/ptf.js` (`window.PTF`)
- `PTF.initNav()` — **auto-runs.** Hamburger drawer + scroll-transparency.
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

### 1. Vertical spacing — ONE law (train is the reference)
The #1 recurring complaint. The reference is the **train page**: every body section is **100px top / 100px bottom → a consistent 200px between sections.**

**The law (this is the only source of vertical space between sections):**
- **Every body section uses `.section`** = `var(--section-y)` (**100px**) top & bottom. The gap between any two sections is therefore always **200px**. Nothing else may add space.
- **No margins on sections. No spacer `<div>`s. No `margin-top` to "nudge" a gap.** If a gap looks wrong, the cause is a rule violation — find it, don't add a counter-margin.
- A section's **background colour never changes its spacing** — dark and white sections sit on the same 200px rhythm. (If consecutive white sections *feel* like a lot of space, that's the honest 200px, not a bug — it's consistent with train.)
- Denser/airier only via the **variant class**, never a raw number: `.section-tight` / `.section-loose`.

**The only two formal exceptions (everything else follows the law):**
1. **Hero** — owns its internal padding (it sits against the nav, no "gap above").
2. **Stat-strip** — the thin band right after the hero (e.g. `.section-statband`) is an attached strip, not a rhythm section.
3. *(Special)* a **pinned/scroll-animation section** (e.g. hire's `.hire-scroll-outer`) may use a larger **bottom** padding for animation clearance so its moving cards don't crowd the next title — comment it as such.

Why this kept recurring: space used to come from three places (padding + stray margins + special-section clearance), so it was never one predictable number. Now it's one number (`--section-y`), with the exceptions named above.

### 2. Width & alignment: nav and footer share one edge; content sits *inside* it
The other recurring complaint: *"make the top nav elements align with the elements from the footer"* and *"align the top bar to the content, not the screen edge."*

The house pattern (from the train page, the most recent reference): the **shell** (nav + footer) is a touch wider than the **content**, so the nav and footer frame the content rather than line up dead-even with the screen edge.

The width ladder (tokens — use these, don't invent pixel values):
- `--container` (**1280px**) → `.nav-inner`, `.footer-inner`. Nav and footer ALWAYS match, so they align.
- `--content-wide` (**1180px**) → `.section-narrow`. Main section content — just inside the shell.
- `--content` (**1080px**) → a comfortable column.
- `--content-narrow` (**720px**) → headlines, prose, form cards (`.section-head` already uses this).

So the hierarchy per page: **nav/footer 1280 → content 1180 → column 1080 → text 720.** Never make body text as wide as the nav bar. Left/right padding is always `var(--gutter)` (32px).

⚠️ **Existing-page note:** `employers/` and `talents/` were built earlier on a wider **1400px** grid (set inline, nav + footer + content together). They're internally aligned, just wider — leave them unless asked to retrofit. **New pages use the 1280 default.** If you ever change a page's width, change nav, footer, and content *together* so they never drift apart.

### 3. The eyebrow is always the green pill
*"Eyebrow pill"* — one style, everywhere.

- Use **`.eyebrow`** (green uppercase label inside a soft-green pill) above any headline. Optional `<span class="dot"></span>` for a live/now feel.
- On dark sections it auto-adjusts (or add `.eyebrow-on-dark`).
- Only drop the pill with `.eyebrow-plain` when a pill would feel too heavy (rare).
- ❌ Do not invent `.hero-eyebrow`, `.book-eyebrow`, `.why-eyebrow`, etc. again. One class: `.eyebrow`.

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

### 5. Icons & illustrations: the iridescent gradient sparkle, thick rounded strokes
*"illustration styles"* must be consistent.

- Decorative icons (benefit cards, feature bullets) use the **gradient "sparkle"** style: filled with the iridescent gradient (cyan → green → lime), soft, rounded, with the gentle `floatY` animation (`.benefit-sparkle`).
- UI/line icons (chevrons, checks, arrows) are **thick, rounded strokes** (`stroke-width` ~1.8–2, round caps) — the "MUI, thicker/fatter" look — never thin hairlines.
- Accent color for icons on light = `var(--green)`; on dark = `var(--green-mid)`.
- Keep one icon family per page. Don't mix outline sets.

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

You should never have to say "make the eyebrow a pill" or "align the nav to the footer" or "fix the spacing" again. If you do, that's a bug in me — point at this section.

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

**To build a new flow (summit, job fair, webinar): copy [`ds/flow-template.html`](flow-template.html).** It's a complete, working 4-step signup (info → resume/LinkedIn → demographics → thank-you) built entirely from this kit. Keep the steps you need, delete the rest, change the copy — no new CSS. Steps are `data-step="1..N"`; the inline script shows one at a time.

These are one canonical version. The two **existing** flows (`auth.html`, `event-register.html`) still inline their own copies and are pending conversion to this kit; until then, don't copy *them* for a new flow — copy `flow-template.html`.

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
