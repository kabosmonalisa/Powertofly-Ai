# PowerToFly AI — Design rules for Claude Code and Cowork

## 📖 The design system is documented. Read it first.

**Before building or editing any page, read [`ds/DESIGN-SYSTEM.md`](ds/DESIGN-SYSTEM.md).**
It is the single source of truth: the full inventory of every shared component, which class to use when, and how to start a new page.

The system lives in three local files — **reuse them, never rebuild them**:
- `ds/ptf.css` — all shared styling (tokens, type, buttons, nav, footer, alert, forms, cards, sections, dark theme)
- `ds/ptf.js` — all shared behavior (nav drawer, scroll, mega-flyout, fixed header, marquee)
- `ds/template.html` — the page skeleton to copy for a new page

Need a nav / footer / alert / button / card / form / section? **It is already built.** Copy the markup, change the copy. Do not write CSS for it.

Reference renders (what the result should look like): the Employers and Talents pages — locally `employers/index.html` and `talents/index.html`. The local `ds/` files are the source of truth; these pages are just the rendered output.

---

## 🚫 Non-negotiables (apply on EVERY page, without being asked)
Full detail in `ds/DESIGN-SYSTEM.md` → "The things Lizu keeps repeating."
1. **Even spacing.** Every section uses `.section` (96px). Never hand-set section padding; use `.section-tight` / `.section-loose` if needed. Background color never changes rhythm.
2. **Aligned widths.** Nav + footer share `--container` (1280px); content sits *inside* it — `.section-narrow` 1180, `.content` 1080, `.content-narrow` 720. Never make text as wide as the bar; if you change a page's width, move nav+footer+content together. (employers/talents run a wider 1400 grid inline — leave them.)
3. **Eyebrow = green pill.** Always `.eyebrow`. Never invent `.hero-eyebrow`/`.book-eyebrow`/etc.
4. **Images & video = real, diverse, professional people — Pexels preferred** (photos + video), or the local `photos/` library for featured faces. Never posed stock models, never all-white/all-male.
5. **Icons = iridescent gradient sparkles + thick rounded strokes.** One icon family per page.

Workflow: Lizu gives copy + intent. You map it to existing components, reuse them, say which, apply rules 1–5, and verify in the browser. Lizu should never have to re-specify these.

---

## Shared design system
All new pages link ONE file: `../ds/ptf.css`
All JS: `../ds/ptf.js`
Fonts go in `<head>` exactly as in `ds/template.html`.
**Never copy tokens, resets, or button styles inline. They are already in ptf.css.**

---

## Headline italic accent — the most important rule

**Use `.italic-plain` for the italic accent word in any headline.**

```html
<!-- CORRECT -->
<h1>Hire experts who already <em class="italic-plain">know</em> your industry</h1>

<!-- WRONG — never do this -->
<h1>Hire experts who already <em style="background: linear-gradient(...)">know</em> your industry</h1>
```

`.italic-plain` = bold italic, same ink color as the headline. No gradient. No color.  
The gradient text style (`.italic-accent`) belongs to the old design. **It is banned from headlines.**

Gradient text is only acceptable on small UI elements on dark backgrounds (e.g. the featured service card link on the employers page). Never on h1, h2, or any large display text.

---

## What never goes in page-specific `<style>` blocks
- `:root` variables — already in ptf.css
- Reset (`* { box-sizing... }`) — already in ptf.css
- `.display`, `.italic-plain`, `.italic-accent`, `.brand-ai` — already in ptf.css
- `.btn`, `.btn-primary`, `.btn-sm`, `.btn-light` — already in ptf.css
- Nav, hamburger, mobile drawer, footer — already in ptf.css
- `.section`, `.section-head`, `.section-narrow` — already in ptf.css
- `.t-card` testimonials, `.benefit-card` — already in ptf.css

Only add CSS to the page `<style>` block for layout and components **unique to that page**.

---

## Copy rules
- Sentence case for all headlines and buttons. Not Title Case.
- No Lorem ipsum. Write real copy in the PowerToFly voice.
- Mark unconfirmed claims with `<!-- COPY: confirm -->`.
- Lean into: smaller scale, bigger impact. Verified domain experts. Not anonymous crowds.
- Real numbers: 80K+ experts, 6,500 AI professionals, 190 countries, 75%+ women & BIPOC, 12+ years.

---

## New page checklist
- [ ] Fetched live source of employers + talents and grepped for every pattern used
- [ ] Nav copied character-for-character from `employers/index.html` (mega flyout, mobile drawer with drawer-groups)
- [ ] Footer copied character-for-character from `ds/template.html`
- [ ] Links `../ds/ptf.css` and `../ds/ptf.js`
- [ ] Headline italic uses `<em class="italic-plain">`, never gradient
- [ ] No duplicate tokens or resets in page `<style>`
- [ ] Sentence case throughout
- [ ] Responsive at 1280px, 768px, 375px
- [ ] Opens in browser with no console errors
