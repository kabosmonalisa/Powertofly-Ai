# PowerToFly AI — Design rules for Claude Code and Cowork

## The two reference pages. Match these exactly.
- Employers: https://kabosmonalisa.github.io/Powertofly-Ai/employers/
- Talents: https://kabosmonalisa.github.io/Powertofly-Ai/talents/

Every new page must look like it belongs to the same site as those two. When in doubt, open them and compare.

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
- [ ] Links `../ds/ptf.css` and `../ds/ptf.js`
- [ ] Nav + footer copied from `ds/template.html`
- [ ] Headline italic uses `<em class="italic-plain">`, never gradient
- [ ] No duplicate tokens or resets in page `<style>`
- [ ] Sentence case throughout
- [ ] Responsive at 1280px, 768px, 375px
- [ ] Opens in browser with no console errors
