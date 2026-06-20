// ---------------------------------------------------------------------------
// Local rhyme generator — the offline fallback for Rhyme Vault when a word
// isn't in the curated dictionary and no AI key is configured. Produces
// plausible perfect/near/slant rhymes from common rhyme families plus
// multisyllabic phrases built around the word. Original by construction.
// ---------------------------------------------------------------------------

import type { RhymeGroup } from "./types";

// Common rhyme families keyed by word ending (checked longest-first).
const FAMILIES: Record<string, string[]> = {
  ight: ["light", "night", "sight", "fight", "bright", "flight", "might", "tonight"],
  ire: ["fire", "desire", "higher", "wire", "inspire", "entire", "conspire"],
  ove: ["love", "above", "dove", "glove", "shove", "thereof"],
  ain: ["pain", "rain", "chain", "brain", "train", "remain", "again", "sustain"],
  art: ["heart", "start", "apart", "part", "chart", "depart"],
  oul: ["soul", "whole", "control", "role", "goal", "console"],
  ole: ["soul", "whole", "control", "role", "goal", "stole"],
  ay: ["stay", "away", "day", "play", "say", "way", "betray"],
  anger: ["danger", "stranger", "anger", "manger"],
  ang: ["danger", "stranger", "anger", "rang", "hang"],
  eam: ["dream", "stream", "scream", "team", "gleam", "redeem"],
  ind: ["mind", "find", "blind", "kind", "behind", "remind"],
  eal: ["feel", "real", "steal", "heal", "reveal", "conceal"],
  eel: ["feel", "real", "steal", "heal", "wheel", "reveal"],
  old: ["cold", "gold", "hold", "bold", "told", "uncontrolled"],
  one: ["alone", "gone", "stone", "unknown", "shown", "thrown"],
  orm: ["storm", "form", "warm", "norm", "swarm", "transform"],
  ace: ["face", "place", "space", "grace", "trace", "embrace"],
  ime: ["time", "crime", "climb", "rhyme", "prime", "sublime"],
  ize: ["rise", "skies", "disguise", "realize", "eyes", "despise"],
  ake: ["break", "mistake", "awake", "take", "shake", "forsake"],
  own: ["down", "crown", "town", "drown", "renown"],
  all: ["fall", "call", "all", "wall", "stall", "recall"],
  eart: ["heart", "apart", "start", "depart"],
  ear: ["near", "fear", "tear", "clear", "appear", "sincere"],
  ight2: [],
};

const GENERIC_NEAR = ["closer", "shadow", "ember", "river", "after", "whisper"];

function family(word: string): string[] {
  const w = word.toLowerCase();
  const keys = Object.keys(FAMILIES).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    if (FAMILIES[k].length && w.endsWith(k)) return FAMILIES[k];
  }
  return [];
}

export function deriveRhymes(word: string): RhymeGroup {
  const w = word.trim().toLowerCase() || "word";
  const fam = family(w).filter((x) => x !== w);

  const perfect = fam.slice(0, 6);
  const near = fam.length > 4 ? fam.slice(3, 9) : [...fam.slice(0, 3), ...GENERIC_NEAR].slice(0, 6);
  const slant = [...GENERIC_NEAR].slice(0, 6);
  const multi = [
    `${w} again`,
    `chasing ${w}`,
    `lost in ${w}`,
    `the weight of ${w}`,
    `nothing but ${w}`,
    `${w} in the dark`,
  ];

  return { perfect, near, multi, slant };
}
