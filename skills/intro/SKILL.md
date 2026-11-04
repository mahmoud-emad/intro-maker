---
name: intro
description: Generate a short, polished YouTube intro (channel sting / video opener) as an MP4 using Hyperframes. Use when the user asks for a YouTube intro, channel intro, video opener, logo sting, or "intro maker". Reads the project or channel info from the working directory, plans a storyboard, composes HTML motion graphics, and renders intro.mp4 with music and SFX.
---

# /intro — YouTube intro maker

Turn a channel name (or the current project) into a 3–8 second YouTube intro with motion, music, and a poster frame.

## Invocation

```
/intro                              # infer channel/project from the directory
/intro "Code With Sam"              # explicit channel name
/intro --style neon --duration 5    # steer the look and length
```

### Options

| Flag | Values | Default |
|---|---|---|
| `--name` | channel / brand text | inferred from README, package.json, git remote |
| `--tagline` | short line under the name | none |
| `--style` | `neon`, `minimal`, `glitch`, `retro`, `terminal`, `cinematic` | `terminal` |
| `--duration` | 3–8 (seconds) | 5 |
| `--format` | `landscape` (1920x1080), `vertical` (1080x1920), `square` (1080x1080) | `landscape` |
| `--accent` | hex colour | picked from style |
| `--logo` | path to SVG/PNG | none (typographic logo) |
| `--no-music` / `--no-sfx` | flags | audio on |

## Output

Write to `intro-output/` (or `intro-output-YYYY-MM-DD-HHmmss/` if it exists — never overwrite a previous run):

```
intro-output/
  brief.md          # name, tagline, style, palette, beats
  storyboard.md     # scene-by-scene timing
  composition/      # Hyperframes project (HTML)
  intro.mp4         # final render
  intro.jpg         # poster frame
  share-copy.txt    # title/description lines for the video
```

## Workflow

Follow the phases in order. Each has a gate; do not continue until it passes.

1. **Brief** — `references/step-1-brief.md`. Gate: name, style, format, duration, and palette are all decided and written to `brief.md`.
2. **Storyboard** — `references/step-2-storyboard.md`. Gate: beat durations sum to exactly `--duration`; one beat is the "logo hit" on the strongest audio accent.
3. **Compose** — `references/step-3-compose.md`. Gate: `npx hyperframes check` reports zero errors.
4. **Render & deliver** — `references/step-4-deliver.md`. Gate: `intro.mp4` exists, plays, matches the requested resolution and duration (±0.1s), and has an audio stream unless `--no-music`.

Style presets live in `references/styles.md`.

## Requirements

Node.js 22+, FFmpeg on PATH, and the Hyperframes CLI. Verify with `npx hyperframes doctor` before composing; if it fails, report what's missing and stop.

## Rules

- Keep it short. An intro over 8 seconds loses viewers. Default to 5.
- Legibility first: channel name must be readable on a phone and held on screen for at least 1 second.
- Use only assets you can license. Bundled audio is listed in `references/audio.md` with attribution; add attribution lines to `share-copy.txt` when required.
- Do not invent a logo or claim affiliation with real brands. If no logo is given, use typography.
- Before overwriting or deleting anything outside `intro-output*/`, ask.
- Read the Hyperframes skills/docs for composition format and render commands rather than guessing flags.
