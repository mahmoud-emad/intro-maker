// Smoke test: every style x format builds and passes `hyperframes check`; bad input is rejected.
// Run: npm test   (add RENDER=1 to also render and verify the MP4s)
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const build = join(root, 'skills/intro/scripts/build.mjs');
const tmp = mkdtempSync(join(tmpdir(), 'intro-test-'));
const styles = ['terminal', 'neon', 'minimal', 'glitch', 'retro', 'cinematic'];
const render = process.env.RENDER === '1';
let failed = 0;

const sh = (cmd, args, opts = {}) => spawnSync(cmd, args, { encoding: 'utf8', ...opts });
const ok = (name, cond, detail = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`);
  if (!cond) { failed++; if (detail) console.log(detail.split('\n').slice(-12).join('\n')); }
};

for (const style of styles) {
  const out = join(tmp, style);
  const r = sh('node', [build, '--name', 'Code With Sam', '--tagline', 'Ship faster', '--style', style, '--out', out, ...(render ? ['--render'] : [])]);
  ok(`build ${style}`, r.status === 0 && existsSync(join(out, 'composition/index.html')), r.stderr);
  if (r.status !== 0) continue;
  if (!render) {
    const c = sh('npx', ['--yes', 'hyperframes@0.9.12', 'check'], { cwd: join(out, 'composition') });
    ok(`check ${style}`, c.status === 0, c.stdout + c.stderr);
  } else {
    ok(`render ${style}`, existsSync(join(out, 'intro.mp4')));
  }
}

for (const format of ['vertical', 'square']) {
  const out = join(tmp, `fmt-${format}`);
  const r = sh('node', [build, '--name', 'Sam', '--style', 'neon', '--format', format, '--duration', '3', '--no-music', '--out', out]);
  ok(`build format ${format}`, r.status === 0, r.stderr);
  const c = sh('npx', ['--yes', 'hyperframes@0.9.12', 'check'], { cwd: join(out, 'composition') });
  ok(`check format ${format}`, c.status === 0, c.stdout + c.stderr);
}

// --- creative-mode tooling: scaffold, audio cue sheets, bespoke examples ---
const scripts = join(root, 'skills/intro/scripts');
{
  const out = join(tmp, 'scaffold');
  const r = sh('node', [join(scripts, 'new.mjs'), '--out', out, '--duration', '4', '--format', 'square', '--bg', '#102030']);
  ok('new.mjs scaffolds', r.status === 0 && existsSync(join(out, 'composition/index.html')), r.stderr);
  const wav = join(out, 'composition/assets/audio.wav');
  const spec = join(tmp, 'scaffold-spec.json');
  writeFileSync(spec, JSON.stringify({ duration: 4, out: wav, riser: { end: 2 }, thuds: [{ t: 2 }], tones: [{ t: 0.5, f: 440, d: 0.3, wave: 'saw' }], noise: [{ t: 1, d: 0.5, decay: -1 }], clicks: [0.2, 0.3] }));
  const a = sh('node', [join(scripts, 'audio.mjs'), spec]);
  ok('audio.mjs synthesizes all layers', a.status === 0 && existsSync(wav), a.stderr);
  const c = sh('npx', ['--yes', 'hyperframes@0.9.12', 'check'], { cwd: join(out, 'composition') });
  ok('scaffold passes check', c.status === 0, c.stdout + c.stderr);
  const rej = sh('node', [join(scripts, 'new.mjs'), '--out', out]);
  ok('new.mjs refuses to overwrite', rej.status !== 0 && rej.stderr.includes('already exists'), rej.stderr);
  const none = sh('node', [join(scripts, 'audio.mjs'), (() => { const f = join(tmp, 'empty.json'); writeFileSync(f, '{"duration":3,"out":"' + join(tmp, 'e.wav') + '"}'); return f; })()]);
  ok('audio.mjs rejects an empty cue sheet', none.status !== 0 && none.stderr.includes('no layers'), none.stderr);
}
const customDir = join(root, 'examples/custom');
mkdirSync(join(tmp, 'custom'), { recursive: true });
for (const name of readdirSync(customDir)) {
  const dir = join(customDir, name);
  const work = join(tmp, 'custom', name);
  const cp = sh('cp', ['-R', dir, work]);
  const spec = JSON.parse(readFileSync(join(dir, 'audio.json'), 'utf8'));
  spec.out = join(work, 'composition/assets/audio.wav');
  const specFile = join(tmp, `${name}-audio.json`);
  writeFileSync(specFile, JSON.stringify(spec));
  const a = sh('node', [join(scripts, 'audio.mjs'), specFile]);
  ok(`custom/${name} audio`, cp.status === 0 && a.status === 0, a.stderr);
  const c = sh('npx', ['--yes', 'hyperframes@0.9.12', 'check'], { cwd: join(work, 'composition') });
  ok(`custom/${name} passes check`, c.status === 0, c.stdout + c.stderr);
  ok(`custom/${name} has concept + mp4`, existsSync(join(dir, 'concept.md')) && existsSync(join(dir, 'intro.mp4')));
}

const bad = [
  [['--style', 'neon'], '--name is required'],
  [['--name', 'x', '--style', 'nope'], '--style must be'],
  [['--name', 'x', '--duration', '20'], '--duration must be'],
  [['--name', 'x', '--accent', 'red'], '--accent must be'],
  [['--name', 'x'.repeat(30)], '24 characters'],
  [['--name', 'x', '--format', 'tall'], '--format must be'],
  [['--name', 'x', '--logo', '/nope.svg'], 'not found'],
];
for (const [args, msg] of bad) {
  const r = sh('node', [build, ...args, '--out', join(tmp, 'bad')]);
  ok(`rejects ${args.join(' ')}`, r.status !== 0 && r.stderr.includes(msg), r.stderr);
}

console.log(failed ? `\n${failed} test(s) failed` : '\nall tests passed');
process.exit(failed ? 1 : 0);
