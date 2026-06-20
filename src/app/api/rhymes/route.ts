import { NextResponse } from "next/server";
import { rhymeData } from "@/lib/mockData";
import { deriveRhymes } from "@/lib/rhymeGen";

// ---------------------------------------------------------------------------
// Rhymes API (server-side). Provider abstraction: the curated dictionary is
// checked first, then a local generator covers any other word. Swap in a real
// rhyming API (e.g. Datamuse) here without changing any client code — the
// client only ever calls getRhymes() → /api/rhymes.
//
//   Future provider example:
//   const res = await fetch(`https://api.datamuse.com/words?rel_rhy=${word}`)
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  let word = "";
  try {
    const body = await request.json();
    word = typeof body?.word === "string" ? body.word.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!word) {
    return NextResponse.json({ error: "Please provide a word." }, { status: 400 });
  }

  if (rhymeData[word]) {
    return NextResponse.json({ word, source: "dictionary", rhymes: rhymeData[word] });
  }

  // Never a dead end — generate for any word.
  return NextResponse.json({ word, source: "generated", rhymes: deriveRhymes(word) });
}
