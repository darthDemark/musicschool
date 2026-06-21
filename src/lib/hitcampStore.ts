// ---------------------------------------------------------------------------
// Hit Camp persistence layer (localStorage now, Supabase-ready later).
//
// Consistent keys + a shared item shape. Every saved item carries:
//   id, title, type, createdAt, updatedAt, tags, notes
// ---------------------------------------------------------------------------

export const KEYS = {
  sketchpadIdeas: "hitcamp_sketchpad_ideas",
  drumPatterns: "hitcamp_drum_patterns",
  productionPlans: "hitcamp_production_plans",
  arrangements: "hitcamp_arrangements",
  mixNotes: "hitcamp_mix_notes",
  soundPatches: "hitcamp_sound_patches",
  recordingChecklists: "hitcamp_recording_checklists",
  creativityOutputs: "hitcamp_creativity_outputs",
  hooks: "hitcamp_hooks",
  progress: "hitcamp_progress",
} as const;

export interface BaseItem {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  notes: string;
}

export function uid(): string {
  return (
    Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
  );
}

export function nowISO(): string {
  return new Date().toISOString();
}

/** Build a BaseItem with sensible defaults. */
export function makeItem(partial: Partial<BaseItem> & { type: string; title: string }): BaseItem {
  const ts = nowISO();
  return {
    id: uid(),
    createdAt: ts,
    updatedAt: ts,
    tags: [],
    notes: "",
    ...partial,
  };
}

export function loadList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function saveList<T>(key: string, items: T[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(items));
    return true;
  } catch {
    // Quota exceeded or unavailable.
    return false;
  }
}

export function addItem<T extends { id: string }>(key: string, item: T): T[] {
  const next = [item, ...loadList<T>(key)];
  saveList(key, next);
  return next;
}

export function updateItem<T extends { id: string }>(
  key: string,
  id: string,
  patch: Partial<T>
): T[] {
  const next = loadList<T>(key).map((it) =>
    it.id === id ? { ...it, ...patch, updatedAt: nowISO() } : it
  );
  saveList(key, next);
  return next;
}

export function removeItem<T extends { id: string }>(key: string, id: string): T[] {
  const next = loadList<T>(key).filter((it) => it.id !== id);
  saveList(key, next);
  return next;
}

export function count(key: string): number {
  return loadList(key).length;
}

/* ------------------------------ Progress -------------------------------- */

export type ProgressMap = Record<string, boolean>;

export function loadProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEYS.progress);
    return raw ? (JSON.parse(raw) as ProgressMap) : {};
  } catch {
    return {};
  }
}

export function progressKey(section: string, moduleId: string): string {
  return `${section}/${moduleId}`;
}

export function isModuleComplete(section: string, moduleId: string): boolean {
  return Boolean(loadProgress()[progressKey(section, moduleId)]);
}

export function setModuleComplete(
  section: string,
  moduleId: string,
  done: boolean
): ProgressMap {
  const map = loadProgress();
  const k = progressKey(section, moduleId);
  if (done) map[k] = true;
  else delete map[k];
  try {
    window.localStorage.setItem(KEYS.progress, JSON.stringify(map));
  } catch {
    /* ignore */
  }
  return map;
}

export function completedCount(section?: string): number {
  const map = loadProgress();
  const keys = Object.keys(map);
  if (!section) return keys.length;
  return keys.filter((k) => k.startsWith(`${section}/`)).length;
}
