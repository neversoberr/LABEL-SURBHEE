# UI UX Pro Max — installed skills

UI/UX design-intelligence skills installed project-scope to `.claude/skills`,
from [PSYOP-Z/UIUXProMax](https://github.com/PSYOP-Z/UIUXProMax) (a fork of
[nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)).

> Not a runnable app or theme — these are prompt-time skills + a local Python
> search engine the agent uses when making UI/UX decisions for this store.

## Installed skills (`.claude/skills/`)

| Skill | What it provides |
|---|---|
| `ui-ux-pro-max` | Core engine: 67 UI styles, 161 color palettes, 57 font pairings, 99 UX guidelines, 25 chart types, 12+ stacks. Includes the Python search CLI. |
| `design` | Logo / icon / brand-design generators + search data. |
| `design-system` | Token architecture, component specs, design-system generator. |
| `brand` | Brand guidelines templates + color/asset scripts. |
| `slides` | Slide decks, layout patterns, copywriting formulas. |
| `banner-design` | Banner sizes + style references. |
| `ui-styling` | 5.8 MB of fonts, styling references and scripts. |

## Search CLI (from this folder)

```bash
cd .claude/skills/ui-ux-pro-max

# UI style for a query
python3 scripts/search.py "luxury fashion e-commerce" --domain style

# domains: product | style | typography | color | landing | chart | ux
python3 scripts/search.py "ecommerce" --domain color

# stack-specific guidelines (html-tailwind, react, nextjs, vue, svelte, swiftui, …)
python3 scripts/search.py "animation" --stack html-tailwind

# generate a whole design system
python3 scripts/design_system.py "Luxury Indian bridal fashion store" \
  --project-name "Label Surbhee" --format markdown
```

Requires **Python 3.x only** (no pip dependencies). Node.js is only needed for
the optional `uipro-cli` npm installer.

## Notes

- The `ui-ux-pro-max` skill's `data/` and `scripts/` are real copies (the
  upstream symlinks were resolved) so the skill is self-contained.
- License: MIT (see `LICENSE` in the upstream repo — attribution retained in
  `SKILL.md` `author:` fields).
- The clone itself lives at `/home/user/UIUXProMax` (kept outside the repo to
  avoid committing 16 MB of upstream history/duplicates).
