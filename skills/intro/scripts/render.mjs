#!/usr/bin/env node
// Check, render, poster and verify any intro composition.
// Usage: node render.mjs <output-dir> [--snapshots] [--at 2.6,3.0] [--check-only] [--no-audio-check]
//   <output-dir> contains composition/index.html (made by new.mjs or build.mjs).
//   Writes <output-dir>/intro.mp4 and intro.jpg, then verifies resolution, duration and audio.
//   --snapshots also writes review/frame-<t>.jpg (6 evenly spaced frames) so you can LOOK at the result.
//   --at t1,t2,...  extra snapshot times in seconds (use hit+0.15 and hit+0.6 to judge the hit). Implies --snapshots.
//   --check-only    run only `hyperframes check` (from the right folder) and exit.
import { spawnSync } from 'node:child_process';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const HF = 'hyperframes@0.9.12';
const args = process.argv.slice(2);
const outDir = resolve(args.find((x) => !x.startsWith('--')) || 'intro-output');
const comp = join(outDir, 'composition');
const fail = (m) => { console.error(`\nFAIL: ${m}`); process.exit(1); };
const sh = (cmd, a, opts = {}) => spawnSync(cmd, a, { encoding: 'utf8', ...opts });
const flag = (f) => args.includes(f);
const val = (f) => { const i = args.indexOf(f); return i > -1 ? args[i + 1] : undefined; };

if (!existsSync(join(comp, 'index.html'))) fail(`no composition at ${comp}/index.html`);
const html = readFileSync(join(comp, 'index.html'), 'utf8');
const attr = (n) => Number((html.match(new RegExp(`data-composition-id="main"[^>]*?${n}="([\\d.]+)"`)) || [])[1]);
const W = attr('data-width'), H = attr('data-height'), D = attr('data-duration');
if (!W || !H || !D) fail('could not read data-width/height/duration from the root element');
const wantsAudio = /<audio\b/.test(html) && !flag('--no-audio-check');

console.log(`> hyperframes check (${W}x${H}, ${D}s)`);
let r = sh('npx', ['--yes', HF, 'check'], { cwd: comp });
process.stdout.write(r.stdout.split('\n').filter((l) => !/hyperframes\] check:/.test(l)).join('\n'));
if (r.status !== 0) { process.stderr.write(r.stderr); fail('hyperframes check reported errors. Fix them, then re-run.'); }
if (flag('--check-only')) { console.log('\nOK  check passed'); process.exit(0); }

console.log('> hyperframes render');
const mp4 = join(outDir, 'intro.mp4');
r = sh('npx', ['--yes', HF, 'render', '-o', mp4], { cwd: comp });
if (r.status !== 0 || !existsSync(mp4)) { process.stderr.write(r.stdout.split('\n').slice(-15).join('\n') + r.stderr); fail('render failed'); }

const probe = sh('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,width,height,duration', '-of', 'json', mp4]);
const streams = JSON.parse(probe.stdout).streams;
const v = streams.find((s) => s.codec_type === 'video');
const au = streams.find((s) => s.codec_type === 'audio');
const problems = [];
if (!v || +v.width !== W || +v.height !== H) problems.push(`resolution ${v && v.width}x${v && v.height}, expected ${W}x${H}`);
if (!v || Math.abs(+v.duration - D) > 0.1) problems.push(`duration ${v && v.duration}s, expected ${D}s`);
if (wantsAudio && !au) problems.push('no audio stream although the composition has an <audio> tag');
if (problems.length) fail(problems.join('; '));

const hold = Math.max(0.1, D - 0.9).toFixed(2);
sh('ffmpeg', ['-y', '-v', 'error', '-ss', hold, '-i', mp4, '-frames:v', '1', '-q:v', '2', join(outDir, 'intro.jpg')]);
const extra = (val('--at') || '').split(',').map(Number).filter((x) => x >= 0 && x < D);
if (flag('--snapshots') || extra.length) {
  const dir = join(outDir, 'review'); mkdirSync(dir, { recursive: true });
  const times = [...Array.from({ length: 6 }, (_, i) => Math.min(D - 0.05, (D * (i + 1)) / 6 - 0.05)), ...extra].sort((x, y) => x - y);
  for (const tt of times) {
    const t = tt.toFixed(2);
    sh('ffmpeg', ['-y', '-v', 'error', '-ss', t, '-i', mp4, '-frames:v', '1', '-vf', 'scale=960:-1', '-q:v', '3', join(dir, `frame-${t}.jpg`)]);
  }
  console.log(`snapshots in ${dir}`);
}
const size = (readFileSync(mp4).length / 1024).toFixed(0);
console.log(`\nOK  ${mp4}\n    ${v.width}x${v.height}, ${(+v.duration).toFixed(2)}s, audio: ${au ? 'yes' : 'no'}, ${size} KB\n    poster: ${join(outDir, 'intro.jpg')}`);
