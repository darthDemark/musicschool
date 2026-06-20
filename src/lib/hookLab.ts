// ---------------------------------------------------------------------------
// Hook Lab — teaching content, scoring, idea transformation, and the daily
// workout system. Pure data + logic; UI lives in the page/components.
// Real songs are referenced by title/artist only — no copyrighted lyrics.
// ---------------------------------------------------------------------------

export interface HookTypeLesson {
  type: string;
  definition: string;
  whereFound: string;
  whyItWorks: string;
  genres: string[];
  references: string[];
  drill: string;
}

export const HOOK_TYPES = [
  "Title Hook",
  "Melodic Hook",
  "Rhythmic Hook",
  "Lyrical Hook",
  "Vocal Ad-lib Hook",
  "Instrumental Hook",
  "Production Hook",
  "Structural Hook",
] as const;

export type HookType = (typeof HOOK_TYPES)[number];

export const hookTypeLessons: Record<HookType, HookTypeLesson> = {
  "Title Hook": {
    type: "Title Hook",
    definition: "The song title becomes the repeated phrase the listener remembers.",
    whereFound: "Usually the chorus, post-chorus, intro tag, or outro.",
    whyItWorks: "Naming the feeling makes the song easy to recall, request, and sing back.",
    genres: ["Pop", "Rock", "R&B", "Country"],
    references: ["Purple Rain — Prince", "Billie Jean — Michael Jackson", "Rolling in the Deep — Adele"],
    drill: "Write 10 title phrases around one emotion.",
  },
  "Melodic Hook": {
    type: "Melodic Hook",
    definition: "A short, memorable melody that sticks after a single listen.",
    whereFound: "Chorus, intro motif, or vocal refrain.",
    whyItWorks: "Melody bypasses language — a strong contour lodges in memory on its own.",
    genres: ["Pop", "Rock", "EDM"],
    references: ["Yesterday — The Beatles", "Blinding Lights — The Weeknd", "Sweet Child O' Mine — Guns N' Roses"],
    drill: "Create a 4-note motif and repeat it three different ways.",
  },
  "Rhythmic Hook": {
    type: "Rhythmic Hook",
    definition: "A memorable rhythm or cadence pattern.",
    whereFound: "Drums, vocal phrasing, bassline, or a repeated chant.",
    whyItWorks: "Rhythm engages the body — a distinctive groove makes a song move people.",
    genres: ["Hip-Hop", "Funk", "Rock", "Pop"],
    references: ["We Will Rock You — Queen", "Superstition — Stevie Wonder", "Billie Jean — Michael Jackson"],
    drill: "Tap a rhythm first, then fit words into it.",
  },
  "Lyrical Hook": {
    type: "Lyrical Hook",
    definition: "A phrase or image that carries emotional weight.",
    whereFound: "Chorus, a verse punchline, or a pre-chorus setup.",
    whyItWorks: "A vivid, specific line gives listeners something to feel and quote.",
    genres: ["Singer-Songwriter", "Country", "Rock", "Pop"],
    references: ["I Will Always Love You — Whitney Houston / Dolly Parton", "Smells Like Teen Spirit — Nirvana"],
    drill: "Write 5 lines with emotional contrast.",
  },
  "Vocal Ad-lib Hook": {
    type: "Vocal Ad-lib Hook",
    definition: "A repeated vocal sound, cry, shout, run, or phrase.",
    whereFound: "Intro, chorus tail, bridge, or outro.",
    whyItWorks: "Ad-libs are personal fingerprints that make a record feel alive.",
    genres: ["R&B", "Soul", "Hip-Hop", "Gospel"],
    references: ["James Brown records", "Michael Jackson ad-libs", "Prince performances"],
    drill: "Create 5 non-lyrical vocal phrases.",
  },
  "Instrumental Hook": {
    type: "Instrumental Hook",
    definition: "A riff, bassline, synth line, guitar motif, or piano figure.",
    whereFound: "Intro, turnaround, chorus, or post-chorus.",
    whyItWorks: "An instrumental signature lets a song be recognized in two seconds.",
    genres: ["Rock", "Funk", "EDM", "Pop"],
    references: ["Smoke on the Water — Deep Purple", "Seven Nation Army — The White Stripes", "Superstition — Stevie Wonder"],
    drill: "Write a two-bar motif.",
  },
  "Production Hook": {
    type: "Production Hook",
    definition: "A sonic signature, texture, effect, drop, or sound-design moment.",
    whereFound: "Intro, a transition, the chorus drop, or the bridge.",
    whyItWorks: "A unique sound makes the record instantly identifiable.",
    genres: ["Pop", "EDM", "Hip-Hop", "Alternative"],
    references: ["Bad Guy — Billie Eilish", "When Doves Cry — Prince", "In the Air Tonight — Phil Collins"],
    drill: "Design one sound that makes the song identifiable.",
  },
  "Structural Hook": {
    type: "Structural Hook",
    definition: "A memorable arrangement move — a pause, stop, drop, or surprise section.",
    whereFound: "Pre-chorus, chorus entrance, bridge, or breakdown.",
    whyItWorks: "A structural surprise keeps the listener engaged through the form.",
    genres: ["Rock", "Pop", "Funk"],
    references: ["Bohemian Rhapsody — Queen", "Uptown Funk — Mark Ronson ft. Bruno Mars", "Hey Ya! — OutKast"],
    drill: "Create one surprise before the chorus.",
  },
};

// ----------------------------- Scoring rubric ------------------------------

export interface ScoreRow {
  key: string;
  label: string;
  description: string;
}

export const scoringRubric: ScoreRow[] = [
  { key: "memorability", label: "Memorability", description: "Recall after one listen?" },
  { key: "simplicity", label: "Simplicity", description: "Lean, with nothing wasted?" },
  { key: "emotion", label: "Emotional Impact", description: "Carries a clear feeling?" },
  { key: "singability", label: "Singability", description: "Easy and satisfying to sing back?" },
  { key: "originality", label: "Originality", description: "Fresh rather than generic?" },
  { key: "placement", label: "Placement Potential", description: "Works in sync, radio, or a key moment?" },
];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export interface HookScore {
  overall: number;
  scores: { label: string; value: number }[];
}

export function scoreHook(text: string, hookType?: string): HookScore {
  const seed = hashString((text + (hookType ?? "")).toLowerCase());
  const words = text.trim().split(/\s+/).filter(Boolean).length || 1;
  const scores = scoringRubric.map((c, i) => {
    let base = 6.5 + (((seed >> (i * 2)) % 30) / 10);
    if (c.key === "simplicity") base += words <= 6 ? 1.2 : -0.6;
    if (c.key === "memorability") base += words <= 8 ? 0.6 : -0.3;
    if (c.key === "singability") base += words <= 7 ? 0.5 : -0.4;
    return { label: c.label, value: Math.max(4, Math.min(10, +base.toFixed(1))) };
  });
  const overall = +(scores.reduce((a, s) => a + s.value, 0) / scores.length).toFixed(1);
  return { overall, scores };
}

// --------------------------- Idea transformation ---------------------------

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const capWords = (s: string) =>
  s.replace(/\b\w/g, (c) => c.toUpperCase());

/** Transform one base idea into a specific hook type (mock/local fallback). */
export function transformIdea(base: string, hookType: HookType): string {
  const b = base.trim() || "blue skies";
  switch (hookType) {
    case "Title Hook":
      return `"${capWords(b)} (Don't Feel the Same Without You)" — use it as the repeated chorus title.`;
    case "Melodic Hook":
      return `Sing "${b}" as a sustained two-note phrase, then repeat it a step higher each time.`;
    case "Rhythmic Hook":
      return `"${b} / late nights / your eyes / no lies" — a short, repeated syllabic pattern.`;
    case "Lyrical Hook":
      return `"${cap(b)} above me, but the room still feels like rain."`;
    case "Vocal Ad-lib Hook":
      return `"Ooh, ${b}… yeah, ${b}…" — a repeated vocal tag in the chorus tail.`;
    case "Instrumental Hook":
      return `A bright two-note guitar or piano motif that 'speaks' ${b} before the vocal enters.`;
    case "Production Hook":
      return `An airy reverse-reverb swell that blooms right before the phrase "${b}".`;
    case "Structural Hook":
      return `Cut everything for one beat before the chorus, then crash back in on "${b}".`;
    default:
      return b;
  }
}

// ------------------------------- Rewrites ----------------------------------

export type RewriteMode = "darker" | "romantic" | "rhythmic" | "singable";

const DARK: Record<string, string> = {
  blue: "midnight",
  skies: "shadows",
  light: "dark",
  love: "obsession",
  warm: "cold",
  smile: "scar",
  bright: "burning",
};
const ROMANTIC: Record<string, string> = {
  cold: "warm",
  alone: "in your arms",
  night: "candlelight",
  rain: "your skin",
  gone: "mine",
};

function swap(text: string, map: Record<string, string>): string {
  return text.replace(/\b([A-Za-z']+)\b/g, (w) => {
    const repl = map[w.toLowerCase()];
    if (!repl) return w;
    return w[0] === w[0].toUpperCase() ? cap(repl) : repl;
  });
}

export function rewriteHook(text: string, mode: RewriteMode): string {
  const t = text.trim();
  if (!t) return text;
  switch (mode) {
    case "darker":
      return swap(t, DARK);
    case "romantic":
      return swap(t, ROMANTIC);
    case "rhythmic": {
      const words = t.replace(/[".]/g, "").split(/\s+/).slice(0, 8);
      const chunks: string[] = [];
      for (let i = 0; i < words.length; i += 2) chunks.push(words.slice(i, i + 2).join(" "));
      return chunks.join(" / ");
    }
    case "singable": {
      const words = t.replace(/[".]/g, "").split(/\s+/);
      return words.slice(0, 5).join(" ");
    }
    default:
      return text;
  }
}

export const REWRITE_LABELS: { mode: RewriteMode; label: string }[] = [
  { mode: "darker", label: "Rewrite Darker" },
  { mode: "romantic", label: "Rewrite More Romantic" },
  { mode: "rhythmic", label: "Make More Rhythmic" },
  { mode: "singable", label: "Make More Singable" },
];

// ------------------------------- Workout -----------------------------------

export type WorkoutAction =
  | "title"
  | "chorus"
  | "analyze"
  | "rewrite"
  | "melodic"
  | "transform"
  | "save";

export interface WorkoutTask {
  id: string;
  label: string;
  action: WorkoutAction;
  done: number;
  total: number;
}

export interface Workout {
  level: string;
  createdAt: number;
  tasks: WorkoutTask[];
  completed: boolean;
  completedAt?: number;
  xpAwarded?: number;
}

export interface WorkoutMeta {
  totalXp: number;
  streak: number;
  lastCompleted?: string; // YYYY-MM-DD
}

export const WORKOUT_LEVELS = ["Standard", "Beginner", "Intermediate", "Advanced"] as const;
export type WorkoutLevel = (typeof WORKOUT_LEVELS)[number];

let taskSeq = 0;
function task(label: string, action: WorkoutAction, total: number): WorkoutTask {
  return { id: `t${Date.now()}-${taskSeq++}`, label, action, done: 0, total };
}

const POOLS: Record<WorkoutLevel, () => WorkoutTask[]> = {
  Standard: () => [
    task("Write 5 Titles", "title", 5),
    task("Write 3 Chorus Hooks", "chorus", 3),
    task("Analyze 1 Hook", "analyze", 1),
    task("Rewrite 1 Chorus", "rewrite", 1),
  ],
  Beginner: () => [
    task("Write 5 title hooks", "title", 5),
    task("Write 3 emotional hooks", "save", 3),
    task("Transform 1 hook into 3 styles", "transform", 3),
  ],
  Intermediate: () => [
    task("Create 3 melodic hooks", "melodic", 3),
    task("Rewrite 2 hooks", "rewrite", 2),
    task("Analyze 2 famous hooks", "analyze", 2),
  ],
  Advanced: () => [
    task("Create 5 hook variations", "transform", 5),
    task("Build a hook family (save 4)", "save", 4),
    task("Write a hook ladder (5 titles)", "title", 5),
    task("Convert a hook into a chorus", "chorus", 1),
  ],
};

export function generateWorkout(level: WorkoutLevel): Workout {
  return {
    level,
    createdAt: Date.now(),
    tasks: POOLS[level](),
    completed: false,
  };
}

export function workoutProgress(w: Workout | null): number {
  if (!w || w.tasks.length === 0) return 0;
  const done = w.tasks.reduce((a, t) => a + Math.min(t.done, t.total), 0);
  const total = w.tasks.reduce((a, t) => a + t.total, 0);
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

export function xpForWorkout(w: Workout): number {
  const total = w.tasks.reduce((a, t) => a + t.total, 0);
  return 20 + total * 10;
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
