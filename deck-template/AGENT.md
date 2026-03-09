# AGENT.md

This repository builds MARP slides via `Taskfile.yml` using `slides/deck.md` and `.marp/themes/deck-theme.css`. The deck always contains a **frontpage** (title slide) and a **closing** slide; all user-provided slides are inserted between them.

Use these rules when turning a user prompt into `slides/deck.md` and (if needed) extending `.marp/themes/deck-theme.css`.

## Mandatory references

Before generating or modifying any slides, read both reference files:

1. `.marp/references/deck-template.md` — build context, deck skeleton, input format, core rules,
   all class/layout mappings, CSS extension rules, slide metadata, image placement patterns,
   source artifacts.
2. `.marp/references/style-guide.md` — design identity, cover/section tone guidance, callout
   patterns, breadcrumb format, emoji rules.

Do not apply any layout rule, CSS class, or design constraint that is not in these files.

## Output Expectation

- The deck should remain clean, readable, and consistent with the current theme.
- If you add CSS, keep it concise and avoid duplicating existing patterns.
