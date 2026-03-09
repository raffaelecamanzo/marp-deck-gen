# Style Guide
## For MARP Presentation System

> **Scope:** Visual identity rules for authoring on-brand presentations.
> **Pair with:** `.marp/references/deck-template.md` — which defines CSS classes and Markdown syntax.
> This guide answers *what* and *why*; `deck-template.md` answers *how*.

---

## 1. Design Identity

| | |
|---|---|
| **Aesthetic** | Editorial / Refined |
| **Personality** | Confident, clean, professional, approachable |

**Tone in presentations:** Confident without being cold. Use direct language, active verbs, short titles. Avoid corporate jargon. The design leans editorial — sharp typography, restrained color, generous whitespace.

---

## 2. Color System

### Palette (canonical)

| Role | Name | Hex | RGB | Meaning |
|------|------|-----|-----|---------|
| Primary accent | Terracotta | `#e07a5f` | 224, 122, 95 | Warmth, energy |
| Secondary accent | Navy | `#1a1a2e` | 26, 26, 46 | Depth, authority |
| Neutral / text | Ink | `#2d2d2d` | 45, 45, 45 | Stability, readability |
| Background | Cream | `#f8f7f4` | 248, 247, 244 | Openness, calm |

> **These hex values are authoritative.** Do not approximate.
> CSS maps these as `--terra-500` (#e07a5f), `--navy-500` (#1a1a2e), `--ink-700` (#2d2d2d), `--cream-200` (#f8f7f4).

### Slide application rules

- **Terracotta** → accent bar (top of content slides), section labels, interactive highlights, callout pill borders.
- **Navy** → secondary emphasis, dark cover/section backgrounds, softer accent when terracotta would over-dominate.
- **Ink** → body text, muted labels, closing lines.
- White and near-white backgrounds (`--cream-050` `#fdfcfb`) → clean content slides.
- Never use terracotta as a large background fill on content slides — reserve it for cover `accent` variant and accent elements only.

---

## 3. Typography

### Typefaces: DM Serif Display + DM Sans

| Typeface | Role | Character |
|----------|------|-----------|
| **DM Serif Display** | Headings (h1, h2, cover titles, section titles) | Elegant serif with editorial feel, strong display presence |
| **DM Sans** | Body, labels, lists, UI elements | Clean geometric sans-serif, excellent readability |

Both are loaded via Google Fonts in `.marp/themes/deck-theme.css`.

### Type hierarchy in slides

| Level | Usage | Font | Weight guidance |
|-------|-------|------|-----------------|
| Cover title | Deck name, event | DM Serif Display | 400 (only weight) |
| Section heading | Section divider large heading | DM Serif Display | 400 |
| Slide title (`##`) | 1–2 lines, ≤ 8 words | DM Serif Display | 400 |
| Body / bullets | Main content | DM Sans | Regular (400) |
| Labels / breadcrumbs | `/ Section Name`, STEP N | DM Sans | Semibold (600), uppercase |
| Muted / closing line | Taglines, footnotes | DM Sans | Regular (400), lower contrast |

---

## 4. Cover Slides — All 5 Variants

Use the cover variant to set the **emotional register** of the presentation.

| Variant class | Background character | Text style | Best for |
|---------------|---------------------|------------|----------|
| `title` (standard) | Clean white, no background | Dark text | Internal working documents, neutral contexts |
| `title cover` (default cover) | Warm cream (`--cream-200`) | Dark text | Client-facing intros with light, friendly feel |
| `title cover dark` | Navy gradient (135°, `#1a1a2e` → `#2a2a4a`) | Light text | Executive briefings, keynotes, high-impact openers |
| `title cover accent` | Terracotta gradient (135°, `#e07a5f` → `#c46a52`) | White text | Energy-forward topics, launches, bold messaging |
| `title cover geometric` | Cream + CSS diagonal line pattern | Dark text | Technology, infrastructure, engineering themes |
| `title cover minimal` | Pure white + thin terracotta accent line | Dark text | Professional/neutral, understated elegance |

**Rules:**
- Keep title ≤ 2 lines; subtitle ≤ 1 line. Textured covers (`geometric`) have wider title safe areas but dense text still degrades readability.
- Always include date on the cover — use `.date` class.
- `dark` and `accent` require light-coloured text — never place dark body text on these covers.

---

## 5. Section Dividers — 5 Background Variants

Section slides (`<!-- _class: section [variant] -->`) mark narrative transitions.

| Class modifier | Background | Tone | Use when |
|----------------|------------|------|----------|
| *(none)* `section` | White / minimal | Neutral, open | Low-contrast pause, light-themed decks |
| `section light` | Subtle cream gradient | Calm, inviting | Transitioning to a friendly or explanatory section |
| `section medium` | Mid-tone warm gradient | Moderate contrast | Default choice — balances energy and readability |
| `section grey` | Grey gradient | Professional, grounded | Technical or factual sections |
| `section dark` | Navy gradient | Strong contrast, dramatic | High-impact section breaks; final major sections |

**Policy:** Use 1–2 section background variants across a single deck. Switching backgrounds on every section feels restless and undermines visual cohesion. Choose based on the deck's cover: dark covers → `dark` or `medium` dividers; light covers → `light` or `medium` dividers.

---

## 6. Content Slides — Tone and Density Rules

### Visual tone
- Background is white/off-white. No accent colours as content-slide fills.
- Use `--ed-muted` (`#585858`) for secondary text, closing lines, and labels.

### Density
- **Target:** a reader should scan a slide in under 10 seconds without losing context.
- Hard caps from `deck-template.md` apply. Style note: if content is hitting the cap, the message isn't distilled enough — reduce before adding `compact`.
- Avoid sub-bullets. A flat list of 4–5 strong points beats a hierarchy of 8 nested items.
- Closing/tagline lines at the bottom of a slide should be muted (lighter weight, reduced contrast). They frame but don't compete with the main message.

### Language
- Slide titles: imperative or declarative, 4–8 words. No gerunds as title openers ("Improving X" → "X Improves By…" or just "X Results").
- Bullet items: fragments are fine. Start with the fact, not the qualification.

---

## 7. Layout Patterns — Which to Use for Which Content

| Content type | Layout pattern | Notes |
|---|---|---|
| Opening statement + supporting bullets | `content hero` + `.impact-list` | Use `closing-line` for tagline |
| Standard bullet list (4–6 items) | `content` + `ul` | Default — no special class needed |
| Two topics compared | `columns two-col` with `.duo` or `.split-panels` | `.duo` = soft panels; `.split-panels` = hard contrast |
| Signal vs. Impact / Pros vs. Cons | `columns compare split-panels` + `.panel` | Two hard panels; add `no-top-accent` |
| Ranked priorities (1–4) | `ol.ranked-list` with `hero hero-ranked` | Vertical centering for emphasis |
| Process (3–5 sequential steps) | `process-flow` + `.flow-cards` + `.process-step` | No extra content below flow rail |
| Tool/option grid | `content tools-cards no-top-accent` + `.tools-grid` | Emoji icons work well here |
| Focus areas / capability tiles | `content labs-focus no-top-accent` + `.labs-grid` + `.lab-tile` | |
| Diagram + explanation | `content visual-split no-top-accent` | Image left, bullets right |
| Quote / callout emphasis | `columns two-col highlight-layout` + `.highlight-box` | |
| Framework / investment table | `content investment no-top-accent` + `.investment-layout` | |
| Full-bleed image | `content image-full` + `![](../images/…)` | No competing text elements |

---

## 8. Breadcrumb and Argument Labeling

### Section breadcrumb

When a content slide belongs to a named section, label it:

```
/ Section Name
```

- Placed at top-left of slide content area, small font, terracotta (`--ed-accent`).
- Formatted as: forward-slash space then the section name in sentence case.
- Use sparingly — not every slide needs a breadcrumb. Apply when the section context is not obvious from the title alone.

### STEP labels

Process steps use uppercase labels:
```
STEP 1   STEP 2   STEP 3
```
- All caps, semibold, placed above or inside each `.process-step` card.
- Followed by a short description in regular weight below.

---

## 9. Callout Patterns

Callouts are used to flag a key takeaway, reframe, or framework before transitioning.

### Callout pill labels (uppercase)

| Label | Use when |
|-------|----------|
| `TAKEAWAY` | Summarising the single most important conclusion |
| `BASELINE SHIFT` | Marking a before/after or paradigm change |
| `FRAMEWORK` | Introducing a repeatable model or decision structure |

**Style:** Uppercase pill — bordered box, terracotta accent stroke, semibold label, body text beneath. Use `.highlight-box` with `.highlight-title` + `.highlight-quote`.

**One callout per slide.** If you need two takeaways, they belong on separate slides.

---

## 10. Imagery and Diagrams

- Diagrams should have aspect ratio between 1.1 and 2.6. Ultra-wide diagrams lose label readability at slide scale.
- Use `../images/` path from `slides/` directory for generated diagrams (Mermaid/Excalidraw outputs). Never embed images as data URIs.
- Prefer generated Mermaid diagrams (flowcharts, sequences) over raster screenshots for technical content.
- Do not place more than one image per slide unless using an explicit grid layout.

### Emoji usage

Emoji icons are acceptable on categorical/tool slides where a visual anchor per item aids scanning:
```
🔍 Discovery   🔧 Implementation   📊 Measurement
```
One emoji per bullet maximum. Do not use emoji on formal executive covers or financial slides.

---

## 11. Do / Don't Summary

| Do | Don't |
|----|-------|
| Use `#e07a5f` terracotta exactly as specified | Approximate terracotta with any other shade |
| Keep slide titles ≤ 8 words | Copy a long plan heading verbatim as a title |
| Use 1–2 section background variants per deck | Switch section background on every divider |
| Keep callout labels (TAKEAWAY, FRAMEWORK) uppercase | Use mixed case for pill labels |
| Use DM Serif Display for headings, DM Sans for body | Mix fonts inconsistently |
| Match cover tone to deck energy (dark = bold, light = accessible) | Default to `standard` cover for every deck without considering alternatives |
| Mute closing/tagline lines with `--ed-muted` | Use full-contrast body text for tagline/footnote lines |
| Prefer flat bullet lists (4–5 items) | Use deep sub-bullet hierarchies |
