// ---------------------------------------------------------------------------
// Theory Academy progress tracking (localStorage). A subtopic is "completed"
// once the student answers all of its quiz questions.
// ---------------------------------------------------------------------------

import { getStorage, setStorage } from "./storage";
import { theoryCurriculum } from "./theoryCurriculum";

const KEY = "theory-completed";

/** Stable id for a subtopic. */
export function subtopicKey(categoryId: string, subtopicId: string): string {
  return `${categoryId}/${subtopicId}`;
}

export function getCompletedSubtopics(): string[] {
  return getStorage<string[]>(KEY) ?? [];
}

export function markSubtopicComplete(categoryId: string, subtopicId: string): void {
  const id = subtopicKey(categoryId, subtopicId);
  const cur = getCompletedSubtopics();
  if (!cur.includes(id)) setStorage(KEY, [...cur, id]);
}

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
