"use client";

import { useCallback, useEffect, useState } from "react";
import { getStorage, setStorage } from "./storage";
import {
  generateWorkout,
  workoutProgress,
  xpForWorkout,
  todayKey,
  type Workout,
  type WorkoutAction,
  type WorkoutLevel,
  type WorkoutMeta,
} from "./hookLab";

const WORKOUT_KEY = "hook-workout";
const META_KEY = "hook-workout-meta";

/**
 * Shared workout state for Hook Lab and the Dashboard. Progress only ever comes
 * from real user actions (recordAction). Everything persists to localStorage.
 */
export function useWorkout() {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [meta, setMeta] = useState<WorkoutMeta>({ totalXp: 0, streak: 0 });
  const [hydrated, setHydrated] = useState(false);
  const [celebrate, setCelebrate] = useState<{ xp: number; streak: number } | null>(null);

  useEffect(() => {
    const w = getStorage<Workout>(WORKOUT_KEY);
    const m = getStorage<WorkoutMeta>(META_KEY);
    if (w) setWorkout(w);
    if (m) setMeta(m);
    setHydrated(true);
  }, []);

  const persist = (w: Workout | null) => {
    setWorkout(w);
    setStorage(WORKOUT_KEY, w);
  };

  const generate = useCallback((level: WorkoutLevel) => {
    setCelebrate(null);
    persist(generateWorkout(level));
  }, []);

  const recordAction = useCallback(
    (action: WorkoutAction, n = 1) => {
      if (!workout || workout.completed) return;
      let remaining = n;
      const tasks = workout.tasks.map((t) => {
        if (remaining > 0 && t.action === action && t.done < t.total) {
          const inc = Math.min(remaining, t.total - t.done);
          remaining -= inc;
          return { ...t, done: t.done + inc };
        }
        return t;
      });

      const allDone = tasks.every((t) => t.done >= t.total);
      if (!allDone) {
        persist({ ...workout, tasks });
        return;
      }

      // Completed — award XP and update the streak (once per day).
      const candidate: Workout = { ...workout, tasks };
      const xp = xpForWorkout(candidate);
      const today = todayKey();
      const streak = meta.lastCompleted === today ? Math.max(meta.streak, 1) : meta.streak + 1;
      const nextMeta: WorkoutMeta = { totalXp: meta.totalXp + xp, streak, lastCompleted: today };
      const next: Workout = {
        ...candidate,
        completed: true,
        completedAt: Date.now(),
        xpAwarded: xp,
      };
      setWorkout(next);
      setStorage(WORKOUT_KEY, next);
      setMeta(nextMeta);
      setStorage(META_KEY, nextMeta);
      setCelebrate({ xp, streak });
    },
    [workout, meta]
  );

  const dismissCelebrate = useCallback(() => setCelebrate(null), []);

  return {
    workout,
    meta,
    hydrated,
    celebrate,
    progress: workoutProgress(workout),
    generate,
    recordAction,
    dismissCelebrate,
  };
}
