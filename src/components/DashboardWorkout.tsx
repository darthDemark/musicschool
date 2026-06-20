"use client";

import Link from "next/link";
import { Dumbbell, Check, Flame, Trophy } from "lucide-react";
import { Card } from "@/components/Card";
import { useWorkout } from "@/lib/useWorkout";

/**
 * Dashboard "Today's Workout" — pulls live from the Hook Lab workout in
 * localStorage. No hardcoded progress; shows a CTA when no workout exists.
 */
export function DashboardWorkout() {
  const { workout, meta, progress, hydrated } = useWorkout();

  return (
    <Card className="flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-4 w-4 text-brass" />
          <p className="label-caps">Today&apos;s Workout</p>
        </div>
        {meta.streak > 0 && (
          <span className="flex items-center gap-1 text-xs text-amber">
            <Flame className="h-3.5 w-3.5" />
            {meta.streak}
          </span>
        )}
      </div>

      {!hydrated ? (
        <div className="h-16" />
      ) : !workout ? (
        <>
          <p className="mb-4 text-sm text-muted">
            No workout yet. Generate today&apos;s session and start training your hooks.
          </p>
          <Link href="/hook-lab" className="btn-brass mt-auto w-full">
            Generate in Hook Lab
          </Link>
        </>
      ) : (
        <>
          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-serif text-base text-ink">{progress}% complete</span>
              {workout.completed ? (
                <span className="flex items-center gap-1 text-success">
                  <Trophy className="h-3.5 w-3.5" /> Done
                </span>
              ) : (
                <span className="text-muted">{workout.level}</span>
              )}
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-brass transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-4 space-y-1.5">
            {workout.tasks.slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <span className="truncate text-ink">{t.label}</span>
                {t.done >= t.total ? (
                  <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                ) : (
                  <span className="shrink-0 text-xs text-muted">
                    {t.done}/{t.total}
                  </span>
                )}
              </div>
            ))}
          </div>

          <Link href="/hook-lab" className="btn-brass mt-auto w-full">
            Open Hook Lab
          </Link>
        </>
      )}
    </Card>
  );
}
