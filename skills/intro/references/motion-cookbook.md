# Motion cookbook (Hyperframes + GSAP)

How to write the composition. Each technique below is used in a working, `hyperframes check`-clean example: see `examples/custom/midnight-baker` and `examples/custom/pixel-quest`, and `scripts/build.mjs` for the presets.

Authoritative docs: `npx hyperframes docs compositions`, `docs gsap`, `docs data-attributes`, `docs audio`. Read them rather than guessing.

## Skeleton

Start with `node scripts/new.mjs --out <dir> --duration <s> --format <f> --bg "#hex"`. You get a root element and one paused GSAP timeline registered as `window.__timelines['main']`.

```html
<div id="root" data-composition-id="main" data-start="0" data-duration="5" data-width="1920" data-height="1080">
  ...layers...
  <audio src="assets/audio.wav" data-start="0" data-duration="5" data-volume="1"></audio>
</div>
<script>
  const tl = gsap.timeline({ paused: true });
  tl.to('#el', { opacity: 1, duration: 0.4 }, 0.5);   // always give an absolute time
  window.__timelines = window.__timelines || {};
  window.__timelines['main'] = tl;
  tl.seek(0);
</script>
```

Everything must be a pure function of timeline time (the renderer seeks to arbitrary frames). So: no `Date.now`, no unseeded `Math.random`, no `onUpdate` that mutates text/DOM, no CSS animations/transitions. Use `tl.set(el, {...}, time)` for discrete state changes (typing, blinking, step states).

## Rules that the checker enforces (learned the hard way)

1. **No CSS `transform` on an element GSAP animates.** Centre with `gsap.set(el, { xPercent: -50, yPercent: -50 })` over `left:50%; top:50%`, or with flexbox.
2. **Hidden at start + `fromTo` → put the visible `opacity` in both the from and to vars**, or just use `gsap.set` + `to`.
3. **A `fromTo` that starts later than t=0 → add `immediateRender: false`** (otherwise its *from* state is painted from frame 0; e.g. a flash drawn at 95 % opacity from the first frame). The same applies to every `fromTo` on one target except the earliest.
4. **Never animate `letterSpacing`, `width`, `top/left`** for motion; animate `x`, `y`, `scale`, `rotation`, `opacity`. For a letter-spread, split into per-char spans and tween each `x`.
5. **Don't put full-frame overlays (vignette, grain, scanlines) above text.** Put them below the content in the DOM, or the checker reports `text_occluded` / `canvas_covered`.
6. **Contrast.** Text needs ≥ 3:1 (large) against what is *actually behind it*, including blobs and gradients that animate under it. Dim decorations (lower opacity) rather than the text.
7. **Fonts.** Hyperframes auto-resolves Google fonts it knows. Verified: JetBrains Mono, Space Mono, Inter, Montserrat, Poppins, Bebas Neue, Archivo Black, Playfair Display. Verified NOT resolved: Space Grotesk, Orbitron, Cormorant Garamond, Anton, Fira Code, Impact. For others, add your own `@font-face` pointing at a file in `assets/`. Always test with `check`.
8. **Fit the text.** Size from the frame width: monospace ≈ 0.6 em/char, caps sans ≈ 0.8–0.9 em/char, add tracking. Keep ≥ 8 % margin. The checker reports `text_box_overflow`.
9. **Z-order.** Overlapping absolutely positioned layers have a fragile paint order once you animate them. Give layers an explicit `z-index` (background < glow < decor < content < flash).
10. **Text-time rules from the checker (`line_unread`).** A closing line such as the tagline must be fully visible for ≥ 2.0 s before the exit starts, so it should begin by about `duration − 2.3 s` (for a 5 s intro, by 2.7 s). Large title text needs ≥ 1 s.
11. **`first_frame_empty` (warning).** Frame 0 is the thumbnail on social players, so ideally the title or key image is already visible at t=0 (then animates). If the *reveal* is the concept (a build-up intro such as `orbit-lab`), accept the warning, but make sure something intentional and interesting is on screen at t=0 (a shape, star field, first letter) and that the poster `intro.jpg` (a hold frame) is used as the thumbnail.
12. Finish with a **clean exit** (fade or hard cut in the last 0.3 s) so the video can start.

Note: some checker messages cite Hyperframes' own reference files (`references/review.md`, `references/motion.md`) that are not in this repo. Ignore the path and follow the message text and its `Fix:` line.

## Techniques

| Technique | Recipe | Seen in |
|---|---|---|
| **Per-letter reveal** | wrap letters in `<span class="ch">`; `gsap.set(chars, {opacity:0})`; `tl.to(chars, {opacity:1, stagger:s}, t)` | all |
| **Blur resolve** | `gsap.set(chars, {filter:'blur(20px)', y:34, opacity:0})` → `to {filter:'blur(0px)', y:0, opacity:1}` | midnight-baker, cinematic preset |
| **Typing + cursor** | `tl.set(ch,{opacity:1}, t)` per char; move an absolutely positioned cursor to `ch.offsetLeft+offsetWidth` | terminal preset |
| **Frame-stepped motion** | `ease: 'steps(5)'` on `to`; use `tl.set` for flicker/blink | pixel-quest |
| **Seeded particle field** | tiny LCG `seed=(seed*16807)%2147483647`; create divs in a loop; tween each with its own time/offset | midnight-baker (steam), pixel-quest (sparks) |
| **Screen shake** | a few `tl.set('#stage',{x,y}, t+i*0.04)` frames, last one `{0,0}` | pixel-quest |
| **Glow / bloom** | animate opacity of a radial-gradient layer *below* the text; or `textShadow` on chars | midnight-baker, terminal preset |
| **Line/underline wipe** | element with no CSS transform; `fromTo(el,{scaleX:0,opacity:1,transformOrigin:'0% 50%'},{scaleX:1,opacity:1})` | minimal preset |
| **Slam / impact** | `fromTo(el,{scale:1.1},{scale:1, ease:'power4.out'})` at the hit + flash layer opacity 0.38 → 0 | all presets |
| **RGB-split glitch** | clone the title twice, colour the clones, `mix-blend-mode: screen`, jitter their x/y with seeded `tl.set` steps, snap to 0 at the hit | glitch preset |
| **Perspective grid** | `transform: perspective(500px) rotateX(62deg)` set in CSS on a *non-animated* element; animate its `backgroundPosition` | retro preset |
| **Slow push** | `fromTo('#stage',{scale:1},{scale:1.06,duration:D,ease:'none'})` | cinematic preset |

**3D / orbits:** a rotating child inside a `perspective()`-tilted parent gives a convincing orbit ring (see `examples/custom/orbit-lab`). **Occlusion/eclipse:** a dark circle sliding over a glowing circle, with the glow bloom triggered at the alignment (also orbit-lab).

Ideas not yet in the examples (verify with `check` as you go): SVG path drawing with `strokeDashoffset`, clip-path wipes, masks, 3D card flips, counters via stepped `tl.set` of pre-built text elements, logo reveals from a supplied SVG.

## Layering order (back to front)

background → ambient glow → particles/decor → **content (name, tagline)** → flash. Keep overlays that cover the frame behind the content.

## Logo

If `--logo` was given, copy it to `assets/` and use `<img src="assets/logo.svg">`. Animate it as part of the concept; do not redraw it.

## Debug loop

`node scripts/render.mjs <dir> --check-only` (always runs from the right folder) → fix → `node scripts/render.mjs <dir> --snapshots --at <hit+0.15>,<hit+0.6>` → view `review/frame-*.jpg`. `npx hyperframes preview` opens the studio in a browser if you want to scrub interactively.
