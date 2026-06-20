import { NextResponse } from "next/server";
import { getMockTutorReply } from "@/lib/tutorMock";
import type { ChatMessage } from "@/lib/types";

// ---------------------------------------------------------------------------
// AI Tutor API route.
//
// Optional env vars:
//   OPENAI_API_KEY    → OpenAI Chat Completions (gpt-4o-mini)
//   ANTHROPIC_API_KEY → Anthropic Messages API (claude-3-5-sonnet-latest)
//
// If neither key is present the route returns rich mock responses so the
// prototype works out of the box without breaking a Vercel deploy.
// ---------------------------------------------------------------------------

const BASE_SYSTEM_PROMPT = `You are a serious private music conservatory tutor for "Music School".
Voice: direct, scholarly, like a respected conservatory professor. No gamified or cheesy language.
You teach music theory (beginner to advanced), ear training, songwriting, hooks, harmony, melody, rhyme, counterpoint, arrangement, and composition.
You can quiz the student, design practice assignments, analyze hook and chorus ideas, suggest melodies conceptually, give rhyme ideas, explain counterpoint rules, compare songs, generate listening missions, and give feedback on drafts.
Reference real songs and composers for educational analysis, but NEVER reproduce full copyrighted lyrics or full sheet music. Short excerpts only when strictly necessary and legally appropriate. Prefer analysis, concepts, and practice over reproduction.
Be concise and actionable. End with a concrete next step when appropriate.`;

const CONTEXT_ADDENDA: Record<string, string> = {
  Theory:
    "Focus this session on music theory: scales, intervals, chords, modes, voice leading, form, and notation.",
  Counterpoint:
    "Focus on counterpoint: species rules, voice leading, invertible counterpoint, fugue writing, canon.",
  "Hit Lab":
    "Focus on song deconstruction: structure, hooks, harmony, melody, arrangement, and commercial craft of existing hits.",
  "Hook Lab":
    "Focus on hook writing: melodic hooks, rhythmic hooks, lyrical hooks, title hooks. Generate, critique, and improve hook ideas.",
  Songwriting:
    "Focus on songwriting craft: verse-chorus architecture, pre-chorus, bridge, prosody, lyric writing, rewriting.",
  Composition:
    "Focus on composition: counterpoint, fugue, theme and variations, formal design, orchestration, harmonic rhythm.",
  "Ear Training":
    "Focus on ear training: intervals, chord qualities, cadences, scale degrees, rhythm dictation, melodic dictation.",
};

const LEVEL_ADDENDA: Record<string, string> = {
  Beginner:
    "Teach at a BEGINNER level: assume no prior knowledge, define every term, use simple analogies, and keep it short and encouraging.",
  Intermediate:
    "Teach at an INTERMEDIATE level: assume basic theory knowledge, use correct terminology, and include a practical example.",
  Advanced:
    "Teach at an ADVANCED level: assume strong theory fluency, be rigorous and concise, and reference repertoire or edge cases where useful.",
};

export async function POST(request: Request) {
  let messages: ChatMessage[] = [];
  let context = "";
  let level = "";

  try {
    const body = await request.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
    context = typeof body?.context === "string" ? body.context : "";
    level = typeof body?.level === "string" ? body.level : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const contextAddendum = CONTEXT_ADDENDA[context] ?? "";
  const levelAddendum = LEVEL_ADDENDA[level] ?? "";
  const systemPrompt = [BASE_SYSTEM_PROMPT, contextAddendum, levelAddendum]
    .filter(Boolean)
    .join("\n\n");

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const userText = lastUser?.content ?? "";

  // -------------------------------------------------------------------------
  // OpenAI
  // -------------------------------------------------------------------------
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
            ...messages.map((m) => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.7,
        }),
      });
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (reply) return NextResponse.json({ reply, source: "openai" });
    } catch (err) {
      console.error("OpenAI request failed:", err);
    }
  }

  // -------------------------------------------------------------------------
  // Anthropic
  // -------------------------------------------------------------------------
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
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data?.content?.[0]?.text;
      if (reply) return NextResponse.json({ reply, source: "anthropic" });
    } catch (err) {
      console.error("Anthropic request failed:", err);
    }
  }

  // -------------------------------------------------------------------------
  // Mock fallback
  // -------------------------------------------------------------------------
  const reply = getMockTutorReply(userText);
  return NextResponse.json({ reply, source: "mock" });
}
