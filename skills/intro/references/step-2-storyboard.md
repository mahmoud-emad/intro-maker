# Step 2 — Storyboard

Write `storyboard.md` with a table:

| # | Start | End | What's on screen | Motion | Audio cue |
|---|-------|-----|------------------|--------|-----------|

## Shape of a good 5s intro

| Beat | Time | Purpose |
|---|---|---|
| Setup | 0.0–1.0 | Hint of the style: particles, scanlines, cursor, light sweep |
| Build | 1.0–2.5 | Elements converge; rising audio |
| **Hit** | 2.5–3.0 | Name lands on the strongest accent. Screen flash / shake / glow |
| Hold | 3.0–4.5 | Name + tagline fully legible. Subtle idle motion |
| Out | 4.5–5.0 | Fast, clean exit so the video can start (cut or wipe) |

Scale proportionally for other durations. Never hold the name for less than 1s.

## Rules

- One idea per beat. No more than 3 simultaneous moving elements.
- Easing: ease-out for entrances, ease-in for exits. No linear except for loops.
- Last frame should be a clean transition point (solid colour or the held logo).
- For `vertical`, stack name and tagline; keep text inside a 900px-wide safe zone.

**Gate:** beat durations sum to exactly the target duration, and exactly one beat is marked **Hit**.
