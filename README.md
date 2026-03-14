# MARP Deck Generator Template

Opinionated template and workflow for building polished MARP slide decks. It ships with:

- A ready-to-clone deck scaffold in [deck-template](deck-template)
- A root [Taskfile.yml](Taskfile.yml) to bootstrap a new deck repository from the template
- Dockerized build tasks to preview and export PDF/PPTX
- Optional “skills” to plan, generate, and QA decks end-to-end

Use this when you want a clean, repeatable way to go from an outline to a production-ready deck.

## Prerequisites

- Docker Desktop (daemon running)
- Task (Go Task)
	- macOS: `brew install go-task/tap/go-task`
- Git (optional but recommended)

## Quick start

1) Initialize a new deck repository from this template

```
task init-deck TARGET=../my-deck \
	DECK_TITLE="My Presentation" \
	DECK_SUBTITLE="Subtitle (optional)" \
	AUTHOR="Your Name" \
	DATE="2026-01-27"   # accepts DD/MM/YY, DD/MM/YYYY, or YYYY-MM-DD
```

What this does
- Copies [deck-template](deck-template) into TARGET
- Replaces placeholders in text files (.md/.txt/.css/.yml/.yaml):
	- `{{DECK_TITLE}}`, `{{DECK_SUBTITLE}}`, `{{AUTHOR}}`, `{{DATE}}`
- Normalizes `DATE` if provided (e.g., `27/01/26` → `2026-01-27`)
- Initializes a new Git repo with the initial commit (inside TARGET)
- Installs the skills

2) Work inside your new deck repo (TARGET)

```
cd ../my-deck
```

## Template layout

Key paths inside a generated deck repo:

- [slides/deck.md](deck-template/slides/deck.md): the MARP deck source (front page + closing are pre-created)
- [.marp/themes/deck-theme.css](deck-template/.marp/themes/deck-theme.css): the theme (`@theme deck-theme`)
- [.marp/assets/](deck-template/.marp/assets): images referenced by slides
- [diagrams/](deck-template/diagrams): Mermaid sources (`.mmd`/`.mermaid`) → rendered into `.marp/assets/`
- [definition/deck-definition.md](deck-template/definition/deck-definition.md): your outline/definition
- [planning/](deck-template/planning): planned artifacts (plan and visual design)
- [.marp/references/deck-template.md](deck-template/.marp/references/deck-template.md): template rules (layout/classes)
- [Taskfile.yml](deck-template/Taskfile.yml): Dockerized preview/build tasks for the deck

Front matter expected at the top of [slides/deck.md](deck-template/slides/deck.md):

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

## Build and preview (inside the deck repo)

All tasks run MARP via Docker. From the deck folder:

```
task preview   # Live reload server at http://localhost:8080
task pdf       # Export versioned PDF to output/
task pptx      # Export versioned PPTX to output/
task mermaid   # Render diagrams/*.mmd|*.mermaid → .marp/assets/*.png
task mermaid-file FILE=diagrams/example.mmd  # Render one diagram
task artifacts # List generated artifacts in output/
task clean     # Remove output/
```

Notes
- Outputs are versioned as `<slugged-title>_<date>.pdf|pptx`
- `preview` serves the whole slides directory with live reload
- Theme name in slides must be `deck-theme` to match the CSS

## Recommended workflow

Two options: Skills-based (automated) or manual.

### A) Skills-based workflow (recommended)

The repository includes skills that automate plan → visuals → deck → QA. Use the “skills” utility by Vercel. See docs at https://skills.sh.

The init-deck task installs all the skills needed for the job.

Typical sequence inside your deck repo:

1. Author your outline in [definition/deck-definition.md](deck-template/definition/deck-definition.md)
2. Run the planner skill to generate [planning/deck-plan.md](deck-template/planning)
3. Run the visual designer to create [planning/deck-visual-design.md](deck-template/planning) and any `diagrams/*.mmd`
4. Render diagrams: `task mermaid`
5. Run the generator to produce [slides/deck.md](deck-template/slides/deck.md) and `slides/deck-notes.md`
6. Run the consistency checker to produce `qa/deck-consistency-report.md`
7. Preview/export with `task preview | pdf | pptx`

Refer to skills.sh for the exact command to run a skill in your environment.

Skill references (hosted at [raffaelecamanzo/skills](https://github.com/raffaelecamanzo/skills/tree/main/marp)):

- [marp-deck-planner/SKILL.md](https://github.com/raffaelecamanzo/skills/tree/main/marp/marp-deck-planner/SKILL.md)
- [marp-deck-visual-designer/SKILL.md](https://github.com/raffaelecamanzo/skills/tree/main/marp/marp-deck-visual-designer/SKILL.md)
- [marp-deck-gen/SKILL.md](https://github.com/raffaelecamanzo/skills/tree/main/marp/marp-deck-gen/SKILL.md)
- [marp-deck-workflow/SKILL.md](https://github.com/raffaelecamanzo/skills/tree/main/marp/marp-deck-workflow/SKILL.md)
- [marp-deck-checker/SKILL.md](https://github.com/raffaelecamanzo/skills/tree/main/marp/marp-deck-checker/SKILL.md)

### B) Manual workflow

1. Write your outline in [definition/deck-definition.md](deck-template/definition/deck-definition.md)
2. Create a plan in `planning/deck-plan.md` (see [.marp/references/deck-template.md](deck-template/.marp/references/deck-template.md) for slide patterns)
3. If your plan calls for visuals, add Mermaid files in `diagrams/` and run `task mermaid`
4. Build [slides/deck.md](deck-template/slides/deck.md) between the pre-existing title and closing slides
5. Preview locally (`task preview`) and export (`task pdf` / `task pptx`)

## Customization tips

- Change preview port: set `PREVIEW_PORT` in [deck-template/Taskfile.yml](deck-template/Taskfile.yml)
- Change MARP/mermaid image versions: edit `MARP_IMAGE` / `MERMAID_IMAGE` in the same file
- Update colors or typography: modify CSS variables in [.marp/themes/deck-theme.css](deck-template/.marp/themes/deck-theme.css)
- Enable page numbers: set `paginate: true` in slide front matter and adjust CSS if desired
- Asset paths in slides are relative to the slides folder, e.g. `![](../.marp/assets/diagram.png)`

## Troubleshooting

- “Docker daemon not running” → Start Docker Desktop and retry the task
- “Task not found” → Install Task (`brew install go-task/tap/go-task`)
- Port 8080 in use → `task preview` with a different `PREVIEW_PORT`
- Theme not applied → Ensure `theme: deck-theme` in slide front matter and CSS `/* @theme deck-theme */`
- Missing images in exports → Run `task mermaid` and check that slides reference `../.marp/assets/<name>.png`

## Notes and caveats

- The template README in [deck-template/README.md](deck-template/README.md) describes deck-level tasks and expectations
- The reference rules in [deck-template/.marp/references/deck-template.md](deck-template/.marp/references/deck-template.md) are the source of truth for layouts/classes
- Skills are hosted externally at [raffaelecamanzo/skills/marp](https://github.com/raffaelecamanzo/skills/tree/main/marp)

## License
Apache-2.0

---

Happy presenting!

