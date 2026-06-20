"use client";

import { useEffect, useState } from "react";
import {
  Play,
  RotateCcw,
  Lightbulb,
  ChevronRight,
  Flame,
  Check,
  X,
  Trophy,
  Eye,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { FadeIn } from "@/components/Motion";
import { PianoKeyboard } from "@/components/PianoKeyboard";
import { earTrainingModules } from "@/lib/mockData";
import { getStorage, setStorage } from "@/lib/storage";
import {
  DISCIPLINE_TITLES,
  makeQuestion,
  makeSingBack,
  midiName,
  type Discipline,
  type ETQuestion,
  type SingBackPhrase,
} from "@/lib/earTraining";

type Stats = { score: number; total: number; streak: number };
type AllStats = Record<string, Stats>;

const EMPTY: Stats = { score: 0, total: 0, streak: 0 };

export default function EarTrainingPage() {
  const [discipline, setDiscipline] = useState<Discipline>("intervals");
  const [stats, setStats] = useState<AllStats>({});
  const [question, setQuestion] = useState<ETQuestion>(() => makeQuestion("intervals"));
  const [phrase, setPhrase] = useState<SingBackPhrase>(() => makeSingBack());
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [round, setRound] = useState(0);

  // Restore active discipline + per-discipline stats.
  useEffect(() => {
    const savedDisc = getStorage<Discipline>("ear-training-discipline");
    const savedStats = getStorage<AllStats>("ear-training-stats");
    if (savedStats) setStats(savedStats);
    if (savedDisc && DISCIPLINE_TITLES[savedDisc]) {
      setDiscipline(savedDisc);
      if (savedDisc === "singback") setPhrase(makeSingBack());
      else setQuestion(makeQuestion(savedDisc));
    }
  }, []);

  const cur = stats[discipline] ?? EMPTY;

  const saveStats = (next: AllStats) => {
    setStats(next);
    setStorage("ear-training-stats", next);
  };

  const selectDiscipline = (id: Discipline) => {
    setDiscipline(id);
    setStorage("ear-training-discipline", id);
    setSelected(null);
    setRevealed(false);
    setShowHint(false);
    setShowNotes(false);
    if (id === "singback") setPhrase(makeSingBack());
    else setQuestion(makeQuestion(id));
    setRound((r) => r + 1);
  };

  // Auto-play each new multiple-choice question.
  useEffect(() => {
    if (discipline === "singback") return;
    const t = setTimeout(() => question.play(), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const choose = (name: string) => {
    if (revealed) return;
    setSelected(name);
    setRevealed(true);
    const correct = name === question.answer;
    const next: AllStats = {
      ...stats,
      [discipline]: {
        score: cur.score + (correct ? 1 : 0),
        total: cur.total + 1,
        streak: correct ? cur.streak + 1 : 0,
      },
    };
    saveStats(next);
  };

  const nextQuestion = () => {
    setSelected(null);
    setRevealed(false);
    setShowHint(false);
    setShowNotes(false);
    setQuestion(makeQuestion(discipline));
    setRound((r) => r + 1);
  };

  const rateSingBack = (matched: boolean) => {
    const next: AllStats = {
      ...stats,
      [discipline]: {
        score: cur.score + (matched ? 1 : 0),
        total: cur.total + 1,
        streak: matched ? cur.streak + 1 : 0,
      },
    };
    saveStats(next);
    setShowNotes(false);
    setPhrase(makeSingBack());
  };

  const accuracy = cur.total > 0 ? Math.round((cur.score / cur.total) * 100) : 0;
  const activeNotes =
    discipline === "singback"
      ? showNotes
        ? phrase.notes
        : []
      : revealed || showNotes
        ? question.notes
        : [];

  return (
    <div>
      <PageHeader
        eyebrow="Ear Training"
        title="The Ear Gym"
        subtitle="Focused, repeatable drills to sharpen interval, chord, rhythmic, and melodic recognition."
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Disciplines (clickable) + session stats */}
        <aside className="space-y-3">
          <p className="label-caps mb-2">Disciplines</p>
          {earTrainingModules.map((mod) => {
            const active = mod.id === discipline;
            const s = stats[mod.id] ?? EMPTY;
            const acc = s.total > 0 ? Math.round((s.score / s.total) * 100) : mod.accuracy;
            return (
              <button
                key={mod.id}
                onClick={() => selectDiscipline(mod.id as Discipline)}
                className={`card w-full p-4 text-left transition-all hover:shadow-card-hover ${
                  active ? "ring-2 ring-brass/50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink">{mod.label}</span>
                  <span className="font-serif text-sm text-brass">{acc}%</span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-sand">
                  <div
                    className="h-full rounded-full bg-success transition-all duration-500"
                    style={{ width: `${acc}%` }}
                  />
                </div>
              </button>
            );
          })}

          {cur.total > 0 && (
            <div className="card p-4">
              <div className="mb-2 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-brass" />
                <p className="label-caps">Session</p>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Correct</span>
                  <span className="font-serif text-success">
                    {cur.score}/{cur.total}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Accuracy</span>
                  <span className="font-serif text-ink">{accuracy}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Streak</span>
                  <span className="flex items-center gap-1 font-serif text-amber">
                    <Flame className="h-3.5 w-3.5" />
                    {cur.streak}
                  </span>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Exercise area */}
        <div className="space-y-6">
          <Card>
            <FadeIn motionKey={discipline}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="label-caps text-brass">Current Exercise</p>
                  <SectionTitle className="mt-1">
                    {DISCIPLINE_TITLES[discipline]}
                  </SectionTitle>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-amber/30 bg-amber/10 px-3 py-2">
                  <Flame className="h-4 w-4 text-amber" />
                  <span className="font-serif text-lg text-ink">{cur.streak}</span>
                  <span className="label-caps">Streak</span>
                </div>
              </div>

              {discipline === "singback" ? (
                <SingBack
                  phrase={phrase}
                  showNotes={showNotes}
                  onReveal={() => setShowNotes(true)}
                  onRate={rateSingBack}
                />
              ) : (
                <MultipleChoice
                  question={question}
                  selected={selected}
                  revealed={revealed}
                  showHint={showHint}
                  onChoose={choose}
                  onToggleHint={() => setShowHint((h) => !h)}
                  onReplay={() => question.play()}
                  onNext={nextQuestion}
                />
              )}

              {/* Piano keyboard — shared visual reference */}
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="label-caps">Visual Reference</p>
                  {discipline !== "rhythm" && !revealed && discipline !== "singback" && (
                    <button
                      onClick={() => setShowNotes((s) => !s)}
                      className="flex items-center gap-1 text-xs text-muted transition-colors hover:text-ink"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {showNotes ? "Hide notes" : "Show notes"}
                    </button>
                  )}
                </div>
                <PianoKeyboard activeNotes={activeNotes} startMidi={48} endMidi={72} />
                {activeNotes.length > 0 && (
                  <p className="mt-1.5 text-xs text-muted">
                    {activeNotes.map(midiName).join(" · ")}
                  </p>
                )}
              </div>
            </FadeIn>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MultipleChoice({
  question,
  selected,
  revealed,
  showHint,
  onChoose,
  onToggleHint,
  onReplay,
  onNext,
}: {
  question: ETQuestion;
  selected: string | null;
  revealed: boolean;
  showHint: boolean;
  onChoose: (name: string) => void;
  onToggleHint: () => void;
  onReplay: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <div className="mt-6 flex items-center gap-4 rounded-xl2 border border-line bg-charcoal p-5">
        <button
          onClick={onReplay}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brass text-charcoal transition-transform hover:scale-105"
        >
          <Play className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <p className="font-serif text-base text-ivory/90">{question.prompt}…</p>
          <p className="mt-0.5 text-xs text-white/45">
            Press play, listen, then choose your answer.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {question.options.map((opt) => {
          const isAnswer = opt === question.answer;
          const isChosen = opt === selected;
          let cls =
            "border-line bg-white/60 text-ink hover:border-brass hover:bg-brass/5 cursor-pointer";
          if (revealed && isAnswer)
            cls = "border-success bg-success/10 text-ink cursor-default";
          else if (revealed && isChosen && !isAnswer)
            cls = "border-burgundy bg-burgundy/10 text-burgundy cursor-default";
          else if (revealed)
            cls = "border-line bg-white/40 text-muted cursor-default opacity-70";
          return (
            <button
              key={opt}
              onClick={() => onChoose(opt)}
              disabled={revealed}
              className={`flex items-center justify-between rounded-lg border px-4 py-3.5 text-sm font-medium transition-colors ${cls}`}
            >
              {opt}
              {revealed && isAnswer && <Check className="h-4 w-4 shrink-0 text-success" />}
              {revealed && isChosen && !isAnswer && (
                <X className="h-4 w-4 shrink-0 text-burgundy" />
              )}
            </button>
          );
        })}
      </div>

      {showHint && (
        <div className="mt-4 flex gap-2.5 rounded-lg border border-amber/30 bg-amber/10 p-4 text-sm text-ink">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
          <span>{question.hint}</span>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button onClick={onToggleHint} className="btn-ghost">
          <Lightbulb className="h-4 w-4" />
          {showHint ? "Hide Hint" : "Hint"}
        </button>
        <button onClick={onReplay} className="btn-ghost">
          <RotateCcw className="h-4 w-4" />
          Hear Again
        </button>
        <button onClick={onNext} disabled={!revealed} className="btn-primary ml-auto">
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}

function SingBack({
  phrase,
  showNotes,
  onReveal,
  onRate,
}: {
  phrase: SingBackPhrase;
  showNotes: boolean;
  onReveal: () => void;
  onRate: (matched: boolean) => void;
}) {
  return (
    <>
      <div className="mt-6 flex items-center gap-4 rounded-xl2 border border-line bg-charcoal p-5">
        <button
          onClick={phrase.play}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brass text-charcoal transition-transform hover:scale-105"
        >
          <Play className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <p className="font-serif text-base text-ivory/90">
            Call &amp; response — sing the phrase back
          </p>
          <p className="mt-0.5 text-xs text-white/45">
            Listen, sing it back, then reveal to check yourself.
          </p>
        </div>
      </div>

      {showNotes && (
        <div className="mt-4 rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-ink">
          Phrase: <span className="font-serif">{phrase.label}</span>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button onClick={phrase.play} className="btn-ghost">
          <RotateCcw className="h-4 w-4" />
          Hear Again
        </button>
        {!showNotes ? (
          <button onClick={onReveal} className="btn-primary ml-auto">
            <Eye className="h-4 w-4" />
            Show Answer
          </button>
        ) : (
          <div className="ml-auto flex gap-2">
            <button onClick={() => onRate(false)} className="btn-ghost">
              <X className="h-4 w-4" />
              Missed it
            </button>
            <button onClick={() => onRate(true)} className="btn-primary">
              <Check className="h-4 w-4" />
              I matched it
            </button>
          </div>
        )}
      </div>
    </>
  );
}
