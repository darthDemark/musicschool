// ---------------------------------------------------------------------------
// Server-side AI provider helper (used by API routes only — never the client).
//
// Tries OpenAI, then Anthropic, based on environment variables. Returns null
// when no key is configured so callers fall back to deterministic local logic.
//   OPENAI_API_KEY     → OpenAI Chat Completions
//   ANTHROPIC_API_KEY  → Anthropic Messages API
// ---------------------------------------------------------------------------

export async function askProvider(
  systemPrompt: string,
  userPrompt: string
): Promise<string | null> {
  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
        }),
      });
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (reply) return reply as string;
    } catch (err) {
      console.error("OpenAI request failed:", err);
    }
  }

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-latest",
          max_tokens: 1024,
          system: systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });
      const data = await res.json();
      const reply = data?.content?.[0]?.text;
      if (reply) return reply as string;
    } catch (err) {
      console.error("Anthropic request failed:", err);
    }
  }

  return null;
}

export function parseLines(text: string, limit = 8): string[] {
  return text
    .split("\n")
    .map((l) =>
      l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").replace(/^["“]|["”]$/g, "").trim()
    )
    .filter((l) => l.length > 0 && l.length < 140)
    .slice(0, limit);
}
