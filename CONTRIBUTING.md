# Contributing

Thanks for helping! The highest-value contributions:

1. **Style presets**: add a block to `STYLES` and a function to `S` in `skills/intro/scripts/build.mjs`, document it in `references/styles.md`, add it to `test/smoke.mjs`, and add an example in `examples/`.
2. **Formats / options**: e.g. new aspect ratios, caption support.
3. **Example intros**: a rendered MP4 + command under `examples/<name>/` (keep it under 1 MB).
4. **Bugs**: include your OS, Node version, FFmpeg version, `npx hyperframes doctor` output, and the `brief.md` that failed.

## Ground rules

- Keep intros short (≤ 8s) and legible.
- `npm test` must pass (every style passes `hyperframes check`).
- Only submit assets you have the right to redistribute.
- Keep `SKILL.md` lean; push detail into `references/`.
- One idea per PR.
