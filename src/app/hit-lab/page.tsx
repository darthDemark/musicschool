"use client";

import { useEffect, useState } from "react";
import {
  Sparkles,
  Link2,
  AlertCircle,
  Music,
  Clock,
  Activity,
  KeyRound,
  History,
  Trash2,
  Check,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { Timeline } from "@/components/Timeline";
import { HookMap } from "@/components/HookMap";
import { EnergyCurve } from "@/components/EnergyCurve";
import { GenomeRadar } from "@/components/GenomeScore";
import { Tabs } from "@/components/Tabs";
import { extractYouTubeVideoId, generateMockReport } from "@/lib/youtube";
import { purpleRainReport } from "@/lib/mockData";
import type { HitLabReport } from "@/lib/types";

const ANALYSIS_TABS = [
  "Overview",
  "Structure Timeline",
  "Hook Map",
  "Energy Curve",
  "Harmony Analysis",
  "Melody Analysis",
  "Lyrics & Theme",
  "Arrangement",
  "Song Genome",
];

const HISTORY_KEY = "music-school:hitlab-history";

// Purple Rain is ONLY the default demo shown when no user report exists.
const demoReport: HitLabReport = purpleRainReport;

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function HitLabPage() {
  const [url, setUrl] = useState("");
  const [activeReport, setActiveReport] = useState<HitLabReport>(demoReport);
  const [reportsHistory, setReportsHistory] = useState<HitLabReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Load saved reports; if any exist, show the most recent instead of the demo.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HISTORY_KEY);
      if (raw) {
        const parsed: HitLabReport[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReportsHistory(parsed);
          setActiveReport(parsed[0]);
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  const persistHistory = (next: HitLabReport[]) => {
    setReportsHistory(next);
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      /* storage may be unavailable */
    }
  };

  const handleAnalyze = () => {
    setError(null);
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      setError("Please enter a valid YouTube link.");
      return;
    }
    setAnalyzing(true);
    // Simulated async analysis. In production this calls the YouTube Data API
    // for metadata + an AI service for the deconstruction (see src/lib/youtube.ts).
    setTimeout(() => {
      const report = generateMockReport(url, videoId);
      setActiveReport(report);
      // Keep newest first; cap history length.
      persistHistory([report, ...reportsHistory].slice(0, 12));
      setAnalyzing(false);
      setShowHistory(false);
    }, 800);
  };

  const selectFromHistory = (report: HitLabReport) => {
    setActiveReport(report);
    setUrl(report.url);
    setShowHistory(false);
  };

  const clearHistory = () => {
    persistHistory([]);
    setActiveReport(demoReport);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Hit Lab"
        title="Song Deconstructor"
        subtitle="Paste a YouTube link to generate an educational deconstruction — structure, hooks, harmony, and more."
      />

      {/* Input */}
      <Card className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="label-caps">Paste YouTube Link</p>
          <button
            onClick={() => setShowHistory((s) => !s)}
            className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink"
          >
            <History className="h-3.5 w-3.5" />
            History ({reportsHistory.length})
          </button>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              placeholder="https://www.youtube.com/watch?v=... · youtu.be/... · /shorts/..."
              className="w-full rounded-lg border border-line bg-white/60 py-2.5 pl-10 pr-4 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-brass focus:ring-1 focus:ring-brass/30"
            />
          </div>
          <button onClick={handleAnalyze} disabled={analyzing} className="btn-primary">
            <Sparkles className="h-4 w-4" />
            {analyzing ? "Analyzing..." : "Analyze Song"}
          </button>
        </div>
        {error && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-burgundy">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}

        {/* History panel */}
        {showHistory && (
          <div className="mt-4 rounded-lg border border-line bg-sand/40 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="label-caps">Saved Reports</p>
              {reportsHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="inline-flex items-center gap-1.5 text-xs text-burgundy transition-colors hover:underline"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>
            {reportsHistory.length === 0 ? (
              <p className="text-sm text-muted">
                No saved reports yet. Analyze a song to build your history.
              </p>
            ) : (
              <ul className="space-y-2">
                {reportsHistory.map((r) => {
                  const active = r.id === activeReport.id;
                  return (
                    <li key={r.id}>
                      <button
                        onClick={() => selectFromHistory(r)}
                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-colors ${
                          active
                            ? "border-brass bg-brass/10"
                            : "border-line bg-white/60 hover:border-brass/40"
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm text-ink">
                            {r.song} — {r.artist}
                          </span>
                          <span className="block truncate text-xs text-muted">
                            {r.url}
                          </span>
                        </span>
                        {active && <Check className="h-4 w-4 shrink-0 text-brass" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        <p className="mt-3 flex items-start gap-2 text-xs text-muted">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass" />
          This tool never downloads or stores audio. It keeps only the video ID,
          metadata, your notes, timestamps, and the educational analysis report.
        </p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Main analysis — renders entirely from activeReport */}
        <div className="space-y-6">
          <Card>
            <Tabs tabs={ANALYSIS_TABS}>
              {(tab) => (
                <>
                  {tab === "Overview" && (
                    <div className="space-y-4">
                      <SectionTitle>Overview</SectionTitle>
                      <p className="text-[15px] leading-relaxed text-ink">
                        {activeReport.overview}
                      </p>
                    </div>
                  )}
                  {tab === "Structure Timeline" && (
                    <div>
                      <SectionTitle className="mb-4">Structure Timeline</SectionTitle>
                      <Timeline segments={activeReport.structure} />
                    </div>
                  )}
                  {tab === "Hook Map" && (
                    <div>
                      <SectionTitle className="mb-4">Hook Map</SectionTitle>
                      <HookMap hooks={activeReport.hookMap} />
                    </div>
                  )}
                  {tab === "Energy Curve" && (
                    <div>
                      <SectionTitle className="mb-4">Energy Curve</SectionTitle>
                      <EnergyCurve data={activeReport.energyCurve} />
                    </div>
                  )}
                  {tab === "Harmony Analysis" && (
                    <div>
                      <SectionTitle className="mb-4">Harmony Analysis</SectionTitle>
                      <BulletList items={activeReport.harmony} />
                    </div>
                  )}
                  {tab === "Melody Analysis" && (
                    <div>
                      <SectionTitle className="mb-4">Melody Analysis</SectionTitle>
                      <BulletList items={activeReport.melody} />
                    </div>
                  )}
                  {tab === "Lyrics & Theme" && (
                    <div>
                      <SectionTitle className="mb-4">Lyrics & Theme</SectionTitle>
                      <BulletList items={activeReport.lyricsTheme} />
                      <p className="mt-4 text-xs text-muted">
                        Note: we store thematic and structural commentary only — never
                        full copyrighted lyrics.
                      </p>
                    </div>
                  )}
                  {tab === "Arrangement" && (
                    <div>
                      <SectionTitle className="mb-4">Arrangement</SectionTitle>
                      <BulletList items={activeReport.arrangement} />
                    </div>
                  )}
                  {tab === "Song Genome" && (
                    <div>
                      <SectionTitle className="mb-4">Song Genome</SectionTitle>
                      <GenomeRadar scores={activeReport.genome} />
                      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                        {activeReport.genome.map((g) => (
                          <div
                            key={g.label}
                            className="flex items-center justify-between border-b border-line/60 py-1.5 text-sm"
                          >
                            <span className="text-muted">{g.label}</span>
                            <span className="font-serif text-burgundy">
                              {g.value.toFixed(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </Tabs>
          </Card>
        </div>

        {/* Sidebar — video + song overview, both from activeReport */}
        <aside className="space-y-6">
          <YouTubeEmbed videoId={activeReport.youtubeId} title={activeReport.song} />

          <Card>
            <SectionTitle className="mb-1">Song Overview</SectionTitle>
            <p className="text-sm text-muted">Auto-generated summary</p>
            <div className="mt-4 space-y-3">
              <OverviewRow icon={Music} label="Song" value={activeReport.song} />
              <OverviewRow icon={Music} label="Artist" value={activeReport.artist} />
              <OverviewRow icon={Activity} label="Genre" value={activeReport.genre} />
              <OverviewRow icon={Clock} label="Length" value={activeReport.length} />
              <OverviewRow icon={Activity} label="BPM estimate" value={activeReport.bpm} />
              <OverviewRow icon={KeyRound} label="Key estimate" value={activeReport.key} />
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function OverviewRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Music;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-line/60 pb-2.5 last:border-0">
      <span className="flex items-center gap-2 text-sm text-muted">
        <Icon className="h-3.5 w-3.5 text-brass" />
        {label}
      </span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  );
}
