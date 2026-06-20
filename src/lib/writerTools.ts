// ---------------------------------------------------------------------------
// Writer's Room — songwriting ideation engine.
//
// Pure, deterministic generators power every creative tool so the studio is
// fully functional offline (the "mock results" path). When an AI provider key
// is configured, the same buttons route through /api/tutor and show the live
// AI response instead. Nothing here reproduces copyrighted lyrics or melodies —
// outputs are original templates, scale-degree patterns, and chord symbols.
// ---------------------------------------------------------------------------

import { getStorage, setStorage } from "./storage";

/* ----------------------------- Project model ---------------------------- */

export interface LyricSections {
  title: string;
  verse1: string;
  preChorus: string;
  chorus: string;
  verse2: string;
  bridge: string;
  outro: string;
}

export interface ThemeState {
  primary: string;
  emotionalTargets: string[];
  keywords: string[];
  conceptNotes: string;
  subThemes: string[];
}

export interface WriterProject {
  id: string;
  name: string;
  updatedAt: number;
  /** True only for the onboarding example; cleared on first user edit. */
  isExample?: boolean;
  lyrics: LyricSections;
  themes: ThemeState;
  chords: string;
  melody: string;
  notes: string;
}

export interface WriterTabProps {
  project: WriterProject;
  setProject: (updater: (p: WriterProject) => WriterProject) => void;
}

export const LYRIC_FIELDS: { key: keyof LyricSections; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "verse1", label: "Verse 1" },
  { key: "preChorus", label: "Pre-Chorus" },
  { key: "chorus", label: "Chorus" },
  { key: "verse2", label: "Verse 2" },
  { key: "bridge", label: "Bridge" },
  { key: "outro", label: "Outro" },
];

export const THEME_CATEGORIES = [
  "Love",
  "Desire",
  "Betrayal",
  "Obsession",
  "Freedom",
  "Loss",
  "Power",
  "Redemption",
  "Jealousy",
  "Spiritual hunger",
  "Dangerous romance",
  "Poverty to greatness",
  "Nightlife",
  "Addiction",
  "Isolation",
  "Triumph",
];

const PROJECTS_KEY = "writer:projects";
const ACTIVE_KEY = "writer:active";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function blankProject(name = "Untitled Song"): WriterProject {
  return {
    id: uid(),
    name,
    updatedAt: Date.now(),
    lyrics: {
      title: "",
      verse1: "",
      preChorus: "",
      chorus: "",
      verse2: "",
      bridge: "",
      outro: "",
    },
    themes: {
      primary: "",
      emotionalTargets: [],
      keywords: [],
      conceptNotes: "",
      subThemes: [],
    },
    chords: "",
    melody: "",
    notes: "",
  };
}

function seedProject(): WriterProject {
  const p = blankProject("Dangerous Love");
  p.isExample = true;
  p.lyrics.title = "Dangerous Love";
  p.lyrics.verse1 =
    "Midnight on your skin, I shouldn't be here\nEvery warning sign, but I disappear";
  p.lyrics.preChorus = "I know how this ends, still I'm reaching for the flame";
  p.lyrics.chorus = "Dangerous love, pull me under\nI can't walk away";
  p.themes = {
    primary: "Dangerous romance",
    emotionalTargets: ["Desire", "Obsession", "Vulnerability", "Power", "Seduction"],
    keywords: ["Fire", "Touch", "Night", "Secret", "Addiction", "Risk"],
    conceptNotes:
      "A love that consumes you. You know it's dangerous, but you can't walk away.",
    subThemes: [],
  };
  p.chords =
    "Verse:  Fm  -  Db  -  Ab  -  Eb\nPre:    Bbm -  Db  -  Ab\nChorus: Fm  -  Cm  -  Db  -  Eb";
  return p;
}

export function loadProjects(): WriterProject[] {
  const stored = getStorage<WriterProject[]>(PROJECTS_KEY);
  if (stored && Array.isArray(stored) && stored.length > 0) return stored;
  const seeded = [seedProject()];
  setStorage(PROJECTS_KEY, seeded);
  return seeded;
}

export function saveProjects(projects: WriterProject[]): void {
  setStorage(PROJECTS_KEY, projects);
}

export function loadActiveId(fallback: string): string {
  return getStorage<string>(ACTIVE_KEY) ?? fallback;
}

export function saveActiveId(id: string): void {
  setStorage(ACTIVE_KEY, id);
}

export function projectToMarkdown(p: WriterProject): string {
  const L = p.lyrics;
  const lines = [
    `# ${L.title || p.name}`,
    "",
    `**Primary theme:** ${p.themes.primary || "—"}`,
    `**Emotional targets:** ${p.themes.emotionalTargets.join(", ") || "—"}`,
    `**Keywords:** ${p.themes.keywords.join(", ") || "—"}`,
    p.themes.subThemes.length ? `**Sub-themes:** ${p.themes.subThemes.join(", ")}` : "",
    "",
    "## Lyrics",
    L.verse1 && `### Verse 1\n${L.verse1}`,
    L.preChorus && `### Pre-Chorus\n${L.preChorus}`,
    L.chorus && `### Chorus\n${L.chorus}`,
    L.verse2 && `### Verse 2\n${L.verse2}`,
    L.bridge && `### Bridge\n${L.bridge}`,
    L.outro && `### Outro\n${L.outro}`,
    "",
    p.chords && `## Chords\n${p.chords}`,
    p.melody && `## Melody\n${p.melody}`,
    p.themes.conceptNotes && `## Concept\n${p.themes.conceptNotes}`,
    p.notes && `## Notes\n${p.notes}`,
  ].filter(Boolean);
  return lines.join("\n\n");
}

/* --------------------------- AI / mock runner --------------------------- */

export type GenResult<T> =
  | { kind: "local"; data: T }
  | { kind: "ai"; text: string };

/**
 * Route a generation request through /api/tutor. If a real AI provider answers
 * (source !== "mock"), return its text. Otherwise fall back to the deterministic
 * local generator so the feature always works.
 */
export async function generate<T>(
  prompt: string,
  local: () => T,
  context = "Songwriting"
): Promise<GenResult<T>> {
  try {
    const res = await fetch("/api/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: prompt }], context }),
    });
    const data = await res.json();
    if (data?.source && data.source !== "mock" && typeof data.reply === "string") {
      return { kind: "ai", text: data.reply };
    }
  } catch {
    /* network/unavailable — use local generator */
  }
  return { kind: "local", data: local() };
}

/* ------------------------------ Thesaurus ------------------------------- */

export interface ThesaurusResult {
  word: string;
  synonyms: string[];
  emotional: string[];
  sensory: string[];
  darker: string[];
  romantic: string[];
  poetic: string[];
  opposites: string[];
}

const THESAURUS: Record<string, Omit<ThesaurusResult, "word">> = {
  desire: {
    synonyms: ["longing", "hunger", "craving", "yearning"],
    emotional: ["want", "need", "thirst", "appetite"],
    sensory: ["heat", "breath", "touch", "pulse"],
    darker: ["obsession", "fixation", "addiction"],
    romantic: ["devotion", "ache", "surrender"],
    poetic: ["a fire with no name", "the pull beneath the skin", "an unanswered hunger"],
    opposites: ["distance", "restraint", "numbness"],
  },
  fire: {
    synonyms: ["flame", "blaze", "burn", "spark"],
    emotional: ["passion", "rage", "intensity", "fever"],
    sensory: ["heat", "smoke", "glow", "ember"],
    darker: ["inferno", "wildfire", "ash", "scorch"],
    romantic: ["warmth", "candlelight", "slow burn"],
    poetic: ["a match against the dark", "the heat we don't survive", "embers in the chest"],
    opposites: ["ice", "cold", "frost", "rain"],
  },
  love: {
    synonyms: ["affection", "passion", "devotion", "adoration"],
    emotional: ["tenderness", "longing", "warmth", "attachment"],
    sensory: ["touch", "warmth", "heartbeat", "embrace"],
    darker: ["obsession", "possession", "dependence"],
    romantic: ["devotion", "yearning", "surrender", "intimacy"],
    poetic: ["a quiet gravity", "the weight I choose to carry", "two shadows, one light"],
    opposites: ["hatred", "indifference", "distance", "coldness"],
  },
  night: {
    synonyms: ["dark", "midnight", "evening", "dusk"],
    emotional: ["loneliness", "mystery", "calm", "freedom"],
    sensory: ["shadow", "moonlight", "silence", "cold air"],
    darker: ["blackout", "the void", "the witching hour"],
    romantic: ["moonlight", "candle glow", "whispered hours"],
    poetic: ["the hour without witnesses", "a city holding its breath", "ink across the sky"],
    opposites: ["day", "dawn", "sunlight", "morning"],
  },
  pain: {
    synonyms: ["ache", "hurt", "agony", "sting"],
    emotional: ["grief", "sorrow", "anguish", "heartbreak"],
    sensory: ["bruise", "tear", "burn", "sting"],
    darker: ["torment", "wound", "scar", "torture"],
    romantic: ["longing", "ache", "the cost of caring"],
    poetic: ["a song in a minor key", "the bill love leaves behind", "weather in the bones"],
    opposites: ["comfort", "relief", "healing", "peace"],
  },
  heart: {
    synonyms: ["soul", "core", "chest", "spirit"],
    emotional: ["feeling", "courage", "love", "compassion"],
    sensory: ["heartbeat", "pulse", "warmth", "rhythm"],
    darker: ["wound", "scar", "stone", "cage"],
    romantic: ["devotion", "tenderness", "longing"],
    poetic: ["a drum that gives me away", "the room where you still live", "a fist that won't unclench"],
    opposites: ["mind", "logic", "numbness", "void"],
  },
};

function deriveThesaurus(word: string): Omit<ThesaurusResult, "word"> {
  const w = word.trim().toLowerCase() || "feeling";
  return {
    synonyms: [`${w} itself`, `a kind of ${w}`, `pure ${w}`, `that ${w}`],
    emotional: ["longing", "tension", "release", "hunger"],
    sensory: ["heat", "breath", "touch", "pulse"],
    darker: [`too much ${w}`, `the weight of ${w}`, "obsession"],
    romantic: ["devotion", "ache", "surrender"],
    poetic: [`the shape of ${w}`, `living with ${w}`, `${w} you can taste`],
    opposites: ["distance", "restraint", "numbness", "stillness"],
  };
}

export function localThesaurus(word: string): ThesaurusResult {
  const key = word.trim().toLowerCase();
  const found = THESAURUS[key];
  return { word: word.trim() || "word", ...(found ?? deriveThesaurus(word)) };
}

/* ----------------------------- Creative Spin ---------------------------- */

export interface CreativeSpinInput {
  obj1: string;
  obj2: string;
  emotion: string;
  genre: string;
}

export interface CreativeSpinResult {
  title: string;
  titleIdeas: string[];
  concept: string;
  visualStory: string;
  chorusAngle: string;
  verse1: string;
  verse2: string;
  bridge: string;
  thesis: string;
}

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

export function localCreativeSpin(input: CreativeSpinInput): CreativeSpinResult {
  const a = input.obj1.trim() || "chair";
  const b = input.obj2.trim() || "rose";
  const emo = input.emotion.trim() || "love lost";
  const genre = input.genre.trim() || "Pop";

  return {
    title: `The ${cap(a)} and the ${cap(b)}`,
    titleIdeas: [
      `The ${cap(a)} and the ${cap(b)}`,
      `Where the ${cap(b)} Used to Be`,
      `Still ${cap(emo.split(" ")[0] || "Here")}`,
      `${cap(a)} for Two`,
    ],
    concept: `A ${genre.toLowerCase()} song that places a ${a} beside a ${b} and lets the contrast carry the feeling of ${emo}. The ${a} is the constant; the ${b} is what changes — so the ${b} becomes the clock measuring the loss.`,
    visualStory: `Someone sits in the same ${a} where things once felt alive, staring at a ${b} that has outlived the moment. The ${a} remembers a shape; the ${b} keeps fading while they refuse to move.`,
    chorusAngle: `Anchor the chorus on the ${b} dying slowly while the ${a} stays exactly where it was — make the title phrase land on the downbeat.`,
    verse1: `Set the scene: the room is still, the ${a} remembers them. Keep imagery concrete and the melody low and conversational.`,
    verse2: `Develop, don't repeat: the ${b} has dropped a petal, and so has the resolve. Raise the stakes and tighten the lines.`,
    bridge: `Twist the meaning: the ${b} wasn't dying from time — it was dying from being kept somewhere without light. Reframe ${emo} as a choice, not an accident.`,
    thesis: `${cap(emo)} isn't the absence of the ${b}; it's the refusal to leave the ${a}.`,
  };
}

/* ------------------------------- Melody --------------------------------- */

export interface MelodyInput {
  key: string;
  mood: string;
  range: string;
  phraseLength: string;
  style: string;
}

export interface MelodyResult {
  verseContour: string;
  preChorusLift: string;
  chorusArrival: string;
  notePattern: string;
  callResponse: string;
  repetition: string;
}

export function localMelody(input: MelodyInput): MelodyResult {
  const minor = /min|dark|sad|danger|dorian|phrygian|aeolian/i.test(
    `${input.key} ${input.mood} ${input.style}`
  );
  const wide = /wide|high|full/i.test(input.range);

  if (minor) {
    return {
      verseContour: wide ? "1 - b3 - 5 - b3 - 1" : "1 - b3 - 4 - b3 - 1",
      preChorusLift: "4 - 5 - b6 - 5",
      chorusArrival: wide ? "b7 - 1 - b3 - 5" : "b7 - 1 - b3 - 4",
      notePattern: "1 - b3 - 4 - 5 - b6 - 5 - 4 - b3",
      callResponse:
        "Call: 1 - b3 - 4 (rising question). Response: 4 - b3 - 1 (falling answer).",
      repetition:
        "Repeat the verse cell twice, then vary the tail on the third pass to set up the lift.",
    };
  }
  return {
    verseContour: wide ? "1 - 3 - 5 - 3 - 1" : "1 - 3 - 4 - 3 - 1",
    preChorusLift: "4 - 5 - 6 - 5",
    chorusArrival: wide ? "5 - 1 - 3 - 5" : "5 - 1 - 3 - 2",
    notePattern: "1 - 3 - 4 - 5 - 6 - 5 - 4 - 3",
    callResponse:
      "Call: 1 - 3 - 5 (rising question). Response: 5 - 3 - 1 (falling answer).",
    repetition:
      "State the hook motif, repeat it exactly, then on the third repeat push the peak up a step.",
  };
}

/* -------------------------------- Chords -------------------------------- */

export interface ChordInput {
  key: string;
  mode: string;
  genre: string;
  color: string;
  complexity: string;
}

export interface ChordResult {
  basic: string;
  darker: string;
  jazzier: string;
  gospel: string;
  bridge: string;
}

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
const LETTER_SEMITONE: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};
const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE = [0, 2, 3, 5, 7, 8, 10];

function spellScale(key: string, isMinor: boolean): string[] {
  const m = key.trim().match(/^([A-Ga-g])([#b]*)/);
  if (!m) return [];
  const letter = m[1].toUpperCase();
  let acc = 0;
  for (const ch of m[2]) acc += ch === "#" ? 1 : -1;
  const tonicVal = (LETTER_SEMITONE[letter] + acc + 120) % 12;
  const startIdx = LETTERS.indexOf(letter);
  const intervals = isMinor ? MINOR_SCALE : MAJOR_SCALE;
  return intervals.map((iv, deg) => {
    const ltr = LETTERS[(startIdx + deg) % 7];
    const target = (tonicVal + iv) % 12;
    let diff = (target - LETTER_SEMITONE[ltr] + 12) % 12;
    if (diff > 6) diff -= 12;
    const a = diff === 0 ? "" : diff > 0 ? "#".repeat(diff) : "b".repeat(-diff);
    return ltr + a;
  });
}

type Spec = [number, string][];
function build(scale: string[], spec: Spec): string {
  return spec.map(([deg, suf]) => `${scale[deg] ?? "?"}${suf}`).join(" - ");
}

export function localChords(input: ChordInput): ChordResult {
  const isMinor = /min|aeolian|dorian|phrygian|dark/i.test(
    `${input.mode} ${input.color}`
  );
  const key = input.key.trim() || "C";
  const scale = spellScale(key, isMinor);
  if (scale.length < 7) {
    return {
      basic: "C - G - Am - F",
      darker: "C - Fm - Am - G",
      jazzier: "Cmaj9 - Am9 - Dm9 - G13",
      gospel: "C - C7 - F - Fm",
      bridge: "Fmaj7 - G7 - Em - Am",
    };
  }

  if (isMinor) {
    return {
      basic: build(scale, [[0, "m"], [5, ""], [2, ""], [6, ""]]),
      darker: build(scale, [[0, "m"], [5, "m"], [2, ""], [4, "7"]]),
      jazzier: build(scale, [[0, "m9"], [3, "m9"], [6, "13"], [2, "maj9"]]),
      gospel: build(scale, [[0, "m9"], [3, "m9"], [5, "maj7"], [4, "7"]]),
      bridge: build(scale, [[5, "maj7"], [4, "7alt"], [0, "m9"], [3, "13"]]),
    };
  }
  return {
    basic: build(scale, [[0, ""], [4, ""], [5, "m"], [3, ""]]),
    darker: build(scale, [[0, ""], [3, "m"], [5, "m"], [4, ""]]),
    jazzier: build(scale, [[0, "maj9"], [5, "m9"], [1, "m9"], [4, "13"]]),
    gospel: build(scale, [[0, ""], [0, "7"], [3, ""], [3, "m"]]),
    bridge: build(scale, [[3, "maj7"], [4, "7"], [2, "m"], [5, "m"]]),
  };
}

/* ------------------------------ Sub-themes ------------------------------ */

const SUBTHEMES: Record<string, string[]> = {
  Love: ["First love", "Unrequited longing", "Slow-burning devotion", "Love as home", "Falling apart"],
  Desire: ["Forbidden want", "The chase", "Temptation", "Hunger that won't quit", "Wanting what hurts"],
  Betrayal: ["Broken trust", "The lie revealed", "Friend turned enemy", "Self-betrayal", "Aftermath"],
  Obsession: ["Can't let go", "Idealizing someone", "Losing yourself", "The all-night spiral", "Possession"],
  Freedom: ["Breaking out", "The open road", "Leaving the cage", "Self-definition", "Cost of freedom"],
  Loss: ["Grief", "Empty rooms", "What remains", "Learning to carry it", "The last goodbye"],
  Power: ["Rising up", "Holding the throne", "Power corrupts", "Quiet strength", "Reclaiming control"],
  Redemption: ["Second chances", "Owning the past", "The long climb back", "Forgiveness", "Becoming new"],
  Jealousy: ["The green eye", "Comparison", "Insecurity", "Watching them leave", "Possessive love"],
  "Spiritual hunger": ["Searching for meaning", "Doubt and faith", "Transcendence", "The empty self", "Grace"],
  "Dangerous romance": ["Toxic pull", "Love that consumes", "Knowing better, staying", "Risk and ruin", "The high"],
  "Poverty to greatness": ["From nothing", "The grind", "Proving them wrong", "Cost of success", "Never forget where"],
  Nightlife: ["After hours", "Neon and noise", "Strangers till dawn", "Escape", "The morning after"],
  Addiction: ["The first hit", "Chasing the feeling", "Rock bottom", "Relapse", "Getting clean"],
  Isolation: ["Alone in a crowd", "Self-imposed exile", "Disconnection", "Longing to be seen", "Quiet"],
  Triumph: ["The comeback", "Against the odds", "Victory lap", "Hard-won peace", "Standing tall"],
};

export function localSubThemes(theme: string): string[] {
  return (
    SUBTHEMES[theme] ?? [
      `${theme}: the beginning`,
      `${theme}: the cost`,
      `${theme}: the turning point`,
      `${theme}: the aftermath`,
      `${theme}: the resolution`,
    ]
  );
}

/* --------------------------- Lyric transforms --------------------------- */

export type LyricMode =
  | "improve"
  | "darker"
  | "romantic"
  | "simplify"
  | "internal-rhyme"
  | "imagery";

const DARK_MAP: Record<string, string> = {
  light: "shadow",
  day: "night",
  love: "obsession",
  happy: "haunted",
  smile: "scar",
  sun: "smoke",
  warm: "cold",
  heart: "wound",
  sweet: "bitter",
};
const ROMANTIC_MAP: Record<string, string> = {
  want: "ache for",
  like: "adore",
  see: "memorize",
  hold: "cradle",
  cold: "warm",
  alone: "yours",
  leave: "stay",
};

const IMAGERY = [
  "like rain on a window",
  "under a streetlight's hum",
  "where the smoke still lingers",
  "in the blue before dawn",
  "with the city holding its breath",
];
const INTERNAL_RHYMES = [
  ["fire", "desire"],
  ["night", "light"],
  ["pain", "rain"],
  ["stay", "away"],
  ["heart", "apart"],
];

function swapWords(text: string, map: Record<string, string>): string {
  return text.replace(/\b([A-Za-z']+)\b/g, (w) => {
    const lower = w.toLowerCase();
    if (map[lower]) {
      const repl = map[lower];
      return w[0] === w[0].toUpperCase() ? cap(repl) : repl;
    }
    return w;
  });
}

export function localTransformLyric(text: string, mode: LyricMode): string {
  const input = text.trim();
  if (!input) return text;
  const lines = input.split("\n");

  switch (mode) {
    case "improve":
      return lines
        .map((l) =>
          l
            .replace(/\s+/g, " ")
            .replace(/\b(really|very|just|kinda|sorta)\s+/gi, "")
            .replace(/^\s*([a-z])/, (_, c) => c.toUpperCase())
            .trim()
        )
        .join("\n");
    case "darker":
      return lines.map((l) => swapWords(l, DARK_MAP)).join("\n");
    case "romantic":
      return lines.map((l) => swapWords(l, ROMANTIC_MAP)).join("\n");
    case "simplify":
      return lines
        .map((l) => {
          const words = l.trim().split(/\s+/);
          return words.length > 7 ? words.slice(0, 7).join(" ") : l.trim();
        })
        .join("\n");
    case "internal-rhyme": {
      const pair = INTERNAL_RHYMES[input.length % INTERNAL_RHYMES.length];
      return lines
        .map((l, i) => (i === 0 ? `${l} — ${pair[0]} and ${pair[1]}` : l))
        .join("\n");
    }
    case "imagery": {
      const img = IMAGERY[input.length % IMAGERY.length];
      return lines.map((l, i) => (i === lines.length - 1 ? `${l} ${img}` : l)).join("\n");
    }
    default:
      return text;
  }
}

export const LYRIC_MODE_LABELS: { mode: LyricMode; label: string }[] = [
  { mode: "improve", label: "Improve line" },
  { mode: "darker", label: "Make darker" },
  { mode: "romantic", label: "Make more romantic" },
  { mode: "simplify", label: "Simplify" },
  { mode: "internal-rhyme", label: "Add internal rhyme" },
  { mode: "imagery", label: "Add imagery" },
];
