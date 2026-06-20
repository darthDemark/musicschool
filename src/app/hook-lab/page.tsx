"use client";

import { useMemo, useState } from "react";
import {
  Sparkles,
  Dumbbell,
  Check,
  Target,
  BookOpen,
  PenLine,
  Gauge,
  Music2,
  Quote,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { Pill } from "@/components/Tabs";
import {
  genres,
  hookScoringRubric,
  hookStyles,
  hookTypes,
  hookWorkout,
  recentHooks,
} from "@/lib/mockData";
import type { HookStyle } from "@/lib/types";

type Tab = "Learn Hook Styles" | "Hook Builder" | "Hook Analysis";
const TABS: Tab[] = ["Learn Hook Styles", "Hook Builder", "Hook Analysis"];

const tabIcon: Record<Tab, typeof BookOpen> = {
  "Learn Hook Styles": BookOpen,
  "Hook Builder": PenLine,
  "Hook Analysis": Gauge,
};

export default function HookLabPage() {
  const [tab, setTab] = useState<Tab>("Learn Hook Styles");

  return (
    <div>
      <PageHeader
        eyebrow="Hook Lab"
        title="Hook Strength Training"
        subtitle="Study the craft of the hook, build new ones, and score them against a professional rubric."
      />

      {/* Top-level tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = tabIcon[t];
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "border-charcoal bg-charcoal text-ivory"
                  : "border-line bg-white/60 text-ink hover:border-brass"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t}
            </button>
          );
        })}
      </div>

      {tab === "Learn Hook Styles" && <LearnHookStyles />}
      {tab === "Hook Builder" && <HookBuilder />}
      {tab === "Hook Analysis" && <HookAnalysis />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab 1 — Learn Hook Styles                                          */
/* ------------------------------------------------------------------ */

function LearnHookStyles() {
  const [filter, setFilter] = useState<string>("All");
  const visible =
    filter === "All" ? hookStyles : hookStyles.filter((s) => s.name === filter);

  return (
    <div>
      {/* Filter buttons */}
      <div className="mb-5 flex flex-wrap gap-2">
        <Pill active={filter === "All"} onClick={() => setFilter("All")}>
          All
        </Pill>
        {hookStyles.map((style) => (
          <Pill
            key={style.id}
            active={filter === style.name}
            onClick={() => setFilter(style.name)}
          >
            {style.name}
          </Pill>
        ))}
      </div>

      <div
        className={
          filter === "All" ? "grid gap-5 lg:grid-cols-2" : "grid gap-5"
        }
      >
        {visible.map((style) => (
          <HookStyleCard key={style.id} style={style} detailed={filter !== "All"} />
        ))}
      </div>
    </div>
  );
}

function HookStyleCard({
  style,
  detailed,
}: {
  style: HookStyle;
  detailed?: boolean;
}) {
  return (
    <Card className="flex flex-col">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-brass/30 bg-brass/10 text-brass">
          <Music2 className="h-4 w-4" />
        </span>
        <SectionTitle>{style.name}</SectionTitle>
      </div>

      <p className="text-[15px] leading-relaxed text-ink">{style.definition}</p>

      <div className="mt-4">
        <p className="label-caps mb-1">Why It Works</p>
        <p className="text-sm text-muted">{style.purpose}</p>
      </div>

      <div className="mt-4">
        <p className="label-caps mb-2">Real Song References</p>
        <ul className="space-y-1.5">
          {style.examples.map((ex) => (
            <li key={ex} className="flex items-center gap-2 text-sm text-ink">
              <Quote className="h-3.5 w-3.5 shrink-0 text-brass" />
              {ex}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-lg border border-burgundy/20 bg-burgundy/5 p-4">
        <p className="label-caps mb-1 text-burgundy">Daily Drill</p>
        <p className="text-sm text-ink">{style.drill}</p>
      </div>

      {detailed && (
        <div className="mt-4">
          <p className="label-caps mb-2">Scoring Criteria</p>
          <div className="flex flex-wrap gap-2">
            {style.scoring.map((c) => (
              <span key={c} className="chip border-brass/30 bg-brass/10">
                <Target className="h-3 w-3 text-brass" />
                {c}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Tab 2 — Hook Builder                                               */
/* ------------------------------------------------------------------ */

const EMOTION_WORDS: Record<string, string[]> = {
  default: ["heart", "fire", "night", "again", "without you", "tonight"],
};

function buildIdeas(theme: string, emotion: string, hookType: string, genre: string) {
  const t = theme.trim() || "love";
  const e = emotion.trim() || "longing";
  const tail = EMOTION_WORDS.default;

  const templates = [
    `${capitalize(e)} in the ${tail[2]}`,
    `Can't ${randomVerb(t)} you`,
    `${capitalize(t)}, ${tail[5]}`,
    `All this ${e.toLowerCase()}`,
    `You're my ${t.toLowerCase()}`,
    `Hold the ${tail[1]}`,
  ];

  // Hook-type-specific framing so the suggestions feel purpose-built.
  const framing: Record<string, string> = {
    "Title Hook": "as a one-line song title",
    "Melodic Hook": "as a short repeatable sung phrase",
    "Rhythmic Hook": "set to a tight, chant-like rhythm",
    "Lyrical Hook": "as an emotionally loaded image",
    "Vocal Ad-lib Hook": "as an ad-lib or vocal cry",
    "Instrumental Hook": "as a 2-bar topline over a riff",
    "Production Hook": "anchored to a signature sound/drop",
    "Structural Hook": "landing on a surprise section shift",
  };

  return {
    note: `${hookType} ideas for a ${genre} record • ${framing[hookType] ?? ""}`.trim(),
    ideas: templates,
  };
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function randomVerb(seed: string) {
  const verbs = ["stay away from", "let go of", "forget", "run from", "lose"];
  return verbs[seed.length % verbs.length];
}

function HookBuilder() {
  const [theme, setTheme] = useState("");
  const [emotion, setEmotion] = useState("");
  const [hookType, setHookType] = useState(hookTypes[0]);
  const [genre, setGenre] = useState(genres[0]);
  const [result, setResult] = useState<{ note: string; ideas: string[] } | null>(
    null
  );

  const generate = () => {
    // Mock generator — production would call /api/tutor or a generation endpoint
    // seeded with hookType, emotion, theme, and genre.
    setResult(buildIdeas(theme, emotion, hookType, genre));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Card>
          <SectionTitle className="mb-4">Hook Builder</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
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
            <Field label="Genre">
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="input"
              >
                {genres.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </Field>
            <Field label="Emotion">
              <input
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                placeholder="e.g. Obsession"
                className="input"
              />
            </Field>
            <Field label="Theme">
              <input
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g. Dangerous love"
                className="input"
              />
            </Field>
          </div>
          <button onClick={generate} className="btn-brass mt-4 w-full sm:w-auto">
            <Sparkles className="h-4 w-4" />
            Generate Ideas
          </button>

          {result && (
            <div className="mt-5 space-y-2">
              <p className="label-caps">{result.note}</p>
              {result.ideas.map((idea) => (
                <div
                  key={idea}
                  className="flex items-center justify-between rounded-lg border border-line bg-white/60 px-4 py-3"
                >
                  <span className="text-sm text-ink">&ldquo;{idea}&rdquo;</span>
                  <span className="rounded-full bg-brass/15 px-2 py-0.5 font-serif text-xs text-brass">
                    {(7 + ((idea.length * 7) % 25) / 10).toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

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
  );
}

/* ------------------------------------------------------------------ */
/* Tab 3 — Hook Analysis                                              */
/* ------------------------------------------------------------------ */

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function HookAnalysis() {
  const [text, setText] = useState("");
  const [analyzed, setAnalyzed] = useState<string | null>(null);

  const scores = useMemo(() => {
    if (!analyzed) return null;
    const seed = hashString(analyzed.toLowerCase());
    const words = analyzed.trim().split(/\s+/).length;
    return hookScoringRubric.map((c, i) => {
      // Simple heuristics blended with a deterministic seed for variety.
      let base = 6.5 + (((seed >> (i * 2)) % 30) / 10);
      if (c.key === "simplicity") base += words <= 6 ? 1.2 : -0.6;
      if (c.key === "memorability") base += words <= 8 ? 0.6 : -0.3;
      return {
        ...c,
        value: Math.max(4, Math.min(10, +base.toFixed(1))),
      };
    });
  }, [analyzed]);

  const overall = scores
    ? +(scores.reduce((a, s) => a + s.value, 0) / scores.length).toFixed(1)
    : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Card>
        <SectionTitle className="mb-2">Analyze a Hook</SectionTitle>
        <p className="mb-4 text-sm text-muted">
          Paste your own hook to score it against the professional rubric. Enter
          only your original words — never copyrighted lyrics.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Type or paste your hook..."
          className="w-full resize-y rounded-lg border border-line bg-white/60 p-4 text-sm leading-relaxed text-ink outline-none placeholder:text-muted/60 focus:border-brass focus:ring-1 focus:ring-brass/30"
        />
        <button
          onClick={() => setAnalyzed(text)}
          disabled={!text.trim()}
          className="btn-primary mt-4"
        >
          <Gauge className="h-4 w-4" />
          Analyze Hook
        </button>

        {scores && (
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between rounded-lg border border-line bg-sand/50 p-4">
              <span className="font-serif text-lg text-ink">Overall Score</span>
              <span className="font-serif text-3xl text-burgundy">{overall}</span>
            </div>
            <div className="space-y-4">
              {scores.map((s) => (
                <div key={s.key}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-sm text-ink">{s.label}</span>
                    <span className="font-serif text-sm text-burgundy">
                      {s.value.toFixed(1)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-sand">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brass to-burgundy"
                      style={{ width: `${(s.value / 10) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <aside>
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-brass" />
            <SectionTitle>Scoring Rubric</SectionTitle>
          </div>
          <div className="space-y-3">
            {hookScoringRubric.map((c) => (
              <div
                key={c.key}
                className="rounded-lg border border-line bg-sand/40 p-3"
              >
                <p className="text-sm font-medium text-ink">{c.label}</p>
                <p className="text-xs text-muted">{c.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                        */
/* ------------------------------------------------------------------ */

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
