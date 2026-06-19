"use client";

import { useState } from "react";
import { Sparkles, Dumbbell, Check } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { hookTypes, hookWorkout, recentHooks } from "@/lib/mockData";

const generatedIdeas = [
  "Caught in the undertow",
  "You're my favorite mistake",
  "Burning down the quiet",
  "Hold me like a secret",
  "Every scar says your name",
];

export default function HookLabPage() {
  const [theme, setTheme] = useState("");
  const [emotion, setEmotion] = useState("");
  const [hookType, setHookType] = useState(hookTypes[0]);
  const [ideas, setIdeas] = useState<string[]>([]);

  const generate = () => {
    // Mock generator — in production this would call /api/tutor or a dedicated
    // generation endpoint seeded with theme/emotion/hookType.
    setIdeas(generatedIdeas);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Hook Lab"
        title="Hook Strength Training"
        subtitle="Build the most important muscle in songwriting — the ability to write a hook that won't let go."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Hook Builder */}
          <Card>
            <SectionTitle className="mb-4">Hook Builder</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Theme">
                <input
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g. Dangerous love"
                  className="input"
                />
              </Field>
              <Field label="Emotion">
                <input
                  value={emotion}
                  onChange={(e) => setEmotion(e.target.value)}
                  placeholder="e.g. Obsession"
                  className="input"
                />
              </Field>
              <Field label="Hook Type">
                <select
                  value={hookType}
                  onChange={(e) => setHookType(e.target.value)}
                  className="input"
                >
                  {hookTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </Field>
              <div className="flex items-end">
                <button onClick={generate} className="btn-brass w-full">
                  <Sparkles className="h-4 w-4" />
                  Generate Ideas
                </button>
              </div>
            </div>

            {ideas.length > 0 && (
              <div className="mt-5 space-y-2">
                <p className="label-caps">Generated Ideas</p>
                {ideas.map((idea) => (
                  <div
                    key={idea}
                    className="flex items-center justify-between rounded-lg border border-line bg-white/60 px-4 py-3"
                  >
                    <span className="text-sm text-ink">&ldquo;{idea}&rdquo;</span>
                    <span className="rounded-full bg-brass/15 px-2 py-0.5 font-serif text-xs text-brass">
                      {(7 + Math.random() * 2).toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent hooks */}
          <Card>
            <SectionTitle className="mb-4">Recent Hooks</SectionTitle>
            <div className="space-y-2">
              {recentHooks.map((hook) => (
                <div
                  key={hook.id}
                  className="flex items-center justify-between rounded-lg border border-line bg-white/60 px-4 py-3"
                >
                  <span className="text-sm text-ink">&ldquo;{hook.text}&rdquo;</span>
                  <ScoreBadge score={hook.score} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Today's workout */}
        <aside>
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-brass" />
              <SectionTitle>Today&apos;s Workout</SectionTitle>
            </div>
            <div className="space-y-3">
              {hookWorkout.map((item) => {
                const done = item.done >= item.total;
                return (
                  <div
                    key={item.task}
                    className="rounded-lg border border-line bg-sand/40 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ink">{item.task}</span>
                      {done ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <span className="text-xs text-muted">
                          {item.done}/{item.total}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-success"
                        style={{ width: `${(item.done / item.total) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-caps mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 8.5
      ? "bg-success/15 text-success"
      : score >= 7.5
        ? "bg-brass/15 text-brass"
        : "bg-amber/15 text-amber";
  return (
    <span className={`rounded-full px-2.5 py-0.5 font-serif text-xs ${color}`}>
      {score.toFixed(1)}
    </span>
  );
}
