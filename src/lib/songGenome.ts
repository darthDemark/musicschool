// ---------------------------------------------------------------------------
// Song Genome — Educational Mode.
//
// Turns raw dimension scores into teaching: what each dimension means, why this
// song scored the way it did, how to improve it, songwriter takeaways, a
// technique to steal, and structural "song relatives". Every score must teach.
// Real songs referenced by title/artist only.
// ---------------------------------------------------------------------------

import type { GenomeScore } from "./types";

export interface DimensionEducation {
  short: string;
  meaning: string;
  highObservations: string[];
  lowObservations: string[];
  improvements: string[];
  exemplars: string[];
}

export const dimensionEducation: Record<string, DimensionEducation> = {
  "Hook Density": {
    short: "Hooks",
    meaning: "Measures how frequently memorable moments occur throughout the song.",
    highObservations: [
      "Chorus repeats the title phrase",
      "Secondary post-chorus hook",
      "Recurring melodic motif",
      "Strong opening phrase",
    ],
    lowObservations: [
      "Few repeated phrases to latch onto",
      "No post-chorus or secondary hook",
      "The main hook arrives late",
    ],
    improvements: [
      "Repeat your strongest phrase more often",
      "Introduce recurring motifs",
      "Add a post-chorus",
      "Create a stronger opening hook",
    ],
    exemplars: ["Blinding Lights — The Weeknd", "Uptown Funk — Mark Ronson", "Since U Been Gone — Kelly Clarkson"],
  },
  "Melody Strength": {
    short: "Melody",
    meaning: "Measures how memorable and singable the melody is — contour, intervals, repetition, and climax.",
    highObservations: [
      "Strong, shapely contour",
      "Repeated melodic motif",
      "Sits in an easy, singable range",
      "Clear melodic climax",
    ],
    lowObservations: [
      "Chorus melody too similar to the verse",
      "Final phrase lacks resolution",
      "Narrow, static contour",
    ],
    improvements: [
      "Use larger interval contrast",
      "Build a stronger melodic climax",
      "Add variation in the final chorus",
    ],
    exemplars: ["Yesterday — The Beatles", "Someone Like You — Adele", "Sweet Child O' Mine — Guns N' Roses"],
  },
  "Emotional Impact": {
    short: "Emotion",
    meaning: "Measures emotional intensity across lyric, dynamics, melody, harmony, and performance.",
    highObservations: [
      "Rising melody into the chorus",
      "Repeated title phrase at the peak",
      "Expanding instrumentation builds escalation",
      "Strong dynamic contrast",
    ],
    lowObservations: [
      "Dynamics stay flat throughout",
      "The lyric keeps the listener at a distance",
      "No single clear emotional peak",
    ],
    improvements: [
      "Save the biggest emotional moment for later",
      "Widen the dynamic range",
      "Align melody, harmony, and lyric on one feeling",
    ],
    exemplars: ["Purple Rain — Prince", "Someone Like You — Adele", "Nothing Compares 2 U — Sinéad O'Connor"],
  },
  Arrangement: {
    short: "Arrangement",
    meaning: "Measures structural effectiveness — verse, chorus, bridge, transitions, and tension/release.",
    highObservations: [
      "Clear verse / chorus contrast",
      "Well-placed bridge",
      "Smooth transitions",
      "Deliberate tension and release",
    ],
    lowObservations: [
      "Sections blur together",
      "No bridge or breakdown for relief",
      "Energy stays flat across the form",
    ],
    improvements: [
      "Add a contrasting bridge",
      "Use a drop or breakdown before the final chorus",
      "Stage the instrumentation additively",
    ],
    exemplars: ["Bohemian Rhapsody — Queen", "Purple Rain — Prince", "Hey Ya! — OutKast"],
  },
  "Lyrics / Theme": {
    short: "Lyrics",
    meaning: "Measures clarity, originality, emotional connection, and imagery in the words.",
    highObservations: [
      "A clear central theme",
      "Concrete, memorable imagery",
      "An emotional, quotable line",
      "Consistent point of view",
    ],
    lowObservations: [
      "Abstract language keeps it generic",
      "No single memorable image",
      "Theme drifts between sections",
    ],
    improvements: [
      "Anchor the lyric to one concrete image",
      "Lead with a fresh point of view",
      "Make the title line the emotional thesis",
    ],
    exemplars: ["Smells Like Teen Spirit — Nirvana", "A Case of You — Joni Mitchell", "Fast Car — Tracy Chapman"],
  },
  "Replay Value": {
    short: "Replay",
    meaning: "Measures the likelihood of repeat listening — hooks, novelty, emotional reward, and pacing.",
    highObservations: [
      "Strong, recurring hooks",
      "A novel moment that rewards re-listening",
      "Satisfying emotional payoff",
      "Tight pacing with no dead air",
    ],
    lowObservations: [
      "Hooks fade after one listen",
      "Little novelty to rediscover",
      "Pacing drags in the middle",
    ],
    improvements: [
      "Add a detail that rewards the second listen",
      "Tighten the pacing",
      "Strengthen the emotional payoff",
    ],
    exemplars: ["Blinding Lights — The Weeknd", "Mr. Brightside — The Killers", "Dreams — Fleetwood Mac"],
  },
  "Commercial Appeal": {
    short: "Commercial",
    meaning: "Measures accessibility to a broad audience — hook clarity, memorability, familiarity vs. surprise.",
    highObservations: [
      "A clear, immediate hook",
      "High memorability",
      "Balances familiarity with one surprise",
    ],
    lowObservations: [
      "The hook is buried or arrives late",
      "Structure is unconventional for radio",
      "Sound or theme is quite niche",
    ],
    improvements: [
      "Make the hook clearer and earlier",
      "Tighten the song length",
      "Balance a familiar form with one fresh element",
    ],
    exemplars: ["Uptown Funk — Mark Ronson", "Shape of You — Ed Sheeran", "Billie Jean — Michael Jackson"],
  },
  Originality: {
    short: "Originality",
    meaning: "Measures uniqueness versus common patterns — harmony, arrangement, lyrical angle, production.",
    highObservations: [
      "Distinctive production signature",
      "An unconventional arrangement move",
      "A fresh lyrical perspective",
      "Unexpected harmonic color",
    ],
    lowObservations: [
      "Highly common chord progression (e.g., I–V–vi–IV)",
      "Familiar arrangement template",
      "Conventional lyrical angle",
    ],
    improvements: [
      "Reharmonize one section",
      "Add a signature production moment",
      "Find a less obvious angle on the theme",
    ],
    exemplars: ["Bohemian Rhapsody — Queen", "When Doves Cry — Prince", "Bad Guy — Billie Eilish"],
  },
};

const HIGH = 7.8;

export function observationsFor(label: string, value: number): { good: string[]; warn: string[] } {
  const edu = dimensionEducation[label];
  if (!edu) return { good: [], warn: [] };
  if (value >= HIGH) {
    return { good: edu.highObservations.slice(0, 4), warn: edu.lowObservations.slice(0, 1) };
  }
  if (value >= 6.8) {
    return { good: edu.highObservations.slice(0, 2), warn: edu.lowObservations.slice(0, 2) };
  }
  return { good: edu.highObservations.slice(0, 1), warn: edu.lowObservations.slice(0, 3) };
}

export function sortedByValue(genome: GenomeScore[]): GenomeScore[] {
  return [...genome].sort((a, b) => b.value - a.value);
}

/* --------------------------- Why this song works --------------------------- */

export interface WhyItWorks {
  strength: GenomeScore;
  weakest: GenomeScore;
  strengthText: string;
  weaknessText: string;
}

export function whyItWorks(genome: GenomeScore[]): WhyItWorks | null {
  if (genome.length === 0) return null;
  const sorted = sortedByValue(genome);
  const strength = sorted[0];
  const weakest = sorted[sorted.length - 1];
  const sEdu = dimensionEducation[strength.label];
  const wEdu = dimensionEducation[weakest.label];

  const strengthText = sEdu
    ? `The song's biggest strength is ${strength.label.toLowerCase()}. ${sEdu.highObservations
        .slice(0, 3)
        .join(", ")
        .toLowerCase()} — together these create escalation and payoff.`
    : "";

  const weaknessText =
    weakest.label === "Originality"
      ? "Its weakest area is originality — the harmonic and structural choices are fairly common. The song succeeds through performance and arrangement rather than harmonic innovation."
      : wEdu
        ? `Its weakest area is ${weakest.label.toLowerCase()}: ${wEdu.lowObservations[0].toLowerCase()}. Strengthening it would raise the ceiling on an already strong song.`
        : "";

  return { strength, weakest, strengthText, weaknessText };
}

/* ----------------------------- Takeaways ----------------------------------- */

const BASE_TAKEAWAYS = [
  "Repeat your strongest phrase — familiarity is what makes a hook stick.",
  "Save your biggest emotional moment for later in the song.",
  "Use contrast between sections so the chorus feels like a release.",
  "Build intensity gradually rather than all at once.",
  "Combine familiarity with one genuine surprise.",
];

export function takeaways(genome: GenomeScore[]): string[] {
  const sorted = sortedByValue(genome);
  const lessons = [...BASE_TAKEAWAYS];
  const weakest = sorted[sorted.length - 1];
  const wEdu = dimensionEducation[weakest?.label];
  if (wEdu) {
    lessons[lessons.length - 1] = `Shore up ${weakest.label.toLowerCase()}: ${wEdu.improvements[0].toLowerCase()}.`;
  }
  return lessons.slice(0, 5);
}

/* --------------------------- Steal this technique -------------------------- */

export interface Technique {
  name: string;
  effect: string;
  artists: string[];
  exercise: string;
}

const TECHNIQUES: Record<string, Technique> = {
  "Hook Density": {
    name: "Post-Chorus Hook",
    effect: "A second, often wordless hook after the chorus doubles the song's memorable real estate.",
    artists: ["The Weeknd", "Dua Lipa", "Robyn"],
    exercise: "Write a 2-bar wordless 'oh-oh' hook that lands right after your chorus.",
  },
  "Emotional Impact": {
    name: "Delayed Chorus Entry",
    effect: "Holding the title back an extra measure creates anticipation, then a bigger payoff.",
    artists: ["Prince", "Adele", "Coldplay"],
    exercise: "Write a chorus where the title doesn't arrive until measure four.",
  },
  Arrangement: {
    name: "Drop Before the Final Chorus",
    effect: "Stripping the arrangement to near-silence makes the final chorus hit hardest.",
    artists: ["Beyoncé", "Sia", "Bruno Mars"],
    exercise: "Cut everything but vocal + one instrument for two bars before your last chorus.",
  },
  "Melody Strength": {
    name: "Melodic Climax Placement",
    effect: "Placing the highest note on the most important word fuses melody and meaning.",
    artists: ["Whitney Houston", "Freddie Mercury", "Adele"],
    exercise: "Rewrite your chorus so its highest note lands on the title's key word.",
  },
  "Lyrics / Theme": {
    name: "Concrete Image Anchor",
    effect: "One vivid object the whole song returns to makes an abstract feeling tangible.",
    artists: ["Joni Mitchell", "Taylor Swift", "Bruce Springsteen"],
    exercise: "Pick one physical object and reference it in every section of your song.",
  },
  "Replay Value": {
    name: "Hidden Detail Reward",
    effect: "A small detail revealed only on repeat listens makes people come back.",
    artists: ["Beatles", "Kendrick Lamar", "Radiohead"],
    exercise: "Add a counter-melody or lyric callback that only appears in the last chorus.",
  },
  "Commercial Appeal": {
    name: "Hook in the First 15 Seconds",
    effect: "Front-loading the hook earns the listener's attention before they skip.",
    artists: ["Max Martin productions", "Bruno Mars", "Olivia Rodrigo"],
    exercise: "Rework your intro so a version of the hook appears within 15 seconds.",
  },
  Originality: {
    name: "One Borrowed Chord",
    effect: "A single chord from the parallel mode adds color without losing accessibility.",
    artists: ["The Beatles", "Radiohead", "Stevie Wonder"],
    exercise: "Swap one chord in your progression for a borrowed iv or ♭VII and keep the rest.",
  },
};

export function stealTechnique(genome: GenomeScore[]): Technique {
  const top = sortedByValue(genome)[0];
  return TECHNIQUES[top?.label] ?? TECHNIQUES["Hook Density"];
}

/* ------------------------------ Song relatives ----------------------------- */

interface ReferenceSong {
  title: string;
  profile: Record<string, number>;
  traits: string[];
}

const REFERENCES: ReferenceSong[] = [
  {
    title: "Purple Rain — Prince",
    profile: {
      "Hook Density": 9.1, "Melody Strength": 8.7, "Emotional Impact": 9.6, Arrangement: 8.2,
      "Lyrics / Theme": 8.5, "Replay Value": 8.8, "Commercial Appeal": 9.0, Originality: 8.3,
    },
    traits: ["Emotional build", "Dynamic contrast", "Climactic instrumental section"],
  },
  {
    title: "November Rain — Guns N' Roses",
    profile: {
      "Hook Density": 7.6, "Melody Strength": 8.4, "Emotional Impact": 9.2, Arrangement: 9.0,
      "Lyrics / Theme": 7.8, "Replay Value": 7.9, "Commercial Appeal": 7.7, Originality: 8.0,
    },
    traits: ["Long-form arrangement", "Anthem-style chorus", "Emotional climax"],
  },
  {
    title: "Billie Jean — Michael Jackson",
    profile: {
      "Hook Density": 9.0, "Melody Strength": 8.5, "Emotional Impact": 8.0, Arrangement: 8.6,
      "Lyrics / Theme": 8.2, "Replay Value": 9.1, "Commercial Appeal": 9.4, Originality: 8.1,
    },
    traits: ["Rhythmic hook", "Tight groove", "Iconic bassline"],
  },
  {
    title: "Bohemian Rhapsody — Queen",
    profile: {
      "Hook Density": 8.0, "Melody Strength": 8.8, "Emotional Impact": 9.0, Arrangement: 9.6,
      "Lyrics / Theme": 8.4, "Replay Value": 8.6, "Commercial Appeal": 8.0, Originality: 9.5,
    },
    traits: ["Multi-section form", "Dramatic contrast", "Genre-blending"],
  },
  {
    title: "Blinding Lights — The Weeknd",
    profile: {
      "Hook Density": 9.4, "Melody Strength": 8.6, "Emotional Impact": 8.0, Arrangement: 8.3,
      "Lyrics / Theme": 7.5, "Replay Value": 9.3, "Commercial Appeal": 9.5, Originality: 7.8,
    },
    traits: ["Relentless hook", "Retro-synth signature", "High replay value"],
  },
  {
    title: "Rolling in the Deep — Adele",
    profile: {
      "Hook Density": 8.7, "Melody Strength": 9.0, "Emotional Impact": 9.1, Arrangement: 8.4,
      "Lyrics / Theme": 8.6, "Replay Value": 8.5, "Commercial Appeal": 9.1, Originality: 7.9,
    },
    traits: ["Strong vocal melody", "Build to a big chorus", "Emotional intensity"],
  },
];

export interface SongRelative {
  title: string;
  similarity: number;
  traits: string[];
}

export function songRelatives(
  genome: GenomeScore[],
  currentTitle?: string
): SongRelative[] {
  const vec = Object.fromEntries(genome.map((g) => [g.label, g.value]));
  const labels = genome.map((g) => g.label);
  const maxDist = Math.sqrt(labels.length * 100);

  return REFERENCES.filter((r) => !currentTitle || !currentTitle.includes(r.title.split(" — ")[0]))
    .map((r) => {
      let sumSq = 0;
      for (const l of labels) {
        const a = vec[l] ?? 7;
        const b = r.profile[l] ?? 7;
        sumSq += (a - b) ** 2;
      }
      const dist = Math.sqrt(sumSq);
      const similarity = Math.max(40, Math.round(100 * (1 - dist / maxDist)));
      return { title: r.title, similarity, traits: r.traits };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);
}
