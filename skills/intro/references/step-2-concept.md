# Step 2 — Concept

Goal: one specific, memorable idea, with every design decision traced back to it. Read `concepts.md` for fuel.

## 1. Invent three concepts (diverge)

Write three one-sentence concepts that are **genuinely different** from each other, not three colour variations. Each is: *central metaphor + what happens + how the name appears*.

> "Warm steam drifts up and the name condenses out of it like writing on a fogged bakery window."
> "A fake game boot: segmented loader fills, bar flickers out, the title drops in frame-by-frame."

Throw out any concept that works for any channel. Prefer the one with a visual or sonic surprise tied to the subject.

## 2. Choose one and decide

Fill in (these go in `concept.md`):

- **Metaphor / idea**
- **Palette**: ground, text, one accent (+ optional second). Check contrast.
- **Typography**: one family (see the resolvable font list in `motion-cookbook.md`), case, weight, tracking. Why it fits.
- **Signature move**: the one thing people remember.
- **Hit moment**: time of the strongest beat (usually 45–55 % of the duration).
- **Sound concept**: instruments/textures that fit (warm pad + bell, chiptune, sub-boom + glitch, wood blocks…) and where the loudest accent is.

## 3. Storyboard

A table with absolute times (seconds):

| Start | End | On screen | Motion | Sound |
|---|---|---|---|---|

Typical shape for 5 s: **setup** 0–1 (something is already moving at t=0, and in the first 0.5 s: the hook), **build** 1–2.4 (elements converge), **hit** ~2.4 (name lands), **hold** 2.9–4.6 (name readable ≥ 1 s, subtle idle motion), **out** last 0.3 (clean exit so the video can start). The tagline must be fully on screen ≥ 2.0 s before the exit, so start it by `duration − 2.3 s`.

## 4. Originality check (gate)

Compare against the six presets in `styles.md`, `examples/*` and `examples/custom/*`. The concept must differ in **at least three** of these five, using these definitions (a "near" match counts as the same):

| Axis | Counts as different when |
|---|---|
| Metaphor | the central visual idea is a different thing (not the same idea reskinned) |
| Palette | the accent hue is ≥ 60° away on the colour wheel, or the ground flips light/dark |
| Typography | a different family *and* a different feel (mono / serif / heavy sans / condensed / thin) |
| Signature motion | a different dominant technique (e.g. steps vs blur resolve vs occlusion vs typing) |
| Sound | a different instrument family and a different hit sound (pad+bell vs chiptune vs sub+riser vs clicks) |

If not, go back to step 1.

Also check: beat times sum to the duration; exactly one hit; the name is on screen ≥ 1 s at full legibility; something moves in the first 0.5 s.

**Gate:** `concept.md` written (metaphor, palette, type, signature move, hit time, sound concept, storyboard) and the originality check passes.
