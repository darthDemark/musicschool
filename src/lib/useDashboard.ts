"use client";

import { useEffect, useState } from "react";
import { getStorage } from "./storage";
import { theoryCurriculum } from "./theoryCurriculum";
import {
  getCompletedSubtopics,
  totalSubtopics,
  categoryCompleted,
} from "./theoryProgress";
import { computeStreak } from "./activity";

export interface ContinueLearning {
  unit: string;
  title: string;
  lessonNumber: number;
  progress: number;
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
}

const EMPTY: DashboardData = {
  continueLearning: null,
  lessonsCompleted: 0,
  overallProgress: 0,
  listening: null,
  songsAnalyzed: 0,
  hooksWritten: 0,
  streak: 0,
};

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
      };
    }

    const listening = getStorage<ListeningAssignment>("listening-current");
    const hooksWritten = (getStorage<unknown[]>("hook-saved") ?? []).length;
    const songsAnalyzed = (getStorage<unknown[]>("hit-lab-reports") ?? []).length;
    const streak = computeStreak();

    setData({
      continueLearning,
      lessonsCompleted,
      overallProgress,
      listening,
      songsAnalyzed,
      hooksWritten,
      streak,
    });
    setHydrated(true);
  }, []);

  return { hydrated, ...data };
}
