"use client";

import { useEffect, useState } from "react";
import { getStorage } from "./storage";
import { theoryCurriculum, theorySectionOrder } from "./theoryCurriculum";
import { curriculumUnits } from "./mockData";
import {
  getCompletedSubtopics,
  totalSubtopics,
  categoryCompleted,
  categoryProgress,
} from "./theoryProgress";
import { computeStreak } from "./activity";
import { KEYS, count, completedCount } from "./hitcampStore";

export interface MissionTask {
  label: string;
  href: string;
  done: boolean;
}

export interface ContinueLearning {
  unit: string;
  title: string;
  lessonNumber: number;
  progress: number;
  lessonsDone: number;
  lessonsTotal: number;
}

export interface Skill {
  name: string;
  pct: number;
  level: "Beginner" | "Intermediate" | "Advanced";
}

export interface ListeningAssignment {
  title: string;
  artist: string;
  focus: string;
}

export interface DashboardData {
  continueLearning: ContinueLearning | null;
  lessonsCompleted: number;
  overallProgress: number;
  listening: ListeningAssignment | null;
  songsAnalyzed: number;
  hooksWritten: number;
  streak: number;
  xp: number;
  level: number;
  levelProgress: number;
  xpIntoLevel: number;
  xpForLevel: number;
  skills: Skill[];
  sketchpadIdeas: number;
  arrangements: number;
  productions: number;
  drumPatterns: number;
  soundPatches: number;
  mission: MissionTask[];
}

const XP_PER_LEVEL = 600;

const EMPTY: DashboardData = {
  continueLearning: null,
  lessonsCompleted: 0,
  overallProgress: 0,
  listening: null,
  songsAnalyzed: 0,
  hooksWritten: 0,
  streak: 0,
  xp: 0,
  level: 1,
  levelProgress: 0,
  xpIntoLevel: 0,
  xpForLevel: XP_PER_LEVEL,
  skills: [],
  sketchpadIdeas: 0,
  arrangements: 0,
  productions: 0,
  drumPatterns: 0,
  soundPatches: 0,
  mission: [],
};

function levelFromPct(pct: number): Skill["level"] {
  if (pct < 40) return "Beginner";
  if (pct < 80) return "Intermediate";
  return "Advanced";
}

/** Reads the user's real activity from localStorage. No mock values. */
export function useDashboard() {
  const [data, setData] = useState<DashboardData>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const completed = getCompletedSubtopics();
    const total = totalSubtopics();
    const lessonsCompleted = completed.length;
    const overallProgress = total ? Math.round((lessonsCompleted / total) * 100) : 0;

    const cat = getStorage<string>("theory-active-category");
    const sub = getStorage<string>("theory-active-subtopic");
    let continueLearning: ContinueLearning | null = null;
    if (cat && theoryCurriculum[cat]) {
      const category = theoryCurriculum[cat];
      const idx = Math.max(
        0,
        category.subtopics.findIndex((s) => s.id === sub)
      );
      const subtopic = category.subtopics[idx] ?? category.subtopics[0];
      const catTotal = category.subtopics.length;
      const catDone = categoryCompleted(cat, completed);
      continueLearning = {
        unit: category.unit,
        title: subtopic.title,
        lessonNumber: idx + 1,
        progress: catTotal ? Math.round((catDone / catTotal) * 100) : 0,
        lessonsDone: catDone,
        lessonsTotal: catTotal,
      };
    }

    const listening = getStorage<ListeningAssignment>("listening-current");
    const hooksWritten = (getStorage<unknown[]>("hook-saved") ?? []).length;
    const songsAnalyzed = (getStorage<unknown[]>("hit-lab-reports") ?? []).length;
    const streak = computeStreak();

    // XP / level derived entirely from real activity.
    const workoutXp =
      getStorage<{ totalXp?: number }>("hook-workout-meta")?.totalXp ?? 0;
    const xp =
      workoutXp + lessonsCompleted * 100 + songsAnalyzed * 60 + hooksWritten * 15;
    const level = Math.floor(xp / XP_PER_LEVEL) + 1;
    const xpIntoLevel = xp % XP_PER_LEVEL;
    const levelProgress = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100);

    // Skills = theory categories with progress, leveled by completion.
    const skills: Skill[] = theorySectionOrder
      .map((id) => {
        const pct = categoryProgress(id, completed);
        const name =
          curriculumUnits.find((u) => u.id === id)?.title ??
          theoryCurriculum[id]?.unit ??
          id;
        return { name, pct, level: levelFromPct(pct) };
      })
      .filter((s) => s.pct > 0)
      .sort((a, b) => b.pct - a.pct);

    // Hit Camp activity counts.
    const sketchpadIdeas = count(KEYS.sketchpadIdeas);
    const arrangements = count(KEYS.arrangements);
    const productions = count(KEYS.productionPlans);
    const drumPatterns = count(KEYS.drumPatterns);
    const soundPatches = count(KEYS.soundPatches);
    const hitcampHooks = count(KEYS.hooks);

    // Today's Mission — generated from incomplete real tasks.
    const mission: MissionTask[] = [
      { label: "Record one idea in Sketchpad", href: "/sketchpad", done: sketchpadIdeas > 0 },
      { label: "Complete one Beatmaking module", href: "/beatmaking", done: completedCount("beatmaking") > 0 },
      { label: "Write one hook", href: "/hook-lab", done: hooksWritten > 0 || hitcampHooks > 0 },
      { label: "Analyze one song", href: "/hit-lab", done: songsAnalyzed > 0 },
    ];

    setData({
      continueLearning,
      lessonsCompleted,
      overallProgress,
      listening,
      songsAnalyzed,
      hooksWritten,
      streak,
      xp,
      level,
      levelProgress,
      xpIntoLevel,
      xpForLevel: XP_PER_LEVEL,
      skills,
      sketchpadIdeas,
      arrangements,
      productions,
      drumPatterns,
      soundPatches,
      mission,
    });
    setHydrated(true);
  }, []);

  return { hydrated, ...data };
}
