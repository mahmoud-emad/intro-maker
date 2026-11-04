# Style presets

Implemented in `scripts/build.mjs` (`STYLES` for palette/type, `S` for motion). Fonts are limited to ones Hyperframes can resolve.

Each preset: palette, type, motion signature, SFX flavour.

## terminal (default — fits Claude Code channels)
- Palette: bg `#0b0f14`, fg `#e6edf3`, accent `#7ee787`
- Type: JetBrains Mono, large, tight tracking
- Motion: blinking cursor → typed `$ channel-name` → command "runs" → name enlarges with a soft green glow
- SFX: soft key clicks, one low thud on the hit

## neon
- Palette: bg `#07030f`, fg `#ffffff`, accent `#ff2bd6` + `#27e8ff`
- Type: Montserrat ExtraBold, uppercase
- Motion: light tubes flicker on, name slams in with chromatic glow
- SFX: riser sweep into a low thud on the hit (pitch range tuned per style)

## minimal
- Palette: bg `#fafafa`, fg `#0a0a0a`, accent `#3b5bff`
- Type: Inter, generous whitespace
- Motion: line draws, name fades up 16px, underline wipes
- SFX: riser sweep into a low thud on the hit (pitch range tuned per style)

## glitch
- Palette: bg `#050505`, fg `#fafafa`, accent `#ff3b3b` + `#3bffd0` RGB split
- Type: Bebas Neue, uppercase
- Motion: noisy scanlines, slice displacement, snap to clean at the hit
- SFX: riser sweep into a low thud on the hit (pitch range tuned per style)

## retro
- Palette: bg `#2a0a4a`, sunset sun, perspective grid floor, accent `#ff7e5f`
- Type: Archivo Black, italic, uppercase
- Motion: synthwave grid scrolls, sun rises, name sweeps in
- SFX: riser sweep into a low thud on the hit (pitch range tuned per style)

## cinematic
- Palette: bg `#07070a`, warm white `#f5efe6`, gold accent `#d4af37`
- Type: Playfair Display, uppercase, wide tracking
- Motion: slow push-in, light leak, letters resolve from blur
- SFX: riser sweep into a low thud on the hit (pitch range tuned per style)
