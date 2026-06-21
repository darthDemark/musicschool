"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Check,
  Trash2,
  Star,
  BookmarkPlus,
  Loader2,
  GraduationCap,
  Quote,
  Wand2,
  Gauge,
  Send,
  ArrowRight,
  MapPin,
  Music2,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { FadeIn } from "@/components/Motion";
import { WorkoutPanel } from "@/components/WorkoutPanel";
import { useWorkout } from "@/lib/useWorkout";
import { getStorage, setStorage } from "@/lib/storage";
import { logActivity } from "@/lib/activity";
import { loadProjects, saveProjects, loadActiveId } from "@/lib/writerTools";
import {
  HOOK_TYPES,
  hookTypeLessons,
  scoreHook,
  scoringRubric,
  transformIdea,
  rewriteHook,
  REWRITE_LABELS,
  type HookType,
  type RewriteMode,
} from "@/lib/hookLab";

const TABS = ["Learn Hook Types", "Hook Builder", "Hook Transformer"] as const;
type Tab = (typeof TABS)[number];

const GENRES = ["Pop", "Rock", "R&B", "Soul", "Funk", "Hip-Hop", "Jazz", "Film", "EDM", "Country"];

interface SavedHook {
  id: string;
  text: string;
  hookType: string;
  score: number;
  rating: number;
  isChorus: boolean;
  savedAt: string;
}

export default function HookLabPage() {
  const [tab, setTab] = useState<Tab>("Learn Hook Types");
  const [selectedHookType, setSelectedHookType] = useState<HookType>("Title Hook");

  // Builder
  const [theme, setTheme] = useState("");
  const [emotion, setEmotion] = useState("");
  const [genre, setGenre] = useState(GENRES[0]);
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [analyzedId, setAnalyzedId] = useState<string | null>(null);

  // Transformer
  const [baseIdea, setBaseIdea] = useState("");
  const [transformedHook, setTransformedHook] = useState("");

  const [savedHooks, setSavedHooks] = useState<SavedHook[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const wk = useWorkout();

  useEffect(() => {
    const saved = getStorage<SavedHook[]>("hook-saved");
    if (saved) setSavedHooks(saved);
    const base = getStorage<string>("hook-base-idea");
    if (base) setBaseIdea(base);
  }, []);

  // Keep the transformation in sync with base idea + hook type (no base loss).
  useEffect(() => {
    setTransformedHook(transformIdea(baseIdea || "blue skies", selectedHookType));
  }, [baseIdea, selectedHookType]);

  const persistSaved = (next: SavedHook[]) => {
    setSavedHooks(next);
    setStorage("hook-saved", next);
  };

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const saveHook = (text: string, hookType: string, opts?: { chorus?: boolean }) => {
    const hook: SavedHook = {
      id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text,
      hookType,
      score: scoreHook(text, hookType).overall,
      rating: 0,
      isChorus: !!opts?.chorus,
      savedAt: new Date().toLocaleDateString(),
    };
    persistSaved([hook, ...savedHooks]);
    logActivity();
    // Workout: increment the relevant action(s).
    wk.recordAction("save");
    if (hookType === "Title Hook") wk.recordAction("title");
    if (hookType === "Melodic Hook") wk.recordAction("melodic");
    if (opts?.chorus) wk.recordAction("chorus");
    flash(opts?.chorus ? "Saved as chorus candidate" : "Hook saved");
  };

  const analyzeHook = (id: string) => {
    setAnalyzedId((prev) => (prev === id ? null : id));
    if (analyzedId !== id) wk.recordAction("analyze");
  };

  const generate = async () => {
    setGenerating(true);
    setHasGenerated(true);
    try {
      const res = await fetch("/api/hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, emotion, hookType: selectedHookType }),
      });
      const data = await res.json();
      setGeneratedIdeas(Array.isArray(data?.ideas) ? data.ideas : []);
    } catch {
      setGeneratedIdeas([]);
    } finally {
      setGenerating(false);
    }
  };

  const setAsBaseIdea = (text: string) => {
    setBaseIdea(text);
    setStorage("hook-base-idea", text);
    setTab("Hook Transformer");
    flash("Set as base idea");
  };

  const transformAndCount = () => {
    setTransformedHook(transformIdea(baseIdea || "blue skies", selectedHookType));
    wk.recordAction("transform");
  };

  const rewrite = (mode: RewriteMode) => {
    setTransformedHook((cur) => rewriteHook(cur, mode));
    wk.recordAction("rewrite");
  };

  const sendToWritersRoom = (text: string) => {
    try {
      const projects = loadProjects();
      const activeId = loadActiveId(projects[0]?.id ?? "");
      const idx = projects.findIndex((p) => p.id === activeId);
      const target = idx >= 0 ? idx : 0;
      if (projects[target]) {
        const note = `Hook idea (${selectedHookType}): ${text}`;
        projects[target] = {
          ...projects[target],
          notes: projects[target].notes ? `${projects[target].notes}\n${note}` : note,
          updatedAt: Date.now(),
          isExample: false,
        };
        saveProjects(projects);
        flash("Sent to Writer's Room");
      }
    } catch {
      flash("Could not reach Writer's Room");
    }
  };

  const updateRating = (id: string, rating: number) =>
    persistSaved(savedHooks.map((h) => (h.id === id ? { ...h, rating } : h)));
  const deleteHook = (id: string) =>
    persistSaved(savedHooks.filter((h) => h.id !== id));

  const lesson = hookTypeLessons[selectedHookType];

  return (
    <div>
      <PageHeader
        eyebrow="Hook Lab"
        title="Hook Strength Training"
        subtitle="Learn how hooks work, hear them in real songs, and transform one idea into many hook forms."
      />

      {toast && (
        <div className="mb-4 rounded-lg border border-success/40 bg-success/10 px-4 py-2.5 text-sm text-ink">
          {toast}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t
                ? "border-charcoal bg-charcoal text-ivory"
                : "border-line bg-white/60 text-ink hover:border-brass"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Hook type selector — shared across Learn & Transformer */}
          {tab !== "Hook Builder" && (
            <Card>
              <p className="label-caps mb-3">Hook Type</p>
              <div className="flex flex-wrap gap-2">
                {HOOK_TYPES.map((h) => (
                  <button
                    key={h}
                    onClick={() => setSelectedHookType(h)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                      selectedHookType === h
                        ? "border-brass bg-brass/15 font-medium text-ink"
                        : "border-line bg-white/60 text-muted hover:border-brass/50 hover:text-ink"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {tab === "Learn Hook Types" && (
            <Card>
              <FadeIn motionKey={selectedHookType}>
                <div className="mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-brass" />
                  <SectionTitle>{lesson.type}</SectionTitle>
                </div>
                <p className="text-[15px] leading-relaxed text-ink">{lesson.definition}</p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field icon={MapPin} label="Where It Appears" text={lesson.whereFound} />
                  <Field icon={Sparkles} label="Why It Works" text={lesson.whyItWorks} />
                </div>

                <div className="mt-4">
                  <p className="label-caps mb-2">Common Genres</p>
                  <div className="flex flex-wrap gap-2">
                    {lesson.genres.map((g) => (
                      <span key={g} className="chip">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="label-caps mb-2">Real Song References</p>
                  <ul className="space-y-1.5">
                    {lesson.references.map((r) => (
                      <li key={r} className="flex items-center gap-2 text-sm text-ink">
                        <Quote className="h-3.5 w-3.5 shrink-0 text-brass" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 rounded-lg border border-burgundy/20 bg-burgundy/5 p-4">
                  <p className="label-caps mb-1 text-burgundy">Practice Drill</p>
                  <p className="text-sm text-ink">{lesson.drill}</p>
                </div>
              </FadeIn>
            </Card>
          )}

          {tab === "Hook Builder" && (
            <Card>
              <SectionTitle className="mb-4">Hook Builder</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Theme" value={theme} setValue={setTheme} placeholder="e.g. Dangerous love" />
                <Input label="Emotion" value={emotion} setValue={setEmotion} placeholder="e.g. Obsession" />
                <Select label="Genre" value={genre} setValue={setGenre} options={GENRES} />
                <Select
                  label="Hook Type"
                  value={selectedHookType}
                  setValue={(v) => setSelectedHookType(v as HookType)}
                  options={[...HOOK_TYPES]}
                />
              </div>
              <button onClick={generate} disabled={generating} className="btn-brass mt-4">
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate Ideas
              </button>

              {generating && (
                <p className="mt-5 flex items-center gap-2 text-sm text-muted">
                  <Loader2 className="h-4 w-4 animate-spin text-brass" /> Generating…
                </p>
              )}

              {!generating && hasGenerated && generatedIdeas.length === 0 && (
                <p className="mt-5 text-sm text-muted">No ideas — adjust inputs and try again.</p>
              )}

              {!generating && generatedIdeas.length > 0 && (
                <div className="mt-5 space-y-2">
                  <p className="label-caps">Generated Ideas — save the ones worth keeping</p>
                  {generatedIdeas.map((idea, i) => {
                    const id = `gen-${i}`;
                    const sc = scoreHook(idea, selectedHookType);
                    const open = analyzedId === id;
                    return (
                      <div key={id} className="rounded-lg border border-line bg-white/60 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex-1 text-sm text-ink">&ldquo;{idea}&rdquo;</span>
                          <ScoreBadge score={sc.overall} />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <MiniBtn onClick={() => saveHook(idea, selectedHookType)} icon={BookmarkPlus}>
                            Save
                          </MiniBtn>
                          <MiniBtn onClick={() => saveHook(idea, selectedHookType, { chorus: true })} icon={Music2}>
                            Save as Chorus
                          </MiniBtn>
                          <MiniBtn onClick={() => setAsBaseIdea(idea)} icon={ArrowRight}>
                            Use as Base
                          </MiniBtn>
                          <MiniBtn onClick={() => analyzeHook(id)} icon={Gauge}>
                            {open ? "Hide Analysis" : "Analyze"}
                          </MiniBtn>
                        </div>
                        {open && <Rubric score={sc} />}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          )}

          {tab === "Hook Transformer" && (
            <Card>
              <SectionTitle className="mb-1">Hook Transformer</SectionTitle>
              <p className="mb-4 text-sm text-muted">
                Enter one raw idea, then see it become every type of hook.
              </p>
              <Input
                label="Base Idea"
                value={baseIdea}
                setValue={(v) => {
                  setBaseIdea(v);
                  setStorage("hook-base-idea", v);
                }}
                placeholder="e.g. blue skies"
              />

              <div className="mt-5 rounded-lg border border-brass/30 bg-brass/5 p-4">
                <FadeIn motionKey={selectedHookType + transformedHook}>
                  <p className="label-caps mb-1 text-brass">
                    {selectedHookType} of &ldquo;{baseIdea || "blue skies"}&rdquo;
                  </p>
                  <p className="text-[15px] leading-relaxed text-ink">{transformedHook}</p>
                </FadeIn>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <MiniBtn onClick={transformAndCount} icon={Wand2}>
                  Transform This Idea
                </MiniBtn>
                {REWRITE_LABELS.map((r) => (
                  <MiniBtn key={r.mode} onClick={() => rewrite(r.mode)} icon={Wand2}>
                    {r.label}
                  </MiniBtn>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <MiniBtn onClick={() => saveHook(transformedHook, selectedHookType)} icon={BookmarkPlus}>
                  Save Hook
                </MiniBtn>
                <MiniBtn onClick={() => sendToWritersRoom(transformedHook)} icon={Send}>
                  Send to Writer&apos;s Room
                </MiniBtn>
              </div>

              <div className="mt-5">
                <Rubric score={scoreHook(transformedHook, selectedHookType)} />
              </div>
            </Card>
          )}

          {/* Saved hooks */}
          <Card>
            <SectionTitle className="mb-4">
              Saved Hooks{" "}
              {savedHooks.length > 0 && (
                <span className="ml-1.5 rounded-full bg-brass/15 px-2 py-0.5 font-mono text-xs text-brass">
                  {savedHooks.length}
                </span>
              )}
            </SectionTitle>
            {savedHooks.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted">
                No hooks saved yet. Generate or transform ideas and save the best.
              </p>
            ) : (
              <div className="space-y-2">
                {savedHooks.map((hook) => (
                  <div
                    key={hook.id}
                    className="flex flex-col gap-2 rounded-lg border border-line bg-white/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-ink">&ldquo;{hook.text}&rdquo;</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {[hook.hookType, hook.isChorus ? "Chorus candidate" : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StarRating value={hook.rating} onChange={(r) => updateRating(hook.id, r)} />
                      <ScoreBadge score={hook.score} />
                      <button
                        onClick={() => deleteHook(hook.id)}
                        className="text-muted transition-colors hover:text-burgundy"
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

        {/* Workout sidebar */}
        <aside>
          <Card>
            <WorkoutPanel
              workout={wk.workout}
              meta={wk.meta}
              progress={wk.progress}
              celebrate={wk.celebrate}
              onGenerate={wk.generate}
              onDismiss={wk.dismissCelebrate}
            />
          </Card>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------- bits ------------------------------------ */

function Field({
  icon: Icon,
  label,
  text,
}: {
  icon: typeof MapPin;
  label: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-sand/40 p-3">
      <p className="label-caps mb-1 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-brass" />
        {label}
      </p>
      <p className="text-sm text-ink">{text}</p>
    </div>
  );
}

function Input({
  label,
  value,
  setValue,
  placeholder,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="label-caps mb-1.5 block">{label}</span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="input"
      />
    </label>
  );
}

function Select({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="label-caps mb-1.5 block">{label}</span>
      <select value={value} onChange={(e) => setValue(e.target.value)} className="input">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function MiniBtn({
  onClick,
  icon: Icon,
  children,
}: {
  onClick: () => void;
  icon: typeof Wand2;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white/70 px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brass hover:bg-brass/10"
    >
      <Icon className="h-3.5 w-3.5 text-brass" />
      {children}
    </button>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score >= 8.5
      ? "bg-success/15 text-success"
      : score >= 7.5
        ? "bg-brass/15 text-brass"
        : "bg-amber/15 text-amber";
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-0.5 font-serif text-xs ${cls}`}>
      {score.toFixed(1)}
    </span>
  );
}

function Rubric({ score }: { score: ReturnType<typeof scoreHook> }) {
  return (
    <div className="mt-3 rounded-lg border border-line bg-sand/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="label-caps">Scoring Rubric</p>
        <span className="font-serif text-lg text-burgundy">{score.overall}</span>
      </div>
      <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
        {score.scores.map((s, i) => (
          <div key={s.label}>
            <div className="mb-0.5 flex items-center justify-between text-xs">
              <span className="text-ink">{s.label}</span>
              <span className="font-serif text-burgundy">{s.value.toFixed(1)}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brass to-burgundy"
                style={{ width: `${(s.value / 10) * 100}%` }}
              />
            </div>
            <p className="mt-0.5 text-[10px] text-muted">{scoringRubric[i]?.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          onClick={() => onChange(s === value ? 0 : s)}
          className={`transition-colors ${s <= value ? "text-amber" : "text-line"} hover:text-amber`}
        >
          <Star className="h-3.5 w-3.5 fill-current" />
        </button>
      ))}
    </div>
  );
}
