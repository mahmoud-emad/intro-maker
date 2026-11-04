# Orbit Lab — concept

Brief: name "Orbit Lab", tagline "Learn the universe", landscape 1920x1080, 5 s, intro before every video.
Subject: space-science explainers. Personality: curious, awed, clear. First-second emotion: quiet anticipation (a held breath).

## Three candidates
1. Total solar eclipse: a dark moon slides across a small sun; at totality the corona blooms and the name resolves beneath it.
2. Telescope focus pull: a field of blurry bokeh orbs racks into sharp stars while the name sharpens from the same blur.
3. Orbit tracing: a planet draws an elliptical orbit line and the name letters light up one by one as it passes each.

Chosen: 1 (eclipse). Reasons: "the moment the universe shows you something" = awe; a one-beat reveal gives a clean hit; has a built-in sonic idea (hush, then bloom). (3 is the most literal pun on the name, 2 fits any optics channel.)

## Decisions
- Metaphor: totality. Wait, slide, hush, corona.
- Palette: ground #05060d (deep ink), text #f4f1ea (warm white), accent #ffb347 (amber corona). Warm, not cold cyan, to break the "space = blue" expectation. White on ground contrast ~18:1.
- Type: Montserrat 300 uppercase, tracking 0.32em; thin wide letters = calm wonder. Tagline Inter 400, tracking 0.2em, amber.
- Signature move: moon covers the sun and the corona flares into existence exactly as the letters resolve out of blur.
- Hit: 2.5 s (50%).
- Sound: low open-fifth drone, shimmering rising sine riser, 150 ms near-silence before the hit, then deep sub thud + a bell cluster (sine with partials) and a noise swell/exhale. Loudest at 2.5.

## Originality check
vs presets: cinematic (dark, gold, Playfair, blur resolve, riser+thud). Differs in metaphor (eclipse), typography (thin Montserrat vs Playfair), signature motion (occlusion + corona bloom vs slow push/light leak), sound (bell cluster + hush vs riser+thud); palette is amber on ink, close to cinematic gold, so that one is similar. 4 of 5 differ. Orbiting-ring decor is unlike retro grid. Passes.

## Storyboard
| Start | End | On screen | Motion | Sound |
|---|---|---|---|---|
| 0.0 | 1.0 | stars twinkle in, tilted orbit ring + planet dot fade in, small sun | slow ring rotation | drone fades in, noise swell begins |
| 1.0 | 2.35 | moon slides from left to cover the sun, corona hints at edges | power2.inOut slide, slows into totality | riser climbs |
| 2.35 | 2.5 | moon almost aligned; last sliver | stillness | near silence |
| 2.5 | 2.9 | totality: flash, corona blooms, NAME resolves from blur | stagger 0.045 | sub thud + bells |
| 2.9 | 3.1 | tagline fades up | y 12 -> 0 | exhale noise |
| 2.9 | 4.65 | hold: name readable 1.8 s, corona breathes | slow scale | bells ring out |
| 4.68 | 5.0 | clean exit | fade | drone out |

## Known checker warning
`first_frame_empty`: frame 0 shows the sun and stars but not the title, because the eclipse reveal *is* the concept. Use `intro.jpg` as the thumbnail.

## Provenance
This intro was produced by a fresh agent that only had the skill's instructions, as a test of the workflow (prompt: `/intro "Orbit Lab" --vibe "space science explainers, curious, a sense of awe" --tagline "Learn the universe"`).
