# Claude Code prompt — build the HIRE page

> Paste everything below the line into Claude Code, running from inside the
> `round-04-synthesis` site repo. It builds **one new page: `/hire/`**.
> (Train and About are separate pages, to be done later — do not build them now.)

---

## What you're building

Build a new standalone **Hire** page for the PowerToFly AI site at `hire/index.html`.

It is a sibling of the existing `employers/` and `talents/` pages. It must look and
feel like it belongs to the same site — same fonts, colors, buttons, nav, footer,
section rhythm. **Do not invent a new visual style.** Reuse the shared design system.

### Hard constraints (read before writing any code)

- **Use the shared design system.** Link `../ds/ptf.css` in the `<head>` (same as
  `ds/template.html`). All tokens, buttons (`.btn`, `.btn-primary`, `.btn-light`,
  `.btn-sm`), nav, footer, `.section`, `.section-head`, `.t-card` testimonials, and
  `.benefit-card` already live there. Only add page-specific CSS in an inline
  `<style>` block for things unique to this page.
- **Copy the nav and footer** from `ds/template.html` exactly. In the nav, point the
  "Hire" link to `../hire/` (this page) and give it an active style; keep all other
  links as-is. Do the same in the mobile drawer.
- **Load `../ds/ptf.js`** before `</body>` (handles scroll-nav + mobile drawer).
- **Single page, no build tools.** Plain HTML + inline `<style>` + the shared CSS/JS
  files. Must open directly in a browser.
- **Fonts:** Inter + Inter Tight, loaded the same way as `ds/template.html`.
- **Fully responsive**, with the existing mobile breakpoints (768px / 480px). The nav
  collapses to the hamburger drawer below 768px (already handled by `ptf.css`).

### Voice & copy rules

- **Sentence case** for all headlines and buttons (e.g. "Hire experts who already know
  your industry" — not Title Case).
- Write **realistic placeholder copy in the established PowerToFly voice** — match the
  tone of the employers/talents pages. Do **not** use "Lorem ipsum". Mark anything you
  invent that needs sign-off with an HTML comment `<!-- COPY: confirm -->`.
- **Lean hard into our differentiation: smaller scale, bigger impact.** Concrete,
  specific, human. Verified domain experts, not anonymous crowds.
- **Avoid vague, over-generalized messaging** (the "we power AI for everyone" register).
  Every claim should be specific enough that a competitor couldn't copy-paste it.
- Reuse these real numbers already used on the site: 80K+ domain & functional experts,
  6,500 AI professionals, 190 countries, 75%+ women & BIPOC, 12+ years, ~78% of AI
  researchers are male (Stanford HAI 2023), 0 competitors at the talent layer.

---

## Page sections (in order)

Build these sections. Each should be visually distinct but share the site's rhythm.

### 1. Hero
- Big display headline with one italic accent word (same treatment as the employers
  hero "humans"). Hire-focused angle, e.g. "Hire AI experts who already *know* your
  industry." Sentence case.
- One-line subhead that states the differentiation: smaller, vetted, domain-qualified —
  bigger impact than anonymous-crowd vendors.
- Primary CTA: `Book a discovery call →` (links to `../book/`). Secondary CTA scrolls
  to the role-types section.
- A small visual element consistent with the site (e.g. an expert card + an iridescent
  "● Ready to deploy" status pill, like the employers hero).

### 2. Who it's for
- 3–4 short cards naming the audiences: e.g. AI labs & model builders, enterprises
  deploying AI in regulated fields, product teams needing domain-grounded data,
  companies that need representative talent. One line each.

### 3. The problem we're solving
- Frame the gap: bias and quality are decided **at the talent layer**, and no one else
  is solving it there. Use the ~78% / 0-competitors stats for contrast. Specific, not
  preachy.

### 4. Trust ladder
- A distinctive 5-rung visual showing how a person moves from raw applicant to
  deployable expert: **verified → vetted → qualified → trusted → ready to deploy.**
  One short definition per rung (what we check at each stage). Build it as a stepped /
  progress-style horizontal component (stacks vertically on mobile). This is a signature
  section — make it feel earned and concrete, not a generic icon row.

### 5. What domain expertise actually looks like
- Counter vague competitor messaging with concrete examples: a clinician reviewing
  medical AI output, a lawyer annotating contracts, a CFA validating an earnings model,
  a multilingual reviewer catching regional failures. Show real role + real task, not
  abstractions. (This is the direct answer to "avoid Scale's vagueness.")

### 6. Role types / scope — the three archetypes  ⭐ (Andela-inspired)
- The team loves Andela's three-archetype layout (andela.com/ai-engineers). Mirror it
  with **three archetypes**: **Domain professionals**, **Functional experts**,
  **AI consultants**.
- Build it as a **clickable tab / toggle** (like Andela): selecting an archetype reveals
  its detail panel — who they are, what they deliver, example titles, typical engagement.
  Keyboard-accessible, works without a framework (vanilla JS, progressive enhancement so
  it still reads if JS is off).

### 7. Capabilities — what our experts deliver
- Grid of capability cards: **RLHF, model evaluation, red teaming, QA, multilingual.**
  Short, concrete descriptions of each.
- This is the right spot to nod to Labelbox's "Accelerate key GenAI jobs" *idea* (we
  like the concept, not their design) — frame these as the jobs our experts accelerate.
- *Optional enhancement (build only if quick & clean):* a Deel-style "pick your need"
  clickthrough — let the user pick an **industry or a desired outcome**, and the panel
  swaps to the matching capabilities/talent. Keep it lightweight; if it adds risk, ship
  the static grid and leave a `<!-- FUTURE: Deel-style selector -->` placeholder.

### 8. How hiring works  (Toptal "Hiring made easy"-inspired)
- A clean numbered flow: tell us what you need → we match verified experts → start in
  days → project-to-hire to validate fit. Plus a line that **we handle the admin**:
  background checks, onboarding, payroll, benefits. Mirror Toptal's calm, confident
  "hiring made easy" feel.

### 9. Auditability / defensibility
- A trust/compliance block: verified credentials, traceable contributors, auditable
  outputs your regulators and board can defend. This is a key differentiator vs.
  anonymous-crowd vendors — make it concrete.

### 10. Proof / testimonials
- Reuse the existing `.t-card` testimonial component and the employer testimonials
  already on `employers/index.html` (Zapier, RebelMouse, SoftwareOne, Collins Aerospace).

### 11. Social proof
- The client-logo marquee (reuse the logos in `../logos/` already used on the talents
  page). Subtle, scrolling.

### 12. Final CTA
- Strong closing: `Book a discovery call →` to `../book/`, with one line reinforcing
  smaller scale / bigger impact.

---

## Reference notes from the team (rationale — honor these)

Use these to guide tone and what to emphasize/avoid. We are borrowing **ideas**, not
copying designs.

- **Andela — /ai-engineers:** love the three-archetype layout. → Our archetypes:
  domain professionals, functional experts, AI consultants. (Section 6.)
- **Deel — /solutions/payroll:** like the "product needs" clickthrough experience.
  Possible future fit; for us it should let people explore by **industry or client
  outcome.** (Optional in Section 7.)
- **Toptal — /#services:** the "Hiring made easy" section is great. (Section 8.)
  Also like the idea of a "meet the talent in our network" toggle — **future**, likely
  on a dedicated Meet-our-experts page, not here.
- **Toptal — /teams:** like the "unrivaled expertise" prestige angle. Not 100% sold —
  treat as **optional**; only include a light prestige cue if it fits, don't force it.
- **Scale — scale.com:** we DON'T like how vague it is. **Avoid over-generalized
  messaging.** Lean into our difference: smaller scale, bigger impact. (Whole page.)
- **Labelbox — /expert-network:** like the data-dense expert layout — but that belongs
  on the **Meet our experts** page, **not** the Hire page. Don't build it here.
- **Labelbox — /why-labelbox:** like the *idea* of "Accelerate key GenAI jobs", not the
  design. (Inform Section 7's framing.)

---

## Technical checklist before you finish

- [ ] Page is `hire/index.html`, links `../ds/ptf.css` and `../ds/ptf.js`.
- [ ] Nav + footer copied from `ds/template.html`; "Hire" link → `../hire/` and marked active.
- [ ] All headlines & buttons in sentence case.
- [ ] No Lorem ipsum; copy matches site voice; unconfirmed claims flagged with `<!-- COPY: confirm -->`.
- [ ] Trust-ladder and three-archetype tabs both work and are keyboard-accessible.
- [ ] Responsive: looks right at 1280px, 768px, and 375px; hamburger drawer works.
- [ ] Opens directly in a browser with no build step and no console errors.
- [ ] Visually consistent with `employers/index.html` and `talents/index.html`.
