"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Dumbbell,
  Check,
  Trash2,
  Star,
  BookmarkPlus,
  Loader2,
  GraduationCap,
  Quote,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { FadeIn } from "@/components/Motion";
import { hookTypes, hookWorkout } from "@/lib/mockData";
import { hookLessons } from "@/lib/hookLessons";
import { getStorage, setStorage } from "@/lib/storage";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HookIdea {
  id: string;
  text: string;
  theme: string;
  emotion: string;
  hookType: string;
  score: number;
  rating: number; // user star rating 0–5
  savedAt: string;
}

// ---------------------------------------------------------------------------
// Mock idea pools (seeded by theme/emotion/type combinations)
// ---------------------------------------------------------------------------

const IDEA_POOLS: Record<string, string[]> = {
  danger: [
    "Caught in the undertow",
    "Burning down the quiet",
    "You're the risk I'd take again",
    "I know better — still I stay",
    "One touch and the whole thing breaks",
  ],
  love: [
    "You're my favorite mistake",
    "Hold me like a secret",
    "Every scar says your name",
    "Can't stay away from you",
    "Addicted to everything you are",
  ],
  pain: [
    "Still bleeding at the seams",
    "You left and I kept counting",
    "The ache that won't sit still",
    "Beautiful and breaking",
    "I wear the wound like gold",
  ],
  obsession: [
    "Danger in your eyes",
    "One touch, I'm gone",
    "You're the fire I can't put out",
    "Midnight in your arms again",
    "Losing sleep to find you",
  ],
  default: [
    "The moment before it all changed",
    "We were meant to burn",
    "Tell me something true",
    "Light me up one more time",
    "Gone before the morning comes",
  ],
};

function getIdeas(theme: string, emotion: string): string[] {
  const key = (theme + " " + emotion).toLowerCase();
  for (const [k, pool] of Object.entries(IDEA_POOLS)) {
    if (key.includes(k)) return pool;
  }
  return IDEA_POOLS.default;
}

function genScore(): number {
  return Math.round((6.5 + Math.random() * 3) * 10) / 10;
}

// ---------------------------------------------------------------------------
// Score badge
// ---------------------------------------------------------------------------

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score >= 8.5
      ? "bg-success/15 text-success"
      : score >= 7.5
        ? "bg-brass/15 text-brass"
        : "bg-amber/15 text-amber";
  return (
    <span className={`rounded-full px-2.5 py-0.5 font-serif text-xs ${cls}`}>
      {score.toFixed(1)}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Star rating
// ---------------------------------------------------------------------------

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          onClick={() => onChange(s === value ? 0 : s)}
          className={`transition-colors ${
            s <= value ? "text-amber" : "text-line"
          } hover:text-amber`}
        >
          <Star className="h-3.5 w-3.5 fill-current" />
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HookLabPage() {
  const [theme, setTheme] = useState("");
  const [emotion, setEmotion] = useState("");
  const [hookType, setHookType] = useState(hookTypes[0]);
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [savedHooks, setSavedHooks] = useState<HookIdea[]>([]);
  const [generating, setGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = getStorage<HookIdea[]>("hook-lab");
    if (saved) setSavedHooks(saved);
  }, []);

  const persist = (next: HookIdea[]) => {
    setSavedHooks(next);
    setStorage("hook-lab", next);
  };

  // Server-side generation (AI-first, with a local fallback in the route).
  const generate = async () => {
    setGenerating(true);
    setHasGenerated(true);
    try {
      const res = await fetch("/api/hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, emotion, hookType }),
      });
      const data = await res.json();
      const ideas: string[] = Array.isArray(data?.ideas) ? data.ideas : [];
      setGeneratedIdeas(ideas.length ? ideas : getIdeas(theme, emotion));
    } catch {
      setGeneratedIdeas(getIdeas(theme, emotion));
    } finally {
      setGenerating(false);
    }
  };

  const saveHook = (text: string) => {
    const newHook: HookIdea = {
      id: `hook-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text,
      theme,
      emotion,
      hookType,
      score: genScore(),
      rating: 0,
      savedAt: new Date().toLocaleDateString(),
    };
    persist([newHook, ...savedHooks]);
  };

  const updateRating = (id: string, rating: number) => {
    persist(savedHooks.map((h) => (h.id === id ? { ...h, rating } : h)));
  };

  const deleteHook = (id: string) => {
    persist(savedHooks.filter((h) => h.id !== id));
  };

  const alreadySaved = (text: string) =>
    savedHooks.some((h) => h.text === text);

  return (
    <div>
      <PageHeader
        eyebrow="Hook Lab"
        title="Hook Strength Training"
        subtitle="Build the most important muscle in songwriting — the ability to write a hook that won't let go."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Hook type lesson — unique training content per type */}
          {hookLessons[hookType] && (
            <Card>
              <FadeIn motionKey={hookType}>
                <div className="mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-brass" />
                  <SectionTitle>{hookType}</SectionTitle>
                </div>
                <p className="text-[15px] leading-relaxed text-ink">
                  {hookLessons[hookType].whatItIs}
                </p>
                <div className="mt-4">
                  <p className="label-caps mb-1">Why It Works</p>
                  <p className="text-sm text-muted">{hookLessons[hookType].whyItWorks}</p>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="label-caps mb-2">Examples</p>
                    <ul className="space-y-1.5">
                      {hookLessons[hookType].examples.map((ex) => (
                        <li key={ex} className="flex items-center gap-2 text-sm text-ink">
                          <Quote className="h-3.5 w-3.5 shrink-0 text-brass" />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="label-caps mb-2">Mechanics</p>
                    <ul className="space-y-1.5">
                      {hookLessons[hookType].mechanics.map((m) => (
                        <li key={m} className="flex gap-2 text-sm text-ink">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            </Card>
          )}

          {/* Hook Builder */}
          <Card>
            <SectionTitle className="mb-4">Hook Builder</SectionTitle>
            <p className="mb-4 text-sm text-muted">
              Choose a hook type to study it above, then generate ideas to practice.
            </p>
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
                <button
                  onClick={generate}
                  disabled={generating}
                  className="btn-brass w-full"
                >
                  {generating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Generate Ideas
                </button>
              </div>
            </div>

            {generating && (
              <p className="mt-5 flex items-center gap-2 text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin text-brass" />
                Generating hook ideas…
              </p>
            )}

            {!generating && hasGenerated && generatedIdeas.length === 0 && (
              <p className="mt-5 text-sm text-muted">
                No ideas yet — adjust the theme or emotion and generate again.
              </p>
            )}

            {!generating && generatedIdeas.length > 0 && (
              <div className="mt-5 space-y-2">
                <p className="label-caps">
                  Suggested Ideas{" "}
                  <span className="font-normal normal-case tracking-normal text-muted">
                    — save the ones worth keeping
                  </span>
                </p>
                {generatedIdeas.map((idea) => (
                  <div
                    key={idea}
                    className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white/60 px-4 py-3"
                  >
                    <span className="flex-1 text-sm text-ink">
                      &ldquo;{idea}&rdquo;
                    </span>
                    <div className="flex items-center gap-2">
                      <ScoreBadge score={genScore()} />
                      <button
                        onClick={() => saveHook(idea)}
                        disabled={alreadySaved(idea)}
                        title={alreadySaved(idea) ? "Already saved" : "Save hook"}
                        className={`flex h-7 w-7 items-center justify-center rounded-lg border transition-colors ${
                          alreadySaved(idea)
                            ? "border-success/30 bg-success/10 text-success"
                            : "border-line text-muted hover:border-brass hover:text-ink"
                        }`}
                      >
                        {alreadySaved(idea) ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <BookmarkPlus className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Saved hooks */}
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <SectionTitle>
                Saved Hooks{" "}
                {savedHooks.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-brass/15 px-2 py-0.5 font-mono text-xs text-brass">
                    {savedHooks.length}
                  </span>
                )}
              </SectionTitle>
            </div>

            {savedHooks.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted">
                No hooks saved yet. Generate ideas above and click the bookmark
                icon to save.
              </p>
            ) : (
              <div className="space-y-2">
                {savedHooks.map((hook) => (
                  <div
                    key={hook.id}
                    className="flex flex-col gap-2 rounded-lg border border-line bg-white/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-ink">
                        &ldquo;{hook.text}&rdquo;
                      </p>
                      {(hook.theme || hook.emotion) && (
                        <p className="mt-0.5 text-xs text-muted">
                          {[hook.theme, hook.emotion, hook.hookType]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <StarRating
                        value={hook.rating}
                        onChange={(r) => updateRating(hook.id, r)}
                      />
                      <ScoreBadge score={hook.score} />
                      <button
                        onClick={() => deleteHook(hook.id)}
                        className="text-muted transition-colors hover:text-burgundy"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                        style={{
                          width: `${(item.done / item.total) * 100}%`,
                        }}
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-caps mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}
