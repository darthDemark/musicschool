"use client";

import { useState } from "react";
import { Loader2, Sparkles, Plus } from "lucide-react";
import {
  generate,
  localSubThemes,
  THEME_CATEGORIES,
  type WriterTabProps,
} from "@/lib/writerTools";
import { AITextBlock, Field, TagInput } from "./shared";

export function ThemesTab({ project, setProject }: WriterTabProps) {
  const [busy, setBusy] = useState(false);
  const [aiText, setAiText] = useState<string | null>(null);
  const t = project.themes;

  const patchThemes = (patch: Partial<typeof t>) =>
    setProject((p) => ({ ...p, themes: { ...p.themes, ...patch } }));

  const generateSubThemes = async () => {
    const primary = t.primary || "Dangerous romance";
    setBusy(true);
    setAiText(null);
    const result = await generate(
      `Suggest 5 specific, original sub-themes for a song whose primary theme is "${primary}". Return a short bullet list.`,
      () => localSubThemes(primary)
    );
    if (result.kind === "local") {
      patchThemes({ subThemes: result.data });
    } else {
      setAiText(result.text);
    }
    setBusy(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Primary theme */}
      <div className="space-y-5">
        <Field label="Primary Theme">
          <select
            value={t.primary}
            onChange={(e) => patchThemes({ primary: e.target.value })}
            className="input"
          >
            <option value="">Select a theme…</option>
            {THEME_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>

        <div>
          <p className="label-caps mb-2">Emotional Targets</p>
          <TagInput
            values={t.emotionalTargets}
            placeholder="Add an emotion (e.g. Obsession)"
            accent="burgundy"
            onAdd={(v) =>
              patchThemes({
                emotionalTargets: Array.from(new Set([...t.emotionalTargets, v])),
              })
            }
            onRemove={(v) =>
              patchThemes({
                emotionalTargets: t.emotionalTargets.filter((x) => x !== v),
              })
            }
          />
        </div>

        <div>
          <p className="label-caps mb-2">Keywords</p>
          <TagInput
            values={t.keywords}
            placeholder="Add a keyword (e.g. Fire)"
            onAdd={(v) =>
              patchThemes({ keywords: Array.from(new Set([...t.keywords, v])) })
            }
            onRemove={(v) =>
              patchThemes({ keywords: t.keywords.filter((x) => x !== v) })
            }
          />
        </div>

        <Field label="Concept Notes">
          <textarea
            value={t.conceptNotes}
            onChange={(e) => patchThemes({ conceptNotes: e.target.value })}
            rows={4}
            placeholder="What is this song really about?"
            className="input min-h-[96px] resize-y"
          />
        </Field>
      </div>

      {/* Sub-themes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="label-caps">Related Sub-Themes</p>
          <button
            onClick={generateSubThemes}
            disabled={busy}
            className="btn-brass px-3 py-1.5 text-xs"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            Generate
          </button>
        </div>

        {aiText ? (
          <AITextBlock text={aiText} />
        ) : t.subThemes.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line bg-sand/30 p-6 text-center text-sm text-muted">
            Pick a primary theme and generate related sub-themes to explore.
          </p>
        ) : (
          <div className="space-y-2">
            {t.subThemes.map((s) => (
              <div
                key={s}
                className="flex items-center justify-between rounded-lg border border-line bg-white/60 px-4 py-2.5"
              >
                <span className="text-sm text-ink">{s}</span>
                <button
                  onClick={() =>
                    patchThemes({
                      keywords: Array.from(new Set([...t.keywords, s])),
                    })
                  }
                  title="Add to keywords"
                  className="text-muted transition-colors hover:text-brass"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
