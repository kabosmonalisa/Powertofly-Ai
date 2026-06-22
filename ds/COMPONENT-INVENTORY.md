# PowerToFly AI — COMPONENT INVENTORY & build contract
**Read this in full every time you start or edit a page. This is the closed list of what exists. If it is not in this file, it does not exist — do not invent it.**

---

## ⛔ THE CONTRACT — how you build a page from Lizu's copy (NON-NEGOTIABLE)

When Lizu gives you copy and says "make a page" / "new section" / "use this copy":

1. **Map, don't make.** For every block of her copy, find the matching component in the INVENTORY below. Build the page by **copying that component's markup verbatim from its canonical source file** and changing **only the text and images**.
2. **Only `ptf.css` + `ptf.js`.** A page links `../ds/ptf.css` and `../ds/ptf.js` and the fonts from `ds/template.html`. **You may not write component CSS in the page.** No `<style>` block except genuinely page-unique layout (see "Allowed page-specific CSS" — and even then keep it tiny and comment why).
3. **Never invent a class.** Use only the class names listed here. Do not coin `.hero-eyebrow`, `.pricing-card`, `.my-thing`, etc. If you catch yourself typing a class that isn't in this file, STOP.
4. **Never rebuild what exists.** Nav, footer, buttons, cards, forms, sections, flows, icons — all already built. Copy them. Do not re-implement, re-style, or "improve" them on the page.
5. **No component fits? STOP and ask.** If a piece of her copy has no home in the inventory, do not improvise a component or write new CSS to fake it. Tell Lizu exactly which block has no component and ask how to handle it. A missing component is a conversation, not a guess.
6. **Dark page = one class.** Add `class="theme-dark"` to `<body>`. Nothing else. Every component recolors itself from the tokens. Never hand-roll dark styling.
7. **The 5 non-negotiables apply automatically** (see `DESIGN-SYSTEM.md` → "things Lizu keeps repeating"): even spacing (one `--section-y` token), aligned widths, plain-green eyebrows (NEVER pills), real/diverse people, the one icon recipe. Don't make her re-ask.
8. **Verify before declaring done:** screenshot at 1280 / 768 / 375 px. Light or dark, check it renders and matches.

**If you ever feel the urge to write CSS for something visual on a new page, that urge is the bug. Find the component, or ask.**

---

## CANONICAL SOURCE FILES — copy markup FROM these (never reinvent)
| Need | Copy from |
|---|---|
| Page skeleton (head, fonts, nav, footer) | `ds/template.html` |
| Full mega-flyout nav + mobile drawer + top-alert bar | `top-alerts.html` (the canonical nav) |
| Cards & section layouts (each shown light **and** dark) | `ds/_showcase.html` |
| Regular signup flow (toggle, steps, password, thanks) | `ds/flow-signup.html` |
| Event/registration flow (2-col, event-info panel) | `ds/flow-event.html` |
| Icons (the one recipe, every icon, light + dark) | `ds/_icons.html` |
| The rules & philosophy behind all of it | `ds/DESIGN-SYSTEM.md` |

To scaffold: run **`/new-page`** (marketing page) or **`/new-flow`** (signup/event flow). They enforce this contract.

---

## INVENTORY — the closed list of components

### Page chrome
- **Mega-flyout nav** — `.nav .nav-inner .nav-items .nav-drop .nav-btn .nav-chev .nav-fly .mega-inner .mega-items .mega-left .mega-right .mega-right-dark .fly-item .fly-title .fly-desc .fly-eyebrow .fly-rule .fly-badge .fly-badge-soon .fly-cta .ind-grid .ind-item .ind-name .ind-desc .nav-cta .brand .brand-ai .hamburger` → copy from `top-alerts.html`. Behavior: `PTF.initMegaNav()` + `PTF.initHeader()`.
- **Mobile drawer** — `.mobile-drawer .drawer-group .drawer-cat .drawer-links .drawer-badge .nav-overlay` → from `top-alerts.html`. Behavior: `PTF.initNav()`.
- **Top alert bar** — `.top-alert .top-alert-close .ta-box .ta-badge .ta-dot .ta-thumb .ta-title .ta-count` → from `top-alerts.html`.
- **Footer** — `.footer .footer-inner .footer-cols .footer-col .footer-brand .footer-bio .footer-social .footer-bottom` → from `ds/template.html`. (Footer h5/links are always dark — it's an always-dark block.)

### Layout & headings
- **Section wrappers** — `.section` (standard `--section-y`), `.section-tight`, `.section-loose`, `.section-narrow`. ONE spacing token; never hand-pad.
- **Hero (first section under the nav)** — `.section-hero`: tighter TOP (`--hero-top`, 56px) so it sits close to the nav (like the hire page), standard `--section-y` bottom, and a wider headline column (its inner `.section-head` is `--content`, not the 720 narrow). Use it for the first section of a page. Composition inside (centered text, text+image, video) is page-specific.
- **Content widths** — `.content` (`--content`), `.content-narrow` (`--content-narrow`). Content sits *inside* the nav/footer edge.
- **Section heading** — `.section-head` → `h2` + `p`. Flips dark via tokens.
- **Eyebrow** — `.eyebrow` (+ inner `.dot`). Plain green uppercase, NEVER a pill. `.eyebrow-on-dark` for an ad-hoc dark block on a light page.

### Buttons
- `.btn` (base), `.btn-primary` (ink fill, inverts in dark), `.btn-light`, `.btn-sm`, `.btn-block` (full-width). 
- `.btn-cta` — the button for the final CTA band only (always white-on-dark, black label).
- Flow buttons: `.btn-auth` (primary, inverts), `.btn-social`, `.btn-dashboard`, `.btn-skip`.

### Section components (the big repeating layouts) — markup in `ds/_showcase.html`
- **Mission statement** — `.section-mission` > `.mission-statement` (one big centered line).
- **Stat band** — `.section-statband` > `.statband-inner` > `.statband-item` (`.statband-icon` + `.statband-text` > `.statband-num` + `.statband-lbl`). 4-up, hairline-separated.
- **Stats + portrait** — `.section-stats` > `.stats-card-wrap` (`.stats-portrait` [+ `.stats-portrait-icon`] + `.stats-card-dark` > `.stat-big-num`/`.stat-unit`/`.stat-big-label`).
- **Stat grid** — `.stats-grid` > `.stat-block` (`.stat-block-num` + `.stat-block-label`).
- **Expert / illustration rows** — `.experts-list` > `.expert-row` (`.sc-left`: `.sc-tag` + `h3` + `.sc-body` + `.sc-bullets`/`.sc-ck` + `.sc-titles`/`.sc-title-chip` + `.sc-more`) + (`.sc-right` panel). Panel tints: `.sc-tint-blue/green/amber` (light pages) or `.sc-right-domain/function/ai` (train-style). Mock UI inside: `.sc-mock` (+ `.sc-mock-dark-blue/green/red` for the dark "app" card), `.sc-mock-hd/-icon-box/-title/-sub/-hr/-rows/-row/-row-lbl`, `.sc-badge` (`-green/-amber/-gray`), `.sc-person-card` (`.sc-person-name/-role/-sep/-verify`, `.sc-verify-dot`), `.sc-photo`.
- **How-it-works** — `.how-inner` > `.how-portrait-card` (+ `.how-portrait-icon`) + `.steps` > `.step` (`.step-num` + `.step-content` > `h4` + `p`).
- **Floating outcome cards (animated)** — `.outcomes-wrap` > `.oc-float` (`.oc-float-1..4`, `.oc-float-spark-col` + `.oc-float-vline` + `.oc-float-body`). Animation via `PTF` scroll init.
- **Benefit cards** — `.benefit-card` (`.benefit-eyebrow` + `.benefit-sparkle`).
- **Testimonials** — `.testimonials` > `.t-card` (`.t-stars`, `.t-quote`, `.t-author`, `.t-role`, `.t-company`, `.t-logo`, `.t-meta`).
- **Logo strip (marquee)** — `.logo-strip` > `.logo-strip-track`. Behavior: `PTF.initMarquee()`.
- **Industries grid** — `.ind-grid` > `.ind-item` (`.ind-name` + `.ind-desc`).
- **Final CTA band** — `.section-cta` > `.section-cta-inner` (`.eyebrow eyebrow-on-dark` + `h2` + `p` + `.btn.btn-cta`). Always-dark closer; blends into footer.

### Interactive illustration kit — `.sci` (markup in `ds/_showcase.html`)
`.sci .sci-card .sci-card-hd .sci-card-icon .sci-card-title .sci-card-sub .sci-rows .sci-row .sci-chip .sci-dots .sci-dot .sci-avatars .sci-av .sci-av-lbl .sci-cursor .sci-cursor-tip .sci-reveal`. Already dark by default. Behavior: `PTF.initIllustrations()` (auto).

### Forms & flows — markup in `ds/flow-signup.html` / `ds/flow-event.html`
- **Flow shell** — `<body class="flow-shell">` (gradient bg), `.auth-bg` + `.auth-bg-blob`, `.auth-nav` (`.nav-brand` + `.nav-back`).
- **Card + panels** — `.auth-card` (`.wide`), `.auth-toggle` (sign in/up), `.auth-panel`, `.flow-step`.
- **Copy** — `.auth-heading`, `.auth-sub`, `.auth-note`, `.auth-fineprint`, `.auth-divider`.
- **Fields** — `.auth-form`, `.field`, `.field-row`, `.field-msg`; `.upload-area` (`.upload-icon`/`.upload-name`); `.social-btns`; `.step-indicator`.
- **Identity chips** — `.id-grid` > `.id-section` (`.id-section-label` + `.id-chips` > `.id-chip`); actions `.id-actions`/`.id-actions-right`/`.id-skip`/`.id-privacy`.
- **Checkboxes / questions** — `.check-row` + `.check-box`, `.q-group`/`.q-label`, `.event-list`/`.event-opt`(`-title/-date`), `.agree-row`.
- **Thank-you** — `.thanks-icon`, `.thanks-eyebrow`, `.thanks-body`, `.thanks-divider`, `.thanks-actions`.
- **Event-info panel (event flow)** — `.reg-wrap`/`.reg-layout`, `.event-card` (`.event-top`/`.event-pill`/`.event-title`/`.event-host`(+`-avatar`/`-name`/`-role`/`-text`)/`.event-meta`/`.event-meta-row`/`.event-ico`/`.event-meta-text`). Collapses to a short header on mobile automatically.

### Icons — the ONE recipe (proof + copy-paste in `ds/_icons.html`)
MUI **Outlined** path, `fill="url(#ptf-grad)" stroke="url(#ptf-grad)" stroke-width="1.4" stroke-linejoin="miter" stroke-linecap="square"`. Needs the `#ptf-grad` `<linearGradient>` def on the page. Thank-you check = same family, `stroke-width="6.5"`, no fill. NOT Feather/Lucide. One family per page.

### Tokens (reference them; never hardcode hex)
Color: `--ink --ink-2 --ink-3 --bg --surface --surface-2 --line --line-2 --accent --btn-bg --btn-fg`. Radius: `--r-sm..--r-pill`. Width: `--container --content* --gutter`. Spacing: `--section-y(-tight/-loose)`. `.theme-dark` re-defines the color tokens — that's the whole dark mode.

---

## Allowed page-specific CSS (the ONLY exceptions)
Per `DESIGN-SYSTEM.md` → "Not in the system": a genuinely unique hero composition or one-off decorative layout MAY have a small page `<style>` — but it must (a) use tokens, never raw hex; (b) never restyle a shared component; (c) be commented with why it's page-specific. When unsure whether something qualifies → it doesn't; ask Lizu.
