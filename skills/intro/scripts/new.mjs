#!/usr/bin/env node
// Scaffold an empty, lint-clean Hyperframes composition for a bespoke intro.
// Usage: node new.mjs --out <dir> [--format landscape|vertical|square] [--duration 5] [--name "Title"] [--bg "#0b0f14"]
// Then edit <dir>/composition/index.html (see references/motion-cookbook.md) and run render.mjs.
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const FORMATS = { landscape: [1920, 1080], vertical: [1080, 1920], square: [1080, 1080] };
const o = { out: 'intro-output', format: 'landscape', duration: 5, name: 'Intro', bg: '#0b0f14' };
const a = process.argv.slice(2);
for (let i = 0; i < a.length; i++) {
  const k = a[i];
  if (k === '--out') o.out = a[++i];
  else if (k === '--format') o.format = a[++i];
  else if (k === '--duration') o.duration = Number(a[++i]);
  else if (k === '--name') o.name = a[++i];
  else if (k === '--bg') o.bg = a[++i];
  else { console.error(`error: unknown option ${k}`); process.exit(1); }
}
const fail = (m) => { console.error(`error: ${m}`); process.exit(1); };
if (!FORMATS[o.format]) fail(`--format must be one of: ${Object.keys(FORMATS).join(', ')}`);
if (!(o.duration >= 3 && o.duration <= 8)) fail('--duration must be between 3 and 8 seconds');
if (!/^#[0-9a-fA-F]{6}$/.test(o.bg)) fail('--bg must be a #rrggbb hex colour');

const [W, H] = FORMATS[o.format];
const dir = join(resolve(o.out), 'composition');
if (existsSync(join(dir, 'index.html'))) fail(`${dir}/index.html already exists; pick a new --out`);
mkdirSync(join(dir, 'assets'), { recursive: true });

const D = o.duration;
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=${W}, height=${H}" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<style>
  /* Fonts that Hyperframes resolves automatically: JetBrains Mono, Space Mono, Inter, Montserrat, Poppins,
     Bebas Neue, Archivo Black, Playfair Display. Others need an @font-face with a local file. */
  :root { --bg: ${o.bg}; --fg: #ffffff; --accent: #7ee787; --font: 'Inter', sans-serif; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: var(--bg); }
  #root { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; background: var(--bg); color: var(--fg); font-family: var(--font); }
  .layer { position: absolute; inset: 0; }
  /* Rule: do not put a CSS transform on anything GSAP will animate. Let GSAP own it (gsap.set / fromTo). */
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${D}" data-width="${W}" data-height="${H}">
  <!-- bg layers -> content -> fx -> flash. Add your elements here. -->
  <h1 id="title" style="position:absolute;left:50%;top:50%;font-size:${Math.round(H * 0.12)}px">${o.name.replace(/</g, '&lt;')}</h1>

  <!-- Soundtrack from audio.mjs (remove this line for a silent intro) -->
  <audio id="snd" src="assets/audio.wav" data-start="0" data-duration="${D}" data-volume="1"></audio>
</div>
<script>
  const D = ${D};
  const tl = gsap.timeline({ paused: true });
  gsap.set('#title', { xPercent: -50, yPercent: -50, opacity: 0 });
  // tl.fromTo(...) / tl.to(...): position every tween on the timeline with an absolute time.
  tl.to('#title', { opacity: 1, duration: 0.4 }, 0.5);
  // Clean exit so the video can start.
  tl.to('#root > *:not(audio)', { opacity: 0, duration: 0.3, ease: 'power2.in' }, D - 0.32);

  window.__timelines = window.__timelines || {};
  window.__timelines['main'] = tl;
  tl.seek(0);
</script>
</body>
</html>
`;
writeFileSync(join(dir, 'index.html'), html);
writeFileSync(join(dir, 'hyperframes.json'), JSON.stringify({
  $schema: 'https://hyperframes.heygen.com/schema/hyperframes.json',
  registry: 'https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry',
  paths: { blocks: 'compositions', components: 'compositions/components', assets: 'assets' },
  media: { autoProxy: true },
}, null, 2) + '\n');
writeFileSync(join(dir, 'meta.json'), JSON.stringify({ id: 'intro', name: o.name, createdAt: new Date().toISOString() }, null, 2) + '\n');
console.log(`scaffolded ${dir} (${W}x${H}, ${D}s)`);
