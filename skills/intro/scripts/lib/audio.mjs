// Data-driven audio synthesis with FFmpeg. No samples, no licensing.
// synthAudio(spec) writes a stereo 44.1 kHz WAV. Every layer is optional.
//
// spec = {
//   duration: 5,                       // seconds (required)
//   out: "assets/audio.wav",           // output path (required)
//   riser:  { from: 160, to: 700, end: 2.5, vol: 0.45 },   // sine sweep, 0 -> end
//   pad:    { freqs: [110, 164.81, 220], vol: 0.16, tremolo: 1.5 },  // soft bed, whole clip
//   thuds:  [{ t: 2.5, f: 52, vol: 0.9 }],                  // low boom + noise tick
//   clicks: [0.7, 0.8, 0.9],           // short noise ticks (typing, UI)
//   tones:  [{ t: 0.5, f: 880, d: 0.3, wave: "sine|square|saw|tri", vol: 0.3, decay: 6 }],
//   noise:  [{ t: 1.0, d: 0.4, vol: 0.3, decay: 8 }],       // whooshes / static / swells (decay<0 = swell)
// }
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const n = (x) => Number(x).toFixed(4);

function waveExpr(wave, f) {
  switch (wave) {
    case 'square': return `0.7*sgn(sin(2*PI*${f}*t))`;
    case 'saw': return `2*(${f}*t-floor(${f}*t+0.5))`;
    case 'tri': return `2*abs(2*(${f}*t-floor(${f}*t+0.5)))-1`;
    default: return `sin(2*PI*${f}*t)`;
  }
}

export function synthAudio(spec) {
  const D = spec.duration;
  if (!(D > 0)) throw new Error('audio spec: duration is required');
  if (!spec.out) throw new Error('audio spec: out is required');
  const inputs = [];
  const chains = [];
  const mix = [];
  let idx = 0;
  const src = (expr, dur) => {
    inputs.push('-f', 'lavfi', '-i', `aevalsrc='${expr}':s=44100:d=${n(Math.max(0.01, dur))}`);
    return idx++;
  };
  const place = (label, input, t, extra = '') => {
    const ms = Math.max(0, Math.round(t * 1000));
    chains.push(`[${input}]${extra}adelay=${ms}|${ms},aformat=channel_layouts=stereo[${label}]`);
    mix.push(`[${label}]`);
  };

  if (spec.riser) {
    const { from = 160, to = 700, end = D / 2, vol = 0.45 } = spec.riser;
    const r = src(`${vol}*sin(2*PI*(${from}*t+((${to}-${from})/(2*${end}))*t*t))*pow(t/${end},2)`, end);
    place('riser', r, 0);
  }
  if (spec.pad) {
    const { freqs = [110, 164.81, 220], vol = 0.16, tremolo = 1.5 } = spec.pad;
    const sum = freqs.map((f, i) => `${n(1 / (1 + i * 0.35))}*sin(2*PI*${f}*t)`).join('+');
    const p = src(`${vol}*(${sum})*(0.7+0.3*sin(2*PI*${tremolo}*t))`, D);
    place('pad', p, 0, `afade=t=in:d=0.4,afade=t=out:st=${n(Math.max(0, D - 0.5))}:d=0.5,`);
  }
  (spec.thuds || []).forEach((h, i) => {
    const { t = D / 2, f = 52, vol = 0.9 } = h;
    const s = src(`${vol}*sin(2*PI*${f}*t)*exp(-5*t)+0.35*(random(0)*2-1)*exp(-35*t)`, 0.9);
    place(`thud${i}`, s, t);
  });
  const clicks = spec.clicks || [];
  if (clicks.length) {
    const c = src(`0.35*(random(0)*2-1)*exp(-260*t)`, 0.04);
    if (clicks.length === 1) place('ck0', c, clicks[0]);
    else {
      chains.push(`[${c}]asplit=${clicks.length}${clicks.map((_, i) => `[cs${i}]`).join('')}`);
      clicks.forEach((t, i) => {
        const ms = Math.round(t * 1000);
        chains.push(`[cs${i}]adelay=${ms}|${ms},aformat=channel_layouts=stereo[ck${i}]`);
        mix.push(`[ck${i}]`);
      });
    }
  }
  (spec.tones || []).forEach((tn, i) => {
    const { t = 0, f = 440, d = 0.3, wave = 'sine', vol = 0.3, decay = 6 } = tn;
    const env = `exp(-${decay}*t)*min(1,t*200)*min(1,(${n(d)}-t)*60)`;
    const s = src(`${vol}*(${waveExpr(wave, f)})*${env}`, d);
    place(`tone${i}`, s, t);
  });
  (spec.noise || []).forEach((ns, i) => {
    const { t = 0, d = 0.4, vol = 0.3, decay = 8 } = ns;
    const env = decay >= 0 ? `exp(-${decay}*t)` : `pow(t/${n(d)},2)*min(1,(${n(d)}-t)*30)`;
    const s = src(`${vol}*(random(0)*2-1)*${env}`, d);
    place(`noise${i}`, s, t);
  });

  if (!mix.length) throw new Error('audio spec: no layers (add riser, pad, thuds, clicks, tones or noise)');
  const graph = [...chains, `${mix.join('')}amix=inputs=${mix.length}:normalize=0,alimiter=limit=0.9:level=0,atrim=0:${D},apad=whole_dur=${D},aformat=sample_rates=44100:channel_layouts=stereo[out]`].join(';');
  mkdirSync(dirname(spec.out), { recursive: true });
  const r = spawnSync('ffmpeg', ['-y', '-v', 'error', ...inputs, '-filter_complex', graph, '-map', '[out]', '-t', String(D), spec.out], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`ffmpeg audio synthesis failed:\n${r.stderr}`);
  return spec.out;
}
