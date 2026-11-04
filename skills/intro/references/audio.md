# Audio: compose the sound for the concept

`scripts/audio.mjs <spec.json>` synthesizes a stereo WAV with FFmpeg from a cue sheet you write. No samples, nothing to license. Write `audio.json` next to the composition, set `out` to `composition/assets/audio.wav`, and run:

```bash
node <skill-dir>/scripts/audio.mjs <output-dir>/audio.json
```

(Paths in `out` are resolved from your current directory; the example specs are run from their own folder.)

## Cue sheet format

```json
{
  "duration": 5,
  "out": "composition/assets/audio.wav",
  "riser":  { "from": 160, "to": 700, "end": 2.5, "vol": 0.45 },
  "pad":    { "freqs": [130.81, 164.81, 196], "vol": 0.14, "tremolo": 0.8 },
  "thuds":  [{ "t": 2.5, "f": 52, "vol": 0.9 }],
  "clicks": [0.7, 0.8, 0.9],
  "tones":  [{ "t": 2.4, "f": 880, "d": 2.4, "wave": "sine", "vol": 0.3, "decay": 2.2 }],
  "noise":  [{ "t": 0.2, "d": 2.2, "vol": 0.1, "decay": -1 }]
}
```

| Layer | What it makes | Notes |
|---|---|---|
| `riser` | sine sweep rising from `from` Hz to `to` Hz, building until `end` | tension into the hit |
| `pad` | sustained chord (each freq a sine) with slow tremolo, faded in/out | choose notes by mood: major triad = warm, minor = tense, open fifth = neutral |
| `thuds` | low sine boom + noise tick at `t` | impacts; `f` 40–90 Hz |
| `clicks` | very short noise ticks at each time | typing, UI, mechanical |
| `tones` | any note: `wave` = `sine`, `square`, `saw`, `tri`; `d` length; `decay` envelope speed (higher = shorter) | bells (sine, decay 2–3, add the 1.5× and 3× partials), chiptune (square), plucks (tri, decay 8) |
| `noise` | white-noise bursts; `decay` ≥ 0 = decaying hit, `decay` < 0 = swell building to the end | steam, wind, whoosh, static, cymbal-ish crash |

Note frequencies: C4 261.63, D4 293.66, E4 329.63, F4 349.23, G4 392.00, A4 440.00, B4 493.88, C5 523.25 (double or halve for other octaves).

## Compose it like a sound designer

- Decide the **hit** time from the storyboard; put the loudest, broadest layer there (thud, bell, crash).
- Build tension before the hit (riser, swell, accelerating clicks, arpeggio), then leave a brief gap if you can.
- Match the concept: warm pad + sine bell (cozy), square arpeggio + coin chime (arcade), sub thud + noise (impact), clicks + low drone (tech/mystery).
- Keep levels sane: layers are summed and then hard-limited at −0.9 dBFS (no auto-boost: a quiet mix stays quiet). A thud at `vol` 0.9 plus a bell and a pad will hit the limiter, which is fine for the hit but can flatten dynamics; pull other layers down (`pad` 0.1–0.16, `riser` 0.3–0.45, `tones` 0.15–0.3) so the hit is clearly the loudest thing.
- Verify: `ffmpeg -i audio.wav -af volumedetect -f null -` should show a max around −3 to −0.9 dB and a mean around −14 to −22 dB. Mean below −26 dB means it is too quiet; raise `vol` values.

## Using your own audio

Replace `assets/audio.wav` with a licensed file and keep the `<audio data-start data-duration>` tag. Align its strongest transient to the hit and record attribution in `share-copy.txt` (good free sources: Kenney CC0, ende.app CC BY, Pixabay).

## Silent intros

Remove the `<audio>` tag (or never write one). `render.mjs` only demands an audio stream when the composition has an `<audio>` tag.
