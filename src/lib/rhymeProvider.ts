// ---------------------------------------------------------------------------
// Rhyme provider abstraction (client-side).
//
// The UI only ever calls getRhymes(word); it never talks to a rhyming service
// directly. Today this hits our own /api/rhymes route (curated dictionary +
// local generator). To swap in a real provider later, change only the server
// route — no UI changes required.
// ---------------------------------------------------------------------------

import type { RhymeGroup } from "./types";
import { deriveRhymes } from "./rhymeGen";

export interface RhymeResult {
  word: string;
  source: "dictionary" | "generated";
  rhymes: RhymeGroup;
}

export async function getRhymes(word: string): Promise<RhymeResult> {
  const clean = word.trim();
  try {
    const res = await fetch("/api/rhymes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ word: clean }),
    });
    if (res.ok) {
      const data = (await res.json()) as RhymeResult;
      if (data?.rhymes) return data;
    }
  } catch {
    /* fall through to local */
  }
  // Offline / route unavailable: still never a dead end.
  return { word: clean.toLowerCase(), source: "generated", rhymes: deriveRhymes(clean) };
}
