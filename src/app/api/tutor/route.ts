import { NextResponse } from "next/server";
import { getMockTutorReply } from "@/lib/tutorMock";
import type { ChatMessage } from "@/lib/types";

// ---------------------------------------------------------------------------
// AI Tutor API route.
//
// This route is ready to connect to a real AI provider via environment vars:
//   - process.env.OPENAI_API_KEY     (OpenAI Chat Completions / Responses)
//   - process.env.ANTHROPIC_API_KEY  (Anthropic Messages API)
//
// If NEITHER key is present, it returns rich mock responses so the prototype
// works out of the box and never breaks a Vercel deploy due to missing env.
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are the AI Tutor for "Music School", a private conservatory app.
Voice: serious, direct, scholarly — like a respected conservatory professor. No cheesy or gamified language.
You teach music theory (beginner to advanced), ear training, songwriting, hooks, harmony, melody, rhyme, counterpoint, arrangement, and composition.
You can quiz the student, design practice assignments, analyze hook/chorus ideas, suggest stronger melodies conceptually, give rhyme ideas, explain counterpoint rules, compare songs, generate listening missions, and give feedback on drafts.
Reference real songs and composers for analysis, but NEVER reproduce full copyrighted lyrics or full sheet music. Use only short excerpts when strictly necessary and legally safe. Prefer analysis, concepts, and practice over reproduction.
Be concise and actionable. End with a concrete next step when appropriate.`;

export async function POST(request: Request) {
  let messages: ChatMessage[] = [];
  try {
    const body = await request.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const userText = lastUser?.content ?? "";

  // -------------------------------------------------------------------------
  // OpenAI integration point.
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
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.7,
        }),
      });
      const data = await res.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (reply) return NextResponse.json({ reply, source: "openai" });
    } catch (err) {
      console.error("OpenAI request failed, falling back to mock:", err);
    }
  }

  // -------------------------------------------------------------------------
  // Anthropic integration point.
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
          system: SYSTEM_PROMPT,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data?.content?.[0]?.text;
      if (reply) return NextResponse.json({ reply, source: "anthropic" });
    } catch (err) {
      console.error("Anthropic request failed, falling back to mock:", err);
    }
  }

  // -------------------------------------------------------------------------
  // Mock fallback — no API key configured (default for the prototype).
  // -------------------------------------------------------------------------
  const reply = getMockTutorReply(userText);
  return NextResponse.json({ reply, source: "mock" });
}
