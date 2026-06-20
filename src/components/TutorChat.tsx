"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Bot, User2, Loader2 } from "lucide-react";
import clsx from "clsx";
import { tutorGreeting, tutorSuggestedPrompts } from "@/lib/mockData";
import { getStorage, setStorage } from "@/lib/storage";
import type { ChatMessage } from "@/lib/types";

interface TutorChatProps {
  /** Active lesson context forwarded to the API. */
  context?: string;
}

const CONTEXT_PROMPTS: Record<string, string[]> = {
  Theory: [
    "Explain modal interchange like I'm new",
    "Quiz me on secondary dominants",
    "What is voice leading?",
    "Explain the circle of fifths",
  ],
  Counterpoint: [
    "Give me a cantus firmus exercise",
    "What are the rules for first species?",
    "Explain invertible counterpoint",
    "How does a fugue subject work?",
  ],
  "Hit Lab": [
    "Deconstruct the harmony of Purple Rain",
    "Analyze the hook structure of a power ballad",
    "What makes a song commercially strong?",
    "Compare verse-chorus architecture in two songs",
  ],
  "Hook Lab": [
    "Give me 5 hook exercises",
    "What makes a hook sticky?",
    "Critique this chorus idea",
    "Generate title hooks for a dangerous love theme",
  ],
  Songwriting: [
    "Help me write a stronger pre-chorus",
    "What's the purpose of a bridge?",
    "How do I improve prosody?",
    "Give me a verse rewrite exercise",
  ],
  Composition: [
    "Explain sonata form",
    "Help me write a theme and variation",
    "What is through-composition?",
    "Explain orchestration principles",
  ],
  "Ear Training": [
    "Explain interval recognition techniques",
    "Quiz me on chord qualities",
    "Give me a melodic dictation exercise",
    "How do I identify cadences by ear?",
  ],
};

export function TutorChat({ context }: TutorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = getStorage<ChatMessage[]>("tutor-session");
    return saved && saved.length > 0
      ? saved
      : [{ role: "assistant", content: tutorGreeting }];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const prompts =
    context && CONTEXT_PROMPTS[context]
      ? CONTEXT_PROMPTS[context]
      : tutorSuggestedPrompts.slice(0, 4);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, context }),
      });
      const data = await res.json();
      const updated: ChatMessage[] = [
        ...nextMessages,
        { role: "assistant", content: data.reply ?? "Something went wrong." },
      ];
      setMessages(updated);
      setStorage("tutor-session", updated.slice(-40)); // keep last 40 messages
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I couldn't reach the tutor service. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearSession = () => {
    const fresh: ChatMessage[] = [{ role: "assistant", content: tutorGreeting }];
    setMessages(fresh);
    setStorage("tutor-session", fresh);
  };

  return (
    <div className="card flex h-[640px] flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line bg-sand/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-brass/30 bg-brass/10 text-brass">
            <Bot className="h-5 w-5" />
          </span>
          <div>
            <p className="font-serif text-base text-ink">AI Tutor</p>
            <p className="text-xs text-muted">
              {context ? `Context: ${context}` : "Your private music mentor"}
            </p>
          </div>
        </div>
        <button
          onClick={clearSession}
          className="rounded px-2 py-1 text-xs text-muted transition-colors hover:text-ink"
        >
          Clear
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={clsx(
              "flex gap-3",
              m.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <span
              className={clsx(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                m.role === "user"
                  ? "border-line bg-charcoal text-ivory"
                  : "border-brass/30 bg-brass/10 text-brass"
              )}
            >
              {m.role === "user" ? (
                <User2 className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </span>
            <div
              className={clsx(
                "max-w-[78%] whitespace-pre-wrap rounded-xl2 px-4 py-3 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-charcoal text-ivory"
                  : "border border-line bg-white/70 text-ink"
              )}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin text-brass" />
            Tutor is thinking…
          </div>
        )}
      </div>

      {/* Suggested prompts */}
      <div className="border-t border-line px-4 pt-3">
        <div className="flex flex-wrap gap-2 pb-3">
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              disabled={loading}
              className="rounded-full border border-line bg-sand px-3 py-1.5 text-xs text-ink transition-colors hover:border-brass hover:bg-brass/10 disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-line p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your tutor anything about music…"
          className="flex-1 rounded-lg border border-line bg-white/60 px-4 py-2.5 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-brass focus:ring-1 focus:ring-brass/30"
        />
        <button type="submit" disabled={loading} className="btn-primary">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
