# Step 4 — Render & deliver

## Render

Easiest: re-run the generator with `--render` (it builds, runs `hyperframes check`, renders, and extracts the poster):

```bash
node <skill-dir>/scripts/build.mjs ...same flags as step 3... --out <output-dir> --render
```

Or, for an already-edited composition:

```bash
cd <output-dir>/composition
npx hyperframes check
npx hyperframes render -o ../intro.mp4
```

Rendering needs network access for the GSAP script (jsDelivr), Chrome (downloaded by Hyperframes on first run), and takes roughly 30-60 s for a 5 s intro.

## Verify

```bash
ffprobe -v error -show_entries stream=codec_type,width,height,duration -of default=nw=1 <output-dir>/intro.mp4
```

Check: resolution matches `--format` (1920x1080 / 1080x1920 / 1080x1080), duration within ±0.1 s, audio stream present unless `--no-music --no-sfx`.

Look at the poster (`intro.jpg`, the held-logo frame): name fully visible, centred, not clipped.

## Poster (manual)

```bash
ffmpeg -ss <hold-time> -i intro.mp4 -frames:v 1 intro.jpg
```

## Share copy

Write `<output-dir>/share-copy.txt`:
- 3 title options for a video that uses this intro
- 1 social post (≤ 240 chars) announcing the new channel intro

No attribution lines are needed for the bundled synthesized audio. Add them if you swap in third-party audio.

## Report to the user

Print: path to `intro.mp4`, duration, resolution, file size, and how to tweak (`/intro --style glitch --duration 4`). Offer to open the file.

**Gate:** all verification checks pass. If any fail, fix and re-render; do not hand back a broken file.
