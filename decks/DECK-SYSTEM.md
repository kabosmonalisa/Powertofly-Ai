# PowerToFly AI — Deck System

The deck twin of `ds/DESIGN-SYSTEM.md`. Same brand, expressed at slide scale.
**One rule above all: a deck re-uses the website's brand decisions — it never re-guesses them.**

The visual source of truth is [`decks/preview.html`](preview.html) — every layout below, rendered
at true 16:9 from the live `ds/ptf.css`. Look there; this file is the "why."

---

## Why this exists
The website rebrand shipped fast and on-brand because the system was **written down** — tokens,
rules, components — so nobody re-decided the brand per screen. Decks had no such system, so every
deck re-guessed it and drifted (pill eyebrows, colored italics, random purple/green numbers,
mismatched greens). This file + `preview.html` + the Google Slides master close that gap.

---

## Brand kit for slides (pulled straight from `ptf.css` tokens — never a raw hex)

| Role | Token | Value |
|---|---|---|
| Ink / dark slide bg | `--ink` | `#0A0A0A` |
| Secondary text | `--ink-2` / `--ink-3` | `#2A2A2A` / `#5C6F69` |
| Slide bg | `--bg` | `#ffffff` |
| Soft fill (panels, image placeholders) | `--bg-soft` | `#FAFAF6` |
| **The one accent** | `--green` / `--green-mid` | `#0A8C66` / `#4FE8A9` |
| Iridescent gradient (cover/divider hairline + AI lockup ONLY) | `--iri-cyan/green/lime` | `#5BCFFF · #4FE8A9 · #D5FF66` |

- **Fonts:** Inter Tight (headlines, 800) + Inter (body). Both are in Google Slides — add via *More fonts*.
  If Inter Tight is missing from the picker, fall back to **Inter bold** for headlines (confirm at build).
- **Purple is banned on decks.** On the web `--purple-bright` is the top-alert bar only. A deck has no
  alert bar, so purple never appears. The current sales deck's purple bar/pills/numbers all come out.

## Deck type scale (in `preview.html` as container-query units, so a slide scales to any width)

| Role | Size @1280 slide | Font |
|---|---|---|
| Cover headline | ~69px | Inter Tight 800, `-.03em` |
| Section headline | ~54px | Inter Tight 800 |
| Big stat number | ~67px | Inter Tight 800, green |
| Body | ~22px | Inter 400, ink-2 |
| Eyebrow | ~15px | Inter 700, uppercase, `.16em`, green |
| Footer / page no. | ~15px | Inter, ink-3 |

---

## The layout set (the deck's "component inventory") — each maps to a web component

| # | Slide layout | From the web DS |
|---|---|---|
| 1 | Cover | hero + eyebrow |
| 2 | Section divider | `.section-mission` statement |
| 3 | Agenda | `.steps` |
| 4 | Stat slide | `.stat-block` / `.statband` |
| 5 | Two-column (copy + visual) | `.expert-row` |
| 6 | Feature trio | `.benefit-card` row |
| 7 | Quote | `.t-card` |
| 8 | Logo wall | customer marquee |
| 9 | Closing CTA | `.section-cta` |
| 10 | Differentiator grid (6-up) | dense "why us" — one line each |
| 11 | Problem / challenges | numbered pain points (deck slide 4) |
| 12 | Service breakdown (2-up + checklist) | "what we do" — deck's most-repeated slide (5,6,7,14) |
| 13 | Outcomes 4-up | business-impact blocks (deck slide 8) |
| 14 | Comparison matrix | us vs. alternatives (deck slide 9) |
| 15 | Client outcomes / case study | client + metrics (deck slide 16) |
| 16 | Testimonial grid (4-up) | star quotes (deck slide 16) |
| 17 | Pricing table (3-up) | engagement models + rates (deck slide 18) |
| 18 | Promise (dark + photo) | employers page — "understand your industry from day one" |
| 19 | Three-layer talent (dark + faces) | deck slide 1 + notes — native AI / fluency / domain |
| 20 | How-it-works process | hire & train pages — the engagement flow |
| 21 | Event sponsorship | deck slide 11 — audience + inclusions |
| 22 | Event calendar | deck slide 11 — themed representative-talent events |
| 23 | Measurable results (dark band) | deck slide 12 — event benchmarks |

New layout needed? Add it here + to `preview.html` first, then to the Slides master. Don't let a
deck invent a layout the system hasn't claimed (that's how the current deck drifted).

---

## The non-negotiables, restated for slides (identical to the web rules)

1. **Eyebrows are PLAIN green uppercase text — never a pill.** A `•` dot is fine; a background/border-radius is not.
   *(Current deck breaks this: "ABOUT US" green pill, "Your AI Workforce Partner" purple pill.)*
2. **Headline italic accent = same colour, bold italic — never colored, never gradient.**
   `people` and `a community` are italic-plain (white on dark, ink on light), NOT green/purple.
   *(Current deck breaks this on the cover and slide 3.)*
3. **One accent: green.** Stat numbers, dots, keylines are all `--green`. No purple/green scatter,
   no underlines, no two-greens-a-few-hex-apart. *(Current deck breaks this across the stat slide.)*
4. **Real, diverse, professional people** in every people-shot. Source from the local **`photos/`**
   library first (curated real people that always load) or Pexels — never posed stock, never a broken
   image. *(Current deck has several broken placeholders — the exact thing to avoid.)* Use imagery
   sparingly: a hero photo on the promise slide, a face cluster on the talent slide, a portrait in a
   two-column — not on every slide.

**Rhythm: use black.** Don't let the deck go all-white. Alternate dark slides (`.slide.dark`, bg `--ink`)
for the cover, dividers, the promise/talent slides, quotes, the results band, and the closer — so the
deck breathes and the green accent pops. Roughly one dark slide every few light ones.
5. **One icon family: MUI Outlined.** Gradient recipe only at big sizes (feature icons ≥ ~40px);
   plain single-colour ink when small. Never gradient on a tiny icon.
6. **Even margins + inset content.** One safe-area on all four sides of every slide; content never
   bleeds to the edge. Sentence case for every headline and button.

## Numbers (keep decks in sync with the site — confirm with Mara)
80K+ verified experts · 6,500 AI professionals · 190 countries · 75%+ women & BIPOC · 12+ years.
*(The current deck says "1.1M+ / 10 yrs+" — reconcile before the master ships.)*

---

## How the Slides master gets built (next step)
1. Claude authors a branded **`.pptx`** — theme colours + both fonts + these 9 layouts as real slide masters.
2. In Google Slides: **Slide → Edit theme → Import theme →** pick the `.pptx`. Team now picks layouts from the menu.
3. Rebuild the current sales deck on the master as the reference deck.
4. Same master seeds CSM / event / org-call decks. Optional `/new-deck` skill scaffolds branded decks from copy.

**Caveats:** the iridescent gradient can't be a live editable fill in Slides — use it as a static
shape/image on the cover + dividers only (same "big moments only" rule as the web).
