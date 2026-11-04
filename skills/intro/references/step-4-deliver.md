# Step 4 — Render & deliver

## Render

Use the Hyperframes render command (see `npx hyperframes --help`). Output to `<output-dir>/intro.mp4`.

Target: H.264, yuv420p, 30 or 60 fps, AAC audio. If Hyperframes outputs something else, normalise with FFmpeg:

```bash
ffmpeg -i in.mp4 -c:v libx264 -pix_fmt yuv420p -c:a aac -movflags +faststart intro.mp4
```

## Verify

```bash
ffprobe -v error -show_entries stream=codec_type,width,height,duration -of default=nw=1 intro.mp4
```

Check: resolution matches `--format`, duration within ±0.1s, audio stream present (unless `--no-music`).

## Poster

Extract the held-logo frame:

```bash
ffmpeg -ss <hold-time> -i intro.mp4 -frames:v 1 intro.jpg
```

## Share copy

Write `share-copy.txt`:
- 3 title options for a video that uses this intro
- 1 social post (≤ 240 chars) announcing the new channel intro
- Attribution lines for any CC-BY audio

## Report to the user

Print: path to `intro.mp4`, duration, resolution, file size, and how to tweak (`/intro --style glitch --duration 4`). Offer to open the file.

**Gate:** all verification checks pass. If any fail, fix and re-render; do not hand back a broken file.
