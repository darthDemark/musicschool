"use client";

import { useState } from "react";
import { Dumbbell, Check, Sparkles, Trophy, Flame, X } from "lucide-react";
import { WORKOUT_LEVELS, type Workout, type WorkoutLevel, type WorkoutMeta } from "@/lib/hookLab";

interface WorkoutPanelProps {
  workout: Workout | null;
  meta: WorkoutMeta;
  progress: number;
  celebrate: { xp: number; streak: number } | null;
  onGenerate: (level: WorkoutLevel) => void;
  onDismiss: () => void;
}

export function WorkoutPanel({
  workout,
  meta,
  progress,
  celebrate,
  onGenerate,
  onDismiss,
}: WorkoutPanelProps) {
  const [level, setLevel] = useState<WorkoutLevel>("Standard");

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-4 w-4 text-brass" />
          <h2 className="font-serif text-xl text-ink">Today&apos;s Workout</h2>
        </div>
        {meta.totalXp > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-brass/10 px-2.5 py-0.5 text-xs text-brass">
            <Trophy className="h-3 w-3" />
            {meta.totalXp} XP
          </span>
        )}
      </div>

      {/* Completion reward */}
      {celebrate && (
        <div className="mb-4 rounded-lg border border-success/40 bg-success/10 p-4">
          <div className="mb-1 flex items-center justify-between">
            <p className="font-serif text-lg text-ink">Workout Complete</p>
            <button onClick={onDismiss} className="text-muted hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-4 text-sm text-ink">
            <span className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-brass" /> +{celebrate.xp} XP
            </span>
            <span className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-amber" /> {celebrate.streak}-day streak
            </span>
          </div>
        </div>
      )}

      {!workout ? (
        // Empty state — no fake progress bars.
        <div className="rounded-lg border border-dashed border-line bg-sand/30 p-6 text-center">
          <Dumbbell className="mx-auto mb-3 h-8 w-8 text-line" />
          <p className="font-serif text-lg text-ink">Generate today&apos;s workout</p>
          <p className="mt-1 text-sm text-muted">
            Pick a level and start training. Progress comes only from real reps.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as WorkoutLevel)}
              className="input max-w-[150px]"
            >
              {WORKOUT_LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
            <button onClick={() => onGenerate(level)} className="btn-brass">
              <Sparkles className="h-4 w-4" />
              Generate Daily Workout
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Overall progress */}
          <div className="mb-4">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="label-caps">{workout.level} · {progress}%</span>
              {workout.completed && <span className="text-success">Complete</span>}
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-brass transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {workout.tasks.map((item) => {
              const done = item.done >= item.total;
              return (
                <div key={item.id} className="rounded-lg border border-line bg-sand/40 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ink">{item.label}</span>
                    {done ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <span className="text-xs text-muted">
                        {item.done}/{item.total}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-success transition-all duration-500"
                      style={{ width: `${(Math.min(item.done, item.total) / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onGenerate(workout.level as WorkoutLevel)}
            className="btn-ghost mt-4 w-full text-xs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            New Workout
          </button>
        </>
      )}
    </div>
  );
}
