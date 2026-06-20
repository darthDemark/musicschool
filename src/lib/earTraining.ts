// ---------------------------------------------------------------------------
// Ear Training exercise engine. Each discipline generates its own unique
// questions. All audio is synthesized via the Web Audio engine, but the
// getSampleUrl() hook lets future sampled mp3s in /public/audio override it.
// ---------------------------------------------------------------------------

import {
  playInterval,
  playChord,
  playMelody,
  playRhythm,
} from "./audioEngine";

export type Discipline =
  | "intervals"
  | "chords"
  | "cadences"
  | "rhythm"
  | "melody"
  | "singback";

export interface ETQuestion {
  prompt: string;
  options: string[];
  answer: string;
  hint: string;
  play: () => void;
  /** Notes to highlight on the keyboard (empty for rhythm). */
  notes: number[];
}

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export function midiName(midi: number): string {
  return `${NOTE_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
function pickOptions(all: string[], answer: string, n = 4): string[] {
  const others = shuffle(all.filter((x) => x !== answer)).slice(0, n - 1);
  return shuffle([answer, ...others]);
}
function randomRoot(lo = 48, hi = 56): number {
  return lo + Math.floor(Math.random() * (hi - lo));
}

/**
 * Future sampled-audio hook. Returns a path under /public/audio when a file is
 * expected to exist; today the engine always synthesizes, so this is a stub for
 * the documented naming scheme (see public/audio/README.md).
 */
export function getSampleUrl(kind: string, id: string): string {
  return `/audio/${kind}/${id}.mp3`;
}

// --------------------------------- Intervals -------------------------------

const INTERVALS = [
  { name: "Minor 2nd", semitones: 1, hint: "Half step — tense, like Jaws." },
  { name: "Major 2nd", semitones: 2, hint: "Whole step — Happy Birthday opening." },
  { name: "Minor 3rd", semitones: 3, hint: "Smoke on the Water riff. Slightly sad." },
  { name: "Major 3rd", semitones: 4, hint: "Bright — When the Saints Go Marching In." },
  { name: "Perfect 4th", semitones: 5, hint: "Here Comes the Bride. Open, stable." },
  { name: "Tritone", semitones: 6, hint: "The Simpsons theme. Tense, ambiguous." },
  { name: "Perfect 5th", semitones: 7, hint: "Star Wars theme. Open and powerful." },
  { name: "Minor 6th", semitones: 8, hint: "Love Story theme. Melancholic, wide." },
  { name: "Major 6th", semitones: 9, hint: "My Bonnie Lies Over the Ocean. Warm." },
  { name: "Minor 7th", semitones: 10, hint: "Somewhere (West Side Story). Yearning." },
  { name: "Major 7th", semitones: 11, hint: "Take On Me phrase. Very wide, tense." },
  { name: "Octave", semitones: 12, hint: "Over the Rainbow opening. Pure, complete." },
];

function makeInterval(): ETQuestion {
  const correct = INTERVALS[Math.floor(Math.random() * INTERVALS.length)];
  const root = randomRoot();
  return {
    prompt: "Identify the interval",
    options: pickOptions(INTERVALS.map((i) => i.name), correct.name),
    answer: correct.name,
    hint: correct.hint,
    notes: [root, root + correct.semitones],
    play: () => playInterval(root, correct.semitones, true, 0.85),
  };
}

// --------------------------------- Chords ----------------------------------

const CHORDS = [
  { name: "Major", intervals: [0, 4, 7], hint: "Bright and stable." },
  { name: "Minor", intervals: [0, 3, 7], hint: "Darker — lowered third." },
  { name: "Diminished", intervals: [0, 3, 6], hint: "Tense — two stacked minor thirds." },
  { name: "Augmented", intervals: [0, 4, 8], hint: "Unstable — raised fifth, dreamlike." },
  { name: "Dominant 7", intervals: [0, 4, 7, 10], hint: "Bluesy, wants to resolve." },
  { name: "Major 7", intervals: [0, 4, 7, 11], hint: "Lush, jazzy, sweet." },
  { name: "Minor 7", intervals: [0, 3, 7, 10], hint: "Smooth, mellow, soulful." },
];

function makeChord(): ETQuestion {
  const correct = CHORDS[Math.floor(Math.random() * CHORDS.length)];
  const root = randomRoot(48, 60);
  const notes = correct.intervals.map((i) => root + i);
  return {
    prompt: "Identify the chord quality",
    options: pickOptions(CHORDS.map((c) => c.name), correct.name),
    answer: correct.name,
    hint: correct.hint,
    notes,
    play: () => playChord(notes, 1.6),
  };
}

// --------------------------------- Cadences --------------------------------

function seq(chords: number[][], gapMs = 900) {
  chords.forEach((c, i) => setTimeout(() => playChord(c, 1.2), i * gapMs));
}

const CADENCES = [
  {
    name: "Authentic (V–I)",
    hint: "Strong, conclusive. The dominant resolves home.",
    chords: [
      [55, 59, 62, 65],
      [48, 60, 64, 67],
    ],
  },
  {
    name: "Plagal (IV–I)",
    hint: "The 'Amen' cadence. Gentle, churchy.",
    chords: [
      [53, 57, 60, 65],
      [48, 60, 64, 67],
    ],
  },
  {
    name: "Deceptive (V–vi)",
    hint: "Surprise — the dominant resolves to vi, not I.",
    chords: [
      [55, 59, 62, 65],
      [57, 60, 64, 69],
    ],
  },
  {
    name: "Half (I–V)",
    hint: "Unfinished — it pauses on the dominant.",
    chords: [
      [48, 60, 64, 67],
      [55, 59, 62, 67],
    ],
  },
];

function makeCadence(): ETQuestion {
  const correct = CADENCES[Math.floor(Math.random() * CADENCES.length)];
  return {
    prompt: "Identify the cadence",
    options: pickOptions(CADENCES.map((c) => c.name), correct.name),
    answer: correct.name,
    hint: correct.hint,
    notes: correct.chords[1],
    play: () => seq(correct.chords),
  };
}

// --------------------------------- Rhythm ----------------------------------

const RHYTHMS = [
  { name: "Four on the floor", pattern: [true, true, true, true] },
  { name: "Backbeat (2 & 4)", pattern: [false, true, false, true] },
  { name: "Son clave (3-2)", pattern: [true, false, true, false, true, false, true, true] },
  { name: "Offbeat eighths", pattern: [false, true, false, true, false, true, false, true] },
  { name: "Gallop", pattern: [true, true, true, false, true, true, true, false] },
];

function makeRhythm(): ETQuestion {
  const correct = RHYTHMS[Math.floor(Math.random() * RHYTHMS.length)];
  return {
    prompt: "Identify the rhythm pattern",
    options: pickOptions(RHYTHMS.map((r) => r.name), correct.name),
    answer: correct.name,
    hint: "Count the pulses and feel where the accents land.",
    notes: [],
    play: () => playRhythm(correct.pattern, 104),
  };
}

// --------------------------------- Melody ----------------------------------

const C = 60;
const DEG = [0, 2, 4, 5, 7, 9, 11, 12]; // major scale offsets, degrees 1..8
function degToMidi(deg: number): number {
  return C + DEG[deg - 1];
}

const MELODIES = [
  { name: "1 – 2 – 3 – 1", degs: [1, 2, 3, 1] },
  { name: "1 – 3 – 5 – 3", degs: [1, 3, 5, 3] },
  { name: "5 – 4 – 3 – 2 – 1", degs: [5, 4, 3, 2, 1] },
  { name: "1 – 5 – 1", degs: [1, 5, 8] },
  { name: "3 – 2 – 1 – 7 – 1", degs: [3, 2, 1, 1, 1] },
];

function makeMelody(): ETQuestion {
  const correct = MELODIES[Math.floor(Math.random() * MELODIES.length)];
  const notes = correct.degs.map(degToMidi);
  return {
    prompt: "Identify the melody (scale degrees)",
    options: pickOptions(MELODIES.map((m) => m.name), correct.name),
    answer: correct.name,
    hint: "Track each step up or down from the tonic (1).",
    notes,
    play: () => playMelody(notes, 120),
  };
}

// --------------------------------- Sing-back -------------------------------

export interface SingBackPhrase {
  label: string;
  notes: number[];
  play: () => void;
}

export function makeSingBack(): SingBackPhrase {
  const m = MELODIES[Math.floor(Math.random() * MELODIES.length)];
  const notes = m.degs.map(degToMidi);
  return {
    label: m.name,
    notes,
    play: () => playMelody(notes, 112),
  };
}

// --------------------------------- Dispatch --------------------------------

export const DISCIPLINE_TITLES: Record<Discipline, string> = {
  intervals: "Interval Identification",
  chords: "Chord Quality",
  cadences: "Cadences",
  rhythm: "Rhythm Dictation",
  melody: "Melody Dictation",
  singback: "Sing-Back Exercises",
};

export function makeQuestion(discipline: Discipline): ETQuestion {
  switch (discipline) {
    case "chords":
      return makeChord();
    case "cadences":
      return makeCadence();
    case "rhythm":
      return makeRhythm();
    case "melody":
      return makeMelody();
    case "intervals":
    default:
      return makeInterval();
  }
}
