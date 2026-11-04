---
name: intro
description: Design and render a one-of-a-kind YouTube intro (channel sting / video opener) as an MP4 with custom motion graphics and a custom synthesized soundtrack, using Hyperframes. Use when the user asks for a YouTube intro, channel intro, video opener, logo sting, or "intro maker". Invents a fresh concept for each channel instead of filling in a template.
---

# /intro — a bespoke YouTube intro, every time

You are the motion designer. Turn a channel (name, topic, personality) into a 3–8 second intro that could only belong to that channel: its own idea, palette, typography, motion and sound. Then render it to MP4.

## Invocation

```
/intro "Midnight Baker" --vibe "cozy night-shift sourdough, warm, steam"
/intro "Pixel Quest" --vibe "8-bit arcade" --duration 5
/intro                                   # infer name/topic from the project in the cwd
/intro "Code With Sam" --style neon      # optional quick preset (see Presets)
```

| Flag | Meaning | Default |
|---|---|---|
| `--name` / first arg | channel or brand text (≤ 24 chars) | inferred from README, package.json, git remote |
| `--vibe "..."` | free-text creative direction: mood, subject, references | inferred from the channel's topic |
| `--tagline` | line under the name (≤ 40 chars) | none |
| `--duration` | 3–8 seconds | 5 |
| `--format` | `landscape` 1920x1080, `vertical` 1080x1920, `square` 1080x1080 | `landscape` |
| `--accent`, `--logo` | forced colour / supplied logo file (use it, never invent one) | free |
| `--no-music` / `--no-sfx` | drop layers of the soundtrack | audio on |
| `--style <preset>` | skip design, use a quick preset | none: creative mode |

## Two modes

- **Creative mode (default).** No `--style`. Follow the five phases below and hand-author the composition. This is the product.
- **Preset mode.** Only when the user names `--style terminal|neon|minimal|glitch|retro|cinematic`, or explicitly wants something fast. Run `node scripts/build.mjs --name ... --style ... --render` and deliver. Mention that creative mode would make something unique.

## Output

`intro-output/` (or `intro-output-YYYY-MM-DD-HHmmss/` if it exists; never overwrite a previous run):

```
intro-output/
  concept.md        # the idea and the design decisions
  audio.json        # the cue sheet for the soundtrack
  composition/      # Hyperframes project you authored (index.html + assets/)
  intro.mp4  intro.jpg
  share-copy.txt
```

## Workflow (creative mode)

Each phase has a gate. Do not move on until it passes.

1. **Brief** — `references/step-1-brief.md`. Learn who the channel is. Gate: name, topic, personality, format and duration are known.
2. **Concept** — `references/step-2-concept.md` (idea fuel in `references/concepts.md`). Invent 3 different concepts, pick one, write `concept.md` with a storyboard. Gate: the originality check passes.
3. **Compose** — `references/step-3-compose.md`. Scaffold with `scripts/new.mjs`, write the composition yourself using `references/motion-cookbook.md`, write `audio.json` (`references/audio.md`) and synthesize it with `scripts/audio.mjs`.
4. **Render & review** — `references/step-4-deliver.md`. `scripts/render.mjs <dir> --snapshots` checks, renders and verifies. Then LOOK at the frames and fix what's wrong (up to 3 rounds). Gate: check passes, specs verified, frames look good.
5. **Deliver** — write `share-copy.txt`, tell the user the concept in 2–3 sentences, the file path, and how to tweak it.

## Originality rules

- Do not reuse a preset, and do not copy `examples/` (including `examples/custom/*`). Study them for the quality bar and technique only.
- Your concept must differ from the presets and from the user's previous runs in **at least three of**: central visual metaphor, palette, typography, signature motion, sound design.
- Derive the idea from the channel's subject or personality, not from "what looks cool". A concept that would work equally well for any channel is a failed concept.
- One strong idea beats five effects. One signature move, one hit moment.

## Craft rules

- Short: default 5 s. The name must be fully readable for at least 1 s, and legible on a phone.
- Sound is half the intro. Compose it for this concept; the loudest sound lands exactly on the hit.
- Use the user's logo if given; never invent or imitate real brands. No logo → typography.
- Deterministic: seeded random only. No `Math.random()`.
- Before touching anything outside `intro-output*/`, ask.

## Requirements

Node.js 22+, FFmpeg on PATH, network access (Hyperframes is fetched by `npx`, renders need Chrome and the GSAP CDN script). Run `npx hyperframes doctor` first; the `Docker running`, Kokoro and MusicGen failures are optional and can be ignored. If FFmpeg or Chrome is missing, say so and stop.

## Presets (optional quick starts)

`references/styles.md` and `scripts/build.mjs` provide six ready-made looks (terminal, neon, minimal, glitch, retro, cinematic). They are shortcuts, not the product, and they are a good source of technique to learn from.
