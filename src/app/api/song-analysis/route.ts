import { NextResponse } from "next/server";
import { extractYouTubeId, generateMockReport } from "@/lib/youtube";
import type { HitLabReport } from "@/lib/types";

// ---------------------------------------------------------------------------
// Song analysis API (server-side; no client-side calls to YouTube).
//
// Uses the public YouTube oEmbed endpoint (NO API key required) to fetch the
// real video title and channel, then parses "Artist - Song" from the title.
// The educational deconstruction is generated deterministically per video.
//
// LEGAL: never downloads/stores audio — only metadata, ids, and our analysis.
// Future: set YOUTUBE_API_KEY to fetch richer metadata (duration, etc.) and
// connect an AI analysis service for the deconstruction itself.
// ---------------------------------------------------------------------------

const META_WORDS =
  "official|music|video|audio|lyric[s]?|visualizer|hd|4k|mv|remaster(?:ed)?|deluxe|explicit|clean|extended|version|edit|live|demo|hq|stereo|mono";

const STRIP_PATTERNS = [
  // Parenthetical/bracketed groups that contain only metadata words.
  new RegExp(`\\((?:[^)]*\\b(?:${META_WORDS})\\b[^)]*)\\)`, "gi"),
  new RegExp(`\\[(?:[^\\]]*\\b(?:${META_WORDS})\\b[^\\]]*)\\]`, "gi"),
  new RegExp(`\\b(?:${META_WORDS})\\b`, "gi"),
  /\(\s*\)/g, // empty parens left behind
  /\[\s*\]/g,
  /\|.*$/g, // trailing " | Channel"
];

function cleanTitle(raw: string): string {
  let t = raw;
  for (const p of STRIP_PATTERNS) t = t.replace(p, "");
  return t
    .replace(/\s{2,}/g, " ")
    .replace(/\(\s*\)|\[\s*\]/g, "")
    .replace(/[\s\-–—|(]+$/, "")
    .trim();
}

function parseArtistSong(
  rawTitle: string,
  channel: string
): { artist: string; song: string } {
  const cleaned = cleanTitle(rawTitle);
  // Split on the first hyphen/en-dash/em-dash surrounded by spaces.
  const match = cleaned.split(/\s+[-–—]\s+/);
  if (match.length >= 2 && match[0].trim() && match[1].trim()) {
    return { artist: match[0].trim(), song: match.slice(1).join(" - ").trim() };
  }
  // Fallback: use the raw (cleaned) title as the song, channel as the artist.
  return {
    artist: (channel || "Unknown Artist").replace(/\s*-\s*Topic$/i, "").trim(),
    song: cleaned || rawTitle || "Untitled",
  };
}

async function fetchOEmbed(
  url: string
): Promise<{ title: string; author: string } | null> {
  try {
    const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(
      url
    )}&format=json`;
    const res = await fetch(endpoint, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.title) return null;
    return { title: data.title, author: data.author_name ?? "" };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let url = "";
  try {
    const body = await request.json();
    url = typeof body?.url === "string" ? body.url : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const videoId = extractYouTubeId(url);
  if (!videoId) {
    return NextResponse.json(
      { error: "Please enter a valid YouTube link." },
      { status: 400 }
    );
  }

  const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const meta = await fetchOEmbed(canonicalUrl);

  let artist: string;
  let song: string;
  if (meta) {
    const parsed = parseArtistSong(meta.title, meta.author);
    artist = parsed.artist;
    song = parsed.song;
  } else {
    // oEmbed unavailable (private/unknown video). Use neutral, non-fixed labels.
    artist = "Unknown Artist";
    song = `YouTube Video ${videoId}`;
  }

  const base = generateMockReport(canonicalUrl, videoId);
  const report: HitLabReport = { ...base, song, artist };

  return NextResponse.json({
    artist,
    song,
    title: meta?.title ?? song,
    videoId,
    url: canonicalUrl,
    genre: report.genre,
    analyzedAt: new Date().toISOString(),
    report,
    source: meta ? "oembed" : "fallback",
  });
}
