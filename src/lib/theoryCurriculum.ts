// ---------------------------------------------------------------------------
// Theory Academy curriculum content.
//
// Each curriculum section owns its own lesson: overview, explanation, a
// notation example, an interactive keyboard range, playable audio examples,
// a practice assignment, and quiz questions. The Theory page renders entirely
// from the selected section so the content always matches the chosen area
// (no more Counterpoint leaking into Melody/Rhythm/etc.).
// ---------------------------------------------------------------------------

import {
  playNote,
  playInterval,
  playMajorTriad,
  playMinorTriad,
  playDominant7,
  playMajor7,
  playAuthenticCadence,
  playPlagalCadence,
  playMelody,
  playRhythm,
} from "./audioEngine";

export interface NotationRow {
  left: string;
  right: string;
}

export interface NotationExample {
  title: string;
  leftLabel: string;
  rightLabel: string;
  rows: NotationRow[];
}

export interface KeyboardExample {
  startMidi: number;
  endMidi: number;
  caption: string;
}

export interface AudioExample {
  label: string;
  play: () => void;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
}

export interface TheorySection {
  id: string;
  /** Small eyebrow label, e.g. "Counterpoint IV". */
  unit: string;
  /** Big lesson title. */
  title: string;
  subtitle: string;
  overview: string;
  explanation: string[];
  notation: NotationExample;
  keyboard: KeyboardExample;
  audio: AudioExample[];
  practice: { title: string; body: string };
  quiz: QuizQuestion[];
}

export const theoryCurriculum: Record<string, TheorySection> = {
  foundations: {
    id: "foundations",
    unit: "Foundations I",
    title: "The Staff, Clefs & Pitch",
    subtitle: "The grammar of written music.",
    overview:
      "Music notation begins with the staff — five lines and four spaces — and the clefs that fix pitch to it. Mastering the staff is the prerequisite for everything that follows.",
    explanation: [
      "A staff is read bottom to top, low to high. The treble (G) clef circles the second line, fixing it as G4; the bass (F) clef's two dots surround the fourth line, fixing it as F3.",
      "Ledger lines extend the staff above and below for pitches beyond its range. Middle C (C4) sits on the first ledger line below the treble staff and the first above the bass staff — the hinge between the two clefs.",
      "Accidentals (sharp, flat, natural) raise or lower a pitch by a half step, while a key signature applies those alterations consistently throughout a passage.",
    ],
    notation: {
      title: "Staff Landmarks",
      leftLabel: "Landmark",
      rightLabel: "Pitch",
      rows: [
        { left: "Treble clef, 2nd line", right: "G4" },
        { left: "Treble bottom line", right: "E4" },
        { left: "Middle C (ledger)", right: "C4" },
        { left: "Bass clef, 4th line", right: "F3" },
        { left: "Bass bottom line", right: "G2" },
      ],
    },
    keyboard: { startMidi: 48, endMidi: 72, caption: "Find Middle C (C4) and play up the white keys." },
    audio: [
      { label: "Middle C (C4)", play: () => playNote(60) },
      { label: "G4 (treble landmark)", play: () => playNote(67) },
      { label: "C Major scale", play: () => playMelody([60, 62, 64, 65, 67, 69, 71, 72], 132) },
    ],
    practice: {
      title: "Practice Assignment",
      body: "Write the pitch name for each note on a one-octave treble passage, then play it back on the keyboard. Identify Middle C in both clefs.",
    },
    quiz: [
      {
        question: "Which line does the treble clef circle?",
        options: ["First line (E4)", "Second line (G4)", "Middle line (B4)", "Fourth line (D5)"],
        answerIndex: 1,
      },
      {
        question: "What does a flat (♭) do to a pitch?",
        options: ["Raises it a half step", "Lowers it a half step", "Raises it a whole step", "Cancels an accidental"],
        answerIndex: 1,
      },
    ],
  },

  notation: {
    id: "notation",
    unit: "Notation",
    title: "Reading Pitch & Rhythm",
    subtitle: "Turning symbols into sound with precision.",
    overview:
      "Notation encodes two dimensions at once: pitch (vertical position) and duration (note value). Reading fluently means decoding both simultaneously.",
    explanation: [
      "Note values are proportional. A whole note equals two half notes, a half equals two quarters, and so on down the rhythmic tree. The time signature tells you how many of which value fill a measure.",
      "Stems, beams, and flags clarify rhythm visually: beamed eighths group the beat, while dots add half of a note's value again.",
      "Articulations and dynamics sit above and below the staff, instructing how — not just what — to play.",
    ],
    notation: {
      title: "Note Values",
      leftLabel: "Note",
      rightLabel: "Duration (4/4)",
      rows: [
        { left: "Whole note", right: "4 beats" },
        { left: "Half note", right: "2 beats" },
        { left: "Quarter note", right: "1 beat" },
        { left: "Eighth note", right: "½ beat" },
        { left: "Sixteenth note", right: "¼ beat" },
      ],
    },
    keyboard: { startMidi: 60, endMidi: 84, caption: "Play the rhythm of quarter notes on a single pitch." },
    audio: [
      { label: "Quarter notes (C–D–E–F)", play: () => playMelody([60, 62, 64, 65], 100) },
      { label: "Eighth notes", play: () => playMelody([60, 60, 62, 62, 64, 64, 65, 65], 120) },
      { label: "Dotted feel", play: () => playRhythm([true, false, false, true, true, false, false, true], 110) },
    ],
    practice: {
      title: "Practice Assignment",
      body: "Notate a two-measure rhythm in 4/4 using whole, half, quarter, and eighth notes that adds up correctly in each bar. Clap it, then play it on one pitch.",
    },
    quiz: [
      {
        question: "How many eighth notes fill one 4/4 measure?",
        options: ["4", "6", "8", "16"],
        answerIndex: 2,
      },
      {
        question: "A dot after a note adds…",
        options: ["A full beat", "Half the note's value again", "Double the value", "A staccato"],
        answerIndex: 1,
      },
    ],
  },

  rhythm: {
    id: "rhythm",
    unit: "Rhythm",
    title: "Meter & Subdivision",
    subtitle: "The architecture of musical time.",
    overview:
      "Meter organizes pulse into recurring groups of strong and weak beats. Subdivision and syncopation are how rhythm gains motion and groove.",
    explanation: [
      "Simple meters divide the beat into two (4/4, 3/4, 2/4); compound meters divide it into three (6/8, 9/8, 12/8). The bottom number names the beat unit; the top number counts them.",
      "Syncopation places emphasis on weak beats or offbeats, pulling against the meter to create tension and swing.",
      "Polyrhythm layers two conflicting subdivisions — three against two is the classic example — producing rhythmic depth.",
    ],
    notation: {
      title: "Common Meters",
      leftLabel: "Time Signature",
      rightLabel: "Feel",
      rows: [
        { left: "4/4", right: "Common time — pop/rock backbone" },
        { left: "3/4", right: "Waltz — strong-weak-weak" },
        { left: "2/4", right: "March — duple pulse" },
        { left: "6/8", right: "Compound duple — lilting" },
        { left: "12/8", right: "Slow blues / gospel shuffle" },
      ],
    },
    keyboard: { startMidi: 60, endMidi: 72, caption: "Tap a pitch in time with the rhythm examples." },
    audio: [
      { label: "Straight 4/4 pulse", play: () => playRhythm([true, true, true, true], 110) },
      { label: "Backbeat (2 & 4)", play: () => playRhythm([false, true, false, true], 100) },
      { label: "Syncopated 'and'", play: () => playRhythm([true, false, true, true, false, true, true, false], 112) },
    ],
    practice: {
      title: "Practice Assignment",
      body: "Write a one-bar groove in 4/4 with at least one syncopation, then perform it against a steady quarter-note count. Try the same idea in 6/8.",
    },
    quiz: [
      {
        question: "6/8 is an example of which kind of meter?",
        options: ["Simple duple", "Compound duple", "Simple triple", "Asymmetric"],
        answerIndex: 1,
      },
      {
        question: "Syncopation emphasizes…",
        options: ["The downbeat", "Weak beats or offbeats", "The tonic", "The last bar only"],
        answerIndex: 1,
      },
    ],
  },

  melody: {
    id: "melody",
    unit: "Melody",
    title: "Scales & Intervals",
    subtitle: "The raw material of memorable line.",
    overview:
      "Melody is built from scales and the intervals between notes. Understanding interval quality and scale construction is what lets you shape contour intentionally.",
    explanation: [
      "The major scale follows the step pattern W–W–H–W–W–W–H. Each scale degree has a function and a characteristic color.",
      "Intervals are measured in half steps and named by quality (major, minor, perfect, augmented, diminished). The same distance can read very differently in context.",
      "Melodic contour — the shape of rises and falls — and motif repetition are what make a line memorable and singable.",
    ],
    notation: {
      title: "Intervals from C",
      leftLabel: "Interval",
      rightLabel: "Half Steps",
      rows: [
        { left: "Minor 2nd", right: "1" },
        { left: "Major 2nd", right: "2" },
        { left: "Major 3rd", right: "4" },
        { left: "Perfect 4th", right: "5" },
        { left: "Perfect 5th", right: "7" },
        { left: "Octave", right: "12" },
      ],
    },
    keyboard: { startMidi: 60, endMidi: 84, caption: "Play the C major scale and the intervals below." },
    audio: [
      { label: "C Major scale", play: () => playMelody([60, 62, 64, 65, 67, 69, 71, 72], 144) },
      { label: "Major 3rd (C–E)", play: () => playInterval(60, 4) },
      { label: "Perfect 5th (C–G)", play: () => playInterval(60, 7) },
    ],
    practice: {
      title: "Practice Assignment",
      body: "Write a four-bar melody in C major using only steps and one leap. Mark each interval, then play it back and adjust any leap that feels unsupported.",
    },
    quiz: [
      {
        question: "How many half steps are in a perfect fifth?",
        options: ["5", "6", "7", "8"],
        answerIndex: 2,
      },
      {
        question: "The major scale step pattern is…",
        options: ["W-H-W-W-H-W-W", "W-W-H-W-W-W-H", "H-W-W-H-W-W-W", "W-W-W-H-W-W-H"],
        answerIndex: 1,
      },
    ],
  },

  harmony: {
    id: "harmony",
    unit: "Harmony",
    title: "Triads & Diatonic Function",
    subtitle: "How chords are built and how they move.",
    overview:
      "Harmony stacks scale tones into triads and organizes their motion by function — tonic, subdominant, and dominant — the engine of tension and resolution.",
    explanation: [
      "A triad is three notes stacked in thirds: root, third, and fifth. The quality (major, minor, diminished) depends on the size of those thirds.",
      "Each diatonic scale degree yields a triad of a predictable quality. In a major key: I and IV and V are major, ii and iii and vi are minor, and vii° is diminished.",
      "Functional harmony groups chords into families: tonic (I, vi), subdominant (ii, IV), and dominant (V, vii°). The V→I cadence is the strongest resolution in tonal music.",
    ],
    notation: {
      title: "Diatonic Triads in C Major",
      leftLabel: "Scale Degree",
      rightLabel: "Triad Quality",
      rows: [
        { left: "I (C)", right: "Major" },
        { left: "ii (Dm)", right: "minor" },
        { left: "iii (Em)", right: "minor" },
        { left: "IV (F)", right: "Major" },
        { left: "V (G)", right: "Major" },
        { left: "vi (Am)", right: "minor" },
        { left: "vii° (B)", right: "diminished" },
      ],
    },
    keyboard: { startMidi: 48, endMidi: 72, caption: "Play triads and the cadence below." },
    audio: [
      { label: "C Major triad (I)", play: () => playMajorTriad(60) },
      { label: "D minor triad (ii)", play: () => playMinorTriad(62) },
      { label: "Authentic cadence (V7→I)", play: () => playAuthenticCadence(60) },
    ],
    practice: {
      title: "Practice Assignment",
      body: "Harmonize a simple C major melody using only I, IV, and V. Then add ii and vi for color and compare. End on an authentic cadence.",
    },
    quiz: [
      {
        question: "What quality is the vii° triad in a major key?",
        options: ["Major", "Minor", "Diminished", "Augmented"],
        answerIndex: 2,
      },
      {
        question: "Which progression is the strongest resolution?",
        options: ["IV → V", "V → I", "ii → iii", "vi → IV"],
        answerIndex: 1,
      },
    ],
  },

  counterpoint: {
    id: "counterpoint",
    unit: "Counterpoint IV",
    title: "Invertible Counterpoint",
    subtitle: "Voices that work with their positions exchanged.",
    overview:
      "Invertible counterpoint is the art of writing two or more voices that remain musically correct when their vertical positions are exchanged — the lower voice becomes the upper, and the upper becomes the lower.",
    explanation: [
      "In invertible (or double) counterpoint, two voices are composed so that either may serve as the bass. The most common form is invertible counterpoint at the octave, where the voices are exchanged across a span of an octave or two.",
      "The central constraint is interval transformation. When voices invert at the octave, each interval maps to its complement: a unison becomes an octave, a third becomes a sixth, a fifth becomes a fourth, and so on.",
      "Because the perfect fifth inverts to a perfect fourth — a dissonance in strict counterpoint — fifths on strong beats become hazardous and must be treated carefully.",
      "Invertible counterpoint is the engine of fugal writing: a subject and countersubject conceived this way can be recombined in any voice pairing.",
    ],
    notation: {
      title: "Interval Inversion at the Octave",
      leftLabel: "Original",
      rightLabel: "Inverted",
      rows: [
        { left: "Unison (1)", right: "Octave (8)" },
        { left: "2nd", right: "7th" },
        { left: "3rd", right: "6th" },
        { left: "4th", right: "5th" },
        { left: "5th", right: "4th" },
        { left: "6th", right: "3rd" },
        { left: "7th", right: "2nd" },
      ],
    },
    keyboard: { startMidi: 48, endMidi: 72, caption: "Play the two-voice example and harmonic intervals." },
    audio: [
      { label: "Two-voice motion", play: () => playMelody([60, 64, 62, 65, 64, 67], 120) },
      { label: "3rd → inverts to 6th", play: () => playInterval(60, 4, false) },
      { label: "5th → inverts to 4th", play: () => playInterval(60, 7, false) },
    ],
    practice: {
      title: "Practice Assignment",
      body: "Compose an eight-measure passage in two voices using invertible counterpoint at the octave. Write out the inversion and verify that every harmonic interval resolves correctly.",
    },
    quiz: [
      {
        question: "At the octave, a 3rd inverts to a…",
        options: ["5th", "6th", "7th", "2nd"],
        answerIndex: 1,
      },
      {
        question: "Why are perfect fifths risky in invertible counterpoint at the octave?",
        options: [
          "They invert to a dissonant 4th",
          "They are too consonant",
          "They cannot be played",
          "They invert to an octave",
        ],
        answerIndex: 0,
      },
    ],
  },

  "advanced-harmony": {
    id: "advanced-harmony",
    unit: "Advanced Harmony",
    title: "Modal Interchange & Chromatic Color",
    subtitle: "Borrowing chords from beyond the key.",
    overview:
      "Advanced harmony reaches outside the diatonic palette — borrowing chords from parallel modes and adding chromatic color — without losing tonal direction.",
    explanation: [
      "Modal interchange borrows chords from a parallel mode that shares the same tonic. From C major you can pull iv (Fm), bVII (Bb), or bVI (Ab) from C minor for instant emotional shading.",
      "Extended chords (7ths, 9ths, 11ths, 13ths) and altered dominants add tension and jazz color while still resolving by function.",
      "Chromatic mediants, Neapolitan, and augmented-sixth chords connect distant harmonies through smooth voice leading rather than diatonic function.",
    ],
    notation: {
      title: "Borrowed Chords in C Major",
      leftLabel: "Chord",
      rightLabel: "Borrowed From",
      rows: [
        { left: "iv (Fm)", right: "Parallel minor" },
        { left: "bVII (Bb)", right: "Mixolydian / minor" },
        { left: "bVI (Ab)", right: "Parallel minor" },
        { left: "bII (Db) — Neapolitan", right: "Phrygian color" },
        { left: "Imaj7 → V7alt", right: "Chromatic tension" },
      ],
    },
    keyboard: { startMidi: 48, endMidi: 72, caption: "Hear a borrowed iv resolve and an altered dominant." },
    audio: [
      { label: "Imaj7 (Cmaj7)", play: () => playMajor7(60) },
      { label: "Borrowed iv (Fm)", play: () => playMinorTriad(65) },
      { label: "V7 (G7)", play: () => playDominant7(67) },
    ],
    practice: {
      title: "Practice Assignment",
      body: "Take a I–V–vi–IV loop in C major and replace the IV with a borrowed iv (Fm). Then reharmonize one chord with a bVII. Describe how each change shifts the mood.",
    },
    quiz: [
      {
        question: "The chord iv (Fm) borrowed into C major comes from…",
        options: ["C Lydian", "C parallel minor", "G major", "A minor"],
        answerIndex: 1,
      },
      {
        question: "Which chord is the Neapolitan in C major?",
        options: ["Db (bII)", "Bb (bVII)", "Ab (bVI)", "D (II)"],
        answerIndex: 0,
      },
    ],
  },

  "non-chord-tones": {
    id: "non-chord-tones",
    unit: "Melodic Embellishment",
    title: "Non-Chord Tones",
    subtitle: "The motion and tension between chord tones.",
    overview:
      "Non-chord tones are melody notes that don't belong to the underlying chord. They create motion, tension, and expressive friction before resolving to a chord tone.",
    explanation: [
      "Each non-chord tone is defined by how it is approached and left. A passing tone fills the gap between two chord tones by step; a neighbor tone steps away and returns.",
      "A suspension holds a note from the previous chord into the next, creating a dissonance that resolves down by step — one of the most expressive devices in tonal music.",
      "Appoggiaturas leap in and resolve by step; escape tones step away and leap back; anticipations arrive early. Each colors the line differently.",
    ],
    notation: {
      title: "Non-Chord Tones",
      leftLabel: "Type",
      rightLabel: "Approach → Resolution",
      rows: [
        { left: "Passing tone", right: "Step → step (same direction)" },
        { left: "Neighbor tone", right: "Step away → step back" },
        { left: "Suspension", right: "Prepared → held → resolved down" },
        { left: "Appoggiatura", right: "Leap in → step out" },
        { left: "Escape tone", right: "Step away → leap back" },
        { left: "Anticipation", right: "Arrives before the chord" },
      ],
    },
    keyboard: { startMidi: 60, endMidi: 84, caption: "Hear passing and neighbor tones in motion." },
    audio: [
      { label: "Passing tone (C–D–E)", play: () => playMelody([60, 62, 64], 150) },
      { label: "Neighbor tone (E–F–E)", play: () => playMelody([64, 65, 64], 150) },
      { label: "Suspension resolve", play: () => playMelody([65, 64], 96) },
    ],
    practice: {
      title: "Practice Assignment",
      body: "Over a C major chord, write a melodic phrase that uses a passing tone, a neighbor tone, and a 4–3 suspension. Label each and confirm every dissonance resolves by step.",
    },
    quiz: [
      {
        question: "A suspension resolves by…",
        options: ["Leap up", "Step down", "Step up", "Staying still"],
        answerIndex: 1,
      },
      {
        question: "A passing tone connects two chord tones by…",
        options: ["Leap", "Step in one direction", "Repetition", "Octave displacement"],
        answerIndex: 1,
      },
    ],
  },

  composition: {
    id: "composition",
    unit: "Composition",
    title: "Canon & Fugue",
    subtitle: "Building large structures from small ideas.",
    overview:
      "Composition is the craft of generating and developing material across a whole form. Canon and fugue show how a single idea can sustain an entire piece.",
    explanation: [
      "A canon is strict imitation: one voice states a melody and another follows exactly, after a fixed delay and interval. The challenge is writing a line that harmonizes with a shifted copy of itself.",
      "A fugue opens with a subject, answered in the dominant, accompanied by a countersubject. Episodes built from sequence connect entries in related keys.",
      "Developmental devices — augmentation, diminution, inversion, retrograde, and stretto — transform the subject to sustain interest across the form.",
    ],
    notation: {
      title: "Contrapuntal Devices",
      leftLabel: "Device",
      rightLabel: "Meaning",
      rows: [
        { left: "Canon", right: "Strict imitation after a delay" },
        { left: "Subject / Answer", right: "Theme, then restated in the dominant" },
        { left: "Augmentation", right: "Same theme, longer note values" },
        { left: "Inversion", right: "Intervals turned upside down" },
        { left: "Stretto", right: "Overlapping subject entries" },
      ],
    },
    keyboard: { startMidi: 48, endMidi: 84, caption: "Hear a subject and its answer in the dominant." },
    audio: [
      { label: "Fugue subject", play: () => playMelody([60, 62, 64, 65, 64, 62, 60], 132) },
      { label: "Answer (in the dominant)", play: () => playMelody([67, 69, 71, 72, 71, 69, 67], 132) },
      { label: "Plagal cadence (IV→I)", play: () => playPlagalCadence(60) },
    ],
    practice: {
      title: "Practice Assignment",
      body: "Write a two-bar subject with a clear rhythmic identity, then notate its answer transposed to the dominant. Sketch one episode using sequence.",
    },
    quiz: [
      {
        question: "In a fugue, the answer typically appears in the…",
        options: ["Subdominant", "Dominant", "Relative minor", "Tonic"],
        answerIndex: 1,
      },
      {
        question: "Stretto refers to…",
        options: [
          "Slowing the tempo",
          "Overlapping subject entries",
          "A final cadence",
          "Doubling the bass",
        ],
        answerIndex: 1,
      },
    ],
  },
};

export const theorySectionOrder = [
  "foundations",
  "notation",
  "rhythm",
  "melody",
  "harmony",
  "counterpoint",
  "advanced-harmony",
  "non-chord-tones",
  "composition",
];
