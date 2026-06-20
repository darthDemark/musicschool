import { NextResponse } from "next/server";
import { askProvider, parseLines } from "@/lib/aiServer";

// ---------------------------------------------------------------------------
// Hook idea generation API (server-side). AI-first via askProvider, with a
// deterministic local fallback so the Hook Lab always returns ideas.
// ---------------------------------------------------------------------------

const IDEA_POOLS: Record<string, string[]> = {
  danger: [
    "Caught in the undertow",
    "Burning down the quiet",
    "You're the risk I'd take again",
    "I know better — still I stay",
    "One touch and the whole thing breaks",
  ],
  love: [
    "You're my favorite mistake",
    "Hold me like a secret",
    "Every scar says your name",
    "Can't stay away from you",
    "Addicted to everything you are",
  ],
  pain: [
    "Still bleeding at the seams",
    "You left and I kept counting",
    "The ache that won't sit still",
    "Beautiful and breaking",
    "I wear the wound like gold",
  ],
  obsession: [
    "Danger in your eyes",
    "One touch, I'm gone",
    "You're the fire I can't put out",
    "Midnight in your arms again",
    "Losing sleep to find you",
  ],
  default: [
    "The moment before it all changed",
    "We were meant to burn",
    "Tell me something true",
    "Light me up one more time",
    "Gone before the morning comes",
  ],
};

function localIdeas(theme: string, emotion: string): string[] {
  const key = `${theme} ${emotion}`.toLowerCase();
  for (const [k, pool] of Object.entries(IDEA_POOLS)) {
    if (k !== "default" && key.includes(k)) return pool;
  }
  return IDEA_POOLS.default;
}

const SYSTEM = `You are a professional hit songwriter and hook specialist.
Generate short, original, singable hook lines. Never reproduce copyrighted lyrics.
Return one hook per line, no numbering or quotes.`;

export async function POST(request: Request) {
  let theme = "";
  let emotion = "";
  let hookType = "Title Hook";
  try {
    const body = await request.json();
    theme = typeof body?.theme === "string" ? body.theme : "";
    emotion = typeof body?.emotion === "string" ? body.emotion : "";
    hookType = typeof body?.hookType === "string" ? body.hookType : hookType;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const ai = await askProvider(
    SYSTEM,
    `Generate 5 ${hookType.toLowerCase()} ideas. Theme: ${theme || "open"}. Emotion: ${
      emotion || "open"
    }.`
  );
  if (ai) {
    const ideas = parseLines(ai, 5);
    if (ideas.length) return NextResponse.json({ ideas, source: "ai" });
  }
  return NextResponse.json({ ideas: localIdeas(theme, emotion), source: "mock" });
}
