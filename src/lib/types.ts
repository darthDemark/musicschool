// Shared domain types for the Music School prototype.
// These mirror the suggested Supabase schema (see README + src/lib/supabase.ts)
// so that swapping mock data for real queries later is a drop-in change.

export interface User {
  id: string;
  name: string;
  role: string;
  streakDays: number;
}

export interface Lesson {
  id: string;
  unit: string;
  title: string;
  number: number;
  summary: string;
  durationMin: number;
  completed: boolean;
}

export interface CurriculumUnit {
  id: string;
  title: string;
  description: string;
  topics: string[];
  progress: number; // 0-100
}

export interface ListeningTrack {
  id: string;
  title: string;
  artist: string;
  collection: string;
  youtubeId: string;
  focus: string;
  durationLabel: string;
  completed: boolean;
}

export interface GenomeScore {
  label: string;
  value: number; // 0-10
}

export interface StructureSegment {
  time: string;
  seconds: number;
  section: string;
}

export interface HookMapEntry {
  type: string;
  description: string;
  timestamp: string;
}

export interface EnergyPoint {
  time: string;
  energy: number; // 0-100
}

export interface HitLabReport {
  id: string;
  url: string;
  createdAt: number;
  song: string;
  artist: string;
  genre: string;
  length: string;
  bpm: string;
  key: string;
  youtubeId: string;
  overview: string;
  structure: StructureSegment[];
  hookMap: HookMapEntry[];
  energyCurve: EnergyPoint[];
  harmony: string[];
  melody: string[];
  lyricsTheme: string[];
  arrangement: string[];
  genome: GenomeScore[];
}

export interface HookEntry {
  id: string;
  text: string;
  score: number;
}

export interface HookStyle {
  id: string;
  name: string;
  definition: string;
  purpose: string;
  examples: string[];
  drill: string;
  scoring: string[];
}

export interface ScoringCriterion {
  key: string;
  label: string;
  description: string;
}

export interface RhymeGroup {
  perfect: string[];
  near: string[];
  multi: string[];
  slant: string[];
}

export interface CompositionLab {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  steps: string[];
  explanation: string;
  topics: string[];
}

export interface VaultSong {
  id: string;
  title: string;
  status: "Draft" | "In Progress" | "Complete" | "Archived";
  genre: string;
  hook: number;
  melody: number;
  lyrics: number;
  arrangement: number;
}

export interface ComposerProfileData {
  id: string;
  name: string;
  subtitle: string;
  era: string;
  bio: string;
  commonKeys: string[];
  chordColors: string[];
  themes: string[];
  signatureTraits: string[];
}

export interface SimilarSong {
  title: string;
  artist: string;
  match: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
