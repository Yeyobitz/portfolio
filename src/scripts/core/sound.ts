/**
 * Tiny WebAudio synth for UI feedback — no audio files, no network.
 * Everything is generated from oscillators so it stays < 1 kB.
 */

let ctx: AudioContext | null = null;
let muted = localStorage.getItem('yb:muted') === '1';

function ac(): AudioContext | null {
  if (muted) return null;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(v: boolean): void {
  muted = v;
  localStorage.setItem('yb:muted', v ? '1' : '0');
  if (!v) blip('select');
}

function tone(freq: number, dur: number, type: OscillatorType, gain = 0.05, delay = 0, slide?: number): void {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export function blip(kind: 'hover' | 'select' | 'xp' | 'level' | 'achievement' | 'power' = 'select'): void {
  switch (kind) {
    case 'hover':
      tone(880, 0.05, 'square', 0.012);
      break;
    case 'select':
      tone(520, 0.07, 'square', 0.03);
      tone(780, 0.06, 'square', 0.02, 0.04);
      break;
    case 'xp':
      tone(660, 0.05, 'triangle', 0.025);
      break;
    case 'level':
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.12, 'square', 0.035, i * 0.09));
      break;
    case 'achievement':
      [784, 988, 1319].forEach((f, i) => tone(f, 0.16, 'triangle', 0.04, i * 0.1));
      break;
    case 'power':
      tone(110, 0.5, 'sawtooth', 0.03, 0, 440);
      tone(220, 0.4, 'square', 0.02, 0.1, 880);
      break;
  }
}
