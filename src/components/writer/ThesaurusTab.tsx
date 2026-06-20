"use client";

import { useState } from "react";
import { Loader2, Search, Plus } from "lucide-react";
import {
  generate,
  localThesaurus,
  type ThesaurusResult,
  type WriterTabProps,
} from "@/lib/writerTools";
import { AITextBlock } from "./shared";

const GROUPS: { key: keyof Omit<ThesaurusResult, "word">; label: string }[] = [
  { key: "synonyms", label: "Synonyms" },
  { key: "emotional", label: "Emotional Relatives" },
  { key: "sensory", label: "Sensory Words" },
  { key: "darker", label: "Darker Alternatives" },
  { key: "romantic", label: "Romantic Alternatives" },
  { key: "poetic", label: "Poetic Phrases" },
  { key: "opposites", label: "Opposite Words" },
];

export function ThesaurusTab({ project, setProject }: WriterTabProps) {
  const [word, setWord] = useState("desire");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ThesaurusResult | null>(null);
  const [aiText, setAiText] = useState<string | null>(null);

  const run = async () => {
    if (!word.trim()) return;
    setBusy(true);
    setAiText(null);
    setResult(null);
    const out = await generate(
      `Act as a songwriting thesaurus for the word "${word}". Give synonyms, emotional relatives, sensory words, darker alternatives, romantic alternatives, poetic phrases, and opposite words.`,
      () => localThesaurus(word)
    );
    if (out.kind === "local") setResult(out.data);
    else setAiText(out.text);
    setBusy(false);
  };

  const addKeyword = (v: string) =>
    setProject((p) => ({
      ...p,
      themes: { ...p.themes, keywords: Array.from(new Set([...p.themes.keywords, v])) },
    }));

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="Enter a word (try 'desire')"
            className="input pl-10"
          />
        </div>
        <button onClick={run} disabled={busy} className="btn-primary">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Expand"}
        </button>
      </div>

      {aiText && <AITextBlock text={aiText} />}

      {result && (
        <div className="grid gap-4 sm:grid-cols-2">
          {GROUPS.map(({ key, label }) => (
            <div key={key} className="rounded-lg border border-line bg-white/60 p-4">
              <p className="label-caps mb-2">{label}</p>
              <div className="flex flex-wrap gap-2">
                {result[key].map((w) => (
                  <button
                    key={w}
                    onClick={() => addKeyword(w)}
                    title="Add to keywords"
                    className="group inline-flex items-center gap-1 rounded-full border border-line bg-sand/60 px-3 py-1 text-xs text-ink transition-colors hover:border-brass hover:bg-brass/10"
                  >
                    {w}
                    <Plus className="h-3 w-3 text-muted group-hover:text-brass" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
