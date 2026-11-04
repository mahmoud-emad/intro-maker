# Pixel Quest

**Channel:** retro-game speedruns and reviews. **Prompt:** `/intro "Pixel Quest" --tagline "Press Start" --vibe "8-bit arcade, chiptune, coin pickup"`

## Concept
A fake game boot sequence: a segmented loading bar fills to a chiptune arpeggio, the bar flickers out, and the title falls in one chunky frame at a time, landing with a coin pickup and a screen shake. "PRESS START" blinks underneath.

## Decisions
- **Palette:** PICO-8-ish: night `#1a1c2c`, yellow `#ffec27`, red `#ff004d`, cyan `#29adff`.
- **Type:** Space Mono Bold, uppercase, hard 8 px offset shadow (no blur anywhere).
- **Signature move:** everything animates with `steps()` easing, so motion looks frame-limited like old hardware.
- **Hit (2.4 s):** title lands, 14 pixel sparks burst out, 6-frame screen shake.
- **Sound:** square-wave arpeggio under the loader, B5→E6 coin chime on the hit, short noise crunch. No pad.
