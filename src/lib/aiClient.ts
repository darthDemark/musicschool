// ---------------------------------------------------------------------------
// Shared client helper for AI-first creative modules.
//
// Routes a generation request through /api/tutor. When a real provider key is
// configured the route answers with source !== "mock" and we return its text.
// Otherwise we return null so the caller falls back to its local generator,
// keeping every module functional offline while remaining AI-first when keys
// exist. (Persistence is localStorage now, Supabase later.)
// ---------------------------------------------------------------------------

export async function askAI(
  prompt: string,
  context = "Songwriting"
): Promise<string | null> {
  try {
    const res = await fetch("/api/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        context,
      }),
    });
    const data = await res.json();
    if (data?.source && data.source !== "mock" && typeof data.reply === "string") {
      return data.reply;
    }
  } catch {
    /* network/unavailable — caller uses local generator */
  }
  return null;
}

/**
 * Parse a loose AI/text response into a flat list of short suggestions:
 * splits on newlines, strips bullets/numbering/quotes, drops empties.
 */
export function parseListResponse(text: string, limit = 8): string[] {
  return text
    .split("\n")
    .map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").replace(/^["“]|["”]$/g, "").trim())
    .filter((l) => l.length > 0 && l.length < 120)
    .slice(0, limit);
}
