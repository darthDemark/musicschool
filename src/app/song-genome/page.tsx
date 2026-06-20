"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Music, Dna } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { GenomeRadar } from "@/components/GenomeScore";
import { ScoreBar } from "@/components/ScoreBar";
import { ProgressRing } from "@/components/ProgressRing";
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
  return +(
    report.genome.reduce((a, g) => a + g.value, 0) / report.genome.length
  ).toFixed(1);
}

export default function SongGenomePage() {
  const [report, setReport] = useState<HitLabReport | null>(null);
  const [isExample, setIsExample] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = getStorage<SavedReport[]>("hit-lab-reports");
    if (saved && saved.length > 0) setReport(saved[0].report);
    setHydrated(true);
  }, []);

  const showExample = () => {
    setReport(purpleRainReport);
    setIsExample(true);
  };

  if (!hydrated) {
    return (
      <div>
        <PageHeader eyebrow="Song Genome" title="Score & Compare" subtitle="Loading…" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Song Genome"
        title="Score & Compare"
        subtitle="A structured fingerprint of what makes a song work — and which songs share its DNA."
      />

      {!report ? (
        <EmptyState
          icon={Dna}
          title="No songs scored yet"
          description="Analyze a song in the Hit Lab and its genome will appear here automatically — eight dimensions of song craft, scored and compared."
        >
          <Link href="/hit-lab" className="btn-primary">
            Go to Hit Lab
          </Link>
          <button onClick={showExample} className="btn-ghost">
            View an example genome
          </button>
        </EmptyState>
      ) : (
        <>
          {isExample && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber/30 bg-amber/10 px-4 py-2.5">
              <ExampleBadge />
              <span className="text-sm text-ink">
                Example genome (Prince — Purple Rain). Analyze a song in the Hit Lab
                to score your own.
              </span>
            </div>
          )}

          {/* Subject header */}
          <Card className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl2 bg-gradient-to-br from-burgundy/25 to-brass/25">
                <Music className="h-7 w-7 text-charcoal/60" />
              </div>
              <div>
                <p className="label-caps text-brass">Now Scoring</p>
                <h2 className="font-serif text-2xl text-ink">{report.song}</h2>
                <p className="text-sm text-muted">{report.artist}</p>
              </div>
            </div>
            <ProgressRing
              value={overallOf(report) * 10}
              label={overallOf(report).toFixed(1)}
              sublabel="Overall"
              size={120}
            />
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <SectionTitle className="mb-2">Genome Radar</SectionTitle>
              <p className="mb-2 text-sm text-muted">Eight dimensions of song craft</p>
              <GenomeRadar scores={report.genome} />
            </Card>

            <Card>
              <SectionTitle className="mb-5">Dimension Scores</SectionTitle>
              <div className="space-y-4">
                {report.genome.map((g) => (
                  <ScoreBar key={g.label} label={g.label} value={g.value} />
                ))}
              </div>
            </Card>
          </div>

          {/* Similar songs only make sense for the curated example */}
          {isExample && (
            <div className="mt-6">
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
        </>
      )}
    </div>
  );
}
