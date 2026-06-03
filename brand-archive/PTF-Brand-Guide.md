# PowerToFly AI — Brand Guide
> For use with Claude Code / Cowork when building sales presentations and marketing materials.

---

## Who We Are

PowerToFly AI is the training network powering production AI. We connect companies building AI products with domain-qualified, diverse experts — for staffing, training data, and AI transformation.

**Tagline:** The training network powering production AI.  
**Hero headline:** Your AI is only as good as the humans behind it.

---

## Brand Voice

- **Direct and confident** — no fluff, no buzzwords
- **Human-first** — we talk about people, not just technology
- **Inclusive by design** — diversity is the product, not the PR
- **Proof over promise** — stats, real names, real quotes

---

## Color Palette

### Primary
| Name | Hex | Usage |
|------|-----|-------|
| Ink (black) | `#0A0A0A` | Body text, headings, primary buttons |
| White | `#FFFFFF` | Backgrounds, button text on dark |
| Off-white | `#FAFAF6` | Soft section backgrounds, sidebar panels |

### Brand Green
| Name | Hex | Usage |
|------|-----|-------|
| Green (dark) | `#0A8C66` | Eyebrows, badges, hover accents |
| Green (mid) | `#4FE8A9` | CTAs on dark bg, checkmarks, link hovers |

### Iridescent Gradient
The signature brand gradient — used sparingly on key brand moments only.
```
linear-gradient(135deg, #5BCFFF 0%, #4FE8A9 50%, #D5FF66 100%)
```
| Stop | Hex | Name |
|------|-----|------|
| 0% | `#5BCFFF` | Iridescent Cyan |
| 50% | `#4FE8A9` | Iridescent Green |
| 100% | `#D5FF66` | Iridescent Lime |

**Where the gradient is used:**
- The "AI" badge next to the logo (the brand mark)
- Outcome/feature section icons
- NOT on body text, backgrounds, or large surfaces

### Brand Purple (new)
| Name | Hex | Usage |
|------|-----|-------|
| Purple | `#5B4FCF` | "Coming soon" badges, secondary accents |
| Purple light | `#EEEBFF` | Purple badge backgrounds |

### Text Colors
| Name | Hex | Usage |
|------|-----|-------|
| `--ink` | `#0A0A0A` | Primary text |
| `--ink-2` | `#2A2A2A` | Secondary headings |
| `--ink-3` | `#5C6F69` | Captions, descriptions, labels |

---

## Typography

### Fonts
| Font | Weights | Usage |
|------|---------|-------|
| **Inter Tight** | 400, 500, 600, 700, 800 (+ italic) | Headings, display text, nav, badges |
| **Inter** | 400, 500, 600, 700 | Body text, UI labels, descriptions |

Google Fonts import:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Inter+Tight:ital,opsz,wght@0,400;0,500;0,600;0,700;0,800;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet">
```

### Type Scale
| Use | Font | Size | Weight | Letter-spacing |
|-----|------|------|--------|---------------|
| Hero headline | Inter Tight | `clamp(40px, 6vw, 80px)` | 800 | `-0.04em` |
| Section heading | Inter Tight | `clamp(32px, 4vw, 52px)` | 700 | `-0.03em` |
| Card heading | Inter Tight | `18–22px` | 700 | `-0.025em` |
| Body | Inter | `16px` | 400 | normal |
| Description | Inter | `15–16.5px` | 400 | normal |
| Caption / label | Inter | `12–13.5px` | 400–500 | normal |
| Eyebrow label | Inter | `10.5–12px` | 700–800 | `0.12–0.14em` |

### Italic Accent
The word **"humans"** in the hero headline uses italic Inter Tight, plain black (no gradient):
```html
the <em class="italic-plain">humans</em> behind it.
```

---

## Logo

The PowerToFly AI logo consists of:
1. **PowerToFly wordmark** — black SVG (see `logo-black.svg`)
2. **"AI" badge** — iridescent gradient pill (`#5BCFFF → #4FE8A9 → #D5FF66`), Inter Tight 800, 12px

On dark backgrounds, use the white wordmark (see `logo-white.svg`) with the same gradient "AI" badge.

---

## Buttons

### Primary (black)
Background `#0A0A0A`, white text, `border-radius: 999px`  
Hover: slightly lighter black + green glow shadow

### Secondary / Ghost
White background, `#0A0A0A` border + text, `border-radius: 999px`  
Hover: inverts to black background, white text

### On dark backgrounds
White background, dark text, `border-radius: 999px` (`.btn-light`)

### Sizing
- Default: `padding: 14px 26px`, `font-size: 15px`
- Small: `padding: 10px 18px`, `font-size: 14px`

---

## Spacing & Radius

### Border Radius Scale
| Token | Value | Use |
|-------|-------|-----|
| `--r-sm` | `8px` | Small elements, badges, inputs |
| `--r-md` | `12px` | Medium cards |
| `--r-lg` | `16px` | Dropdown panels |
| `--r-xl` | `20px` | Cards, testimonials |
| `--r-2xl` | `28px` | Large cards, hero elements |
| `--r-pill` | `999px` | Buttons, tags, badges |

### Section Padding
Standard section: `100px` top and bottom, `32px` left/right.

---

## Key Components

### Eyebrow Label
Small all-caps label above section headings.
```
Font: Inter 10.5–12px / weight 700–800
Letter-spacing: 0.12–0.14em
Color: #0A8C66 (brand dark green)
Transform: uppercase
```

### Testimonial Card
White card (`border-radius: 20px`), subtle border, star rating, quote, author name, company, role, circular headshot, LinkedIn icon link.

### Benefit / Feature Card
White card with `border-radius: 20px`, iridescent sparkle SVG icon, eyebrow label, heading, description.

### Stats Display
Large Inter Tight 800 numbers, `-0.04em` letter-spacing, on dark (`#0A0A0A`) background with white text.

---

## Navigation

5-dropdown mega menu (employers side):
- **Build better AI** → Hire / training data + industries
- **Meet our experts** → Expert Finder + How We Verify + stats
- **The PTF difference** → Why PowerToFly + Compare
- **Events** → upcoming + featured event card
- **Company** → About + Resources

Right CTAs: **Find work** (ghost button → `powertofly.com/talent`) + **Book a call** (black pill → `/book/`)

---

## Stats to Use in Presentations

| Stat | Label |
|------|-------|
| 115K+ | AI-skilled professionals |
| 204 | Countries represented |
| 80% | Women in our network |
| 70% | BIPOC members |
| 12 years | Building diverse tech talent pipelines |
| ~78% | Of AI researchers are male (Stanford HAI 2023) |
| 0 | Competitors addressing this at the talent layer |
| 5 days | Average time to first candidate |

---

## Real Client Testimonials

**Kimberly W. — Head of Talent Attraction, Zapier**
> "PowerToFly has connected us with exceptional talent around the world, and their events have expanded our reach to representative talent, giving us the opportunity to showcase why Zapier is such a special place to work."
LinkedIn: https://www.linkedin.com/in/kimberlywilkes/

**Mayra M. — Global TA Lead, RebelMouse**
> "The proactivity of the team goes above and beyond. They are flexible to provide very personalized solutions for our business. I can trust that the quality of the work delivery will always be great and I'll have their support in everything."
LinkedIn: https://www.linkedin.com/in/mayramassuda/

**Navjyot K. — Global Talent Lead, SoftwareOne**
> "PowerToFly has been such solid support, not just in hiring but also in making sure that we are keeping candidates warm for future opportunities. They work with you as if they are a part of your organization."
LinkedIn: https://www.linkedin.com/in/navjyotkaur1/

**Roberta S. — Global Talent Acquisition Lead, Collins Aerospace**
> "We have made fantastic hires as a result of our partnership. The breadth of candidate reach, the thought leadership, and opportunities for benchmarking are all reasons we partner with PTF."
LinkedIn: https://www.linkedin.com/in/robertahiner/

---

## Live Pages for Reference

| Page | URL |
|------|-----|
| Employers | https://kabosmonalisa.github.io/Powertofly-Ai/employers/ |
| Talents | https://kabosmonalisa.github.io/Powertofly-Ai/talents/ |
| Book a call | https://kabosmonalisa.github.io/Powertofly-Ai/book/ |
| Design system CSS | https://kabosmonalisa.github.io/Powertofly-Ai/ds/ptf.css |
| Page template | https://kabosmonalisa.github.io/Powertofly-Ai/ds/template.html |

---

## Files in This Archive

| File | What it is |
|------|-----------|
| `PTF-Brand-Guide.md` | This document |
| `ptf.css` | Full design system — tokens, buttons, nav, footer, components |
| `template.html` | Starter HTML for any new page |
| `logo-black.svg` | PowerToFly wordmark (dark version) |
| `logo-white.svg` | PowerToFly wordmark (light version) |
| `colors.css` | Just the CSS variables, standalone |
