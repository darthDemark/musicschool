// ---------------------------------------------------------------------------
// Theory Academy progress tracking (localStorage).
// - "visited": the student opened a subtopic.
// - "completed": the student explicitly marked it complete (only this counts
//   toward category/overall progress percentages).
// ---------------------------------------------------------------------------

import { getStorage, setStorage } from "./storage";
import { theoryCurriculum } from "./theoryCurriculum";

const COMPLETED_KEY = "theory-completed";
const VISITED_KEY = "theory-visited";

/** Stable id for a subtopic. */
export function subtopicKey(categoryId: string, subtopicId: string): string {
  return `${categoryId}/${subtopicId}`;
}

/* ------------------------------ Completed -------------------------------- */

export function getCompletedSubtopics(): string[] {
  return getStorage<string[]>(COMPLETED_KEY) ?? [];
}

export function isSubtopicComplete(categoryId: string, subtopicId: string): boolean {
  return getCompletedSubtopics().includes(subtopicKey(categoryId, subtopicId));
}

export function markSubtopicComplete(categoryId: string, subtopicId: string): void {
  const id = subtopicKey(categoryId, subtopicId);
  const cur = getCompletedSubtopics();
  if (!cur.includes(id)) setStorage(COMPLETED_KEY, [...cur, id]);
}

export function unmarkSubtopicComplete(categoryId: string, subtopicId: string): void {
  const id = subtopicKey(categoryId, subtopicId);
  setStorage(
    COMPLETED_KEY,
    getCompletedSubtopics().filter((c) => c !== id)
  );
}

/** Toggle completion; returns the new completed list. */
export function toggleSubtopicComplete(
  categoryId: string,
  subtopicId: string
): string[] {
  if (isSubtopicComplete(categoryId, subtopicId)) {
    unmarkSubtopicComplete(categoryId, subtopicId);
  } else {
    markSubtopicComplete(categoryId, subtopicId);
  }
  return getCompletedSubtopics();
}

/* ------------------------------- Visited -------------------------------- */

export function getVisitedSubtopics(): string[] {
  return getStorage<string[]>(VISITED_KEY) ?? [];
}

export function markSubtopicVisited(categoryId: string, subtopicId: string): string[] {
  const id = subtopicKey(categoryId, subtopicId);
  const cur = getVisitedSubtopics();
  if (!cur.includes(id)) {
    const next = [...cur, id];
    setStorage(VISITED_KEY, next);
    return next;
  }
  return cur;
}

/* ------------------------------- Totals --------------------------------- */

export function totalSubtopics(): number {
  return Object.values(theoryCurriculum).reduce((a, c) => a + c.subtopics.length, 0);
}

export function categoryTotal(categoryId: string): number {
  return theoryCurriculum[categoryId]?.subtopics.length ?? 0;
}

export function categoryCompleted(categoryId: string, completed: string[]): number {
  const prefix = `${categoryId}/`;
  return completed.filter((c) => c.startsWith(prefix)).length;
}

/** Category progress percentage from a completed-ids list. */
export function categoryProgress(categoryId: string, completed: string[]): number {
  const total = categoryTotal(categoryId);
  if (!total) return 0;
  return Math.round((categoryCompleted(categoryId, completed) / total) * 100);
}
