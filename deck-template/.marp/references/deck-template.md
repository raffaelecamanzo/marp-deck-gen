# Deck Template Rules

## Build context
- Build uses Taskfile + dockerized Marp CLI.
- Theme: `deck-theme` with HTML enabled.
- Slide size: 16:9.

## Deck skeleton (must keep)
- **Frontpage**:
  - Standard: `<!-- _class: title -->` with `# Title`, optional `.subtitle`, `.date`.
  - Variant cover: `<!-- _class: title cover <variant> -->` with the same content.
  - Allowed `<variant>`: `dark | accent | geometric | minimal`.
- **Closing**: `<!-- _class: closing -->` (can be empty).
- Insert user slides **between** frontpage and closing.

## Cover selection (required)
- Before generating the deck, ask the user which frontpage cover to use.
- Allowed choices: `standard`, `dark`, `accent`, `geometric`, `minimal`.
- Plain `cover` (no variant) gives a warm cream background.
- If the user does not pick one, default to `standard` and state that assumption.

## Input format (from plan)
- Standard slide:
  - `## Title`
  - `## Structure`
  - `## Content`
  - optional `## Image`
- Section slide:
  - `## Section`

## Core rules
- Use existing CSS classes first; extend CSS only if no pattern matches.
- Prefer semantic Markdown plus minimal HTML for layout.
- Use `<!-- _class: content -->` for normal slides; add modifiers as needed.
- Add `no-top-accent` when heavy boxes/tiles would create a double strong top line.
- **Slide titles must be short and punchy: target ≤ 8 words.** Never copy a verbose plan title verbatim; distil to the core idea. Only use `<br/>` to wrap a title when shortening is truly impossible.
- **Content budget** (hard caps at default type scale):
  - Single-column, 1-line title → max 6 items / ~8 lines of text
  - Single-column, 2-line title → max 4 items / ~6 lines of text
  - Two-column layout → max 4 items per column
  - Layout with large callout box → max 2 bullets + callout
  - `visual-split` left panel → max 3 items at default scale; add `compact` for 4+ items
    (narrow column ~455px causes wrapping; default `ul` margins add ~64px at 24pt)
  - When over budget: reduce content first; add `compact` class only if all content must be kept.
- Keep density moderate: avoid more than ~6 bullet lines per column.

## Class and layout mapping

### Section
- Use `# Section Title` with one of:
  - `<!-- _class: section -->`
  - `<!-- _class: section dark -->`
  - `<!-- _class: section medium -->`
  - `<!-- _class: section grey -->`
  - `<!-- _class: section light -->`

### Cover variants
- `title` (standard): neutral white frontpage.
- `title cover`: warm cream background (default cover).
- `title cover dark`: navy gradient background, light text.
- `title cover accent`: terracotta gradient background, white text.
- `title cover geometric`: cream background with CSS diagonal line pattern.
- `title cover minimal`: white background with thin terracotta accent line.
- Keep title/subtitle/date concise to preserve readability on textured covers.

### Insight cards (2×2)
- Use `<!-- _class: content -->`.
- Container: `<div class="insight-cards">` — 2-column grid that fills available slide height via `align-content: stretch`.
- Each card: `<div class="insight-card">` (terracotta top bar) or `<div class="insight-card secondary">` (navy top bar).
- Inside each card: a single `<p>` with the full statement sentence — no number or separate title.
- Alternate terracotta/navy across the 4 cards for visual rhythm.
- Content budget: exactly 4 cards; each sentence should be 1–2 lines at 18 pt. Add `compact` if sentences are longer.
- Use when content is 4 parallel findings or insights that don't need individual labels.

### Table of Contents (TOC)
- Use `<!-- _class: content -->` — no special section class needed.
- Slide title: short label (e.g. "Six topics, one clear direction").
- Container: `<div class="toc-rows">` — vertical flex stack that fills the content area and centers its rows when they are fewer than the fill threshold.
- Each entry: `<div class="toc-row">` containing:
  - `<p class="toc-num">01</p>` — terracotta bold number
  - `<div class="toc-text">` with `<p class="toc-title">Section Name</p>` and `<p class="toc-subtitle">Short descriptor</p>`
- **Sizing behaviour:**
  - Each row targets 80 px height; `justify-content: center` on `.toc-rows` keeps the block vertically centered when rows are sparse.
  - Rows shrink proportionally when the total exceeds the available height (many entries).
  - Subtitle is automatically hidden via container query when a row shrinks below 58 px.
- **Content budget:** ≤ 8 entries with subtitle; ≤ 12 entries title-only (subtitle hidden automatically). Beyond 12 reduce entries or split into two columns manually.
- Do not add `compact` — row sizing adapts automatically.

### Two columns
- Base:
  - `<!-- _class: content -->`
  - `<div class="columns two-col"> ... </div>`
- Variants:
  - Soft panels: add `.duo` to columns.
  - Split panels: `.split-panels` with `.panel` children.

### Highlight/quote box
- `.highlight-box` with `.highlight-title` and `.highlight-quote`.
- Add `no-top-accent`.

### Ranked list
- `<ol class="ranked-list">...</ol>`.
- Add `hero hero-ranked` if vertically centered.

### Statement + bullets
- `<div class="statement"><p>...</p></div>` then `<ul>`.
- Add `bottom-bar` for soft bottom rule.

### Process / steps
- `<div class="process">` with `.process-step`.
- For horizontal: add `process-flow` and wrap with `flow-cards`.
- **Constraint**: `process-flow` uses a decorative baseline rail (`flow-cards::after`) that extends below the card row. Do not add additional content blocks (bullets, tables) below the `.flow-cards` container — they will overlap the rail. If extra context is needed, use a plain `process` (non-flow) layout instead.

### Numbered top-accent cards (3-col)
- Use `<!-- _class: content -->`.
- Container: `<div class="numbered-cards">` — 3-column grid.
- Each card: `<div class="numbered-card">` (terracotta) or `<div class="numbered-card secondary">` (navy).
- Inside: `<p class="card-number">01</p>`, `<h3>Title</h3>`, `<p>Description.</p>`.
- `h3` inside `.numbered-card` renders dark (not accent-colored) — intentional.
- Content budget: 1-line title + 3 cards × (number + title + 1–2 lines). Add `compact` if text is long.

### Feature rows / stacked accent layers
- Use `<!-- _class: content -->`.
- Container: `<div class="feature-layers">` — vertical flex stack.
- Each row: `<div class="feature-row">` (terracotta) or `<div class="feature-row secondary">` (navy).
- Inside: `<p class="feature-label">LABEL</p>` (fixed 160px column) + `<p class="feature-desc">Text.</p>`.
- Content budget: up to 5 rows at default scale; add `compact` for 6+.
- Distinct from `.columns.duo`: duo is a 2-column side-by-side layout; feature-layers is a vertical stack of full-width rows.

### Timeline with milestone steps
- Use `<!-- _class: content timeline-steps -->` (section class **required** — rail geometry depends on it).
- Add `compact` for 5 steps: `<!-- _class: content compact timeline-steps -->`.
- Container: `<div class="timeline-items">` — horizontal flex row; `::before` renders gradient rail automatically.
- Each step: `<div class="timeline-item">` containing `<div class="step-badge">N</div>` and `<div class="step-card">`.
- Secondary variant: add `.secondary` to both `.step-badge` and `.step-card` on alternating steps.
- Content budget: 3–5 steps. At 5 steps always add `compact`. At 6+ reduce step count.

### Phase cards with left border and arrow connectors
- Use `<!-- _class: content -->`.
- Container: `<div class="phase-cards">` — grid `1fr auto 1fr auto 1fr`.
- Each phase: `<div class="phase-card">` (terracotta border) or `<div class="phase-card secondary">` (navy border).
- Inside: `<p class="phase-label">STEP N</p>`, `<p class="phase-title">Title</p>`, `<p>Body.</p>`.
- Between cards: `<div class="phase-arrow">▶</div>` — always neutral, no modifier.
- Structure is always: card | arrow | card | arrow | card.
- Content budget: label + title + 2–3 body lines per card. Add `compact` for longer text.

### Cards / tiles / grids
- Tools cards: `<!-- _class: content tools-cards no-top-accent -->` + `.tools-grid`.
- Tiles: `.grid-tiles` + `.tile`.
- Focus areas: `.labs-grid` + `.lab-tile`.

### Capability / diagram / lifecycle
- `<!-- _class: content capability-balanced no-top-accent -->` with `.capability-balanced-layout`.
- `<!-- _class: content visual-split no-top-accent -->` with `.capability-balanced-layout` for image-first slides.
  Add `compact` when the left panel has 4+ bullet items (column narrowing causes wrap-driven overflow at default scale).
- Add `image-wide` when diagram aspect ratio is >= 2.8.
- Add `image-tall` when diagram aspect ratio is <= 0.8.
- `<!-- _class: content lifecycle no-top-accent -->` for left rail + right visual.

### Tables
- Prefer grid/card layouts; if needed use simple HTML table + `no-top-accent`.
- Add new table styles only if grid cannot represent content.

## Additional structure mappings

### Full-width title + statements + closing line
- `<!-- _class: content hero -->`
- `## Title`
- `<div class="impact-list">` (2-4 statements)
- `<p class="closing-line">` for final line
- Add `no-top-accent` if visually heavy.

### Two columns: facts vs implications
- `columns two-col duo` with `h3` headings.

### Two columns: left list + right quote
- `columns two-col highlight-layout`.
- Left: `ul`.
- Right: `.highlight-box` with `.highlight-title` + `.highlight-quote`.
- Add `no-top-accent`.

### Statement + list with emphasis
- `.statement` then `ul` or `ol`.
- Add `bottom-bar` for soft emphasis.

### Ranked vertical list
- Use `hero hero-ranked` if centered; otherwise `content`.
- Use `ol.ranked-list`.

### Comparison split (IS vs IS NOT)
- `columns compare split-panels` with `.panel` children.
- Add `no-top-accent`.

### Matrix / 2x2 / side-by-side concepts
- `columns two-col duo` with `h3` + short `p` lines.

### Diagram-centric (center + notes)
- Prefer `content visual-split no-top-accent` for diagrams and external images.
- Keep `content capability-balanced no-top-accent` for text-first conceptual splits.
- Otherwise simple two-column grid with boxed center element + side notes.

### Process diagram (3-5 steps)
- `process-flow` with `.process` and `.process-step`.
- Add `no-top-accent` if cards dominate.

### Tooling proposal / options grid
- `content tools-cards no-top-accent` with `.tools-grid` + `.tool-card`.

### Focus areas / tiles
- `content labs-focus no-top-accent` with `.labs-grid` + `.lab-tile`.

### Investment / framework + validation
- `content investment no-top-accent` with `.investment-layout`.

## CSS extension rules
- Add minimal reusable classes only when no existing pattern fits.
- Prefer generic utilities (`.grid-3`, `.card`, `.pill`).
- Keep borders light; use `--ed-radius` and `--ed-shadow`.
- Avoid heavy contrast; use `--ed-line`, `--ed-muted`, `--ed-accent-soft`.

## Background selection policy
- The agent may choose section background variants per section slide.
- Prefer consistency: use 1-2 section background variants across a deck unless the user asks for stronger visual variety.
- Pick backgrounds based on narrative tone and contrast:
  - `dark` / `medium` for high contrast separators.
  - `grey` / `light` for calmer transitions.
- Always preserve heading readability on chosen backgrounds.

## Slide metadata (required at top of slides/deck.md)
```
---
marp: true
title: <presentation title>
theme: deck-theme
paginate: true
html: true
size: 16:9
---
```

## Assets and images
- Use relative paths from `slides/`: `../images/` for generated diagrams (Mermaid/Excalidraw outputs).
- Do not embed new images unless explicitly provided by the user.
- Use `output/` artifacts (generated PDF) as QA reference for visual checks.

### Image placement patterns

- Full-bleed image: `<!-- _class: content image-full -->` + `![](../images/<name>.png)` on its own line. Image fills content area below title; max-height ~440px, centered.
- Right column visual: `columns two-col` with image in right column. Images inside any `.columns` container are automatically capped at 300px height — keep to one image per column.
- Image-first split: `content visual-split no-top-accent` + `.capability-balanced-layout`.
- Wide diagram split: `content visual-split image-wide no-top-accent` — collapses to single column (text above, diagram below); the text panel renders as plain text with no card border.
- Tall diagram split: `content visual-split image-tall no-top-accent`.
- Left rail + visual: `content lifecycle no-top-accent` with image in visual area.
- Use Markdown image syntax: `![](../images/<name>.png)` for standalone images; use `<img src="...">` inside HTML column/grid structures.
- Keep to one image per slide unless a grid is explicitly needed.

### Diagram generation rules (required)
- Target diagram aspect ratio between `1.1` and `2.6`; avoid ultra-wide outputs.
- Prefer `flowchart TB` for 4+ nodes unless horizontal sequence is semantically required.
- Keep node labels concise (target <= 4 words per line) and use explicit line breaks for long phrases.
- For loops, prefer compact cycle shapes over long linear chains.
- Add lightweight grouping (`subgraph`) only when it reduces crossings and improves scan order.
- After generating PNGs, verify dimensions before deck render; refactor any image with ratio `> 3.0`.
- For ratio `< 0.8`, assign `image-tall`; refactor `.mmd` if labels are still not readable in PDF.
- If readability is still weak in PDF, update `.mmd` structure first; avoid compensating only with CSS scaling.

## PDF visual QA checks (required)
- Validate in the generated PDF under `output/`:
  - Correct frontpage cover variant is applied.
  - Title/subtitle/date are legible on the chosen cover.
  - Section divider headings are legible on each selected background variant.
  - Diagram labels remain readable at slide scale without zoom.
  - **Vertical balance**: on every `content` slide, title should be near the top with content flowing immediately below it. A large empty zone between title and body indicates a CSS/class mismatch — do not solve by adding content; instead verify the correct layout class is applied.
  - **No overflow**: check that no text, cards, or tiles are clipped at the slide bottom. If clipping occurs: reduce content first, then apply `compact`, then report if still overflowing.
- If legibility is weak, switch to a safer variant and regenerate.

## Code blocks

### Single code block

**Class tokens:** `content code-slide`
Add `compact` if the title is two lines.

The pre block sizes to its content width and centers horizontally. Budget ~20 lines of code.

````markdown
---

<!-- _class: content code-slide -->

## Slide title

```python
def my_function(x: int) -> str:
    return str(x)
```
````

### Two-column code blocks

**Class tokens:** `content no-top-accent`
Use raw `<pre><code class="language-xxx">` HTML inside each column (fenced blocks inside divs are unreliable in MARP). Budget ~15 lines per column.

```html
---

<!-- _class: content no-top-accent -->

## Slide title

<div class="code-columns">
<div class="code-col">
<p class="code-label">Left label</p>
<pre><code class="language-python">def before():
    pass
</code></pre>
</div>
<div class="code-col">
<p class="code-label">Right label</p>
<pre><code class="language-python">def after():
    pass
</code></pre>
</div>
</div>
```

The optional `<p class="code-label">` renders as a bold heading above each panel.

## Source artifacts
- Content definition: `definition/deck-definition.md`.
- Deck plan: `planning/deck-plan.md`.
- Visual design: `planning/deck-visual-design.md`.
