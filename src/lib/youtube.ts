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
