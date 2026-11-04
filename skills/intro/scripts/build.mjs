#!/usr/bin/env node
// Generates a Hyperframes composition (+ synthesized audio) for a YouTube intro.
// Usage: node build.mjs --name "My Channel" [--tagline ".."] [--style terminal] [--duration 5]
//        [--format landscape|vertical|square] [--accent "#hex"] [--logo file] [--out dir]
//        [--no-music] [--no-sfx] [--render]
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, copyFileSync, existsSync, readFileSync } from 'node:fs';
import { join, resolve, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { synthAudio } from './lib/audio.mjs';

const HF = 'hyperframes@0.9.12';

const FORMATS = { landscape: [1920, 1080], vertical: [1080, 1920], square: [1080, 1080] };

const STYLES = {
  terminal: { wf: 0.62, bg: '#0b0f14', fg: '#e6edf3', accent: '#7ee787', accent2: '#7ee787', font: "'JetBrains Mono', ui-monospace, Menlo, monospace", weight: 700, track: '-0.02em', riser: [160, 700] },
  neon: { wf: 0.86, bg: '#07030f', fg: '#ffffff', accent: '#ff2bd6', accent2: '#27e8ff', font: "'Montserrat', 'Helvetica Neue', Arial, sans-serif", weight: 800, track: '0.04em', upper: true, riser: [220, 1400] },
  minimal: { wf: 0.62, bg: '#fafafa', fg: '#0a0a0a', accent: '#3b5bff', accent2: '#3b5bff', font: "'Inter', 'Helvetica Neue', Arial, sans-serif", weight: 600, track: '-0.03em', riser: [300, 600] },
  glitch: { wf: 0.55, bg: '#050505', fg: '#fafafa', accent: '#ff3b3b', accent2: '#3bffd0', font: "'Bebas Neue', sans-serif", weight: 800, track: '0.02em', upper: true, riser: [100, 1800] },
  retro: { wf: 0.9, bg: '#2a0a4a', fg: '#fff3e0', accent: '#ff7e5f', accent2: '#feb47e', font: "'Archivo Black', 'Poppins', sans-serif", weight: 900, track: '0.02em', upper: true, italic: true, riser: [120, 900] },
  cinematic: { wf: 1.3, bg: '#07070a', fg: '#f5efe6', accent: '#d4af37', accent2: '#d4af37', font: "'Playfair Display', Georgia, serif", weight: 400, track: '0.2em', upper: true, riser: [70, 400] },
};

function parseArgs(argv) {
  const o = { style: 'terminal', duration: 5, format: 'landscape', out: 'intro-output', music: true, sfx: true, render: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const val = () => argv[++i];
    if (a === '--name') o.name = val();
    else if (a === '--tagline') o.tagline = val();
    else if (a === '--style') o.style = val();
    else if (a === '--duration') o.duration = Number(val());
    else if (a === '--format') o.format = val();
    else if (a === '--accent') o.accent = val();
    else if (a === '--logo') o.logo = val();
    else if (a === '--out') o.out = val();
    else if (a === '--no-music') o.music = false;
    else if (a === '--no-sfx') o.sfx = false;
    else if (a === '--render') o.render = true;
    else if (a === '-h' || a === '--help') { console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 5).join('\n')); process.exit(0); }
    else fail(`Unknown option: ${a}`);
  }
  return o;
}

function fail(msg) { console.error(`error: ${msg}`); process.exit(1); }
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const run = (cmd, args, opts = {}) => {
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if (r.status !== 0) fail(`${cmd} ${args.slice(0, 3).join(' ')} ... failed (exit ${r.status})`);
};

const o = parseArgs(process.argv.slice(2));
if (!o.name || !o.name.trim()) fail('--name is required');
if (o.name.length > 24) fail('--name must be 24 characters or fewer');
if (o.tagline && o.tagline.length > 40) fail('--tagline must be 40 characters or fewer');
if (!STYLES[o.style]) fail(`--style must be one of: ${Object.keys(STYLES).join(', ')}`);
if (!FORMATS[o.format]) fail(`--format must be one of: ${Object.keys(FORMATS).join(', ')}`);
if (!(o.duration >= 3 && o.duration <= 8)) fail('--duration must be between 3 and 8 seconds');
if (o.accent && !/^#[0-9a-fA-F]{6}$/.test(o.accent)) fail('--accent must be a #rrggbb hex colour');
if (o.logo && !existsSync(o.logo)) fail(`--logo file not found: ${o.logo}`);

const S = { ...STYLES[o.style] };
if (o.accent) { S.accent = o.accent; if (o.style !== 'neon' && o.style !== 'glitch') S.accent2 = o.accent; }
const [W, H] = FORMATS[o.format];
const D = o.duration;
const k = D / 5;
const hit = +(2.5 * k).toFixed(3);
const outDir = resolve(o.out);
const compDir = join(outDir, 'composition');
mkdirSync(join(compDir, 'assets'), { recursive: true });

const display = S.upper ? o.name.toUpperCase() : o.name;
const fontSize = Math.round(Math.min((W * 0.78) / (display.length * S.wf + (o.style === 'terminal' ? 1.4 : 0)), H * 0.2, 230));
const tagSize = Math.round(Math.max(26, fontSize * 0.26));

// ---------- audio ----------
let hasAudio = false;
const useMusic = o.music, useSfx = o.sfx;
if (useMusic || useSfx) {
  const spec = { duration: D, out: join(compDir, 'assets', 'audio.wav') };
  if (useMusic) {
    spec.riser = { from: S.riser[0], to: S.riser[1], end: hit, vol: 0.45 };
    spec.pad = { freqs: [110, 164.81, 220], vol: 0.16, tremolo: 1.5 };
  }
  if (useSfx) {
    spec.thuds = [{ t: hit, f: 52, vol: 0.9 }];
    if (o.style === 'terminal') {
      const n = [...display].length;
      spec.clicks = Array.from({ length: n }, (_, i) => +(0.7 * k + i * ((1.6 * k) / n)).toFixed(3));
    }
  }
  synthAudio(spec);
  hasAudio = true;
}

// ---------- logo ----------
let logoRel = null;
if (o.logo) {
  logoRel = `assets/logo${extname(o.logo).toLowerCase()}`;
  copyFileSync(o.logo, join(compDir, logoRel));
}

// ---------- html ----------
const chars = [...display].map((c) => `<span class="ch">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');
const cfg = { style: o.style, D, k, hit, W, H, fontSize, accent: S.accent, accent2: S.accent2, fg: S.fg, bg: S.bg, n: [...display].length };

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=${W}, height=${H}" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
<style>
:root{--bg:${S.bg};--fg:${S.fg};--accent:${S.accent};--accent2:${S.accent2};}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:var(--bg)}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:var(--bg);font-family:${S.font};color:var(--fg)}
.layer{position:absolute;inset:0}
#stage{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${Math.round(fontSize * 0.22)}px}
#logo{height:${Math.round(fontSize * 1.1)}px;width:auto;object-fit:contain}
#line{position:relative;display:flex;white-space:nowrap;font-size:${fontSize}px;font-weight:${S.weight};${o.style==='cinematic'?'padding-left:0.2em;':''}letter-spacing:${S.track};line-height:1.1;${S.italic ? 'font-style:italic;transform:skewX(-8deg);' : ''}}
.ch{display:inline-block;position:relative}
#prompt{color:var(--accent);margin-right:0.35em;opacity:0}
#cursor{position:absolute;top:8%;width:0.5em;height:84%;background:var(--accent);opacity:0}
#tag{font-size:${tagSize}px;letter-spacing:${o.style === 'cinematic' ? '0.4em' : '0.08em'};opacity:0;color:var(--fg);${o.style === 'cinematic' || o.style === 'neon' || o.style === 'glitch' || o.style === 'retro' ? 'text-transform:uppercase;' : ''}}
#flash{background:var(--accent);opacity:0}
#scan{background:repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 2px,transparent 2px 5px);opacity:0}
#rule{position:absolute;left:50%;top:-26%;width:${Math.round(Math.min(W * 0.4, 520))}px;height:4px;margin-left:-${Math.round(Math.min(W * 0.4, 520) / 2)}px;background:var(--accent);opacity:0}
#under{position:absolute;left:0;right:0;bottom:-6%;height:${Math.max(4, Math.round(fontSize * 0.05))}px;background:var(--accent);opacity:0}
#bar1,#bar2{position:absolute;left:-4%;right:-4%;height:6px;border-radius:3px;opacity:0}
#bar1{top:-16%;background:var(--accent);box-shadow:0 0 24px var(--accent),0 0 60px var(--accent)}
#bar2{bottom:-16%;background:var(--accent2);box-shadow:0 0 24px var(--accent2),0 0 60px var(--accent2)}
#sun{position:absolute;left:50%;width:${Math.round(H * 0.5)}px;height:${Math.round(H * 0.5)}px;margin-left:-${Math.round(H * 0.25)}px;top:${Math.round(H * 0.18)}px;border-radius:50%;background:linear-gradient(180deg,#ffd36b 0%,var(--accent) 55%,#d4388f 100%);opacity:0}
#grid{position:absolute;left:-50%;right:-50%;bottom:0;height:42%;background:linear-gradient(90deg,rgba(255,126,95,.55) 2px,transparent 2px) 0 0/90px 90px,linear-gradient(0deg,rgba(255,126,95,.55) 2px,transparent 2px) 0 0/90px 90px;transform:perspective(500px) rotateX(62deg);transform-origin:50% 100%;opacity:0}
#leak{background:radial-gradient(ellipse at 30% 50%,rgba(255,200,120,.55),transparent 55%);mix-blend-mode:screen;opacity:0}
#clone-r,#clone-c{position:absolute;inset:0;display:flex;opacity:0;mix-blend-mode:screen;pointer-events:none}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${D}" data-width="${W}" data-height="${H}">
  <div class="layer" id="fx">
    <div class="layer" id="scan"></div>
    <div class="layer" id="leak"></div>
    <div id="sun"></div><div id="grid"></div>
  </div>
  <div id="stage">
    ${logoRel ? `<img id="logo" src="${logoRel}" alt="" />` : ''}
    <div id="line">${o.style === 'terminal' ? '<span id="prompt">$</span>' : ''}${chars}<span id="under"></span>${o.style === 'terminal' ? '<span id="cursor"></span>' : ''}${o.style === 'neon' ? '<div id="bar1"></div><div id="bar2"></div>' : ''}${o.style === 'minimal' || o.style === 'cinematic' ? '<div id="rule"></div>' : ''}</div>
    ${o.tagline ? `<div id="tag">${esc(o.tagline)}</div>` : '<div id="tag" style="display:none"></div>'}
  </div>
  <div class="layer" id="flash"></div>
  ${hasAudio ? `<audio id="snd" src="assets/audio.wav" data-start="0" data-duration="${D}" data-volume="1"></audio>` : ''}
</div>
<script>
const C = ${JSON.stringify(cfg)};
const at = (x) => +(x * C.k).toFixed(3);
const tl = gsap.timeline({ paused: true });
const chars = gsap.utils.toArray('.ch');
const n = chars.length;
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

// shared: flash on the hit, tagline in, clean exit
tl.fromTo('#flash', { opacity: 0 }, { opacity: C.style === 'minimal' ? 0.12 : 0.38, duration: 0.05, ease: 'none' }, C.hit);
tl.to('#flash', { opacity: 0, duration: at(0.3), ease: 'power2.out' }, C.hit + 0.05);
if (document.getElementById('tag').style.display !== 'none') {
  tl.fromTo('#tag', { opacity: 0, y: 16 }, { opacity: 0.85, y: 0, duration: at(0.4), ease: 'power3.out' }, C.hit + at(0.25));
}
if (document.getElementById('logo')) {
  tl.fromTo('#logo', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: at(0.5), ease: 'back.out(1.6)' }, at(1.6));
}

const S = {
  terminal() {
    const line = document.getElementById('line');
    const cur = document.getElementById('cursor');
    const pos = chars.map((c) => c.offsetLeft + c.offsetWidth);
    const start = chars[0].offsetLeft;
    gsap.set(chars, { opacity: 0 });
    gsap.set(cur, { left: start });
    tl.to('#scan', { opacity: 1, duration: at(0.4) }, 0);
    tl.to('#prompt', { opacity: 1, duration: 0.01 }, at(0.2));
    tl.set(cur, { opacity: 1 }, at(0.2));
    // blink while waiting
    for (let i = 0; i < 4; i++) tl.set(cur, { opacity: i % 2 ? 1 : 0 }, at(0.2 + i * 0.12));
    tl.set(cur, { opacity: 1 }, at(0.68));
    const step = at(1.6) / n;
    chars.forEach((c, i) => {
      const t = at(0.7) + i * step;
      tl.set(c, { opacity: 1 }, t);
      tl.set(cur, { left: pos[i] }, t);
    });
    tl.set(cur, { opacity: 0 }, C.hit);
    tl.to('#prompt', { opacity: 0.35, duration: at(0.2) }, C.hit);
    tl.fromTo('#line', { scale: 1 }, { scale: 1.07, duration: at(0.18), ease: 'power3.out', transformOrigin: '50% 50%' , immediateRender: false }, C.hit);
    tl.to('#line', { scale: 1, duration: at(0.5), ease: 'power2.inOut' }, C.hit + at(0.18));
    tl.fromTo(chars, { textShadow: '0 0 0 rgba(0,0,0,0)' }, { textShadow: '0 0 ' + Math.round(C.fontSize * 0.25) + 'px ' + C.accent, duration: at(0.2) , immediateRender: false }, C.hit);
    tl.to(chars, { color: C.accent, duration: at(0.25) }, C.hit);
    tl.to(chars, { color: C.fg, duration: at(0.8) }, C.hit + at(0.6));
  },
  neon() {
    gsap.set(chars, { opacity: 0, textShadow: '0 0 ' + Math.round(C.fontSize * 0.2) + 'px ' + C.accent + ', 0 0 ' + Math.round(C.fontSize * 0.5) + 'px ' + C.accent2 });
    tl.fromTo('#bar1', { scaleX: 0, opacity: 1 }, { scaleX: 1, opacity: 1, duration: at(0.6), ease: 'power3.out' }, at(0.3));
    tl.fromTo('#bar2', { scaleX: 0, opacity: 1 }, { scaleX: 1, opacity: 1, duration: at(0.6), ease: 'power3.out' }, at(0.5));
    chars.forEach((c, i) => {
      const t = at(0.7) + i * (at(1.5) / n);
      [1, 0.15, 1, 0.3, 1].forEach((v, j) => tl.set(c, { opacity: v }, t + j * 0.07));
    });
    tl.fromTo('#line', { scale: 1.1 }, { scale: 1, duration: at(0.45), ease: 'power4.out', transformOrigin: '50% 50%' , immediateRender: false }, C.hit);
    tl.fromTo(chars, { color: '#ffffff' }, { color: C.fg, duration: at(0.6) , immediateRender: false }, C.hit);
  },
  minimal() {
    gsap.set(chars, { opacity: 0, y: 16 });
    tl.fromTo('#rule', { scaleX: 0, opacity: 1 }, { scaleX: 1, opacity: 1, duration: at(0.9), ease: 'power3.inOut' }, at(0.3));
    tl.to(chars, { opacity: 1, y: 0, duration: at(0.5), ease: 'power3.out', stagger: at(1.2) / n }, at(1.2));
    tl.fromTo('#under', { scaleX: 0, opacity: 1, transformOrigin: '0% 50%' }, { scaleX: 1, opacity: 1, duration: at(0.5), ease: 'power3.inOut' }, C.hit);
  },
  glitch() {
    tl.to('#scan', { opacity: 1, duration: at(0.2) }, 0);
    const line = document.getElementById('line');
    const mk = (id, color) => {
      const el = line.cloneNode(true);
      el.removeAttribute('id');
      el.id = id;
      el.querySelectorAll('#prompt,#cursor,#under,#bar1,#bar2,#rule').forEach((e) => e.remove());
      el.querySelectorAll('[id]').forEach((e) => e.removeAttribute('id'));
      el.style.color = color;
      line.parentNode.insertBefore(el, line.nextSibling);
      el.style.position = 'absolute';
      el.style.left = line.offsetLeft + 'px';
      el.style.top = line.offsetTop + 'px';
      el.style.mixBlendMode = 'screen';
      el.style.opacity = 0;
      return el;
    };
    const r = mk('gr', C.accent), c = mk('gc', C.accent2);
    gsap.set(chars, { opacity: 0 });
    tl.to(chars, { opacity: 1, duration: 0.05, stagger: at(0.8) / n }, at(0.9));
    tl.set([r, c], { opacity: 0.85 }, at(0.9));
    for (let t = at(0.9); t < C.hit - 0.06; t += at(0.07)) {
      tl.set(r, { x: (rnd() - 0.5) * C.fontSize * 0.35, y: (rnd() - 0.5) * 12 }, t);
      tl.set(c, { x: (rnd() - 0.5) * C.fontSize * 0.35, y: (rnd() - 0.5) * 12 }, t);
      tl.set('#line', { x: (rnd() - 0.5) * 18, opacity: rnd() > 0.2 ? 1 : 0.3 }, t);
    }
    tl.set([r, c], { x: 0, y: 0, opacity: 0 }, C.hit);
    tl.set('#line', { x: 0, opacity: 1 }, C.hit);
    tl.fromTo('#line', { scale: 1.08 }, { scale: 1, duration: at(0.3), ease: 'power4.out', transformOrigin: '50% 50%' , immediateRender: false }, C.hit);
  },
  retro() {
    gsap.set(chars, { opacity: 0 });
    tl.to('#grid', { opacity: 1, duration: at(0.4) }, 0);
    tl.fromTo('#grid', { backgroundPosition: '0 0, 0 0' }, { backgroundPosition: '0 0, 0 720px', duration: C.D, ease: 'none' }, 0);
    tl.fromTo('#sun', { y: 200, opacity: 0 }, { y: 0, opacity: 0.45, duration: at(1.6), ease: 'power2.out' }, at(0.3));
    tl.fromTo('#line', { x: -C.W * 0.6 }, { x: 0, duration: at(0.7), ease: 'power4.out' , immediateRender: false }, at(1.8));
    tl.to(chars, { opacity: 1, duration: 0.01, stagger: 0.02 }, at(1.8));
    tl.fromTo('#line', { scale: 1.1 }, { scale: 1, duration: at(0.4), ease: 'power3.out', transformOrigin: '50% 50%' , immediateRender: false }, C.hit);
    tl.fromTo(chars, { textShadow: '0 0 0 rgba(0,0,0,0)' }, { textShadow: '4px 4px 0 ' + C.accent + ', 8px 8px 0 #d4388f', duration: at(0.3) , immediateRender: false }, C.hit);
  },
  cinematic() {
    gsap.set(chars, { opacity: 0, filter: 'blur(22px)' });
    tl.fromTo('#stage', { scale: 1 }, { scale: 1.06, duration: C.D, ease: 'none', transformOrigin: '50% 50%' }, 0);
    tl.fromTo('#leak', { x: -C.W * 0.4, opacity: 0 }, { x: C.W * 0.4, opacity: 1, duration: at(2.2), ease: 'sine.inOut', yoyo: true, repeat: 1 }, at(0.3));
    tl.fromTo('#rule', { scaleX: 0, opacity: 1 }, { scaleX: 1, opacity: 1, duration: at(1.4), ease: 'power2.inOut' }, at(0.4));
    tl.to(chars, { opacity: 1, filter: 'blur(0px)', duration: at(0.9), ease: 'power2.out', stagger: at(1.3) / n }, at(0.9));
    chars.forEach((c, i) => tl.fromTo(c, { x: (i - (n - 1) / 2) * C.fontSize * 0.12 }, { x: 0, duration: at(1.5), ease: 'power2.out' }, at(0.9)));
  },
};
S[C.style]();

// clean exit so the video can start
if (C.D >= 3) tl.to(['#stage', '#fx'], { opacity: 0, duration: 0.3, ease: 'power2.in' }, C.D - 0.32);

window.__timelines = window.__timelines || {};
window.__timelines['main'] = tl;
tl.seek(0);
</script>
</body>
</html>
`;

writeFileSync(join(compDir, 'index.html'), html);
writeFileSync(join(compDir, 'hyperframes.json'), JSON.stringify({
  $schema: 'https://hyperframes.heygen.com/schema/hyperframes.json',
  registry: 'https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry',
  paths: { blocks: 'compositions', components: 'compositions/components', assets: 'assets' },
  media: { autoProxy: true },
}, null, 2) + '\n');
writeFileSync(join(compDir, 'meta.json'), JSON.stringify({ id: 'intro', name: o.name, createdAt: new Date().toISOString() }, null, 2) + '\n');
writeFileSync(join(outDir, 'brief.md'), `# Brief\n\n- **Name:** ${o.name}\n- **Tagline:** ${o.tagline || '(none)'}\n- **Style:** ${o.style}\n- **Format:** ${o.format} (${W}x${H})\n- **Duration:** ${D}s (hit at ${hit}s)\n- **Palette:** bg ${S.bg}, fg ${S.fg}, accent ${S.accent}${S.accent2 !== S.accent ? `, accent2 ${S.accent2}` : ''}\n- **Logo:** ${o.logo || 'typographic'}\n- **Audio:** ${hasAudio ? `synthesized (${[useMusic && 'music', useSfx && 'sfx'].filter(Boolean).join(' + ')})` : 'none'}\n`);
console.log(`composition written to ${compDir}`);

if (o.render) {
  run('npx', ['--yes', HF, 'check'], { cwd: compDir });
  const mp4 = join(outDir, 'intro.mp4');
  run('npx', ['--yes', HF, 'render', '-o', mp4], { cwd: compDir });
  const holdT = Math.min(D - 0.5, hit + 0.9 * k).toFixed(2);
  run('ffmpeg', ['-y', '-v', 'error', '-ss', holdT, '-i', mp4, '-frames:v', '1', '-q:v', '2', join(outDir, 'intro.jpg')]);
  const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,width,height,duration', '-of', 'default=nw=1', mp4], { encoding: 'utf8' });
  console.log(probe.stdout);
  console.log(`rendered ${mp4}`);
}
