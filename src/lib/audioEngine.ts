// Web Audio engine for Music School.
// All synthesis uses the browser Web Audio API — no MP3 files required.
// AudioContext is lazily initialised on first user gesture to comply with
// browser autoplay policies.

let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!_ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    _ctx = new Ctor();
  }
  if (_ctx.state === "suspended") {
    _ctx.resume().catch(() => {});
  }
  return _ctx;
}

// MIDI note number → frequency (equal temperament, A4 = 440 Hz)
export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Pitch-class name (0–11) → letter name
const PC_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export function midiName(midi: number): string {
  const pc = midi % 12;
  const oct = Math.floor(midi / 12) - 1;
  return `${PC_NAMES[pc]}${oct}`;
}

// ---------------------------------------------------------------------------
// Core tone generator
// ---------------------------------------------------------------------------

function playTone(
  frequency: number,
  duration = 0.8,
  startOffset = 0,
  type: OscillatorType = "triangle",
  volume = 0.5
): void {
  const ctx = getCtx();
  if (!ctx) return;

  const t0 = ctx.currentTime + startOffset;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, t0);

  // ADSR-lite envelope: fast attack, sustain, exponential release
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.015);
  gain.gain.setValueAtTime(volume, t0 + duration * 0.65);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.start(t0);
  osc.stop(t0 + duration + 0.01);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Play a single note by MIDI number. */
export function playNote(midi: number, duration = 0.8): void {
  playTone(midiToFreq(midi), duration);
}

/**
 * Play two notes as an interval.
 * @param sequential  true = melodic (ascending), false = harmonic (simultaneous)
 */
export function playInterval(
  root: number,
  semitones: number,
  sequential = true,
  duration = 0.85
): void {
  if (sequential) {
    playTone(midiToFreq(root), duration, 0);
    playTone(midiToFreq(root + semitones), duration, duration + 0.05);
  } else {
    playTone(midiToFreq(root), duration, 0, "triangle", 0.4);
    playTone(midiToFreq(root + semitones), duration, 0, "triangle", 0.4);
  }
}

/** Play multiple MIDI notes simultaneously as a chord. */
export function playChord(notes: number[], duration = 1.4): void {
  const vol = Math.max(0.18, 0.55 / notes.length);
  notes.forEach((midi) => playTone(midiToFreq(midi), duration, 0, "triangle", vol));
}

export function playMajorTriad(root: number, duration = 1.4): void {
  playChord([root, root + 4, root + 7], duration);
}

export function playMinorTriad(root: number, duration = 1.4): void {
  playChord([root, root + 3, root + 7], duration);
}

export function playDominant7(root: number, duration = 1.4): void {
  playChord([root, root + 4, root + 7, root + 10], duration);
}

export function playMajor7(root: number, duration = 1.4): void {
  playChord([root, root + 4, root + 7, root + 11], duration);
}

export function playMinor7(root: number, duration = 1.4): void {
  playChord([root, root + 3, root + 7, root + 10], duration);
}

/** Authentic cadence: V7 → I (in the key whose tonic is `root`). */
export function playAuthenticCadence(root: number): void {
  const V = root + 7;
  playChord([V - 12, V, V + 4, V + 10], 1.0); // V7
  setTimeout(() => playChord([root - 12, root, root + 4, root + 7], 1.6), 1200);
}

/** Plagal cadence: IV → I. */
export function playPlagalCadence(root: number): void {
  const IV = root + 5;
  playChord([IV - 12, IV, IV + 5, IV + 9], 1.0); // IV
  setTimeout(() => playChord([root - 12, root, root + 4, root + 7], 1.6), 1200);
}

/** Play a sequence of MIDI notes as a melody. */
export function playMelody(midis: number[], bpm = 120): void {
  const beatSec = 60 / bpm;
  const noteDur = beatSec * 0.88;
  midis.forEach((midi, i) => {
    playTone(midiToFreq(midi), noteDur, i * beatSec);
  });
}

/**
 * Play a rhythm pattern (boolean array) as synthesised clicks.
 * Each `true` element fires a percussive noise burst.
 */
export function playRhythm(pattern: boolean[], bpm = 120): void {
  const ctx = getCtx();
  if (!ctx) return;

  const beatSec = 60 / bpm;

  pattern.forEach((hit, i) => {
    if (!hit) return;
    const t0 = ctx.currentTime + i * beatSec;

    // Noise buffer for a click/snare sound
    const dur = 0.05;
    const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let j = 0; j < data.length; j++) {
      data[j] =
        (Math.random() * 2 - 1) *
        Math.exp(-j / (ctx.sampleRate * 0.012));
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.7, t0);
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start(t0);
  });
}

/** Resume the AudioContext (call this on any user gesture). */
export function resumeAudio(): void {
  getCtx();
}
