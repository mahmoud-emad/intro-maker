# Audio

`scripts/build.mjs` synthesizes all audio with FFmpeg (no samples, no licensing to track):

| Layer | Flag to disable | What it is |
|---|---|---|
| Riser | `--no-music` | Rising sine sweep that peaks on the hit; range differs per style |
| Pad | `--no-music` | Soft A-minor chord bed with slow tremolo, faded in/out |
| Hit | `--no-sfx` | Low thud + noise transient exactly on the hit beat |
| Key clicks | `--no-sfx` | `terminal` style only: one click per typed character |

With both flags, no audio track is added.

## Using your own audio

To use a licensed track instead, edit `composition/index.html` and replace `assets/audio.wav` with your file (keep the `<audio data-start data-duration>` tag). Align the strongest transient to the hit beat (`hit` in `brief.md`) and record attribution in `share-copy.txt` where required.

Good free sources: Kenney (CC0 SFX), ende.app (CC BY 4.0 music), Pixabay (check terms).

## Mixing rules

- Output is limited to −0.9 dBFS peak (`alimiter`) and normalised by construction; typical mean ≈ −18 dB.
- 0.4 s fade-in and 0.5 s fade-out on the pad.
- The hit lands at `2.5 × duration / 5` seconds.
