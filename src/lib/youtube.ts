// ---------------------------------------------------------------------------
// YouTube link handling for Hit Lab.
//
// LEGAL / PRODUCT RULE: This app must NEVER rip, download, store, or otherwise
// persist copyrighted audio or video. We only ever handle:
//   - the YouTube URL / video ID
//   - publicly available metadata
//   - user notes, timestamps, and our own educational analysis
//
// The video itself is shown via the standard YouTube IFrame embed, served by
// YouTube — we never proxy or store the media.
// ---------------------------------------------------------------------------

import { purpleRainReport } from "./mockData";
import type { HitLabReport } from "./types";

/**
 * Extract a YouTube video ID from the common URL formats
 * (watch?v=, youtu.be/, /embed/, /shorts/). Returns null if none found.
 */
export function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Already looks like a bare 11-char video ID.
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * Mock analyzer that produces an educational deconstruction report.
 *
 * In production this function would:
 *   1. Call the YouTube Data API (process.env.YOUTUBE_API_KEY) to fetch
 *      title, channel, duration, and thumbnails for the given video ID.
 *      // const meta = await fetchYouTubeMetadata(videoId)
 *   2. Pass that metadata (NOT the audio) to an AI analysis service to
 *      generate structure, hook map, harmony/melody commentary, etc.
 *      // const report = await aiAnalyze(meta)
 *   3. Optionally accept a user-OWNED audio upload for true audio analysis
 *      (BPM/key detection) — only for files the user has rights to.
 *      // const features = await analyzeOwnedAudio(uploadedFile)
 *
 * For the prototype we return a hand-authored Prince — Purple Rain report,
 * re-pointed at whatever video the user submitted.
 */
export function analyzeSong(videoId: string): HitLabReport {
  return {
    ...purpleRainReport,
    youtubeId: videoId || purpleRainReport.youtubeId,
  };
}

// Deterministic pseudo-random helper so a given video always yields the same
// (but distinct from other videos) report — never a copy of the demo.
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const GENRES = [
  "Pop",
  "Rock",
  "R&B / Soul",
  "Hip-Hop",
  "Funk",
  "Singer-Songwriter",
  "Electronic / Dance",
  "Film Score",
];
const KEYS = [
  "C Major",
  "G Major",
  "D Major",
  "A Minor",
  "E Minor",
  "F Major",
  "Bb Major",
  "C# Minor",
];
const OVERVIEWS = [
  "A vocal-forward production that leans on a tight, repeating chorus hook and a deliberately restrained verse to maximize contrast. The arrangement adds layers in stages so each section reads as an emotional escalation.",
  "An up-tempo, groove-driven record where the rhythm section carries the hook. The harmony stays simple and loop-based, leaving space for melodic and production details to do the heavy lifting.",
  "A dynamic, narrative arrangement that moves through several contrasting sections, built around a strong central motif reintroduced with variation to create familiarity across the form.",
  "A texture-led production built around a distinctive sonic signature. The hook is as much about timbre and space as melody, giving the record an instantly identifiable fingerprint.",
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}
function clampScore(base: number, seed: number, spread = 1.2): number {
  const delta = ((seed % 100) / 100 - 0.5) * 2 * spread;
  return Math.max(5, Math.min(10, +(base + delta).toFixed(1)));
}

/**
 * Generate a distinct educational deconstruction for a pasted video. With no
 * YouTube Data API key configured (prototype default) the title/artist are
 * placeholders, but structure, hooks, harmony, melody, and genome vary per
 * video so the report is never hardcoded to the demo song.
 *
 * Production integration points:
 *   // const meta = await fetchYouTubeMetadata(videoId)  // YOUTUBE_API_KEY
 *   // const ai   = await aiAnalyze(meta)                // AI analysis service
 *   // const feat = await analyzeOwnedAudio(file)        // user-owned audio only
 */
export function generateMockReport(url: string, videoId: string): HitLabReport {
  const seed = hashString(videoId || url || "seed");
  const bpm = 70 + (seed % 90);
  return {
    song: "Untitled YouTube Song",
    artist: "Unknown Artist",
    genre: pick(GENRES, seed),
    length: `${3 + (seed % 4)}:${String(10 + (seed % 49)).padStart(2, "0")}`,
    bpm: `~${bpm} BPM`,
    key: pick(KEYS, seed >> 2),
    youtubeId: videoId,
    overview: pick(OVERVIEWS, seed >> 1),
    structure: [
      { time: "0:00", seconds: 0, section: "Intro" },
      { time: "0:18", seconds: 18, section: "Verse" },
      { time: "0:54", seconds: 54, section: "Pre-Chorus" },
      { time: "1:12", seconds: 72, section: "Chorus" },
      { time: "1:48", seconds: 108, section: "Verse" },
      { time: "2:24", seconds: 144, section: "Chorus" },
      { time: "3:00", seconds: 180, section: "Bridge" },
      { time: "3:24", seconds: 204, section: "Final Chorus" },
    ],
    hookMap: [
      { type: "Instrumental Hook", description: "Opening figure that frames the record before vocals enter.", timestamp: "0:00" },
      { type: "Vocal Phrase Hook", description: "Primary sung melodic phrase introduced in the first verse.", timestamp: "0:18" },
      { type: "Chorus / Title Hook", description: "The central repeated chorus phrase the song is built around.", timestamp: "1:12" },
      { type: "Production Hook", description: "A distinctive sonic moment or texture that signals the chorus.", timestamp: "1:06" },
    ],
    energyCurve: [
      { time: "0:00", energy: 22 },
      { time: "0:18", energy: 38 },
      { time: "0:54", energy: 52 },
      { time: "1:12", energy: 70 },
      { time: "1:48", energy: 58 },
      { time: "2:24", energy: 80 },
      { time: "3:00", energy: 64 },
      { time: "3:24", energy: 95 },
    ],
    harmony: [
      "Loop-based progression that repeats across sections, keeping the harmonic motion predictable and singable.",
      "The chorus leans on its strongest functional chord for resolution and payoff.",
      "Color is added through occasional borrowed or extended chords rather than constant chromatic motion.",
      "Slow-to-moderate harmonic rhythm leaves room for the melody to lead.",
    ],
    melody: [
      "Verse melody sits in a narrow, conversational range to preserve room for the chorus lift.",
      "The chorus opens the range upward and repeats its core phrase with small variations.",
      "Phrase lengths contrast between sections to keep the listener engaged.",
      "Melodic peaks are reserved for the emotional high points of the form.",
    ],
    lyricsTheme: [
      "Thematic focus established early and reinforced through the title phrase.",
      "Verses carry narrative detail; the chorus distills it to a single feeling.",
      "Imagery is concrete enough to be memorable and open enough to be relatable.",
    ],
    arrangement: [
      "Additive arrangement: layers enter in stages to build momentum.",
      "Dynamic contrast between verse and chorus drives the emotional arc.",
      "A bridge or breakdown provides relief before the final chorus.",
      "Production choices reinforce the hook and the song's identity.",
    ],
    genome: [
      { label: "Hook Density", value: clampScore(8.2, seed) },
      { label: "Melody Strength", value: clampScore(8.0, seed >> 1) },
      { label: "Emotional Impact", value: clampScore(8.4, seed >> 2) },
      { label: "Arrangement", value: clampScore(7.9, seed >> 3) },
      { label: "Lyrics / Theme", value: clampScore(7.8, seed >> 4) },
      { label: "Replay Value", value: clampScore(8.1, seed >> 5) },
      { label: "Commercial Appeal", value: clampScore(8.3, seed >> 6) },
      { label: "Originality", value: clampScore(7.7, seed >> 7) },
    ],
  };
}
