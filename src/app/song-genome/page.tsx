"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Music, Dna, Search, Calendar, Tag } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { GenomeRadar } from "@/components/GenomeScore";
import { ScoreBar } from "@/components/ScoreBar";
import { ProgressRing } from "@/components/ProgressRing";
import { FadeIn } from "@/components/Motion";
import { EmptyState, ExampleBadge } from "@/components/EmptyState";
import { purpleRainReport, similarSongs } from "@/lib/mockData";
import { getStorage } from "@/lib/storage";
import type { HitLabReport } from "@/lib/types";

interface SavedReport {
  url: string;
  videoId: string;
  analyzedAt: string;
  report: HitLabReport;
}

function overallOf(report: HitLabReport): number {
  if (!report.genome.length) return 0;
  return +(report.genome.reduce((a, g) => a + g.value, 0) / report.genome.length).toFixed(1);
}

const EXAMPLE: SavedReport = {
  url: `https://www.youtube.com/watch?v=${purpleRainReport.youtubeId}`,
  videoId: purpleRainReport.youtubeId,
  analyzedAt: "Example",
  report: purpleRainReport,
};

export default function SongGenomePage() {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [usingExample, setUsingExample] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = getStorage<SavedReport[]>("hit-lab-reports");
    if (saved && saved.length > 0) {
      setReports(saved);
      setActiveId(saved[0].videoId);
    }
    setHydrated(true);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter((r) => {
      const { artist, song, genre } = r.report;
      return (
        artist.toLowerCase().includes(q) ||
        song.toLowerCase().includes(q) ||
        genre.toLowerCase().includes(q)
      );
    });
  }, [reports, query]);

  const active =
    (usingExample ? EXAMPLE : reports.find((r) => r.videoId === activeId)) ??
    (reports.length ? reports[0] : null);

  const showExample = () => {
    setUsingExample(true);
    setActiveId(EXAMPLE.videoId);
  };

  if (!hydrated) {
    return (
      <div>
        <PageHeader eyebrow="Song Genome" title="Score & Compare" subtitle="Loading…" />
      </div>
    );
  }

  if (!active) {
    return (
      <div>
        <PageHeader
          eyebrow="Song Genome"
          title="Score & Compare"
          subtitle="A structured fingerprint of what makes a song work — and which songs share its DNA."
        />
        <EmptyState
          icon={Dna}
          title="No songs scored yet"
          description="Analyze a song in the Hit Lab and its genome appears here automatically — eight dimensions of song craft, scored and searchable."
        >
          <Link href="/hit-lab" className="btn-primary">
            Go to Hit Lab
          </Link>
          <button onClick={showExample} className="btn-ghost">
            View an example genome
          </button>
        </EmptyState>
      </div>
    );
  }

  const r = active.report;

  return (
    <div>
      <PageHeader
        eyebrow="Song Genome"
        title="Score & Compare"
        subtitle="A structured fingerprint of what makes a song work — and which songs share its DNA."
      />

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Library + search */}
        <aside className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search artist, song, genre…"
              className="w-full rounded-lg border border-line bg-white/60 py-2.5 pl-10 pr-3 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-brass focus:ring-1 focus:ring-brass/30"
            />
          </div>

          {reports.length === 0 ? (
            <p className="px-1 text-xs text-muted">
              Viewing an example. Analyze songs in the Hit Lab to build your library.
            </p>
          ) : filtered.length === 0 ? (
            <p className="px-1 text-xs text-muted">No analyses match “{query}”.</p>
          ) : (
            filtered.map((item) => {
              const selected = !usingExample && item.videoId === active.videoId;
              return (
                <button
                  key={item.videoId}
                  onClick={() => {
                    setUsingExample(false);
                    setActiveId(item.videoId);
                  }}
                  className={`card w-full p-3 text-left transition-all hover:shadow-card-hover ${
                    selected ? "ring-2 ring-brass/50" : ""
                  }`}
                >
                  <p className="truncate text-sm font-medium text-ink">
                    {item.report.artist} — {item.report.song}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {item.report.genre} · {item.analyzedAt}
                  </p>
                </button>
              );
            })
          )}
        </aside>

        {/* Selected genome */}
        <FadeIn motionKey={active.videoId} className="space-y-6">
          {usingExample && (
            <div className="flex items-center gap-2 rounded-lg border border-amber/30 bg-amber/10 px-4 py-2.5">
              <ExampleBadge />
              <span className="text-sm text-ink">
                Example genome (Prince — Purple Rain). Analyze a song in the Hit Lab to
                score your own.
              </span>
            </div>
          )}

          <Card className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl2 bg-gradient-to-br from-burgundy/25 to-brass/25">
                <Music className="h-7 w-7 text-charcoal/60" />
              </div>
              <div>
                <p className="label-caps text-brass">Now Scoring</p>
                <h2 className="font-serif text-2xl text-ink">
                  {r.artist} — {r.song}
                </h2>
                <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3 text-brass" />
                    {r.genre}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-brass" />
                    {active.analyzedAt}
                  </span>
                </div>
              </div>
            </div>
            <ProgressRing
              value={overallOf(r) * 10}
              label={overallOf(r).toFixed(1)}
              sublabel="Overall"
              size={120}
            />
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <SectionTitle className="mb-2">Genome Radar</SectionTitle>
              <p className="mb-2 text-sm text-muted">Eight dimensions of song craft</p>
              <GenomeRadar scores={r.genome} />
            </Card>
            <Card>
              <SectionTitle className="mb-5">Dimension Scores</SectionTitle>
              <div className="space-y-4">
                {r.genome.map((g) => (
                  <ScoreBar key={g.label} label={g.label} value={g.value} />
                ))}
              </div>
            </Card>
          </div>

          {usingExample && (
            <div>
              <SectionTitle className="mb-4">Similar Songs</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {similarSongs.map((song) => (
                  <Card key={song.title} className="flex flex-col">
                    <div className="mb-3 flex h-28 items-center justify-center rounded-lg bg-gradient-to-br from-burgundy/20 to-brass/20">
                      <Music className="h-7 w-7 text-charcoal/50" />
                    </div>
                    <p className="font-serif text-base text-ink">{song.title}</p>
                    <p className="text-[13px] text-muted">{song.artist}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand">
                        <div
                          className="h-full rounded-full bg-brass"
                          style={{ width: `${song.match}%` }}
                        />
                      </div>
                      <span className="font-serif text-sm text-burgundy">{song.match}%</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
