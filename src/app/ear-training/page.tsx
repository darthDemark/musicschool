"use client";

import { useState } from "react";
import { Play, RotateCcw, Lightbulb, ChevronRight, Flame, Check, X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { earTrainingModules, intervalExercise } from "@/lib/mockData";

export default function EarTrainingPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(7);

  const choose = (option: string) => {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);
    if (option === intervalExercise.answer) {
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    setSelected(null);
    setRevealed(false);
    setShowHint(false);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Ear Training"
        title="The Ear Gym"
        subtitle="Focused, repeatable drills to sharpen interval, chord, and rhythmic recognition."
      />

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Module list */}
        <aside className="space-y-2">
          <p className="label-caps mb-2">Disciplines</p>
          {earTrainingModules.map((mod) => (
            <div
              key={mod.id}
              className={`card p-4 ${mod.active ? "ring-2 ring-brass/50" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink">{mod.label}</span>
                <span className="font-serif text-sm text-brass">{mod.accuracy}%</span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-sand">
                <div
                  className="h-full rounded-full bg-success"
                  style={{ width: `${mod.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </aside>

        {/* Exercise */}
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

            {/* Waveform visual + play */}
            <div className="mt-6 flex items-center gap-4 rounded-xl2 border border-line bg-charcoal p-6">
              <button className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brass text-charcoal transition-transform hover:scale-105">
                <Play className="h-6 w-6" />
              </button>
              <div className="flex h-16 flex-1 items-center gap-[3px] overflow-hidden">
                {Array.from({ length: 56 }).map((_, i) => {
                  const h = 20 + Math.abs(Math.sin(i * 0.6)) * 70;
                  return (
                    <span
                      key={i}
                      className="w-[3px] shrink-0 rounded-full bg-brass/70"
                      style={{ height: `${h}%` }}
                    />
                  );
                })}
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-muted">
              Play the interval, then choose the correct answer.
            </p>

            {/* Answers */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {intervalExercise.options.map((option) => {
                const isAnswer = option === intervalExercise.answer;
                const isSelected = option === selected;
                let stateClass =
                  "border-line bg-white/60 text-ink hover:border-brass hover:bg-brass/5";
                if (revealed && isAnswer) {
                  stateClass = "border-success bg-success/10 text-ink";
                } else if (revealed && isSelected && !isAnswer) {
                  stateClass = "border-burgundy bg-burgundy/10 text-burgundy";
                }
                return (
                  <button
                    key={option}
                    onClick={() => choose(option)}
                    disabled={revealed}
                    className={`flex items-center justify-between rounded-lg border px-4 py-3.5 text-sm font-medium transition-colors ${stateClass}`}
                  >
                    {option}
                    {revealed && isAnswer && <Check className="h-4 w-4 text-success" />}
                    {revealed && isSelected && !isAnswer && (
                      <X className="h-4 w-4 text-burgundy" />
                    )}
                  </button>
                );
              })}
            </div>

            {showHint && (
              <div className="mt-4 flex gap-2 rounded-lg border border-amber/30 bg-amber/10 p-4 text-sm text-ink">
                <Lightbulb className="h-4 w-4 shrink-0 text-amber" />
                {intervalExercise.hint}
              </div>
            )}

            {/* Controls */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => setShowHint((h) => !h)} className="btn-ghost">
                <Lightbulb className="h-4 w-4" />
                Hint
              </button>
              <button className="btn-ghost">
                <RotateCcw className="h-4 w-4" />
                Hear Again
              </button>
              <button onClick={next} className="btn-primary ml-auto">
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
