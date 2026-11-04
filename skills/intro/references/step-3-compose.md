# Step 3 — Compose

Build the Hyperframes project in `<output-dir>/composition/`.

## Division of labour

- **This skill owns:** brief, storyboard, palette, timing, audio choices.
- **Hyperframes owns:** composition file format, animation runtime, lint, render.

Read Hyperframes' own docs/skills (`npx hyperframes --help`, and any installed `hyperframes` skills) for the exact project layout and API. Do not guess file formats or flags from memory.

## Steps

1. Scaffold with the Hyperframes CLI into `composition/`.
2. Translate each storyboard row into a timed element or animation.
3. Apply the preset from `styles.md` (fonts, easing, effects). Use system-safe or bundled fonts only — no runtime font downloads.
4. Add audio per `audio.md`, aligning the strongest accent to the **Hit** beat.
5. Run `npx hyperframes check` and fix every error. Warnings should be fixed or noted in `brief.md`.

## Quality bar

- Text contrast ≥ 4.5:1.
- No element clipped at the chosen resolution.
- Frame 0 is a valid poster (not blank) — if it would be, add a 1-frame hero state.
- Deterministic: no `Math.random()` without a seed, so re-renders match.

**Gate:** `npx hyperframes check` → zero errors.
