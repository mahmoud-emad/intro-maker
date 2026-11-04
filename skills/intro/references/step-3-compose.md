# Step 3 — Compose

Generate the Hyperframes project with the bundled, tested generator. Do not hand-write the composition from scratch unless the user asks for something the presets cannot do.

## Run

```bash
node <skill-dir>/scripts/build.mjs \
  --name "<name>" [--tagline "<tagline>"] \
  --style <style> --duration <s> --format <format> \
  [--accent "#hex"] [--logo <file>] [--no-music] [--no-sfx] \
  --out <output-dir>
```

`<skill-dir>` is the directory containing this skill's `SKILL.md` (e.g. `~/.claude/skills/intro`, or `skills/intro` in this repo). Pass the values decided in `brief.md`; omit flags that are at their defaults.

The script writes `<output-dir>/composition/` (Hyperframes project with `index.html`, `assets/audio.wav`, optional logo) and `<output-dir>/brief.md`. Audio (riser, pad, hit, key clicks) is synthesized with FFmpeg, so there are no licensing concerns.

## Division of labour

- **This skill owns:** brief, storyboard, palette, timing, audio choices.
- **Hyperframes owns:** composition format, animation runtime, lint, render.

If the user wants custom changes, edit `composition/index.html` directly. It is a standard Hyperframes composition (GSAP timeline registered on `window.__timelines["main"]`). Read `npx hyperframes docs compositions` and `docs gsap` first; do not guess the format. Hyperframes' linter rejects a few things (animating `letterSpacing`, CSS `transform` plus GSAP on the same element, fonts it cannot resolve), so re-run the check after any edit.

## Gate

```bash
cd <output-dir>/composition && npx hyperframes check
```

Must report zero errors (lint, runtime, layout, contrast).

## Quality bar

- Text contrast passes WCAG AA (checked by `hyperframes check`).
- Nothing clipped at the chosen resolution.
- Only fonts Hyperframes can resolve are used (the presets use JetBrains Mono, Montserrat, Inter, Bebas Neue, Archivo Black, Playfair Display).
- Deterministic: the generator uses a seeded PRNG, so re-renders match.
