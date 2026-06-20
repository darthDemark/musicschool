// ---------------------------------------------------------------------------
// Theory Academy curriculum content.
//
// Structure: each category contains MULTIPLE subtopics, and every subtopic owns
// a complete lesson — overview, explanation, notation example, keyboard range,
// playable audio examples, practice assignment, and quiz. The Theory page
// renders entirely from the selected category + selected subtopic, so nothing
// is ever locked to a single default lesson.
// ---------------------------------------------------------------------------

import {
  playNote,
  playInterval,
  playChord,
  playMajorTriad,
  playMinorTriad,
  playDominant7,
  playMajor7,
  playMinor7,
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

export interface TheorySubtopic {
  id: string;
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

export interface TheoryCategory {
  id: string;
  /** Category label shown as the eyebrow, e.g. "Counterpoint". */
  unit: string;
  subtopics: TheorySubtopic[];
}

const SCALE = [60, 62, 64, 65, 67, 69, 71, 72];
const PRACTICE = "Practice Assignment";

export const theoryCurriculum: Record<string, TheoryCategory> = {
  // =========================================================================
  foundations: {
    id: "foundations",
    unit: "Foundations",
    subtopics: [
      {
        id: "what-is-music",
        title: "What Is Music?",
        subtitle: "Sound organized in time.",
        overview:
          "Music is the intentional organization of sound and silence across time. Every system that follows — notation, rhythm, harmony — exists to shape those raw elements.",
        explanation: [
          "Sound has measurable properties: pitch (how high or low), duration (how long), intensity (how loud), and timbre (its tone color). Music arranges these deliberately.",
          "Silence is as structural as sound — rests give phrases breath and shape. Organizing sound and silence in time is what separates music from noise.",
        ],
        notation: {
          title: "Elements of Music",
          leftLabel: "Element",
          rightLabel: "Meaning",
          rows: [
            { left: "Pitch", right: "Highness / lowness of a tone" },
            { left: "Duration", right: "How long a sound lasts" },
            { left: "Dynamics", right: "Loudness and softness" },
            { left: "Timbre", right: "Tone color of an instrument" },
            { left: "Form", right: "How sections are organized" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 72, caption: "Play any key to hear a single pitch." },
        audio: [
          { label: "A single pitch", play: () => playNote(60) },
          { label: "Pitches in time (melody)", play: () => playMelody(SCALE, 132) },
          { label: "Pitches together (harmony)", play: () => playMajorTriad(60) },
        ],
        practice: {
          title: PRACTICE,
          body: "Listen to a short piece of music and identify, in writing, one example each of pitch, rhythm, dynamics, and timbre at work.",
        },
        quiz: [
          {
            question: "Which property describes the tone color of an instrument?",
            options: ["Pitch", "Timbre", "Duration", "Dynamics"],
            answerIndex: 1,
          },
          {
            question: "Silence in music functions as…",
            options: ["A mistake", "Structural — it shapes phrases", "Always optional", "Only an ending"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "staff-clefs",
        title: "The Staff & Clefs",
        subtitle: "Fixing pitch to the page.",
        overview:
          "The staff — five lines and four spaces — and its clefs anchor every written pitch. Reading them fluently is the prerequisite for everything that follows.",
        explanation: [
          "The treble (G) clef circles the second line, fixing it as G4; the bass (F) clef's two dots surround the fourth line, fixing it as F3.",
          "Ledger lines extend the staff beyond its range. Middle C (C4) sits one ledger line below the treble staff and one above the bass staff — the hinge between the two clefs.",
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
          { label: "F3 (bass landmark)", play: () => playNote(53) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write the pitch name for each note in a one-octave treble passage, then locate Middle C in both clefs.",
        },
        quiz: [
          {
            question: "Which line does the treble clef circle?",
            options: ["First line (E4)", "Second line (G4)", "Middle line (B4)", "Fourth line (D5)"],
            answerIndex: 1,
          },
          {
            question: "Middle C is notated…",
            options: ["On the middle staff line", "One ledger line below treble", "Two ledger lines above bass", "It cannot be written"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "note-values",
        title: "Note Values",
        subtitle: "Encoding duration.",
        overview:
          "Note values are proportional symbols for duration. The time signature tells you how many of which value fill a measure.",
        explanation: [
          "A whole note equals two half notes, a half equals two quarters, a quarter equals two eighths, and so on down the rhythmic tree.",
          "A dot after a note adds half of its value again; ties join two values into one sustained sound across a barline.",
        ],
        notation: {
          title: "Note Values (in 4/4)",
          leftLabel: "Note",
          rightLabel: "Duration",
          rows: [
            { left: "Whole note", right: "4 beats" },
            { left: "Half note", right: "2 beats" },
            { left: "Quarter note", right: "1 beat" },
            { left: "Eighth note", right: "½ beat" },
            { left: "Sixteenth note", right: "¼ beat" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 72, caption: "Play one pitch in different rhythmic values." },
        audio: [
          { label: "Quarter notes", play: () => playMelody([60, 60, 60, 60], 100) },
          { label: "Eighth notes", play: () => playMelody([60, 60, 60, 60, 60, 60, 60, 60], 120) },
          { label: "Half notes", play: () => playMelody([60, 60], 60) },
        ],
        practice: {
          title: PRACTICE,
          body: "Notate a two-measure rhythm in 4/4 using whole, half, quarter, and eighth notes that totals correctly in each bar.",
        },
        quiz: [
          {
            question: "How many eighth notes fill one 4/4 measure?",
            options: ["4", "6", "8", "16"],
            answerIndex: 2,
          },
          {
            question: "A dot after a note adds…",
            options: ["A full beat", "Half the note's value again", "Double the value", "Nothing"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "key-signatures",
        title: "Key Signatures",
        subtitle: "Sharps and flats that define a key.",
        overview:
          "A key signature places sharps or flats at the start of the staff so those alterations apply throughout, defining the home key.",
        explanation: [
          "Sharps are added in the order F–C–G–D–A–E–B; flats in the reverse. The circle of fifths organizes how keys relate by one accidental at a time.",
          "Each major key signature is shared with its relative minor (a minor third below), so the same accidentals can mean two keys.",
        ],
        notation: {
          title: "Major Key Signatures",
          leftLabel: "Key",
          rightLabel: "Accidentals",
          rows: [
            { left: "C major", right: "None" },
            { left: "G major", right: "1 sharp (F#)" },
            { left: "D major", right: "2 sharps (F#, C#)" },
            { left: "F major", right: "1 flat (Bb)" },
            { left: "Bb major", right: "2 flats (Bb, Eb)" },
          ],
        },
        keyboard: { startMidi: 55, endMidi: 79, caption: "Compare C major and G major scales." },
        audio: [
          { label: "C major scale", play: () => playMelody(SCALE, 144) },
          { label: "G major scale", play: () => playMelody([67, 69, 71, 72, 74, 76, 78, 79], 144) },
          { label: "F major scale", play: () => playMelody([65, 67, 69, 70, 72, 74, 76, 77], 144) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write the key signatures for C, G, D, and F major, then name the relative minor of each.",
        },
        quiz: [
          {
            question: "In what order are sharps added to a key signature?",
            options: ["B-E-A-D-G-C-F", "F-C-G-D-A-E-B", "C-D-E-F-G-A-B", "A-B-C-D-E-F-G"],
            answerIndex: 1,
          },
          {
            question: "G major has how many sharps?",
            options: ["None", "One", "Two", "Three"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "dynamics",
        title: "Dynamics",
        subtitle: "The volume of expression.",
        overview:
          "Dynamics notate loudness and softness, and the gradual changes between them — a primary tool of musical expression.",
        explanation: [
          "Static markings run from pp (very soft) through mf to ff (very loud). Gradual changes are crescendo (growing) and diminuendo/decrescendo (fading).",
          "Dynamics shape phrasing and drama: the same notes feel entirely different played softly versus at full force.",
        ],
        notation: {
          title: "Dynamic Markings",
          leftLabel: "Marking",
          rightLabel: "Meaning",
          rows: [
            { left: "pp", right: "Pianissimo — very soft" },
            { left: "p", right: "Piano — soft" },
            { left: "mf", right: "Mezzo-forte — medium loud" },
            { left: "f", right: "Forte — loud" },
            { left: "ff", right: "Fortissimo — very loud" },
            { left: "cresc. / dim.", right: "Gradually louder / softer" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 72, caption: "Imagine the phrase below growing from soft to loud." },
        audio: [
          { label: "Rising phrase (crescendo idea)", play: () => playMelody([60, 64, 67, 72], 120) },
          { label: "Falling phrase (diminuendo idea)", play: () => playMelody([72, 67, 64, 60], 120) },
        ],
        practice: {
          title: PRACTICE,
          body: "Take an eight-note phrase and mark a dynamic shape: where does it grow, where does it fade, and where is its loudest point?",
        },
        quiz: [
          {
            question: "Which marking is the softest?",
            options: ["mf", "p", "pp", "f"],
            answerIndex: 2,
          },
          {
            question: "A crescendo means…",
            options: ["Gradually softer", "Gradually louder", "Suddenly loud", "Hold the note"],
            answerIndex: 1,
          },
        ],
      },
    ],
  },

  // =========================================================================
  notation: {
    id: "notation",
    unit: "Notation",
    subtopics: [
      {
        id: "pitch-notation",
        title: "Pitch Notation",
        subtitle: "Writing the vertical dimension.",
        overview:
          "Pitch notation places noteheads on lines and spaces to fix exact frequencies, refined by accidentals.",
        explanation: [
          "A notehead's vertical position names its pitch; moving up a line-and-space ascends by step through the musical alphabet A–G.",
          "Accidentals — sharp, flat, natural — raise or lower a pitch by a half step and last for the remainder of the measure.",
        ],
        notation: {
          title: "Accidentals",
          leftLabel: "Symbol",
          rightLabel: "Effect",
          rows: [
            { left: "Sharp (♯)", right: "Raise a half step" },
            { left: "Flat (♭)", right: "Lower a half step" },
            { left: "Natural (♮)", right: "Cancel an accidental" },
            { left: "Double sharp (𝄪)", right: "Raise a whole step" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 72, caption: "Play C, then C# a half step higher." },
        audio: [
          { label: "C natural", play: () => playNote(60) },
          { label: "C sharp (half step up)", play: () => playNote(61) },
          { label: "Chromatic steps", play: () => playMelody([60, 61, 62, 63, 64], 150) },
        ],
        practice: {
          title: PRACTICE,
          body: "Notate the chromatic scale from C to C using sharps ascending and flats descending.",
        },
        quiz: [
          {
            question: "A natural sign (♮)…",
            options: ["Raises a whole step", "Cancels a prior accidental", "Lowers two half steps", "Repeats a note"],
            answerIndex: 1,
          },
          {
            question: "How far apart are C and C#?",
            options: ["A whole step", "A half step", "A third", "An octave"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "rhythmic-notation",
        title: "Rhythmic Notation",
        subtitle: "Writing the horizontal dimension.",
        overview:
          "Rhythmic notation encodes duration with note values, beams, dots, ties, and rests within a metric grid.",
        explanation: [
          "Beams group subdivisions to clarify the beat; dots extend a value by half; ties sustain across barlines.",
          "Rests mirror note values exactly, notating measured silence so the rhythmic grid stays complete.",
        ],
        notation: {
          title: "Rests and Values",
          leftLabel: "Rest",
          rightLabel: "Equals",
          rows: [
            { left: "Whole rest", right: "4 beats of silence" },
            { left: "Half rest", right: "2 beats" },
            { left: "Quarter rest", right: "1 beat" },
            { left: "Eighth rest", right: "½ beat" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 72, caption: "Tap the rhythm patterns below." },
        audio: [
          { label: "Steady eighths", play: () => playRhythm([true, true, true, true, true, true, true, true], 112) },
          { label: "With a rest", play: () => playRhythm([true, false, true, true, false, true, true, false], 112) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write a one-bar rhythm in 4/4 that uses at least one rest and one tie, and clap it accurately.",
        },
        quiz: [
          {
            question: "Beaming eighth notes primarily helps to…",
            options: ["Make them louder", "Clarify the beat groupings", "Change their pitch", "Add a rest"],
            answerIndex: 1,
          },
          {
            question: "A rest represents…",
            options: ["A wrong note", "Measured silence", "A repeat", "A dynamic"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "articulations",
        title: "Articulations",
        subtitle: "How a note is attacked and released.",
        overview:
          "Articulations instruct how to play a note — short, smooth, accented — adding character beyond pitch and rhythm.",
        explanation: [
          "Staccato shortens and detaches; legato connects notes smoothly; accents emphasize; tenuto sustains the full value with slight weight.",
          "Slurs indicate legato phrasing across several notes, while a marcato marks a strong, marked attack.",
        ],
        notation: {
          title: "Common Articulations",
          leftLabel: "Marking",
          rightLabel: "Meaning",
          rows: [
            { left: "Staccato (dot)", right: "Short, detached" },
            { left: "Legato (slur)", right: "Smooth, connected" },
            { left: "Accent (>)", right: "Emphasized attack" },
            { left: "Tenuto (—)", right: "Held full value" },
            { left: "Marcato (^)", right: "Strongly marked" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 72, caption: "Compare short detached vs. smooth connected playing." },
        audio: [
          { label: "Detached (short)", play: () => playMelody([60, 64, 67, 72], 160) },
          { label: "Connected (smooth)", play: () => playMelody([60, 62, 64, 65, 67], 100) },
        ],
        practice: {
          title: PRACTICE,
          body: "Take a four-note motif and write it twice — once staccato, once legato — and describe how each changes its character.",
        },
        quiz: [
          {
            question: "Staccato means…",
            options: ["Smooth and connected", "Short and detached", "Very loud", "Held longer"],
            answerIndex: 1,
          },
          {
            question: "A slur indicates…",
            options: ["Accent each note", "Legato phrasing", "Staccato", "A rest"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "score-reading",
        title: "Score Reading",
        subtitle: "Following multiple parts at once.",
        overview:
          "Score reading is the skill of tracking several staves simultaneously, understanding how parts align vertically and move horizontally.",
        explanation: [
          "In a full score, parts are stacked by family (woodwinds, brass, strings) and read down a vertical slice for the sounding harmony at any instant.",
          "Transposing instruments sound at a different pitch than written; experienced readers compensate mentally to hear the true concert pitch.",
        ],
        notation: {
          title: "Reading a Vertical Slice",
          leftLabel: "Voice",
          rightLabel: "Role",
          rows: [
            { left: "Top staff", right: "Melody / lead" },
            { left: "Inner staves", right: "Harmony / inner voices" },
            { left: "Bottom staff", right: "Bass / foundation" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Hear three stacked voices as one chord." },
        audio: [
          { label: "Three-voice chord", play: () => playChord([48, 60, 64]) },
          { label: "Bass then full chord", play: () => playMelody([48, 60, 64, 67], 100) },
        ],
        practice: {
          title: PRACTICE,
          body: "Take a short four-part chorale and, reading a single vertical slice, name the chord sounding on each beat of one measure.",
        },
        quiz: [
          {
            question: "Reading a score vertically reveals…",
            options: ["The tempo", "The harmony sounding at that instant", "The dynamics only", "The key signature"],
            answerIndex: 1,
          },
          {
            question: "A transposing instrument…",
            options: ["Always sounds as written", "Sounds at a different pitch than written", "Cannot read music", "Has no clef"],
            answerIndex: 1,
          },
        ],
      },
    ],
  },

  // =========================================================================
  rhythm: {
    id: "rhythm",
    unit: "Rhythm",
    subtopics: [
      {
        id: "meter",
        title: "Meter",
        subtitle: "Organizing pulse into measures.",
        overview:
          "Meter groups the steady pulse into recurring patterns of strong and weak beats, named by the time signature.",
        explanation: [
          "The top number counts beats per measure; the bottom number names the beat unit. 4/4 has four quarter-note beats.",
          "Simple meters divide the beat into two; compound meters (6/8, 9/8) divide it into three.",
        ],
        notation: {
          title: "Common Meters",
          leftLabel: "Time Signature",
          rightLabel: "Feel",
          rows: [
            { left: "4/4", right: "Common time" },
            { left: "3/4", right: "Waltz" },
            { left: "2/4", right: "March" },
            { left: "6/8", right: "Compound duple" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 72, caption: "Feel the strong beat in each meter." },
        audio: [
          { label: "4/4 pulse", play: () => playRhythm([true, true, true, true], 110) },
          { label: "3/4 waltz", play: () => playRhythm([true, false, false], 120) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write a four-beat pattern in 4/4 and the same idea adapted to 3/4. Note where the strong beat falls in each.",
        },
        quiz: [
          {
            question: "In a time signature, the bottom number indicates…",
            options: ["Beats per measure", "The beat unit (note value)", "The tempo", "The key"],
            answerIndex: 1,
          },
          {
            question: "3/4 is most associated with…",
            options: ["A march", "A waltz", "A shuffle", "A backbeat"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "subdivision",
        title: "Subdivision",
        subtitle: "Dividing the beat.",
        overview:
          "Subdivision splits each beat into smaller equal parts — the internal grid that keeps rhythm precise and gives it momentum.",
        explanation: [
          "Eighths divide the beat in two, triplets in three, sixteenths in four. Feeling the subdivision internally is the key to steady, expressive time.",
          "Switching subdivision (straight eighths vs. triplet feel) transforms the groove without changing the tempo.",
        ],
        notation: {
          title: "Subdivisions of One Beat",
          leftLabel: "Division",
          rightLabel: "Count",
          rows: [
            { left: "Eighths", right: "1 & 2 &" },
            { left: "Triplets", right: "1 trip-let" },
            { left: "Sixteenths", right: "1 e & a" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 72, caption: "Hear the beat divided different ways." },
        audio: [
          { label: "Eighth-note feel", play: () => playRhythm([true, true, true, true, true, true, true, true], 100) },
          { label: "Triplet feel", play: () => playRhythm([true, true, true, true, true, true], 90) },
        ],
        practice: {
          title: PRACTICE,
          body: "Tap a steady quarter pulse with one hand while subdividing into eighths, then triplets, then sixteenths with the other.",
        },
        quiz: [
          {
            question: "A triplet divides the beat into…",
            options: ["Two equal parts", "Three equal parts", "Four equal parts", "Six equal parts"],
            answerIndex: 1,
          },
          {
            question: "Internalizing subdivision helps you…",
            options: ["Play faster only", "Keep precise, steady time", "Change the key", "Read pitch"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "syncopation",
        title: "Syncopation",
        subtitle: "Accenting the unexpected.",
        overview:
          "Syncopation places emphasis on weak beats or offbeats, pulling against the meter to create drive and groove.",
        explanation: [
          "By stressing the 'and' of a beat or tying across a strong beat, syncopation creates rhythmic tension that the ear wants resolved.",
          "It is central to funk, jazz, Latin, and pop grooves — the engine of music that makes you move.",
        ],
        notation: {
          title: "On-beat vs. Syncopated",
          leftLabel: "Pattern",
          rightLabel: "Emphasis",
          rows: [
            { left: "On-beat", right: "1 - 2 - 3 - 4" },
            { left: "Backbeat", right: "2 and 4" },
            { left: "Offbeat", right: "the '&' between beats" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 72, caption: "Feel the pull of the offbeat accents." },
        audio: [
          { label: "Straight (on-beat)", play: () => playRhythm([true, true, true, true], 100) },
          { label: "Syncopated offbeats", play: () => playRhythm([true, false, true, true, false, true, true, false], 108) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write a one-bar rhythm that places its strongest accent on an offbeat. Perform it against a steady quarter-note count.",
        },
        quiz: [
          {
            question: "Syncopation emphasizes…",
            options: ["The downbeat", "Weak beats or offbeats", "The tonic chord", "The last measure"],
            answerIndex: 1,
          },
          {
            question: "The 'backbeat' falls on beats…",
            options: ["1 and 3", "2 and 4", "1 only", "All four"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "polyrhythm",
        title: "Polyrhythm",
        subtitle: "Two rhythms at once.",
        overview:
          "Polyrhythm layers two or more conflicting subdivisions simultaneously — most famously three against two — for rhythmic depth.",
        explanation: [
          "In a 3:2 polyrhythm, one voice plays three even notes while another plays two in the same span; the parts align only at the start of the cycle.",
          "Polyrhythms are foundational in West African, Latin, and progressive music, creating a shimmering, interlocking texture.",
        ],
        notation: {
          title: "3 Against 2",
          leftLabel: "Voice",
          rightLabel: "Notes per cycle",
          rows: [
            { left: "Voice A", right: "3 even notes" },
            { left: "Voice B", right: "2 even notes" },
            { left: "Align", right: "Only on beat 1" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 72, caption: "Hear the two layers interlock." },
        audio: [
          { label: "Three (high)", play: () => playMelody([72, 72, 72], 180) },
          { label: "Two (low)", play: () => playMelody([48, 48], 120) },
        ],
        practice: {
          title: PRACTICE,
          body: "Practice a 3:2 polyrhythm by tapping three with one hand and two with the other; speak the composite 'pass-the-bread-and-but-ter' phrase.",
        },
        quiz: [
          {
            question: "In a 3:2 polyrhythm, the parts align…",
            options: ["On every beat", "Only at the start of each cycle", "Never", "On the offbeats"],
            answerIndex: 1,
          },
          {
            question: "Polyrhythm means…",
            options: ["One rhythm repeated", "Two+ conflicting subdivisions at once", "No rhythm", "A fast tempo"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "groove",
        title: "Groove",
        subtitle: "The feel that makes it move.",
        overview:
          "Groove is the cumulative feel of a rhythm section — the interplay of placement, accent, and micro-timing that makes music compelling.",
        explanation: [
          "Groove lives in the small choices: laying back behind the beat, pushing ahead, and how the drums, bass, and rhythm parts lock together.",
          "A great groove is repetitive yet alive — consistent enough to trust, human enough to breathe.",
        ],
        notation: {
          title: "Elements of Groove",
          leftLabel: "Element",
          rightLabel: "Role",
          rows: [
            { left: "Kick", right: "Anchors the downbeats" },
            { left: "Snare", right: "Defines the backbeat" },
            { left: "Hi-hat", right: "Keeps the subdivision" },
            { left: "Bass", right: "Locks pitch to rhythm" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 60, caption: "Hear a simple bass groove." },
        audio: [
          { label: "Backbeat groove", play: () => playRhythm([true, false, true, false, true, false, true, false], 96) },
          { label: "Bass line", play: () => playMelody([48, 48, 55, 53], 96) },
        ],
        practice: {
          title: PRACTICE,
          body: "Build a one-bar groove: place a kick on 1 and 3, a snare on 2 and 4, and steady hi-hats. Then try laying the snare slightly back.",
        },
        quiz: [
          {
            question: "The backbeat is usually carried by the…",
            options: ["Kick drum", "Snare drum", "Hi-hat", "Bass"],
            answerIndex: 1,
          },
          {
            question: "Great groove balances…",
            options: ["Randomness and silence", "Repetition and human feel", "Speed and volume", "Pitch and key"],
            answerIndex: 1,
          },
        ],
      },
    ],
  },

  // =========================================================================
  melody: {
    id: "melody",
    unit: "Melody",
    subtopics: [
      {
        id: "scales",
        title: "Scales",
        subtitle: "The note pool of a melody.",
        overview:
          "A scale is an ordered set of pitches that supplies the raw material for melody and harmony in a key.",
        explanation: [
          "The major scale follows W–W–H–W–W–W–H. The natural minor lowers the 3rd, 6th, and 7th degrees, giving a darker color.",
          "Modes are rotations of the major scale, each starting on a different degree to yield a distinct flavor (Dorian, Mixolydian, etc.).",
        ],
        notation: {
          title: "Scale Step Patterns",
          leftLabel: "Scale",
          rightLabel: "Steps",
          rows: [
            { left: "Major", right: "W-W-H-W-W-W-H" },
            { left: "Natural minor", right: "W-H-W-W-H-W-W" },
            { left: "Dorian", right: "W-H-W-W-W-H-W" },
            { left: "Mixolydian", right: "W-W-H-W-W-H-W" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 84, caption: "Play the major and minor scales." },
        audio: [
          { label: "C major scale", play: () => playMelody(SCALE, 144) },
          { label: "C natural minor", play: () => playMelody([60, 62, 63, 65, 67, 68, 70, 72], 144) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write and play a C major scale, then a C natural minor scale. Note exactly which three degrees changed.",
        },
        quiz: [
          {
            question: "The major scale step pattern is…",
            options: ["W-H-W-W-H-W-W", "W-W-H-W-W-W-H", "H-W-W-H-W-W-W", "W-W-W-H-W-W-H"],
            answerIndex: 1,
          },
          {
            question: "Natural minor differs from major by lowering which degrees?",
            options: ["2, 4, 6", "3, 6, 7", "1, 4, 5", "2, 5, 7"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "intervals",
        title: "Intervals",
        subtitle: "The distance between two notes.",
        overview:
          "An interval is the distance between two pitches, measured in half steps and named by size and quality.",
        explanation: [
          "Qualities include major, minor, perfect, augmented, and diminished. Perfect applies to unisons, fourths, fifths, and octaves.",
          "Intervals carry emotional weight: the bright major third, the open perfect fifth, the tense tritone.",
        ],
        notation: {
          title: "Intervals from C",
          leftLabel: "Interval",
          rightLabel: "Half Steps",
          rows: [
            { left: "Minor 2nd", right: "1" },
            { left: "Major 3rd", right: "4" },
            { left: "Perfect 4th", right: "5" },
            { left: "Tritone", right: "6" },
            { left: "Perfect 5th", right: "7" },
            { left: "Octave", right: "12" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 84, caption: "Play the intervals below from C." },
        audio: [
          { label: "Major 3rd (C–E)", play: () => playInterval(60, 4) },
          { label: "Perfect 5th (C–G)", play: () => playInterval(60, 7) },
          { label: "Tritone (C–F#)", play: () => playInterval(60, 6) },
        ],
        practice: {
          title: PRACTICE,
          body: "Play and label four intervals above C: a major third, perfect fourth, perfect fifth, and octave.",
        },
        quiz: [
          {
            question: "How many half steps are in a perfect fifth?",
            options: ["5", "6", "7", "8"],
            answerIndex: 2,
          },
          {
            question: "The tritone spans how many half steps?",
            options: ["5", "6", "7", "4"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "contour",
        title: "Contour",
        subtitle: "The shape of a line.",
        overview:
          "Melodic contour is the overall shape of rises and falls — the silhouette that the ear remembers even more than exact pitches.",
        explanation: [
          "Arch shapes rise to a peak and fall; ascending lines build energy; descending lines release it. A single well-placed climax gives a melody focus.",
          "Mixing steps (conjunct motion) with occasional leaps (disjunct motion) keeps a line both singable and interesting.",
        ],
        notation: {
          title: "Contour Types",
          leftLabel: "Shape",
          rightLabel: "Effect",
          rows: [
            { left: "Ascending", right: "Building, hopeful" },
            { left: "Descending", right: "Relaxing, resolving" },
            { left: "Arch", right: "Tension then release" },
            { left: "Wave", right: "Continuous motion" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 84, caption: "Hear an ascending line vs. an arch." },
        audio: [
          { label: "Ascending line", play: () => playMelody([60, 62, 64, 67, 72], 132) },
          { label: "Arch shape", play: () => playMelody([60, 64, 67, 72, 67, 64, 60], 132) },
        ],
        practice: {
          title: PRACTICE,
          body: "Sketch a melody as a single contour line (no exact pitches), placing one clear high point, then realize it in C major.",
        },
        quiz: [
          {
            question: "A melodic climax is most effective when it…",
            options: ["Happens many times", "Appears once, clearly placed", "Is the lowest note", "Is avoided"],
            answerIndex: 1,
          },
          {
            question: "Conjunct motion means moving by…",
            options: ["Leaps", "Steps", "Octaves", "Rests"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "motif-development",
        title: "Motif Development",
        subtitle: "Growing a melody from a seed.",
        overview:
          "A motif is a short, memorable musical idea; development transforms it through repetition and variation to build a whole melody.",
        explanation: [
          "Core techniques: repetition, sequence (the motif moved to a new pitch level), inversion (flipped), augmentation/diminution (stretched/compressed), and fragmentation.",
          "Strong melodies state a motif, vary it just enough to stay fresh, and return to it for unity.",
        ],
        notation: {
          title: "Development Techniques",
          leftLabel: "Technique",
          rightLabel: "What It Does",
          rows: [
            { left: "Sequence", right: "Repeat at a new pitch level" },
            { left: "Inversion", right: "Flip the intervals" },
            { left: "Augmentation", right: "Longer note values" },
            { left: "Fragmentation", right: "Use only part of the motif" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 84, caption: "Hear a motif and a sequence of it." },
        audio: [
          { label: "Motif", play: () => playMelody([60, 62, 64], 140) },
          { label: "Sequenced up a step", play: () => playMelody([62, 64, 65], 140) },
          { label: "Inverted", play: () => playMelody([64, 62, 60], 140) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write a three-note motif, then develop it with one sequence and one inversion to build a four-bar phrase.",
        },
        quiz: [
          {
            question: "A sequence repeats a motif…",
            options: ["At the same pitch", "At a new pitch level", "Backwards", "Slower"],
            answerIndex: 1,
          },
          {
            question: "Inversion of a motif means…",
            options: ["Playing it louder", "Flipping its intervals upside down", "Removing notes", "Playing it twice"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "phrasing",
        title: "Phrasing",
        subtitle: "Musical punctuation.",
        overview:
          "Phrasing groups notes into coherent units — musical sentences — with points of tension (antecedent) and resolution (consequent).",
        explanation: [
          "A typical period pairs an antecedent phrase that ends open (on a half cadence) with a consequent that answers and closes (authentic cadence).",
          "Breath, contour, and harmonic rhythm all signal phrase boundaries; great phrasing makes a melody feel like speech.",
        ],
        notation: {
          title: "The Period",
          leftLabel: "Phrase",
          rightLabel: "Ending",
          rows: [
            { left: "Antecedent", right: "Open — half cadence (on V)" },
            { left: "Consequent", right: "Closed — authentic cadence (V→I)" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 84, caption: "Hear a question phrase answered by a closing phrase." },
        audio: [
          { label: "Antecedent (question)", play: () => playMelody([60, 64, 67, 69], 120) },
          { label: "Consequent (answer)", play: () => playMelody([67, 64, 62, 60], 120) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write an eight-bar period: a four-bar antecedent ending on V, answered by a four-bar consequent ending on I.",
        },
        quiz: [
          {
            question: "An antecedent phrase typically ends…",
            options: ["Closed on I", "Open on a half cadence", "On a rest", "On the tritone"],
            answerIndex: 1,
          },
          {
            question: "A period is made of…",
            options: ["One phrase", "An antecedent + consequent pair", "Three phrases", "Only cadences"],
            answerIndex: 1,
          },
        ],
      },
    ],
  },

  // =========================================================================
  harmony: {
    id: "harmony",
    unit: "Harmony",
    subtopics: [
      {
        id: "triads",
        title: "Triads",
        subtitle: "Three notes stacked in thirds.",
        overview:
          "A triad is the basic chord: a root, a third, and a fifth. Its quality depends on the size of those thirds.",
        explanation: [
          "Major triad = major third + minor third; minor triad = minor third + major third; diminished = two minor thirds; augmented = two major thirds.",
          "Inversions place the third or fifth in the bass, changing the chord's color and voice-leading options.",
        ],
        notation: {
          title: "Triad Qualities (root C)",
          leftLabel: "Triad",
          rightLabel: "Notes",
          rows: [
            { left: "Major", right: "C – E – G" },
            { left: "Minor", right: "C – E♭ – G" },
            { left: "Diminished", right: "C – E♭ – G♭" },
            { left: "Augmented", right: "C – E – G♯" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Compare major and minor triads." },
        audio: [
          { label: "C major triad", play: () => playMajorTriad(60) },
          { label: "C minor triad", play: () => playMinorTriad(60) },
        ],
        practice: {
          title: PRACTICE,
          body: "Build and play all four triad qualities on the root C, then identify each by ear.",
        },
        quiz: [
          {
            question: "A major triad is built from…",
            options: ["Two minor thirds", "Major third + minor third", "Two major thirds", "A third + a fourth"],
            answerIndex: 1,
          },
          {
            question: "A diminished triad contains…",
            options: ["Two major thirds", "Two minor thirds", "A perfect fifth", "An augmented fifth"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "diatonic-harmony",
        title: "Diatonic Harmony",
        subtitle: "The chords of a key and their function.",
        overview:
          "Diatonic harmony uses the seven triads built on each scale degree, grouped into tonic, subdominant, and dominant functions.",
        explanation: [
          "In a major key: I, IV, V are major; ii, iii, vi are minor; vii° is diminished. Roman numerals show degree and quality.",
          "Functions drive motion: tonic (I, vi) is home, subdominant (ii, IV) departs, dominant (V, vii°) creates tension that resolves to I.",
        ],
        notation: {
          title: "Diatonic Triads in C Major",
          leftLabel: "Degree",
          rightLabel: "Quality",
          rows: [
            { left: "I (C)", right: "Major — tonic" },
            { left: "ii (Dm)", right: "minor — subdominant" },
            { left: "IV (F)", right: "Major — subdominant" },
            { left: "V (G)", right: "Major — dominant" },
            { left: "vi (Am)", right: "minor — tonic substitute" },
            { left: "vii° (B)", right: "diminished — dominant" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Play I, IV, V, and a cadence." },
        audio: [
          { label: "I (C major)", play: () => playMajorTriad(60) },
          { label: "IV (F major)", play: () => playMajorTriad(65) },
          { label: "Authentic cadence (V7→I)", play: () => playAuthenticCadence(60) },
        ],
        practice: {
          title: PRACTICE,
          body: "Harmonize a simple C major melody using only I, IV, and V, ending on an authentic cadence.",
        },
        quiz: [
          {
            question: "Which function creates tension that resolves to I?",
            options: ["Tonic", "Subdominant", "Dominant", "Mediant"],
            answerIndex: 2,
          },
          {
            question: "The ii chord in C major is…",
            options: ["D major", "D minor", "D diminished", "D augmented"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "secondary-dominants",
        title: "Secondary Dominants",
        subtitle: "Borrowing a dominant for another chord.",
        overview:
          "A secondary dominant is a dominant 7th chord that tonicizes a chord other than the tonic, written V7/x.",
        explanation: [
          "To build V7/V in C major, find the dominant of G (the V chord): that's D7, which resolves to G.",
          "Secondary dominants add forward momentum and brief tonicizations without changing the overall key.",
        ],
        notation: {
          title: "Secondary Dominants in C",
          leftLabel: "Symbol",
          rightLabel: "Chord → Target",
          rows: [
            { left: "V7/V", right: "D7 → G" },
            { left: "V7/ii", right: "A7 → Dm" },
            { left: "V7/vi", right: "E7 → Am" },
            { left: "V7/IV", right: "C7 → F" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Hear D7 pull toward G." },
        audio: [
          { label: "V7/V (D7)", play: () => playDominant7(62) },
          { label: "Resolves to V (G)", play: () => playMajorTriad(67) },
        ],
        practice: {
          title: PRACTICE,
          body: "In C major, insert a V7/V (D7) before the V chord in a I–V–I progression and describe the added pull.",
        },
        quiz: [
          {
            question: "V7/V in C major is which chord?",
            options: ["G7", "D7", "A7", "C7"],
            answerIndex: 1,
          },
          {
            question: "A secondary dominant resolves to…",
            options: ["The tonic only", "The chord it tonicizes", "Any chord", "A rest"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "modulation",
        title: "Modulation",
        subtitle: "Changing key within a piece.",
        overview:
          "Modulation moves the tonal center from one key to another, refreshing the harmony and reshaping the emotional landscape.",
        explanation: [
          "A pivot-chord modulation uses a chord common to both keys as a hinge, reinterpreting its function before confirming the new key with a cadence.",
          "Closely related keys (differing by one accidental) modulate smoothly; distant keys create more dramatic shifts.",
        ],
        notation: {
          title: "Pivot from C to G major",
          leftLabel: "Chord",
          rightLabel: "Function",
          rows: [
            { left: "C (I)", right: "Tonic in C" },
            { left: "Am (vi = ii in G)", right: "Pivot chord" },
            { left: "D7 (V in G)", right: "New dominant" },
            { left: "G (I in G)", right: "New tonic" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Hear the move from C toward G." },
        audio: [
          { label: "C major (old tonic)", play: () => playMajorTriad(60) },
          { label: "D7 (new dominant)", play: () => playDominant7(62) },
          { label: "G major (new tonic)", play: () => playMajorTriad(67) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write a short progression that modulates from C major to G major using Am as a pivot chord, confirmed by a cadence in G.",
        },
        quiz: [
          {
            question: "A pivot chord is one that…",
            options: ["Belongs to both keys", "Is dissonant", "Is always the tonic", "Cannot be inverted"],
            answerIndex: 0,
          },
          {
            question: "Closely related keys differ by…",
            options: ["No accidentals", "One accidental", "A tritone", "An octave"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "voice-leading",
        title: "Voice Leading",
        subtitle: "Smooth motion between chords.",
        overview:
          "Voice leading governs how individual voices move from chord to chord — favoring smooth, independent lines.",
        explanation: [
          "Keep common tones, move other voices by the smallest interval, and resolve tendency tones (like the leading tone up to the tonic).",
          "Avoid parallel fifths and octaves, which collapse the independence of two voices.",
        ],
        notation: {
          title: "Voice-Leading Principles",
          leftLabel: "Principle",
          rightLabel: "Why",
          rows: [
            { left: "Keep common tones", right: "Smoothness" },
            { left: "Move by step where possible", right: "Independence" },
            { left: "Resolve the leading tone", right: "Tonal pull" },
            { left: "Avoid parallel 5ths/8ves", right: "Voice independence" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Hear a smoothly voice-led cadence." },
        audio: [
          { label: "V7 → I (smooth)", play: () => playAuthenticCadence(60) },
          { label: "IV → I (plagal)", play: () => playPlagalCadence(60) },
        ],
        practice: {
          title: PRACTICE,
          body: "Connect a V7 chord to I in four voices, keeping common tones and resolving the leading tone up by step.",
        },
        quiz: [
          {
            question: "Good voice leading avoids…",
            options: ["Common tones", "Parallel fifths and octaves", "Stepwise motion", "Resolving tendency tones"],
            answerIndex: 1,
          },
          {
            question: "The leading tone usually resolves…",
            options: ["Down a third", "Up by step to the tonic", "Down by step", "By leap"],
            answerIndex: 1,
          },
        ],
      },
    ],
  },

  // =========================================================================
  counterpoint: {
    id: "counterpoint",
    unit: "Counterpoint",
    subtopics: [
      {
        id: "species-counterpoint",
        title: "Species Counterpoint",
        subtitle: "Learning voice independence step by step.",
        overview:
          "Species counterpoint is a graded system (first through fifth species) for learning to combine independent melodic lines against a fixed cantus firmus.",
        explanation: [
          "First species sets note-against-note (1:1); later species add more notes per measure, then suspensions, then florid mixtures.",
          "The rules — consonance on strong beats, controlled dissonance, mostly stepwise motion, no parallel perfect intervals — train clean voice leading.",
        ],
        notation: {
          title: "The Five Species",
          leftLabel: "Species",
          rightLabel: "Ratio",
          rows: [
            { left: "First", right: "1 : 1 (note against note)" },
            { left: "Second", right: "2 : 1" },
            { left: "Third", right: "4 : 1" },
            { left: "Fourth", right: "Suspensions" },
            { left: "Fifth", right: "Florid (mixed)" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Hear a cantus firmus with a first-species line." },
        audio: [
          { label: "Cantus firmus", play: () => playMelody([60, 62, 64, 62, 60], 84) },
          { label: "Counterpoint above", play: () => playMelody([67, 67, 69, 67, 64], 84) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write a first-species line above a five-note cantus firmus in C, using only consonances and mostly stepwise motion.",
        },
        quiz: [
          {
            question: "First species counterpoint sets…",
            options: ["Two notes per beat", "Note against note", "Only suspensions", "Florid lines"],
            answerIndex: 1,
          },
          {
            question: "Fourth species introduces…",
            options: ["Parallel fifths", "Suspensions", "Polyrhythm", "Modulation"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "free-counterpoint",
        title: "Free Counterpoint",
        subtitle: "Independent lines beyond strict rules.",
        overview:
          "Free counterpoint applies the principles of voice independence more flexibly than species, as found in real Baroque and later music.",
        explanation: [
          "It retains the goals — singable, independent lines with controlled dissonance — while allowing richer rhythm and harmony.",
          "The ear, rather than rigid rules, becomes the final judge of how voices interact.",
        ],
        notation: {
          title: "Free vs. Strict",
          leftLabel: "Aspect",
          rightLabel: "Free Counterpoint",
          rows: [
            { left: "Rhythm", right: "Varied, independent" },
            { left: "Dissonance", right: "Freer, still resolved" },
            { left: "Harmony", right: "Full functional palette" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Two freely moving lines." },
        audio: [
          { label: "Upper line", play: () => playMelody([67, 69, 71, 72, 71, 69], 108) },
          { label: "Lower line", play: () => playMelody([48, 52, 55, 53, 55, 60], 108) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write two independent four-bar lines with varied rhythm that still favor contrary motion and resolve their dissonances.",
        },
        quiz: [
          {
            question: "Free counterpoint differs from species by…",
            options: ["Ignoring voice independence", "Allowing more rhythmic and harmonic freedom", "Forbidding dissonance", "Using one voice"],
            answerIndex: 1,
          },
          {
            question: "The core goal of all counterpoint is…",
            options: ["Loud dynamics", "Independent, coherent voices", "Fast tempo", "A single melody"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "invertible-counterpoint",
        title: "Invertible Counterpoint",
        subtitle: "Voices that work with positions exchanged.",
        overview:
          "Invertible counterpoint writes voices so they remain correct when the upper and lower are swapped — the foundation of fugal writing.",
        explanation: [
          "At the octave, each interval maps to its complement: a third becomes a sixth, a fifth becomes a fourth, and so on.",
          "Because the perfect fifth inverts to a dissonant fourth, fifths on strong beats must be handled carefully.",
        ],
        notation: {
          title: "Interval Inversion at the Octave",
          leftLabel: "Original",
          rightLabel: "Inverted",
          rows: [
            { left: "Unison (1)", right: "Octave (8)" },
            { left: "3rd", right: "6th" },
            { left: "4th", right: "5th" },
            { left: "5th", right: "4th" },
            { left: "6th", right: "3rd" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Hear a 3rd and a 5th as harmonic intervals." },
        audio: [
          { label: "3rd → inverts to 6th", play: () => playInterval(60, 4, false) },
          { label: "5th → inverts to 4th", play: () => playInterval(60, 7, false) },
        ],
        practice: {
          title: PRACTICE,
          body: "Compose an eight-bar two-voice passage in invertible counterpoint at the octave, then write out the inversion and check every interval.",
        },
        quiz: [
          {
            question: "At the octave, a 3rd inverts to a…",
            options: ["5th", "6th", "7th", "2nd"],
            answerIndex: 1,
          },
          {
            question: "Why are fifths risky here?",
            options: ["They invert to a dissonant 4th", "They are too quiet", "They cannot invert", "They become octaves"],
            answerIndex: 0,
          },
        ],
      },
      {
        id: "double-counterpoint",
        title: "Double Counterpoint",
        subtitle: "Invertible counterpoint in two voices.",
        overview:
          "Double counterpoint is invertible counterpoint between exactly two voices — the most common practical case.",
        explanation: [
          "It is most often written at the octave, but also at the tenth or twelfth, each producing a different set of interval complements.",
          "A subject and countersubject in double counterpoint can swap which voice is on top whenever the composer wishes.",
        ],
        notation: {
          title: "Inversion Intervals",
          leftLabel: "At the…",
          rightLabel: "Common Use",
          rows: [
            { left: "Octave", right: "Most common" },
            { left: "Twelfth", right: "Allows added thirds" },
            { left: "Tenth", right: "Allows added sixths" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Two voices that can trade places." },
        audio: [
          { label: "Voices as written", play: () => playMelody([60, 64, 67, 64], 100) },
          { label: "Lower voice idea", play: () => playMelody([48, 52, 55, 52], 100) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write a four-bar phrase in double counterpoint at the octave and demonstrate it with the voices swapped.",
        },
        quiz: [
          {
            question: "Double counterpoint involves how many invertible voices?",
            options: ["One", "Two", "Three", "Four"],
            answerIndex: 1,
          },
          {
            question: "Double counterpoint at the twelfth uniquely allows adding…",
            options: ["Octaves", "Thirds", "Rests", "Tritones"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "triple-counterpoint",
        title: "Triple Counterpoint",
        subtitle: "Three voices, any arrangement.",
        overview:
          "Triple counterpoint writes three voices that remain correct in any of their possible vertical orderings.",
        explanation: [
          "Three voices can be arranged in six permutations; each must form acceptable harmony and voice leading.",
          "It is demanding but powerful — a hallmark of advanced fugal writing, as in Bach.",
        ],
        notation: {
          title: "Permutations",
          leftLabel: "Voices",
          rightLabel: "Orderings",
          rows: [
            { left: "3 voices", right: "6 possible arrangements" },
            { left: "Each must", right: "Form valid harmony" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Hear three voices stacked as a chord." },
        audio: [
          { label: "Three-voice chord", play: () => playChord([48, 60, 64]) },
          { label: "Re-voiced", play: () => playChord([52, 60, 67]) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write a two-bar idea in three-part invertible counterpoint and show it in two different vertical orderings.",
        },
        quiz: [
          {
            question: "Three voices can be vertically arranged in how many orderings?",
            options: ["2", "3", "6", "9"],
            answerIndex: 2,
          },
          {
            question: "Triple counterpoint is most associated with…",
            options: ["Pop choruses", "Advanced fugal writing", "Drum patterns", "Monophony"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "canon",
        title: "Canon",
        subtitle: "Strict imitation.",
        overview:
          "A canon has one voice imitate another exactly, after a fixed delay and at a fixed interval.",
        explanation: [
          "The leader (dux) is followed by the imitator (comes). The challenge is writing a line that harmonizes with a delayed copy of itself.",
          "Canons can be at the unison, octave, fifth, etc., and may even be inverted or in augmentation.",
        ],
        notation: {
          title: "Canon Terms",
          leftLabel: "Term",
          rightLabel: "Meaning",
          rows: [
            { left: "Dux", right: "Leading voice" },
            { left: "Comes", right: "Imitating voice" },
            { left: "Interval", right: "Pitch distance of imitation" },
            { left: "Delay", right: "Time before the comes enters" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 84, caption: "Hear a line, then the same line entering after it." },
        audio: [
          { label: "Dux (leader)", play: () => playMelody([60, 62, 64, 65, 67], 120) },
          { label: "Comes (follower, octave below)", play: () => playMelody([48, 50, 52, 53, 55], 120) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write a four-bar melody that works as a canon at the octave with a two-beat delay.",
        },
        quiz: [
          {
            question: "In a canon, the 'comes' is the…",
            options: ["Leading voice", "Imitating voice", "Bass line", "Cadence"],
            answerIndex: 1,
          },
          {
            question: "A canon imitates the leader…",
            options: ["Loosely", "Exactly, after a delay", "Only the rhythm", "Backwards always"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "fugue",
        title: "Fugue",
        subtitle: "A complete contrapuntal form.",
        overview:
          "A fugue develops a single subject through systematic imitation across voices and keys, built on invertible counterpoint.",
        explanation: [
          "The exposition states the subject, answered in the dominant, accompanied by a countersubject. Episodes built from sequence connect later entries.",
          "Devices like stretto, augmentation, and inversion intensify the subject toward the close.",
        ],
        notation: {
          title: "Fugue Anatomy",
          leftLabel: "Section",
          rightLabel: "Role",
          rows: [
            { left: "Subject", right: "Main theme (tonic)" },
            { left: "Answer", right: "Subject in the dominant" },
            { left: "Countersubject", right: "Recurring companion line" },
            { left: "Episode", right: "Transition via sequence" },
            { left: "Stretto", right: "Overlapping entries" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 84, caption: "Hear a subject and its answer in the dominant." },
        audio: [
          { label: "Subject (tonic)", play: () => playMelody([60, 62, 64, 65, 64, 62, 60], 132) },
          { label: "Answer (dominant)", play: () => playMelody([67, 69, 71, 72, 71, 69, 67], 132) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write a two-bar fugue subject with a clear rhythmic identity, then notate its answer transposed to the dominant.",
        },
        quiz: [
          {
            question: "In a fugue the answer appears in the…",
            options: ["Subdominant", "Dominant", "Relative minor", "Tonic"],
            answerIndex: 1,
          },
          {
            question: "An episode in a fugue typically uses…",
            options: ["A new subject", "Sequence to transition", "Only rests", "The cadence"],
            answerIndex: 1,
          },
        ],
      },
    ],
  },

  // =========================================================================
  "advanced-harmony": {
    id: "advanced-harmony",
    unit: "Advanced Harmony",
    subtopics: [
      {
        id: "jazz-harmony",
        title: "Jazz Harmony",
        subtitle: "Seventh chords and ii–V–I.",
        overview:
          "Jazz harmony treats the seventh chord as the basic unit and organizes motion around the ii–V–I progression.",
        explanation: [
          "Every diatonic chord becomes a seventh chord (maj7, m7, dom7, m7♭5). The ii–V–I is the central cadential motion.",
          "Extensions (9, 11, 13) and chord-scale relationships expand each chord into a rich palette.",
        ],
        notation: {
          title: "ii–V–I in C",
          leftLabel: "Chord",
          rightLabel: "Quality",
          rows: [
            { left: "Dm7 (ii)", right: "minor 7th" },
            { left: "G7 (V)", right: "dominant 7th" },
            { left: "Cmaj7 (I)", right: "major 7th" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Hear a ii–V–I." },
        audio: [
          { label: "Dm7 (ii)", play: () => playMinor7(62) },
          { label: "G7 (V)", play: () => playDominant7(67) },
          { label: "Cmaj7 (I)", play: () => playMajor7(60) },
        ],
        practice: {
          title: PRACTICE,
          body: "Voice a ii–V–I in C (Dm7–G7–Cmaj7) and play it, then transpose it to F major.",
        },
        quiz: [
          {
            question: "The central jazz cadence is…",
            options: ["I–IV–V", "ii–V–I", "vi–IV–I–V", "I–vi–ii–V"],
            answerIndex: 1,
          },
          {
            question: "The basic harmonic unit in jazz is the…",
            options: ["Triad", "Seventh chord", "Single note", "Power chord"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "extended-chords",
        title: "Extended Chords",
        subtitle: "Adding 9ths, 11ths, and 13ths.",
        overview:
          "Extended chords stack additional thirds above the seventh — the 9th, 11th, and 13th — for richer color.",
        explanation: [
          "Extensions are numbered beyond the octave: 9 (the 2nd), 11 (the 4th), 13 (the 6th). They add color while the chord keeps its function.",
          "Some extensions are altered or omitted to avoid clashes (e.g., the natural 11 on a major chord clashes with the 3rd).",
        ],
        notation: {
          title: "Extensions on C",
          leftLabel: "Chord",
          rightLabel: "Added Tone",
          rows: [
            { left: "C9", right: "D (9th)" },
            { left: "C11", right: "F (11th)" },
            { left: "C13", right: "A (13th)" },
            { left: "Cmaj9", right: "D over maj7" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Compare a 7th and a 9th chord." },
        audio: [
          { label: "Cmaj7", play: () => playMajor7(60) },
          { label: "C9 (dominant)", play: () => playChord([60, 64, 67, 70, 74]) },
          { label: "C13", play: () => playChord([60, 64, 70, 74, 81]) },
        ],
        practice: {
          title: PRACTICE,
          body: "Take a G7 chord and add the 9th, then the 13th. Play each and describe the change in color.",
        },
        quiz: [
          {
            question: "The 9th of a chord is the same pitch class as the…",
            options: ["3rd", "2nd", "5th", "7th"],
            answerIndex: 1,
          },
          {
            question: "The natural 11 is often omitted on a major chord because it…",
            options: ["Is too low", "Clashes with the 3rd", "Sounds identical to the root", "Cannot be played"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "altered-dominants",
        title: "Altered Dominants",
        subtitle: "Maximum tension before resolution.",
        overview:
          "Altered dominants add chromatically raised or lowered extensions (♭9, ♯9, ♯11, ♭13) to a dominant chord for intense pull.",
        explanation: [
          "The altered scale (7th mode of melodic minor) supplies all the alterations at once, giving the classic 'alt' sound.",
          "Altered dominants resolve strongly to their tonic, especially in minor keys, intensifying the V–i motion.",
        ],
        notation: {
          title: "Alterations on G7",
          leftLabel: "Alteration",
          rightLabel: "Note",
          rows: [
            { left: "♭9", right: "A♭" },
            { left: "♯9", right: "A♯ / B♭" },
            { left: "♯11", right: "C♯" },
            { left: "♭13", right: "E♭" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Hear G7 then a G7alt resolving." },
        audio: [
          { label: "G7 (plain)", play: () => playDominant7(67) },
          { label: "G7♭9", play: () => playChord([67, 71, 74, 77, 80]) },
          { label: "Resolve to C", play: () => playMajorTriad(60) },
        ],
        practice: {
          title: PRACTICE,
          body: "Replace a plain V7 with a V7alt before resolving to I (or i) and describe the added tension.",
        },
        quiz: [
          {
            question: "Altered dominants add which kind of extensions?",
            options: ["Only natural ones", "Chromatically altered ♭9/♯9/♯11/♭13", "None", "Only the 5th"],
            answerIndex: 1,
          },
          {
            question: "The altered scale is a mode of…",
            options: ["Major", "Harmonic minor", "Melodic minor", "Whole tone"],
            answerIndex: 2,
          },
        ],
      },
      {
        id: "parallel-keys",
        title: "Parallel Keys",
        subtitle: "Same tonic, different mode.",
        overview:
          "Parallel keys share a tonic but differ in mode — C major and C minor — providing a reservoir of borrowable color.",
        explanation: [
          "Switching between parallel major and minor recolors the same root, and borrowing single chords across them is the basis of modal interchange.",
          "The shift from major to parallel minor (or back) is a powerful expressive device in songwriting.",
        ],
        notation: {
          title: "C Major vs. C Minor",
          leftLabel: "Degree",
          rightLabel: "Major / minor",
          rows: [
            { left: "3rd", right: "E / E♭" },
            { left: "6th", right: "A / A♭" },
            { left: "7th", right: "B / B♭" },
            { left: "iv chord", right: "F / Fm" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Hear the parallel major and minor tonic." },
        audio: [
          { label: "C major triad", play: () => playMajorTriad(60) },
          { label: "C minor triad", play: () => playMinorTriad(60) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write a phrase in C major, then rewrite it in C minor. Identify which scale degrees changed and how the mood shifted.",
        },
        quiz: [
          {
            question: "Parallel keys share the same…",
            options: ["Key signature", "Tonic note", "Number of sharps", "Relative minor"],
            answerIndex: 1,
          },
          {
            question: "C major and C minor differ in degrees…",
            options: ["2, 4, 5", "3, 6, 7", "1, 5, 8", "2, 4, 6"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "modal-interchange",
        title: "Modal Interchange",
        subtitle: "Borrowing from a parallel mode.",
        overview:
          "Modal interchange borrows chords from a parallel mode sharing the same tonic, adding emotional color without leaving the key.",
        explanation: [
          "From C major you can pull iv (Fm), ♭VII (B♭), or ♭VI (A♭) from C minor for instant shading.",
          "The borrowed iv is among the most beloved devices in pop and film music for its bittersweet warmth.",
        ],
        notation: {
          title: "Borrowed Chords in C",
          leftLabel: "Chord",
          rightLabel: "Source",
          rows: [
            { left: "iv (Fm)", right: "Parallel minor" },
            { left: "♭VII (B♭)", right: "Mixolydian / minor" },
            { left: "♭VI (A♭)", right: "Parallel minor" },
            { left: "♭III (E♭)", right: "Parallel minor" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Hear a borrowed iv resolve to I." },
        audio: [
          { label: "IV (F major)", play: () => playMajorTriad(65) },
          { label: "Borrowed iv (Fm)", play: () => playMinorTriad(65) },
          { label: "Resolve to I (C)", play: () => playMajorTriad(60) },
        ],
        practice: {
          title: PRACTICE,
          body: "Take a I–IV–I loop in C and replace the IV with a borrowed iv (Fm). Describe how the mood changes.",
        },
        quiz: [
          {
            question: "Borrowed iv (Fm) in C major comes from…",
            options: ["C Lydian", "C parallel minor", "G major", "A minor"],
            answerIndex: 1,
          },
          {
            question: "Modal interchange keeps the same…",
            options: ["Mode", "Tonic", "Tempo", "Time signature"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "chromatic-mediants",
        title: "Chromatic Mediants",
        subtitle: "Third-related chords for cinematic color.",
        overview:
          "Chromatic mediants are chords a third apart that share one common tone but aren't diatonically related — a lush, cinematic sound.",
        explanation: [
          "From C major, chords like E major or A♭ major are chromatic mediants: a third away, with chromatic alterations, sharing one tone.",
          "They sidestep functional harmony, connecting by smooth voice leading rather than dominant pull.",
        ],
        notation: {
          title: "Chromatic Mediants of C",
          leftLabel: "Chord",
          rightLabel: "Relationship",
          rows: [
            { left: "E major", right: "Major 3rd up, chromatic" },
            { left: "A♭ major", right: "Major 3rd down, chromatic" },
            { left: "E♭ major", right: "Minor 3rd up, chromatic" },
            { left: "A major", right: "Minor 3rd down, chromatic" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Hear C move to its chromatic mediants." },
        audio: [
          { label: "C major", play: () => playMajorTriad(60) },
          { label: "E major (mediant)", play: () => playMajorTriad(64) },
          { label: "A♭ major (mediant)", play: () => playMajorTriad(68) },
        ],
        practice: {
          title: PRACTICE,
          body: "Connect C major to E major and then to A♭ major using the smoothest voice leading you can, and note the common tones.",
        },
        quiz: [
          {
            question: "Chromatic mediants are related by…",
            options: ["A second", "A third (chromatically altered)", "A fifth", "An octave"],
            answerIndex: 1,
          },
          {
            question: "Chromatic mediants connect mainly through…",
            options: ["Dominant function", "Smooth voice leading and a common tone", "Parallel octaves", "Rests"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "neapolitan-chords",
        title: "Neapolitan Chords",
        subtitle: "The ♭II of dramatic harmony.",
        overview:
          "The Neapolitan is a major chord built on the lowered second degree (♭II), usually in first inversion (N6), with a dark, dramatic pull.",
        explanation: [
          "In C, the Neapolitan is D♭ major. It functions as a subdominant, typically moving to V (or a cadential I64) before resolving.",
          "Its Phrygian-tinged ♭2 lends a poignant, often tragic color, common in Classical and Romantic music.",
        ],
        notation: {
          title: "Neapolitan in C (minor)",
          leftLabel: "Chord",
          rightLabel: "Function",
          rows: [
            { left: "N6 (D♭/F)", right: "Subdominant, ♭II" },
            { left: "→ V (G)", right: "Dominant" },
            { left: "→ i (Cm)", right: "Tonic resolution" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Hear N6 → V → i." },
        audio: [
          { label: "Neapolitan (D♭)", play: () => playMajorTriad(61) },
          { label: "V (G)", play: () => playDominant7(67) },
          { label: "i (C minor)", play: () => playMinorTriad(60) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write a cadence in C minor using N6 → V → i and describe the emotional effect of the Neapolitan.",
        },
        quiz: [
          {
            question: "The Neapolitan is built on which scale degree?",
            options: ["♭2 (lowered second)", "♭5", "♯4", "♭7"],
            answerIndex: 0,
          },
          {
            question: "The Neapolitan typically functions as a…",
            options: ["Tonic", "Subdominant moving to V", "Leading-tone chord", "Passing chord only"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "augmented-sixth-chords",
        title: "Augmented Sixth Chords",
        subtitle: "Chromatic chords that drive to V.",
        overview:
          "Augmented sixth chords contain the interval of an augmented sixth that expands outward to the dominant — Italian, French, and German varieties.",
        explanation: [
          "The augmented sixth (e.g., A♭ and F♯ in C) resolves outward to an octave G, powerfully approaching V.",
          "The three types differ by their added tone: Italian (none extra), French (adds the 2nd), German (adds a perfect 5th).",
        ],
        notation: {
          title: "Augmented Sixth Types (to V in C)",
          leftLabel: "Type",
          rightLabel: "Added Tone",
          rows: [
            { left: "Italian", right: "Just the +6 + tonic" },
            { left: "French", right: "Adds scale degree 2" },
            { left: "German", right: "Adds a perfect 5th" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 72, caption: "Hear an augmented sixth resolve to V." },
        audio: [
          { label: "Aug 6th chord (German)", play: () => playChord([56, 60, 63, 66]) },
          { label: "Resolves to V (G)", play: () => playMajorTriad(67) },
        ],
        practice: {
          title: PRACTICE,
          body: "Build a German augmented sixth in C and resolve it to V, letting the augmented sixth expand outward to an octave G.",
        },
        quiz: [
          {
            question: "An augmented sixth chord most often resolves to…",
            options: ["I", "V", "ii", "vi"],
            answerIndex: 1,
          },
          {
            question: "The German augmented sixth adds a…",
            options: ["Major 7th", "Perfect 5th", "Tritone", "♭9"],
            answerIndex: 1,
          },
        ],
      },
    ],
  },

  // =========================================================================
  "non-chord-tones": {
    id: "non-chord-tones",
    unit: "Melodic Embellishment",
    subtopics: [
      {
        id: "passing-tones",
        title: "Passing Tones",
        subtitle: "Filling the gap by step.",
        overview:
          "A passing tone is a non-chord tone approached and left by step in the same direction, smoothly connecting two chord tones.",
        explanation: [
          "It fills the melodic space between two chord tones a third apart, occurring on a weak beat (unaccented) or, less commonly, a strong beat (accented).",
          "Passing tones are the most basic source of melodic motion over a static harmony.",
        ],
        notation: {
          title: "Passing Tone",
          leftLabel: "Step",
          rightLabel: "Note",
          rows: [
            { left: "Chord tone", right: "C" },
            { left: "Passing tone", right: "D (by step)" },
            { left: "Chord tone", right: "E" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 72, caption: "Hear D pass between C and E." },
        audio: [{ label: "C – D – E (passing)", play: () => playMelody([60, 62, 64], 150) }],
        practice: {
          title: PRACTICE,
          body: "Over a C major chord, connect C to E and E to G using passing tones, keeping all motion stepwise.",
        },
        quiz: [
          {
            question: "A passing tone is approached and left by…",
            options: ["Leap then step", "Step in the same direction", "Repetition", "Octave leap"],
            answerIndex: 1,
          },
          {
            question: "Passing tones most often fall on…",
            options: ["The strong beat", "A weak beat", "The downbeat only", "Rests"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "neighbor-tones",
        title: "Neighbor Tones",
        subtitle: "Stepping away and returning.",
        overview:
          "A neighbor tone steps away from a chord tone and immediately returns to it, decorating a single pitch.",
        explanation: [
          "Upper neighbors step up and back; lower neighbors step down and back. They ornament a held or repeated chord tone.",
          "A double (or changing) neighbor decorates a tone from both sides before returning.",
        ],
        notation: {
          title: "Neighbor Tone",
          leftLabel: "Step",
          rightLabel: "Note",
          rows: [
            { left: "Chord tone", right: "E" },
            { left: "Upper neighbor", right: "F (step up)" },
            { left: "Return", right: "E" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 72, caption: "Hear E–F–E (upper neighbor)." },
        audio: [
          { label: "Upper neighbor (E–F–E)", play: () => playMelody([64, 65, 64], 150) },
          { label: "Lower neighbor (E–D–E)", play: () => playMelody([64, 62, 64], 150) },
        ],
        practice: {
          title: PRACTICE,
          body: "Decorate a held E (over a C chord) with an upper neighbor, then a lower neighbor, then a double neighbor.",
        },
        quiz: [
          {
            question: "A neighbor tone returns to…",
            options: ["A different chord tone", "The same note it left", "The tonic", "A rest"],
            answerIndex: 1,
          },
          {
            question: "A lower neighbor steps…",
            options: ["Up and back", "Down and back", "Up a third", "Down a fifth"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "escape-tones",
        title: "Escape Tones",
        subtitle: "Step away, leap back.",
        overview:
          "An escape tone (échappée) is approached by step and left by leap in the opposite direction.",
        explanation: [
          "It typically steps up from a chord tone, then leaps down to the next chord tone, creating a light, decorative gesture.",
          "Escape tones are unaccented and add grace without heavy tension.",
        ],
        notation: {
          title: "Escape Tone",
          leftLabel: "Motion",
          rightLabel: "Note",
          rows: [
            { left: "Chord tone", right: "C" },
            { left: "Step up (escape)", right: "D" },
            { left: "Leap down", right: "B → C" },
          ],
        },
        keyboard: { startMidi: 59, endMidi: 72, caption: "Hear the step-up, leap-down gesture." },
        audio: [{ label: "C – D – (leap) B", play: () => playMelody([60, 62, 59], 150) }],
        practice: {
          title: PRACTICE,
          body: "Write a melodic figure that uses an escape tone: step up from a chord tone, then leap down to the next chord tone.",
        },
        quiz: [
          {
            question: "An escape tone is left by…",
            options: ["Step", "Leap in the opposite direction", "Repetition", "A tie"],
            answerIndex: 1,
          },
          {
            question: "An escape tone is approached by…",
            options: ["Leap", "Step", "Octave", "Rest"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "appoggiaturas",
        title: "Appoggiaturas",
        subtitle: "Leap in, resolve by step.",
        overview:
          "An appoggiatura is an accented non-chord tone approached by leap and resolved by step, creating expressive tension on a strong beat.",
        explanation: [
          "Unlike most non-chord tones, the appoggiatura falls on a strong beat, leaning on the harmony before resolving down (usually) by step.",
          "Its built-in tension-and-release makes it one of the most emotionally expressive embellishments.",
        ],
        notation: {
          title: "Appoggiatura",
          leftLabel: "Motion",
          rightLabel: "Note",
          rows: [
            { left: "Leap in (accented)", right: "F (non-chord)" },
            { left: "Resolve by step", right: "E (chord tone)" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 72, caption: "Hear F lean onto E on a strong beat." },
        audio: [{ label: "Appoggiatura F → E", play: () => playMelody([65, 64], 96) }],
        practice: {
          title: PRACTICE,
          body: "Over a C major chord, leap up to F on a strong beat and resolve it down by step to E. Describe the expressive effect.",
        },
        quiz: [
          {
            question: "An appoggiatura is special because it falls on…",
            options: ["A weak beat", "A strong beat (accented)", "A rest", "The last beat only"],
            answerIndex: 1,
          },
          {
            question: "An appoggiatura resolves by…",
            options: ["Leap", "Step", "Octave", "Repetition"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "suspensions",
        title: "Suspensions",
        subtitle: "Holding a note into dissonance.",
        overview:
          "A suspension holds a note from the previous chord into the next, where it becomes a dissonance that resolves down by step.",
        explanation: [
          "A suspension has three phases: preparation (consonant), suspension (dissonant, on a strong beat), and resolution (down by step).",
          "Common types are named by their intervals over the bass: 4–3, 7–6, and 9–8.",
        ],
        notation: {
          title: "Suspension Phases",
          leftLabel: "Phase",
          rightLabel: "Quality",
          rows: [
            { left: "Preparation", right: "Consonant (weak beat)" },
            { left: "Suspension", right: "Dissonant (strong beat)" },
            { left: "Resolution", right: "Down by step (consonant)" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 72, caption: "Hear a 4–3 suspension resolve." },
        audio: [
          { label: "Suspension (F held)", play: () => playChord([60, 65, 67]) },
          { label: "Resolution (to E)", play: () => playMajorTriad(60) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write a 4–3 suspension over a C chord: prepare the F, suspend it on the strong beat, and resolve down to E.",
        },
        quiz: [
          {
            question: "A suspension resolves by…",
            options: ["Leap up", "Step down", "Step up", "Staying"],
            answerIndex: 1,
          },
          {
            question: "The dissonant phase of a suspension falls on…",
            options: ["A weak beat", "A strong beat", "A rest", "The pickup"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "anticipations",
        title: "Anticipations",
        subtitle: "Arriving early.",
        overview:
          "An anticipation is a non-chord tone that arrives before its chord, sounding a note of the coming harmony ahead of time.",
        explanation: [
          "It is approached by step (or leap) and held or repeated into the new chord, where it becomes a chord tone.",
          "Anticipations are common at cadences, where the melody reaches the tonic just before the final chord arrives.",
        ],
        notation: {
          title: "Anticipation",
          leftLabel: "Beat",
          rightLabel: "Event",
          rows: [
            { left: "Before the chord", right: "Play C (anticipation)" },
            { left: "On the chord", right: "C becomes a chord tone" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 72, caption: "Hear the tonic arrive a beat early." },
        audio: [{ label: "Anticipation D → C", play: () => playMelody([62, 60, 60], 120) }],
        practice: {
          title: PRACTICE,
          body: "At a V–I cadence, write the melody so it reaches the tonic note one beat before the I chord sounds.",
        },
        quiz: [
          {
            question: "An anticipation sounds a note of the…",
            options: ["Previous chord", "Coming chord, early", "Wrong key", "Dominant only"],
            answerIndex: 1,
          },
          {
            question: "Anticipations are especially common at…",
            options: ["The very start", "Cadences", "Rests", "Key changes"],
            answerIndex: 1,
          },
        ],
      },
    ],
  },

  // =========================================================================
  composition: {
    id: "composition",
    unit: "Composition",
    subtopics: [
      {
        id: "canon",
        title: "Canon",
        subtitle: "A whole piece from strict imitation.",
        overview:
          "As a compositional form, a canon sustains an entire texture from one melody imitated exactly by other voices.",
        explanation: [
          "The composer must write a line that harmonizes with delayed copies of itself — a puzzle as much as a melody.",
          "Canons range from simple rounds to intricate canons by inversion, augmentation, or retrograde.",
        ],
        notation: {
          title: "Canon Varieties",
          leftLabel: "Type",
          rightLabel: "Imitation",
          rows: [
            { left: "Round", right: "Same pitch, staggered" },
            { left: "Canon at the 5th", right: "Imitation up a fifth" },
            { left: "By inversion", right: "Intervals flipped" },
            { left: "By augmentation", right: "Longer values" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 84, caption: "Hear the leader and the follower." },
        audio: [
          { label: "Leader", play: () => playMelody([60, 62, 64, 65, 67], 120) },
          { label: "Follower (octave below)", play: () => playMelody([48, 50, 52, 53, 55], 120) },
        ],
        practice: {
          title: PRACTICE,
          body: "Compose an eight-bar melody that works as a two-voice canon at the octave with a one-bar delay.",
        },
        quiz: [
          {
            question: "A round is a canon at the…",
            options: ["Fifth", "Unison/octave", "Tritone", "Third"],
            answerIndex: 1,
          },
          {
            question: "Writing a canon requires a melody that harmonizes with…",
            options: ["A bass line", "Delayed copies of itself", "A drum beat", "Random notes"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "fugue",
        title: "Fugue",
        subtitle: "The summit of contrapuntal form.",
        overview:
          "A fugue is a complete composition developing one subject through imitation across voices and keys.",
        explanation: [
          "After the exposition (subject, answer, countersubject), episodes and middle entries explore related keys before a climactic return.",
          "Devices such as stretto, inversion, and pedal point intensify the writing toward the close.",
        ],
        notation: {
          title: "Fugue Sections",
          leftLabel: "Section",
          rightLabel: "Content",
          rows: [
            { left: "Exposition", right: "All voices enter with subject/answer" },
            { left: "Episodes", right: "Sequential transitions" },
            { left: "Middle entries", right: "Subject in related keys" },
            { left: "Final entries", right: "Return to tonic, stretto" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 84, caption: "Hear subject then answer." },
        audio: [
          { label: "Subject", play: () => playMelody([60, 62, 64, 65, 64, 62, 60], 132) },
          { label: "Answer (dominant)", play: () => playMelody([67, 69, 71, 72, 71, 69, 67], 132) },
        ],
        practice: {
          title: PRACTICE,
          body: "Plan a fugue exposition: write a subject, its tonal answer, and a countersubject in invertible counterpoint.",
        },
        quiz: [
          {
            question: "The exposition of a fugue presents…",
            options: ["Only the bass", "Each voice with subject or answer", "A drum solo", "The coda"],
            answerIndex: 1,
          },
          {
            question: "Middle entries typically appear in…",
            options: ["The tonic only", "Related keys", "No key", "The relative major only"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "theme-variations",
        title: "Theme & Variations",
        subtitle: "One idea, many transformations.",
        overview:
          "Theme and variations states a self-contained theme, then transforms it repeatedly — in rhythm, harmony, texture, or mode.",
        explanation: [
          "Each variation keeps a recognizable thread (melody, harmony, or bass) while changing other elements for contrast.",
          "Common techniques include figural variation, harmonic reharmonization, mode change, and textural elaboration.",
        ],
        notation: {
          title: "Variation Techniques",
          leftLabel: "Variation",
          rightLabel: "Change",
          rows: [
            { left: "Figural", right: "Add faster decoration" },
            { left: "Harmonic", right: "Reharmonize the theme" },
            { left: "Mode", right: "Major ↔ minor" },
            { left: "Textural", right: "Thicker / thinner voicing" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 84, caption: "Hear a theme and a simple variation." },
        audio: [
          { label: "Theme", play: () => playMelody([60, 64, 67, 64], 120) },
          { label: "Variation (decorated)", play: () => playMelody([60, 62, 64, 65, 67, 65, 64, 62], 132) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write an eight-bar theme, then create two variations: one figural (faster decoration) and one in the parallel minor.",
        },
        quiz: [
          {
            question: "Each variation must keep…",
            options: ["Everything identical", "A recognizable thread of the theme", "Only the tempo", "Nothing"],
            answerIndex: 1,
          },
          {
            question: "Changing major to minor is a variation by…",
            options: ["Mode", "Tempo only", "Dynamics only", "Instrument only"],
            answerIndex: 0,
          },
        ],
      },
      {
        id: "sonata-form",
        title: "Sonata Form",
        subtitle: "Exposition, development, recapitulation.",
        overview:
          "Sonata form organizes a movement into three parts that present, develop, and resolve two contrasting themes.",
        explanation: [
          "The exposition states a first theme in the tonic and a second in a contrasting key; the development fragments and modulates the material; the recapitulation returns both themes in the tonic.",
          "The dramatic 'problem' is the tonal conflict between key areas, resolved when the second theme returns in the home key.",
        ],
        notation: {
          title: "Sonata Form Map",
          leftLabel: "Section",
          rightLabel: "Key / Function",
          rows: [
            { left: "Exposition — Theme 1", right: "Tonic" },
            { left: "Exposition — Theme 2", right: "Dominant / contrasting" },
            { left: "Development", right: "Unstable, modulating" },
            { left: "Recapitulation", right: "Both themes in tonic" },
          ],
        },
        keyboard: { startMidi: 48, endMidi: 84, caption: "Hear theme 1 (tonic) vs. theme 2 (dominant)." },
        audio: [
          { label: "Theme 1 (tonic, C)", play: () => playMelody([60, 64, 67, 72], 120) },
          { label: "Theme 2 (dominant, G)", play: () => playMelody([67, 71, 74, 79], 120) },
        ],
        practice: {
          title: PRACTICE,
          body: "Sketch a sonata-form plan: choose a key, decide the second theme's key, and outline what happens in the development.",
        },
        quiz: [
          {
            question: "The development section is characterized by…",
            options: ["Tonal stability", "Fragmentation and modulation", "A new theme only", "Silence"],
            answerIndex: 1,
          },
          {
            question: "In the recapitulation, the second theme returns in the…",
            options: ["Dominant", "Tonic", "Relative minor", "Subdominant"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "through-composed",
        title: "Through-Composed Form",
        subtitle: "Continuous, non-repeating structure.",
        overview:
          "Through-composed form presents continuously new material with little or no large-scale repetition, following an unfolding narrative.",
        explanation: [
          "Common in art song (where music tracks an evolving text) and in ambitious pop, it prioritizes forward momentum over recurring sections.",
          "Unity comes from motivic threads, key relationships, and mood rather than literal repeats.",
        ],
        notation: {
          title: "Form Comparison",
          leftLabel: "Form",
          rightLabel: "Repetition",
          rows: [
            { left: "Strophic", right: "Same music each verse" },
            { left: "Verse–Chorus", right: "Recurring chorus" },
            { left: "Through-composed", right: "Continuously new" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 84, caption: "Hear continuously evolving material." },
        audio: [
          { label: "Section A idea", play: () => playMelody([60, 62, 64, 65], 120) },
          { label: "New section B idea", play: () => playMelody([67, 69, 71, 72], 120) },
        ],
        practice: {
          title: PRACTICE,
          body: "Write a short through-composed phrase pair where the second idea grows from a motif in the first without repeating it.",
        },
        quiz: [
          {
            question: "Through-composed form is defined by…",
            options: ["Repeating choruses", "Continuously new material", "A single repeated chord", "No melody"],
            answerIndex: 1,
          },
          {
            question: "Unity in through-composed music comes from…",
            options: ["Literal repeats", "Motivic threads and key relationships", "Random changes", "Only dynamics"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "orchestration",
        title: "Orchestration",
        subtitle: "Coloring music with instruments.",
        overview:
          "Orchestration distributes melody, harmony, bass, and color across instruments, exploiting each one's range and timbre.",
        explanation: [
          "Roles must stay clear: a melody needs space above the accompaniment, the bass anchors the harmony, and inner voices fill without clutter.",
          "Doubling, register, and timbral blend determine whether a texture sounds full or muddy.",
        ],
        notation: {
          title: "Orchestral Roles",
          leftLabel: "Layer",
          rightLabel: "Typical Instrument",
          rows: [
            { left: "Melody", right: "Violin / flute / voice" },
            { left: "Harmony", right: "Horns / inner strings" },
            { left: "Bass", right: "Cello / bass / bassoon" },
            { left: "Color", right: "Percussion / harp" },
          ],
        },
        keyboard: { startMidi: 36, endMidi: 84, caption: "Hear bass, harmony, and melody layered." },
        audio: [
          { label: "Bass", play: () => playNote(40, 1.4) },
          { label: "Harmony", play: () => playMajorTriad(60) },
          { label: "Melody", play: () => playMelody([76, 79, 81], 120) },
        ],
        practice: {
          title: PRACTICE,
          body: "Take a simple piano chord progression and assign each layer (melody, harmony, bass) to an instrument, noting registers.",
        },
        quiz: [
          {
            question: "Clear orchestration keeps the melody…",
            options: ["Buried in the texture", "With space, usually above the accompaniment", "Always in the bass", "Doubled everywhere"],
            answerIndex: 1,
          },
          {
            question: "A muddy texture often results from too much activity in the…",
            options: ["High register", "Low register", "Silence", "Melody alone"],
            answerIndex: 1,
          },
        ],
      },
      {
        id: "formal-analysis",
        title: "Formal Analysis",
        subtitle: "Mapping how a piece is built.",
        overview:
          "Formal analysis identifies a work's sections, themes, contrasts, and returns to reveal its architecture.",
        explanation: [
          "Label sections (A, B, A′…), track motivic development, and mark cadences and key areas to understand the design.",
          "Analysis trains composers to build large structures that feel coherent and inevitable.",
        ],
        notation: {
          title: "Common Forms",
          leftLabel: "Label",
          rightLabel: "Form",
          rows: [
            { left: "ABA", right: "Ternary" },
            { left: "AABB", right: "Binary (repeated)" },
            { left: "ABACA", right: "Rondo" },
            { left: "Theme + var.", right: "Variation form" },
          ],
        },
        keyboard: { startMidi: 60, endMidi: 84, caption: "Hear A, then a contrasting B, then A again." },
        audio: [
          { label: "A section", play: () => playMelody([60, 64, 67, 64], 120) },
          { label: "B section (contrast)", play: () => playMelody([69, 67, 65, 64], 120) },
        ],
        practice: {
          title: PRACTICE,
          body: "Choose a short familiar piece and chart its sections with letters (A, B, A′…), marking each cadence and key.",
        },
        quiz: [
          {
            question: "ABA describes which form?",
            options: ["Binary", "Ternary", "Rondo", "Sonata"],
            answerIndex: 1,
          },
          {
            question: "ABACA is the pattern of a…",
            options: ["Rondo", "Fugue", "Canon", "Strophic song"],
            answerIndex: 0,
          },
        ],
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
