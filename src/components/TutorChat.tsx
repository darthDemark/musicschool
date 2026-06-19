"use client";

import { useRef, useState } from "react";
import { Send, Bot, User2, Loader2 } from "lucide-react";
import clsx from "clsx";
import { tutorGreeting, tutorSuggestedPrompts } from "@/lib/mockData";
import type { ChatMessage } from "@/lib/types";

export function TutorChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: tutorGreeting },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

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
    scrollToBottom();

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Something went wrong." },
      ]);
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
      scrollToBottom();
    }
  };

  return (
    <div className="card flex h-[640px] flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-line bg-sand/60 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-brass/30 bg-brass/10 text-brass">
          <Bot className="h-5 w-5" />
        </span>
        <div>
          <p className="font-serif text-base text-ink">AI Tutor</p>
          <p className="text-xs text-muted">Your private music mentor</p>
        </div>
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
            Tutor is thinking...
          </div>
        )}
      </div>

      {/* Suggested prompts */}
      <div className="border-t border-line px-4 pt-3">
        <div className="flex flex-wrap gap-2 pb-3">
          {tutorSuggestedPrompts.slice(0, 4).map((p) => (
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
          placeholder="Ask your tutor anything about music..."
          className="flex-1 rounded-lg border border-line bg-white/60 px-4 py-2.5 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-brass focus:ring-1 focus:ring-brass/30"
        />
        <button type="submit" disabled={loading} className="btn-primary">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
