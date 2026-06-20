"use client";

import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import {
  generate,
  localTransformLyric,
  LYRIC_FIELDS,
  LYRIC_MODE_LABELS,
  type LyricMode,
  type LyricSections,
  type WriterTabProps,
} from "@/lib/writerTools";
import { AITextBlock } from "./shared";

interface Props extends WriterTabProps {
  activeField: keyof LyricSections;
  setActiveField: (f: keyof LyricSections) => void;
}

const MODE_PROMPT: Record<LyricMode, string> = {
  improve: "Improve this lyric line; tighten the prosody and imagery without changing the meaning",
  darker: "Rewrite this lyric to feel darker and more dangerous",
  romantic: "Rewrite this lyric to feel more romantic and intimate",
  simplify: "Simplify this lyric so it is leaner and more singable",
  "internal-rhyme": "Rewrite this lyric to add a natural internal rhyme",
  imagery: "Rewrite this lyric to add vivid sensory imagery",
};

export function LyricsTab({ project, setProject, activeField, setActiveField }: Props) {
  const [busy, setBusy] = useState<LyricMode | null>(null);
  const [aiText, setAiText] = useState<string | null>(null);

  const updateField = (field: keyof LyricSections, value: string) =>
    setProject((p) => ({ ...p, lyrics: { ...p.lyrics, [field]: value } }));

  const runTransform = async (mode: LyricMode) => {
    const current = project.lyrics[activeField];
    if (!current.trim()) {
      setAiText(null);
      return;
    }
    setBusy(mode);
    setAiText(null);
    const result = await generate<string>(
      `${MODE_PROMPT[mode]}. Return only the rewritten lyric, no commentary:\n\n"${current}"`,
      () => localTransformLyric(current, mode)
    );
    if (result.kind === "local") {
      updateField(activeField, result.data);
    } else {
      // Live AI: show the suggestion so the writer can accept it deliberately.
      setAiText(result.text);
    }
    setBusy(null);
  };

  const acceptAi = () => {
    if (aiText) updateField(activeField, aiText.trim());
    setAiText(null);
  };

  const activeLabel = LYRIC_FIELDS.find((f) => f.key === activeField)?.label ?? "";

  return (
    <div className="space-y-5">
      {/* Transform toolbar */}
      <div className="rounded-lg border border-line bg-sand/40 p-4">
        <p className="label-caps mb-2 flex items-center gap-1.5">
          <Wand2 className="h-3.5 w-3.5 text-brass" />
          Rewrite the <span className="text-ink">{activeLabel}</span> section
        </p>
        <div className="flex flex-wrap gap-2">
          {LYRIC_MODE_LABELS.map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => runTransform(mode)}
              disabled={busy !== null}
              className="rounded-lg border border-line bg-white/70 px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brass hover:bg-brass/10 disabled:opacity-50"
            >
              {busy === mode ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                label
              )}
            </button>
          ))}
        </div>
      </div>

      {aiText && (
        <div className="space-y-2">
          <AITextBlock text={aiText} />
          <div className="flex gap-2">
            <button onClick={acceptAi} className="btn-brass px-3 py-1.5 text-xs">
              Use this
            </button>
            <button
              onClick={() => setAiText(null)}
              className="btn-ghost px-3 py-1.5 text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4">
        {LYRIC_FIELDS.map(({ key, label }) => {
          const isTitle = key === "title";
          const active = key === activeField;
          return (
            <div key={key}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="label-caps">{label}</span>
                {active && (
                  <span className="text-[10px] uppercase tracking-wider text-brass">
                    Editing
                  </span>
                )}
              </div>
              {isTitle ? (
                <input
                  value={project.lyrics.title}
                  onFocus={() => setActiveField(key)}
                  onChange={(e) => updateField(key, e.target.value)}
                  placeholder="Song title"
                  className={`input ${active ? "border-brass ring-1 ring-brass/30" : ""}`}
                />
              ) : (
                <textarea
                  value={project.lyrics[key]}
                  onFocus={() => setActiveField(key)}
                  onChange={(e) => updateField(key, e.target.value)}
                  rows={key === "outro" ? 2 : 3}
                  placeholder={`Write the ${label.toLowerCase()}...`}
                  className={`w-full resize-y rounded-lg border bg-white/60 p-3 text-sm leading-relaxed text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-brass focus:ring-1 focus:ring-brass/30 ${
                    active ? "border-brass ring-1 ring-brass/30" : "border-line"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
