// ---------------------------------------------------------------------------
// Minimal Web Audio synth + metronome for Sketchpad.
// ---------------------------------------------------------------------------

export type Wave = "sine" | "square" | "sawtooth" | "triangle";

export interface SynthSettings {
  waveform: Wave;
  octave: number;
  volume: number; // 0-1
  attack: number; // s
  release: number; // s
  cutoff: number; // Hz
}

export const DEFAULT_SYNTH: SynthSettings = {
  waveform: "sawtooth",
  octave: 0,
  volume: 0.3,
  attack: 0.02,
  release: 0.35,
  cutoff: 2600,
};

const SEMI: Record<string, number> = {
  C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11,
};

/** "C4" -> Hz (A4 = 440). */
export function noteToFreq(note: string): number {
  const m = note.match(/^([A-G]#?)(-?\d)$/);
  if (!m) return 440;
  const midi = (parseInt(m[2], 10) + 1) * 12 + SEMI[m[1]];
  return 440 * Math.pow(2, (midi - 69) / 12);
}

let ctx: AudioContext | null = null;
export function getAudioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctx();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function playSynthFreq(freq: number, s: SynthSettings, dur = 0.4): void {
  const c = getAudioCtx();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const filter = c.createBiquadFilter();
  const gain = c.createGain();
  osc.type = s.waveform;
  osc.frequency.value = freq * Math.pow(2, s.octave);
  filter.type = "lowpass";
  filter.frequency.value = s.cutoff;
  const total = s.attack + Math.max(s.release, dur);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.01, s.volume), now + s.attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + total);
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  osc.start(now);
  osc.stop(now + total + 0.05);
}

export function playSynthNote(note: string, s: SynthSettings, dur = 0.4): void {
  playSynthFreq(noteToFreq(note), s, dur);
}

/** Short metronome click (accented on the downbeat). */
export function metronomeClick(accent = false, volume = 0.5): void {
  const c = getAudioCtx();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "square";
  osc.frequency.value = accent ? 1600 : 1000;
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.06);
}
