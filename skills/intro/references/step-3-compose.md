# Step 3 — Compose

You write the composition. The scripts handle boilerplate, audio and rendering.

## Steps

1. **Scaffold**

   ```bash
   node <skill-dir>/scripts/new.mjs --out <output-dir> --format <f> --duration <s> --name "<Name>" --bg "<ground hex>"
   ```

   `<skill-dir>` is the directory containing `SKILL.md` (e.g. `~/.claude/skills/intro`, or `skills/intro` in this repo). This writes `<output-dir>/composition/index.html` (a valid, minimal composition), `hyperframes.json`, `meta.json`, and an `assets/` folder.

2. **Write `index.html`** following `concept.md` and `motion-cookbook.md`. Replace the placeholder title with your design: layers, text, SVG/CSS shapes, the GSAP timeline with absolute times from your storyboard. Keep the `<audio>` tag if you have sound; remove it for a silent intro. Copy a supplied logo into `assets/` and reference it relatively.

3. **Write `audio.json`** and synthesize it (see `audio.md`):

   ```bash
   node <skill-dir>/scripts/audio.mjs <output-dir>/audio.json --out <output-dir>/composition/assets/audio.wav
   ```

   Always pass `--out` with an absolute path (the `out` field inside the JSON is resolved from your current directory).

4. **Check early and often** (it is fast):

   ```bash
   node <skill-dir>/scripts/render.mjs <output-dir> --check-only
   ```

   This runs `hyperframes check` from the right folder (running it elsewhere fails with "No composition found"). Zero errors required. Read each `✗` and its "Fix:" line; the cookbook lists the common ones. Warnings such as `first_frame_empty` and `line_unread` are explained in the cookbook (rules 10-11); fix them when you can.

## Guidance

- Prefer plain HTML/CSS/SVG + GSAP. Everything must be deterministic (seeded RNG, no timers).
- Build the **hit** first (name legible, glow, flash), then the build-up, then the exit. A strong hit with a plain build beats the opposite.
- Don't over-fill the frame. Negative space makes the name pop.
- If the user supplied a logo/colour, honour it exactly.

**Gate:** `npx hyperframes check` passes with zero errors, and `audio.wav` exists (unless silent).

## Preset shortcut

If the user asked for a named preset instead of a custom design:

```bash
node <skill-dir>/scripts/build.mjs --name "<name>" --style <preset> [--tagline ".."] [--duration 5] [--format landscape] [--accent "#hex"] [--logo file] --out <output-dir> --render
```

This builds, checks, renders and verifies in one go; skip to delivery.
