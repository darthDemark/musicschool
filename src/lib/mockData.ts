import type {
  ComposerProfileData,
  CurriculumUnit,
  HitLabReport,
  HookEntry,
  Lesson,
  ListeningTrack,
  RhymeGroup,
  SimilarSong,
  User,
  VaultSong,
} from "./types";

// ---------------------------------------------------------------------------
// All demo data for the Music School prototype lives here.
// In production these objects would be replaced by Supabase queries
// (see suggested schema in README.md and the client stub in src/lib/supabase.ts).
// ---------------------------------------------------------------------------

export const currentUser: User = {
  id: "u_heron",
  name: "Heron",
  role: "Songwriter • Producer • Composer",
  streakDays: 18,
};

export const dashboardStats = {
  lessonsCompleted: 89,
  songsAnalyzed: 147,
  hooksWritten: 231,
  currentStreak: 18,
  overallProgress: 64,
};

export const continueLearning = {
  unit: "Counterpoint IV",
  lessonNumber: 18,
  title: "Invertible Counterpoint",
  progress: 72,
};

export const todaysListening = {
  song: "Purple Rain",
  artist: "Prince",
  focus: "Dynamic Contrast",
  youtubeId: "TvnYmWpD_T8",
};

export const todaysWriting = {
  task: "Write 3 Chorus Hooks",
  focus: "Emotional Impact",
};

// ---------------------------------------------------------------------------
// Theory Academy
// ---------------------------------------------------------------------------

export const curriculumUnits: CurriculumUnit[] = [
  {
    id: "foundations",
    title: "Foundations",
    description: "The grammar of music — pitch, staff, clefs, and the language of notation.",
    topics: ["Notation", "The Staff & Clefs", "Note Values", "Key Signatures", "Dynamics"],
    progress: 100,
  },
  {
    id: "notation",
    title: "Notation",
    description: "Reading and writing music with precision and clarity.",
    topics: ["Pitch Notation", "Rhythmic Notation", "Articulations", "Score Reading"],
    progress: 100,
  },
  {
    id: "rhythm",
    title: "Rhythm",
    description: "Meter, subdivision, syncopation, and the architecture of time.",
    topics: ["Meter", "Subdivision", "Syncopation", "Polyrhythm", "Groove"],
    progress: 92,
  },
  {
    id: "melody",
    title: "Melody",
    description: "Scales, intervals, and the shaping of memorable melodic line.",
    topics: ["Scales", "Intervals", "Contour", "Motif Development", "Phrasing"],
    progress: 80,
  },
  {
    id: "harmony",
    title: "Harmony",
    description: "Triads, diatonic function, and the movement of chords.",
    topics: [
      "Triads",
      "Diatonic Harmony",
      "Secondary Dominants",
      "Modulation",
      "Voice Leading",
    ],
    progress: 71,
  },
  {
    id: "counterpoint",
    title: "Counterpoint",
    description: "Independent melodic lines woven into a unified whole.",
    topics: [
      "Species Counterpoint",
      "Free Counterpoint",
      "Invertible Counterpoint",
      "Double Counterpoint",
      "Triple Counterpoint",
    ],
    progress: 58,
  },
  {
    id: "advanced-harmony",
    title: "Advanced Harmony",
    description: "Chromatic color, borrowed chords, and harmony beyond the diatonic.",
    topics: [
      "Jazz Harmony",
      "Extended Chords (7ths, 9ths, 11ths, 13ths)",
      "Altered Dominants",
      "Parallel Keys",
      "Modal Interchange",
      "Chromatic Mediants",
      "Neapolitan Chords",
      "Augmented Sixth Chords",
    ],
    progress: 34,
  },
  {
    id: "non-chord-tones",
    title: "Melodic Embellishment",
    description: "Non-chord tones that give melody motion and tension.",
    topics: [
      "Passing Tones",
      "Neighbor Tones",
      "Escape Tones",
      "Appoggiaturas",
      "Suspensions",
      "Anticipations",
    ],
    progress: 46,
  },
  {
    id: "composition",
    title: "Composition",
    description: "Canon, fugue, and large-scale formal design.",
    topics: ["Canon", "Fugue", "Theme & Variations", "Sonata Form", "Through-Composition"],
    progress: 22,
  },
];

export const currentLesson: Lesson = {
  id: "lesson-18",
  unit: "Counterpoint IV",
  title: "Invertible Counterpoint",
  number: 18,
  summary:
    "Invertible counterpoint is the art of writing two or more voices that remain musically correct when their vertical positions are exchanged — the lower voice becomes the upper, and the upper becomes the lower.",
  durationMin: 24,
  completed: false,
};

export const lessonExplanation = [
  "In invertible (or double) counterpoint, two voices are composed so that either may serve as the bass. The most common form is invertible counterpoint at the octave, where the voices are exchanged across a span of an octave or two octaves.",
  "The central constraint is interval transformation. When voices invert at the octave, each interval maps to its complement: a unison becomes an octave, a third becomes a sixth, a fifth becomes a fourth, and so on. The composer must anticipate how every harmonic interval will read after inversion.",
  "Because the perfect fifth inverts to a perfect fourth — a dissonance in strict counterpoint — fifths on strong beats become hazardous. Skilled writers treat the fifth as a passing event, ensuring the inverted fourth is properly prepared and resolved.",
  "Invertible counterpoint is the engine of fugal writing. A subject and countersubject conceived in invertible counterpoint can be recombined in any voice pairing, giving the fugue its sense of inexhaustible variation from minimal material.",
];

export const practiceAssignment = {
  title: "Practice Assignment",
  body: "Compose an eight-measure passage in two voices using invertible counterpoint at the octave. Then write out the inversion and verify that every harmonic interval resolves correctly. Mark each interval and its complement.",
};

// Interval inversion reference rendered in the notation-style example area.
export const intervalInversionTable = [
  { original: "Unison (1)", inverted: "Octave (8)" },
  { original: "2nd", inverted: "7th" },
  { original: "3rd", inverted: "6th" },
  { original: "4th", inverted: "5th" },
  { original: "5th", inverted: "4th" },
  { original: "6th", inverted: "3rd" },
  { original: "7th", inverted: "2nd" },
  { original: "Octave (8)", inverted: "Unison (1)" },
];

// ---------------------------------------------------------------------------
// Ear Training
// ---------------------------------------------------------------------------

export const earTrainingModules = [
  { id: "intervals", label: "Interval Identification", accuracy: 88, active: true },
  { id: "chords", label: "Chord Quality", accuracy: 81, active: false },
  { id: "cadences", label: "Cadences", accuracy: 74, active: false },
  { id: "rhythm", label: "Rhythm Dictation", accuracy: 69, active: false },
  { id: "melody", label: "Melody Dictation", accuracy: 63, active: false },
  { id: "singback", label: "Sing-Back Exercises", accuracy: 77, active: false },
];

export const intervalExercise = {
  prompt: "Identify the interval",
  answer: "Perfect 5th",
  options: ["Major 3rd", "Perfect 4th", "Perfect 5th", "Minor 6th"],
  hint: "Listen for the open, hollow quality — the same interval that opens the Star Wars main theme.",
};

// ---------------------------------------------------------------------------
// Listening Curriculum
// ---------------------------------------------------------------------------

export const listeningCollections: ListeningTrack[] = [
  {
    id: "prince-pr",
    title: "Purple Rain",
    artist: "Prince",
    collection: "Prince Track",
    youtubeId: "TvnYmWpD_T8",
    focus: "Dynamic Contrast",
    durationLabel: "8:41",
    completed: false,
  },
  {
    id: "stevie",
    title: "Sir Duke",
    artist: "Stevie Wonder",
    collection: "Stevie Wonder Track",
    youtubeId: "f-S4hcU0Wf0",
    focus: "Melodic Horn Lines",
    durationLabel: "3:55",
    completed: true,
  },
  {
    id: "bach",
    title: "Toccata & Fugue in D minor",
    artist: "J.S. Bach",
    collection: "Bach Track",
    youtubeId: "ho9rZjlsyYY",
    focus: "Counterpoint & Form",
    durationLabel: "8:58",
    completed: true,
  },
  {
    id: "jazz",
    title: "So What",
    artist: "Miles Davis",
    collection: "Jazz Masters",
    youtubeId: "zqNTltOGh5c",
    focus: "Modal Improvisation",
    durationLabel: "9:22",
    completed: false,
  },
  {
    id: "rock",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    collection: "Rock Legends",
    youtubeId: "fJ9rUzIMcZQ",
    focus: "Multi-Section Form",
    durationLabel: "5:55",
    completed: false,
  },
  {
    id: "pop",
    title: "...Baby One More Time",
    artist: "Britney Spears",
    collection: "Pop Songcraft",
    youtubeId: "C-u5WLJ9Yk4",
    focus: "Hook Construction",
    durationLabel: "3:31",
    completed: false,
  },
  {
    id: "film",
    title: "The Imperial March",
    artist: "John Williams",
    collection: "Film Scoring",
    youtubeId: "-bzWSJG93P8",
    focus: "Leitmotif & Orchestration",
    durationLabel: "3:03",
    completed: false,
  },
  {
    id: "singer",
    title: "A Case of You",
    artist: "Joni Mitchell",
    collection: "Singer-Songwriter Series",
    youtubeId: "RbDFG-NQDQk",
    focus: "Lyric & Open Tuning",
    durationLabel: "4:21",
    completed: false,
  },
];

export const featuredListening = {
  song: "Purple Rain",
  artist: "Prince",
  youtubeId: "TvnYmWpD_T8",
  mission: "Study dynamic contrast",
  focus: "Arrangement and emotional arc",
  questions: [
    "Where does tension increase?",
    "Where does release occur?",
    "How does instrumentation change?",
    "What makes the chorus powerful?",
  ],
};

// ---------------------------------------------------------------------------
// Hit Lab + Song Genome (mock deconstruction of Prince — Purple Rain)
// ---------------------------------------------------------------------------

export const purpleRainReport: HitLabReport = {
  song: "Purple Rain",
  artist: "Prince",
  genre: "Rock / Pop Ballad",
  length: "8:41",
  bpm: "~113 BPM",
  key: "Bb Major",
  youtubeId: "TvnYmWpD_T8",
  overview:
    "Purple Rain is a power ballad built on a slow, gospel-tinged chord progression that earns one of the most cathartic arrangements in popular music. The song withholds its full instrumentation for minutes, using a patient, additive build so that each new layer reads as an emotional escalation rather than mere texture.",
  structure: [
    { time: "0:00", seconds: 0, section: "Intro" },
    { time: "0:42", seconds: 42, section: "Verse" },
    { time: "1:35", seconds: 95, section: "Chorus" },
    { time: "2:20", seconds: 140, section: "Verse" },
    { time: "3:10", seconds: 190, section: "Chorus" },
    { time: "4:00", seconds: 240, section: "Guitar Solo" },
    { time: "6:30", seconds: 390, section: "Final Chorus" },
  ],
  hookMap: [
    {
      type: "Instrument Hook",
      description: "Opening guitar arpeggio figure that frames the entire song.",
      timestamp: "0:00",
    },
    {
      type: "Vocal Phrase Hook",
      description: "The yearning 'I never meant to cause you any sorrow' melodic descent.",
      timestamp: "0:42",
    },
    {
      type: "Chorus / Title Hook",
      description: "The communal, repeated 'Purple Rain' title refrain.",
      timestamp: "1:35",
    },
    {
      type: "Guitar Solo Hook",
      description: "The soaring, vocal-like guitar solo that becomes the song's climax.",
      timestamp: "4:00",
    },
  ],
  energyCurve: [
    { time: "0:00", energy: 18 },
    { time: "0:42", energy: 30 },
    { time: "1:35", energy: 55 },
    { time: "2:20", energy: 48 },
    { time: "3:10", energy: 68 },
    { time: "4:00", energy: 82 },
    { time: "5:15", energy: 92 },
    { time: "6:30", energy: 100 },
    { time: "8:00", energy: 60 },
  ],
  harmony: [
    "Built largely on a Bb – Gm – F – Eb diatonic loop (I – vi – V – IV) that feels both hymnal and inevitable.",
    "The IV chord (Eb) is leaned on for its plagal, 'amen' quality, reinforcing the gospel lineage.",
    "Suspended voicings and sustained pads blur the chord changes, giving the harmony a floating, processional feel.",
    "The harmonic rhythm is deliberately slow, letting each chord ring so the melody can carry the motion.",
  ],
  melody: [
    "Verse melody is conversational and narrow in range, sitting low to maximize the eventual lift.",
    "The chorus opens the range upward, and the title phrase is repeated with small variations to deepen familiarity.",
    "Prince's vocal ad-libs in the back half escalate in register, mirroring the rising arrangement.",
    "The guitar solo functions as a second, wordless melody — arguably the song's true emotional peak.",
  ],
  lyricsTheme: [
    "Themes of regret, devotion, and redemption framed through the recurring 'purple rain' image.",
    "Direct, plainspoken verses give way to a communal, almost liturgical chorus.",
    "Ambiguity of the central image invites listeners to project personal meaning.",
  ],
  arrangement: [
    "Additive arrangement: guitar, then drums and bass, then organ, then strings, then choir.",
    "Long instrumental coda lets the song resolve emotionally rather than abruptly.",
    "Reverb-soaked production creates a stadium-sized, ceremonial space.",
    "Dynamic restraint early on makes the climactic sections land with maximum impact.",
  ],
  genome: [
    { label: "Hook Density", value: 9.1 },
    { label: "Melody Strength", value: 8.7 },
    { label: "Emotional Impact", value: 9.6 },
    { label: "Arrangement", value: 8.2 },
    { label: "Lyrics / Theme", value: 8.5 },
    { label: "Replay Value", value: 8.8 },
    { label: "Commercial Appeal", value: 9.0 },
    { label: "Originality", value: 8.3 },
  ],
};

export const purpleRainOverallScore = 8.9;

export const similarSongs: SimilarSong[] = [
  { title: "When Doves Cry", artist: "Prince", match: 91 },
  { title: "Billie Jean", artist: "Michael Jackson", match: 84 },
  { title: "Every Breath You Take", artist: "The Police", match: 79 },
  { title: "Nothing Compares 2 U", artist: "Prince / Sinéad O'Connor", match: 88 },
];

// ---------------------------------------------------------------------------
// Hook Lab
// ---------------------------------------------------------------------------

export const hookWorkout = [
  { task: "Write 5 Titles", done: 3, total: 5 },
  { task: "Write 3 Chorus Hooks", done: 1, total: 3 },
  { task: "Analyze 1 Hook", done: 0, total: 1 },
  { task: "Rewrite 1 Chorus", done: 0, total: 1 },
];

export const recentHooks: HookEntry[] = [
  { id: "h1", text: "Can't stay away", score: 8.4 },
  { id: "h2", text: "Danger in your eyes", score: 7.9 },
  { id: "h3", text: "One touch, I'm gone", score: 8.7 },
  { id: "h4", text: "Addicted to you", score: 7.5 },
];

export const hookTypes = [
  "Title Hook",
  "Melodic Hook",
  "Rhythmic Hook",
  "Lyrical Hook",
  "Vocal Ad-lib",
  "Instrumental Hook",
];

// ---------------------------------------------------------------------------
// Writer's Room
// ---------------------------------------------------------------------------

export const writersRoomProject = {
  title: "Dangerous Love",
  theme: "Dangerous Romance",
  emotionalTargets: ["Desire", "Obsession", "Vulnerability", "Power", "Seduction"],
  keywords: ["Fire", "Touch", "Night", "Secret", "Addiction", "Risk"],
  notes:
    "A love that consumes you. You know it's dangerous, but you can't walk away.",
  lyrics:
    "[Verse 1]\nMidnight on your skin, I shouldn't be here\nEvery warning sign, but I disappear\n\n[Pre-Chorus]\nI know how this ends, still I'm reaching for the flame...",
  chords:
    "Verse:  Fm  -  Db  -  Ab  -  Eb\nPre:    Bbm -  Db  -  Ab\nChorus: Fm  -  Cm  -  Db  -  Eb",
};

// ---------------------------------------------------------------------------
// Rhyme Vault
// ---------------------------------------------------------------------------

export const rhymeData: Record<string, RhymeGroup> = {
  fire: {
    perfect: ["desire", "higher", "wire", "attire", "inspire", "conspire"],
    near: ["liar", "buyer", "prior", "entire", "admire", "require"],
    multi: [
      "open fire",
      "burning desire",
      "hearts on fire",
      "walking through the fire",
      "set the world on fire",
      "play with fire",
    ],
    slant: ["tired", "wired", "rival", "spiral", "vital", "trial"],
  },
};

// ---------------------------------------------------------------------------
// Composition Lab
// ---------------------------------------------------------------------------

export const compositionCategories = [
  "Counterpoint",
  "Fugue",
  "Reharmonization",
  "Modal Interchange",
  "Chromatic Harmony",
  "Orchestration",
  "Form & Analysis",
];

export const compositionAssignment = {
  title: "Two-Part Invention",
  description: "Write a two-part invention in C major.",
  details: [
    "State a clear subject of one to two measures in the upper voice.",
    "Answer with the subject in the lower voice while the upper voice supplies a countersubject.",
    "Develop the material through sequence, inversion, and episodes in related keys.",
    "Return to C major for a decisive cadence. Maintain two independent, singable lines throughout.",
  ],
  topics: [
    "Advanced counterpoint",
    "Parallel keys",
    "Extended chords",
    "Unorthodox harmony",
    "Passing tones",
    "Voice leading",
    "Fugue",
    "Canon",
    "Modal interchange",
    "Non-functional harmony",
    "Polytonality",
    "Pedal harmony",
    "Planing",
    "Symmetrical harmony",
  ],
};

// ---------------------------------------------------------------------------
// Song Vault
// ---------------------------------------------------------------------------

export const vaultSongs: VaultSong[] = [
  {
    id: "dangerous-love",
    title: "Dangerous Love",
    status: "Draft",
    genre: "Pop / R&B",
    hook: 8.2,
    melody: 7.6,
    lyrics: 8.0,
    arrangement: 6.8,
  },
  {
    id: "black-jupiter",
    title: "Black Jupiter",
    status: "Complete",
    genre: "Alternative",
    hook: 9.0,
    melody: 8.8,
    lyrics: 8.5,
    arrangement: 8.1,
  },
  {
    id: "falling-stars",
    title: "Falling Stars",
    status: "In Progress",
    genre: "Pop",
    hook: 7.5,
    melody: 7.2,
    lyrics: 7.8,
    arrangement: 6.9,
  },
  {
    id: "eternal-light",
    title: "Eternal Light",
    status: "Draft",
    genre: "Ballad",
    hook: 8.1,
    melody: 8.0,
    lyrics: 8.2,
    arrangement: 7.0,
  },
];

// ---------------------------------------------------------------------------
// Composer's Library
// ---------------------------------------------------------------------------

export const composerProfiles: ComposerProfileData[] = [
  {
    id: "prince",
    name: "Prince",
    subtitle: "The Artist • The Composer • The Innovator",
    era: "1958–2016",
    bio: "A singular force who fused funk, rock, pop, R&B, and gospel into a genre-defying body of work. A virtuoso multi-instrumentalist and producer, Prince treated the studio as an instrument and the arrangement as drama.",
    commonKeys: ["F", "G", "D", "Bb", "A"],
    chordColors: ["7ths", "9ths", "11ths", "sus", "add9"],
    themes: ["Love", "Spirituality", "Identity", "Freedom", "Power"],
    signatureTraits: [
      "Strong melodic hooks",
      "Rich harmonic language",
      "Emotional intensity",
      "Dynamic contrast",
      "Genre-defying arrangements",
    ],
  },
  {
    id: "bach",
    name: "J.S. Bach",
    subtitle: "The Master of Counterpoint",
    era: "1685–1750",
    bio: "The towering figure of the Baroque, whose command of counterpoint, harmony, and form remains the foundation of Western musical training.",
    commonKeys: ["C", "D", "G", "Bb", "E minor"],
    chordColors: ["Diminished 7ths", "Suspensions", "Secondary dominants"],
    themes: ["Faith", "Order", "Devotion", "Mathematics of music"],
    signatureTraits: [
      "Supreme contrapuntal mastery",
      "Inevitable voice leading",
      "Fugal architecture",
      "Harmonic depth",
    ],
  },
  {
    id: "mozart",
    name: "W.A. Mozart",
    subtitle: "The Voice of Classical Balance",
    era: "1756–1791",
    bio: "The embodiment of Classical elegance, melody, and proportion across opera, symphony, and chamber music.",
    commonKeys: ["C", "G", "D", "Eb", "A"],
    chordColors: ["Clean triads", "Dominant 7ths", "Appoggiaturas"],
    themes: ["Wit", "Drama", "Humanity", "Grace"],
    signatureTraits: [
      "Effortless melodic gift",
      "Perfect formal balance",
      "Operatic characterization",
      "Clarity of texture",
    ],
  },
  {
    id: "beethoven",
    name: "Ludwig van Beethoven",
    subtitle: "The Bridge to Romanticism",
    era: "1770–1827",
    bio: "Transformed the Classical language into something heroic and personal, expanding form, dynamics, and emotional scope.",
    commonKeys: ["C minor", "Eb", "F", "D", "A"],
    chordColors: ["Diminished 7ths", "Neapolitan", "Augmented 6ths"],
    themes: ["Struggle", "Triumph", "Fate", "Transcendence"],
    signatureTraits: [
      "Motivic development",
      "Dramatic dynamic range",
      "Structural innovation",
      "Emotional intensity",
    ],
  },
  {
    id: "stevie",
    name: "Stevie Wonder",
    subtitle: "The Architect of Modern Soul",
    era: "b. 1950",
    bio: "A melodic and harmonic innovator who expanded the vocabulary of pop and soul with sophisticated chords and infectious grooves.",
    commonKeys: ["Eb", "Ab", "Db", "F", "Bb"],
    chordColors: ["9ths", "13ths", "Altered dominants", "Modal interchange"],
    themes: ["Love", "Social justice", "Joy", "Spirituality"],
    signatureTraits: [
      "Lush jazz-pop harmony",
      "Memorable melodic hooks",
      "Groove-centric writing",
      "Expressive vocal phrasing",
    ],
  },
  {
    id: "max-martin",
    name: "Max Martin",
    subtitle: "The Architect of Modern Pop",
    era: "b. 1971",
    bio: "The most successful pop songwriter-producer of the modern era, master of melodic math and the science of the hook.",
    commonKeys: ["C", "G", "A minor", "E minor"],
    chordColors: ["Power-pop triads", "sus2", "add9"],
    themes: ["Love", "Heartbreak", "Empowerment", "Desire"],
    signatureTraits: [
      "'Melodic math' phrasing",
      "Relentless hooks",
      "Pre-chorus craft",
      "Production clarity",
    ],
  },
  {
    id: "beatles",
    name: "The Beatles",
    subtitle: "The Reinventors of Pop",
    era: "1960–1970",
    bio: "Redefined what a pop song could be — harmonically adventurous, sonically experimental, endlessly melodic.",
    commonKeys: ["A", "E", "G", "D", "C"],
    chordColors: ["Modal interchange", "Chromatic mediants", "Added tones"],
    themes: ["Love", "Surrealism", "Nostalgia", "Social change"],
    signatureTraits: [
      "Inventive harmony",
      "Vocal harmony craft",
      "Studio experimentation",
      "Melodic invention",
    ],
  },
  {
    id: "miles",
    name: "Miles Davis",
    subtitle: "The Eternal Innovator",
    era: "1926–1991",
    bio: "Reinvented jazz repeatedly — from bebop to cool, modal, and fusion — always favoring space, tone, and restraint.",
    commonKeys: ["D dorian", "F", "Bb", "C", "Eb"],
    chordColors: ["Modal voicings", "Quartal harmony", "Slash chords"],
    themes: ["Space", "Cool", "Innovation", "Mood"],
    signatureTraits: [
      "Modal improvisation",
      "Economy of notes",
      "Iconic tone",
      "Constant reinvention",
    ],
  },
];

// ---------------------------------------------------------------------------
// AI Tutor
// ---------------------------------------------------------------------------

export const tutorSuggestedPrompts = [
  "Explain modal interchange like I'm new",
  "Quiz me on secondary dominants",
  "Give me 5 hook exercises",
  "Analyze this chorus idea",
  "Build a Prince-style listening assignment",
  "Help me write a stronger pre-chorus",
];

export const tutorGreeting =
  "Good evening, Heron. I'm your tutor. We can work on theory, ear training, hooks, harmony, counterpoint, or a song you're drafting. Where would you like to focus tonight?";
