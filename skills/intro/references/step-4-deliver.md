# Step 4 — Render, review, deliver

## Render + verify

```bash
node <skill-dir>/scripts/render.mjs <output-dir> --snapshots --at <hit+0.15>,<hit+0.6>
```

It runs `hyperframes check`, renders `<output-dir>/intro.mp4`, extracts the poster `intro.jpg`, and verifies the file: resolution equals the composition's `data-width/height`, duration is within ±0.1 s, and an audio stream exists when the composition has an `<audio>` tag. `--snapshots` writes six evenly spaced frames to `<output-dir>/review/`; `--at` adds the exact times you want to judge (always include just after the hit, e.g. `--at 2.55,3.0` for a hit at 2.4 s).

Rendering needs network (GSAP CDN, Google Fonts, Chrome on first run) and takes ~30–60 s for 5 s of video.

## Review: look at it

Open the review frames (and `intro.jpg`) with the image-reading tool and judge them honestly:

- Is the name fully visible, centred, not clipped, readable at phone size?
- Is the concept recognisable in the frames (does the metaphor read)?
- Is anything ugly: overlapping text, muddy contrast, empty frames at the start, an element stuck on screen?
- Is the hit frame (around the hit time) the strongest-looking frame?

If something is wrong, fix `index.html` / `audio.json` and re-run. Up to **3 rounds**; then deliver the best version and say what you'd still improve. Check the audio too: `ffmpeg -i <output-dir>/intro.mp4 -af volumedetect -vn -f null -` (max between about −6 and −0.5 dB, mean around −14 to −22 dB).

## Deliver

Write `<output-dir>/share-copy.txt`:
- 3 title options for a video that opens with this intro
- 1 social post (≤ 240 chars) announcing the new channel intro
- Attribution lines only if third-party audio or fonts were added

Then tell the user, briefly:
1. The concept in 2–3 sentences (what happens and why it fits the channel).
2. Path to `intro.mp4` (resolution, duration, size) and the poster.
3. How to iterate: "change the vibe", "make it 3 seconds", "vertical for Shorts", "different sound". Offer to open the file.

**Gate:** `render.mjs` printed `OK`, the frames were reviewed, and the report is given. Never hand back a file that failed verification.
