// ---------------------------------------------------------------------------
// Activity log + streak. Any meaningful user action calls logActivity(), which
// records today's date. The streak is the number of consecutive days (ending
// today or yesterday) with recorded activity. No activity → streak 0.
// ---------------------------------------------------------------------------

import { getStorage, setStorage } from "./storage";

const KEY = "activity-dates";

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getActivityDates(): string[] {
  return getStorage<string[]>(KEY) ?? [];
}

export function logActivity(): void {
  const dates = getActivityDates();
  const t = today();
  if (!dates.includes(t)) {
    setStorage(KEY, [...dates, t].slice(-400)); // cap history
  }
}

/** Consecutive-day streak ending today or yesterday. */
export function computeStreak(dates: string[] = getActivityDates()): number {
  if (dates.length === 0) return 0;
  const set = new Set(dates);
  const day = 86400000;
  const start = new Date();
  // If today has no activity, allow the streak to end yesterday.
  if (!set.has(start.toISOString().slice(0, 10))) {
    start.setTime(start.getTime() - day);
    if (!set.has(start.toISOString().slice(0, 10))) return 0;
  }
  let streak = 0;
  const cursor = new Date(start);
  while (set.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setTime(cursor.getTime() - day);
  }
  return streak;
}
