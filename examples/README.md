# Examples

One rendered intro per style, all made with:

```text
/intro "Code With Sam" --tagline "Ship faster" --style <style>
```

| Folder | Files |
|---|---|
| `terminal/` `neon/` `minimal/` `glitch/` `retro/` `cinematic/` | `intro.mp4` (1920x1080, 5 s, with audio), `intro.jpg` poster, `brief.md`, `COMMAND.txt` |

Regenerate any of them with:

```bash
node skills/intro/scripts/build.mjs --name "Code With Sam" --tagline "Ship faster" --style neon --out /tmp/out --render
```

Added a new style or format? Add an example here via PR (keep each MP4 under 1 MB).

## `custom/`: bespoke intros

Designed from scratch by following the skill in creative mode (no preset). Each folder holds everything needed to learn from or rebuild it:

| Folder | Prompt | Files |
|---|---|---|
| `custom/midnight-baker/` | `/intro "Midnight Baker" --vibe "warm, cozy, steam rising from fresh bread"` | `concept.md`, `audio.json`, `composition/`, `intro.mp4` |
| `custom/orbit-lab/` | `/intro "Orbit Lab" --vibe "space science explainers, curious, a sense of awe"` | same (made by a fresh agent following only the skill, as a test) |
| `custom/pixel-quest/` | `/intro "Pixel Quest" --vibe "8-bit arcade, chiptune, coin pickup"` | same |

Rebuild one:

```bash
cd examples/custom/pixel-quest
node ../../../skills/intro/scripts/audio.mjs audio.json
node ../../../skills/intro/scripts/render.mjs . --snapshots
```

Add yours via PR: a `concept.md` plus the composition and cue sheet. Please keep each MP4 under 2 MB, and make it clearly different from the existing ones.
