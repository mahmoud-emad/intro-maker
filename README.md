<div align="center">

# /intro

### Your YouTube intro, made by Claude Code. One command.

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-skill-d97757)](https://claude.com/claude-code)
[![Made with Hyperframes](https://img.shields.io/badge/render-Hyperframes-blue)](https://github.com/heygen-com/hyperframes)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

<!-- Replace with a real demo GIF/MP4 made by the skill itself -->
<img src="docs/assets/demo.gif" alt="Demo: /intro generating a YouTube intro" width="720">

</div>

---

Type `/intro`. Get a 5-second, studio-feel YouTube intro (`intro.mp4`) with motion graphics, music, and sound effects. No After Effects, no templates, no timeline.

```text
> /intro "Code With Sam" --style neon --duration 5
✔ brief  ✔ storyboard  ✔ composition  ✔ rendered intro-output/intro.mp4 (1920x1080, 5.0s)
```

## Install

**Claude Code (plugin)**

```bash
/plugin marketplace add YOUR_USER/intro-maker
/plugin install intro-maker@intro-maker
```

**Any agent via the `skills` CLI**

```bash
npx skills add YOUR_USER/intro-maker
```

**Manual**

```bash
git clone https://github.com/YOUR_USER/intro-maker
cp -r intro-maker/skills/intro ~/.claude/skills/intro
```

### Requirements

- Node.js 22+
- FFmpeg on your `PATH`
- [Hyperframes](https://github.com/heygen-com/hyperframes) (`npx hyperframes doctor` to check)

## Use

```text
/intro                                  # infer name from this project
/intro "Code With Sam"                  # explicit channel name
/intro --style terminal --tagline "Ship faster"
/intro --format vertical --duration 4   # Shorts / Reels
/intro --logo ./logo.svg --accent "#ff5a1f"
```

| Flag | Values | Default |
|---|---|---|
| `--name` | text | inferred |
| `--tagline` | text | none |
| `--style` | `terminal` `neon` `minimal` `glitch` `retro` `cinematic` | `terminal` |
| `--duration` | 3–8 s | 5 |
| `--format` | `landscape` `vertical` `square` | `landscape` |
| `--logo` | SVG/PNG path | typographic |
| `--accent` | hex | per style |
| `--no-music` `--no-sfx` | flags | audio on |

## Styles

| Style | Vibe |
|---|---|
| `terminal` | Typed command, green glow. Built for dev channels |
| `neon` | Flickering tubes, chromatic glow |
| `minimal` | Whitespace, one clean line draw |
| `glitch` | Scanlines, RGB split, snap to clean |
| `retro` | Synthwave grid and sunset |
| `cinematic` | Slow push-in, light leak, serif |

_(Add preview GIFs in `docs/assets/` and link them here.)_

## How it works

1. **Brief**: reads your project/channel info, picks palette and style
2. **Storyboard**: beat-by-beat timing with one signature "hit" moment
3. **Compose**: builds an HTML composition with [Hyperframes](https://github.com/heygen-com/hyperframes), gated by `hyperframes check`
4. **Render & deliver**: `intro.mp4`, poster `intro.jpg`, and `share-copy.txt`

Details live in [`skills/intro/`](skills/intro/SKILL.md).

## Repo layout

```
skills/intro/        the skill + references (the whole product)
.claude-plugin/      plugin + marketplace manifests
.claude/skills/      symlink for in-repo discovery
.agents/skills/      symlink for other agents
examples/            sample briefs and outputs
docs/                landing page (GitHub Pages)
```

## Contributing

New style presets, audio packs, and example intros are the best PRs. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Credits

Rendering by [Hyperframes](https://github.com/heygen-com/hyperframes). Inspired by [latent-spaces/brag](https://github.com/latent-spaces/brag). Audio attributions in [`skills/intro/references/audio.md`](skills/intro/references/audio.md).

## Star history

[![Star History Chart](https://api.star-history.com/svg?repos=YOUR_USER/intro-maker&type=Date)](https://star-history.com/#YOUR_USER/intro-maker&Date)

## License

[MIT](LICENSE)
