# Step 1 — Brief

Goal: decide everything creative before touching code.

## Inspect

Look (read-only) for, in order:
1. Explicit flags from the user.
2. `README.md` title/tagline, `package.json` `name`/`description`, `Cargo.toml`, `pyproject.toml`.
3. `git remote get-url origin` for a handle.
4. Brand files: `logo.svg`, `logo.png`, `assets/`, `public/`, CSS variables for colours.

If there is no usable name, ask the user once: "What should the intro say?"

## Answer these

1. **Name** (max ~24 chars, will be set in large type)
2. **Tagline** (max ~40 chars, optional)
3. **Style** preset (see `styles.md`)
4. **Palette** — background, foreground, accent (check contrast ≥ 4.5:1 for text)
5. **Format** and resolution
6. **Duration** in seconds
7. **Logo** — file path or "typographic"
8. **Audio** — music track + 2–3 SFX, or none
9. **Signature moment** — the single visual hit the intro is remembered for

## Write `brief.md`

Plain markdown, one heading per answer above. Keep under 40 lines.

**Gate:** all nine answered, no "TBD".
