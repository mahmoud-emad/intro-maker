// Smoke test: every style x format builds and passes `hyperframes check`; bad input is rejected.
// Run: npm test   (add RENDER=1 to also render and verify the MP4s)
import { spawnSync } from 'node:child_process';
import { mkdtempSync, existsSync } from 'node:fs';
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
