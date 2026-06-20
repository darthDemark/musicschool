"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Play,
  RotateCcw,
  Lightbulb,
  ChevronRight,
  Flame,
  Check,
  X,
  Trophy,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { PianoKeyboard } from "@/components/PianoKeyboard";
import { playInterval } from "@/lib/audioEngine";
import { earTrainingModules } from "@/lib/mockData";
import { getStorage, setStorage } from "@/lib/storage";

// ---------------------------------------------------------------------------
// Interval catalogue (all 12)
// ---------------------------------------------------------------------------

const INTERVALS = [
  {
    name: "Minor 2nd",
    semitones: 1,
    hint: "Half step — sounds like Jaws approaching. Very dissonant and tense.",
  },
  {
    name: "Major 2nd",
    semitones: 2,
    hint: "Whole step — the opening interval of Happy Birthday.",
  },
  {
    name: "Minor 3rd",
    semitones: 3,
    hint: "The opening riff of Smoke on the Water. Slightly sad, close.",
  },
  {
    name: "Major 3rd",
    semitones: 4,
    hint: "Bright and major — When the Saints Go Marching In opens with this.",
  },
  {
    name: "Perfect 4th",
    semitones: 5,
    hint: "Here Comes the Bride. Open, stable, the 'wedding march' interval.",
  },
  {
    name: "Tritone",
    semitones: 6,
    hint: "The Simpsons theme, or the opening of Maria (West Side Story). Tense, ambiguous.",
  },
  {
    name: "Perfect 5th",
    semitones: 7,
    hint: "Star Wars main theme. Open, hollow, powerful.",
  },
  {
    name: "Minor 6th",
    semitones: 8,
    hint: "The Love Story theme. Slightly melancholic with a wide leap.",
  },
  {
    name: "Major 6th",
    semitones: 9,
    hint: "My Bonnie Lies Over the Ocean. Bright and warm.",
  },
  {
    name: "Minor 7th",
    semitones: 10,
    hint: "There's a Place for Us (Somewhere). Wide, yearning, slightly tense.",
  },
  {
    name: "Major 7th",
    semitones: 11,
    hint: "Take On Me second phrase. Very wide and tense — almost an octave.",
  },
  {
    name: "Octave",
    semitones: 12,
    hint: "Somewhere Over the Rainbow opening. Wide, pure, and complete.",
  },
];

// ---------------------------------------------------------------------------
// Question generation
// ---------------------------------------------------------------------------

interface Question {
  correct: (typeof INTERVALS)[number];
  root: number;
  options: (typeof INTERVALS)[number][];
}

function randomRoot(): number {
  // C3–G3 (MIDI 48–55) so the upper note stays within C3–C5
  return 48 + Math.floor(Math.random() * 8);
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateQuestion(): Question {
  const correct = INTERVALS[Math.floor(Math.random() * INTERVALS.length)];
  const root = randomRoot();
  const others = shuffle(INTERVALS.filter((i) => i.name !== correct.name)).slice(0, 3);
  const options = shuffle([...others, correct]);
  return { correct, root, options };
}

// ---------------------------------------------------------------------------
// Persistence shape
// ---------------------------------------------------------------------------

interface EarTrainingState {
  score: number;
  total: number;
  streak: number;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function EarTrainingPage() {
  const [question, setQuestion] = useState<Question>(generateQuestion);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [activeNotes, setActiveNotes] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load persisted progress on mount
  useEffect(() => {
    const saved = getStorage<EarTrainingState>("ear-training");
    if (saved) {
      setScore(saved.score ?? 0);
      setTotal(saved.total ?? 0);
      setStreak(saved.streak ?? 0);
    }
  }, []);

  const playCurrentInterval = useCallback(() => {
    if (isPlaying) return;
    const { root, correct } = question;
    const upper = root + correct.semitones;
    const dur = 0.85;

    setIsPlaying(true);
    setActiveNotes([root]);

    setTimeout(() => {
      setActiveNotes([upper]);
      setTimeout(() => {
        setActiveNotes([]);
        setIsPlaying(false);
      }, dur * 1000 + 100);
    }, (dur + 0.1) * 1000);

    playInterval(root, correct.semitones, true, dur);
  }, [question, isPlaying]);

  // Auto-play when a new question loads
  useEffect(() => {
    const t = setTimeout(playCurrentInterval, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  const choose = (name: string) => {
    if (revealed) return;
    setSelected(name);
    setRevealed(true);

    const correct = name === question.correct.name;
    const ns = correct ? score + 1 : score;
    const nt = total + 1;
    const nk = correct ? streak + 1 : 0;

    setScore(ns);
    setTotal(nt);
    setStreak(nk);
    setStorage<EarTrainingState>("ear-training", { score: ns, total: nt, streak: nk });
  };

  const next = () => {
    setSelected(null);
    setRevealed(false);
    setShowHint(false);
    setActiveNotes([]);
    setIsPlaying(false);
    setQuestion(generateQuestion());
  };

  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
  const rootName = `${["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][question.root % 12]}${Math.floor(question.root / 12) - 1}`;

  return (
    <div>
      <PageHeader
        eyebrow="Ear Training"
        title="The Ear Gym"
        subtitle="Focused, repeatable drills to sharpen interval, chord, and rhythmic recognition."
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar: modules + session stats */}
        <aside className="space-y-3">
          <p className="label-caps mb-2">Disciplines</p>
          {earTrainingModules.map((mod) => {
            const displayAcc =
              mod.id === "intervals" && total > 0 ? accuracy : mod.accuracy;
            return (
              <div
                key={mod.id}
                className={`card p-4 ${mod.active ? "ring-2 ring-brass/50" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink">{mod.label}</span>
                  <span className="font-serif text-sm text-brass">{displayAcc}%</span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-sand">
                  <div
                    className="h-full rounded-full bg-success transition-all duration-500"
                    style={{ width: `${displayAcc}%` }}
                  />
                </div>
              </div>
            );
          })}

          {total > 0 && (
            <div className="card p-4">
              <div className="mb-2 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-brass" />
                <p className="label-caps">Session</p>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Correct</span>
                  <span className="font-serif text-success">
                    {score}/{total}
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
                    {streak}
                  </span>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Exercise area */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="label-caps text-brass">Current Exercise</p>
                <SectionTitle className="mt-1">Interval Identification</SectionTitle>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-amber/30 bg-amber/10 px-3 py-2">
                <Flame className="h-4 w-4 text-amber" />
                <span className="font-serif text-lg text-ink">{streak}</span>
                <span className="label-caps">Streak</span>
              </div>
            </div>

            {/* Play area */}
            <div className="mt-6 flex items-center gap-4 rounded-xl2 border border-line bg-charcoal p-5">
              <button
                onClick={playCurrentInterval}
                disabled={isPlaying}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brass text-charcoal transition-transform hover:scale-105 disabled:opacity-60"
              >
                <Play className="h-6 w-6" />
              </button>
              <div className="flex-1">
                <p className="font-serif text-base text-ivory/90">
                  {revealed ? question.correct.name : "Identify the interval…"}
                </p>
                <p className="mt-0.5 text-xs text-white/45">
                  Root: {rootName}
                </p>
              </div>
              {/* Decorative waveform */}
              <div className="flex h-10 items-center gap-[2px] overflow-hidden opacity-70">
                {Array.from({ length: 32 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-[2px] shrink-0 rounded-full transition-all ${
                      isPlaying ? "bg-brass" : "bg-white/30"
                    }`}
                    style={{
                      height: `${20 + Math.abs(Math.sin(i * 0.65)) * 80}%`,
                    }}
                  />
                ))}
              </div>
            </div>

            <p className="mt-5 text-center text-sm text-muted">
              Press play, listen carefully, then choose the correct answer below.
            </p>

            {/* Answer choices */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {question.options.map((opt) => {
                const isAnswer = opt.name === question.correct.name;
                const isChosen = opt.name === selected;
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
                    key={opt.name}
                    onClick={() => choose(opt.name)}
                    disabled={revealed}
                    className={`flex items-center justify-between rounded-lg border px-4 py-3.5 text-sm font-medium transition-colors ${cls}`}
                  >
                    {opt.name}
                    {revealed && isAnswer && (
                      <Check className="h-4 w-4 shrink-0 text-success" />
                    )}
                    {revealed && isChosen && !isAnswer && (
                      <X className="h-4 w-4 shrink-0 text-burgundy" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hint */}
            {showHint && (
              <div className="mt-4 flex gap-2.5 rounded-lg border border-amber/30 bg-amber/10 p-4 text-sm text-ink">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
                <span>{question.correct.hint}</span>
              </div>
            )}

            {/* Piano keyboard — highlights the two notes of the interval */}
            <div className="mt-6">
              <p className="label-caps mb-2">Visual Reference</p>
              <PianoKeyboard
                activeNotes={activeNotes}
                startMidi={48}
                endMidi={72}
              />
            </div>

            {/* Controls */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowHint((h) => !h)}
                className="btn-ghost"
              >
                <Lightbulb className="h-4 w-4" />
                {showHint ? "Hide Hint" : "Hint"}
              </button>
              <button
                onClick={playCurrentInterval}
                disabled={isPlaying}
                className="btn-ghost"
              >
                <RotateCcw className="h-4 w-4" />
                Hear Again
              </button>
              <button
                onClick={next}
                disabled={!revealed}
                className="btn-primary ml-auto"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
