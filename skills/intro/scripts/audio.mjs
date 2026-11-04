#!/usr/bin/env node
// Synthesize an intro soundtrack from a JSON cue sheet.
// Usage: node audio.mjs <spec.json> [--out path.wav]
// The spec format is documented at the top of lib/audio.mjs and in references/audio.md.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { synthAudio } from './lib/audio.mjs';

const args = process.argv.slice(2);
if (!args[0] || args[0] === '-h' || args[0] === '--help') {
  console.log('usage: node audio.mjs <spec.json> [--out path.wav]');
  process.exit(args[0] ? 0 : 1);
}
let spec;
try { spec = JSON.parse(readFileSync(args[0], 'utf8')); } catch (e) { console.error(`error: cannot read spec: ${e.message}`); process.exit(1); }
const oi = args.indexOf('--out');
if (oi > -1) spec.out = args[oi + 1];
if (spec.out) spec.out = resolve(spec.out);
try { console.log(`wrote ${synthAudio(spec)}`); } catch (e) { console.error(`error: ${e.message}`); process.exit(1); }
