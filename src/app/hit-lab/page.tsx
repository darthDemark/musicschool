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
  FlaskConical,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { Timeline } from "@/components/Timeline";
import { HookMap } from "@/components/HookMap";
import { EnergyCurve } from "@/components/EnergyCurve";
import { GenomeRadar } from "@/components/GenomeScore";
import { Tabs } from "@/components/Tabs";
import { EmptyState, ExampleBadge } from "@/components/EmptyState";
import { FadeIn } from "@/components/Motion";
import { analyzeSong, extractYouTubeId } from "@/lib/youtube";
import { purpleRainReport } from "@/lib/mockData";
import { getStorage, setStorage } from "@/lib/storage";
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

interface SavedReport {
  url: string;
  videoId: string;
  analyzedAt: string;
  report: HitLabReport;
}

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
  // No hardcoded default — start empty and invite the user to analyze a song.
  const [report, setReport] = useState<HitLabReport | null>(null);
  const [isExample, setIsExample] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Restore the user's most recent analysis if one exists.
  useEffect(() => {
    const saved = getStorage<SavedReport[]>("hit-lab-reports");
    if (saved && saved.length > 0) {
      setSavedReports(saved);
      setReport(saved[0].report);
      setUrl(saved[0].url);
    }
  }, []);

  const persist = (entry: SavedReport) => {
    const updated = [
      entry,
      ...savedReports.filter((r) => r.videoId !== entry.videoId),
    ].slice(0, 10);
    setSavedReports(updated);
    setStorage("hit-lab-reports", updated);
  };

  const handleAnalyze = async () => {
    setError(null);
    if (!url.trim()) {
      setError("Paste a YouTube link to analyze a song.");
      return;
    }
    if (!extractYouTubeId(url)) {
      setError("Please enter a valid YouTube link.");
      return;
    }
    setAnalyzing(true);
    setIsExample(false);

    // Server route fetches real title/channel (YouTube oEmbed), parses
    // "Artist - Song", and builds a per-video report. No client→YouTube calls.
    try {
      const res = await fetch("/api/song-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok || !data?.report) {
        setError(data?.error ?? "Could not analyze that link. Try another.");
        setAnalyzing(false);
        return;
      }
      const newReport: HitLabReport = data.report;
      setReport(newReport);
      setUrl(data.url);
      persist({
        url: data.url,
        videoId: data.videoId,
        analyzedAt: new Date(data.analyzedAt).toLocaleDateString(),
        report: newReport,
      });
      setShowHistory(false);
    } catch {
      setError("Could not reach the analysis service. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const loadExample = () => {
    setReport(analyzeSong(purpleRainReport.youtubeId));
    setUrl("https://www.youtube.com/watch?v=" + purpleRainReport.youtubeId);
    setIsExample(true);
    setError(null);
  };

  const loadReport = (saved: SavedReport) => {
    setUrl(saved.url);
    setReport(saved.report);
    setIsExample(false);
    setShowHistory(false);
  };

  const deleteReport = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedReports.filter((r) => r.videoId !== videoId);
    setSavedReports(updated);
    setStorage("hit-lab-reports", updated);
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
        <p className="label-caps mb-2">Paste YouTube Link</p>
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
            {analyzing ? "Analyzing…" : "Analyze Song"}
          </button>
          {savedReports.length > 0 && (
            <button onClick={() => setShowHistory((h) => !h)} className="btn-ghost">
              <History className="h-4 w-4" />
              History ({savedReports.length})
            </button>
          )}
        </div>

        {error && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-burgundy">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}

        <p className="mt-3 flex items-start gap-2 text-xs text-muted">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass" />
          This tool never downloads or stores audio. It keeps only the video ID,
          metadata, your notes, timestamps, and the educational analysis report.
        </p>

        {/* History panel */}
        {showHistory && (
          <div className="mt-4 rounded-lg border border-line bg-sand/40 p-4">
            <p className="label-caps mb-3">Your Reports</p>
            <div className="space-y-2">
              {savedReports.map((r) => (
                <button
                  key={r.videoId}
                  onClick={() => loadReport(r)}
                  className="flex w-full items-center justify-between rounded-lg border border-line bg-white/60 px-3 py-2 text-left transition-colors hover:border-brass"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {r.report.artist} — {r.report.song}
                    </p>
                    <p className="text-xs text-muted">
                      {r.videoId} · {r.analyzedAt}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteReport(r.videoId, e)}
                    className="ml-3 text-muted hover:text-burgundy"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Empty state — no report yet */}
      {!report ? (
        <EmptyState
          icon={FlaskConical}
          title="Paste a song to analyze"
          description="Drop a YouTube link above and the Hit Lab will generate a full educational deconstruction — structure, hook map, energy curve, harmony, melody, and a song genome."
        >
          <button onClick={loadExample} className="btn-ghost">
            View an example analysis
          </button>
        </EmptyState>
      ) : (
        <>
          {isExample && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber/30 bg-amber/10 px-4 py-2.5">
              <ExampleBadge />
              <span className="text-sm text-ink">
                This is a sample analysis (Prince — Purple Rain). Paste your own
                link above to replace it.
              </span>
            </div>
          )}
          <FadeIn motionKey={report.youtubeId} className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Main analysis */}
            <div className="space-y-6">
              <Card>
                <Tabs tabs={ANALYSIS_TABS}>
                  {(tab) => (
                    <>
                      {tab === "Overview" && (
                        <div className="space-y-4">
                          <SectionTitle>Overview</SectionTitle>
                          <p className="text-[15px] leading-relaxed text-ink">
                            {report.overview}
                          </p>
                        </div>
                      )}
                      {tab === "Structure Timeline" && (
                        <div>
                          <SectionTitle className="mb-4">Structure Timeline</SectionTitle>
                          <Timeline segments={report.structure} />
                        </div>
                      )}
                      {tab === "Hook Map" && (
                        <div>
                          <SectionTitle className="mb-4">Hook Map</SectionTitle>
                          <HookMap hooks={report.hookMap} />
                        </div>
                      )}
                      {tab === "Energy Curve" && (
                        <div>
                          <SectionTitle className="mb-4">Energy Curve</SectionTitle>
                          <EnergyCurve data={report.energyCurve} />
                        </div>
                      )}
                      {tab === "Harmony Analysis" && (
                        <div>
                          <SectionTitle className="mb-4">Harmony Analysis</SectionTitle>
                          <BulletList items={report.harmony} />
                        </div>
                      )}
                      {tab === "Melody Analysis" && (
                        <div>
                          <SectionTitle className="mb-4">Melody Analysis</SectionTitle>
                          <BulletList items={report.melody} />
                        </div>
                      )}
                      {tab === "Lyrics & Theme" && (
                        <div>
                          <SectionTitle className="mb-4">Lyrics & Theme</SectionTitle>
                          <BulletList items={report.lyricsTheme} />
                          <p className="mt-4 text-xs text-muted">
                            Note: we store thematic and structural commentary only —
                            never full copyrighted lyrics.
                          </p>
                        </div>
                      )}
                      {tab === "Arrangement" && (
                        <div>
                          <SectionTitle className="mb-4">Arrangement</SectionTitle>
                          <BulletList items={report.arrangement} />
                        </div>
                      )}
                      {tab === "Song Genome" && (
                        <div>
                          <SectionTitle className="mb-4">Song Genome</SectionTitle>
                          <GenomeRadar scores={report.genome} />
                          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
                            {report.genome.map((g) => (
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

            {/* Sidebar */}
            <aside className="space-y-6">
              <YouTubeEmbed videoId={report.youtubeId} title={report.song} />

              <Card>
                <SectionTitle className="mb-1">Song Overview</SectionTitle>
                <p className="text-sm text-muted">Auto-generated summary</p>
                <div className="mt-4 space-y-3">
                  <OverviewRow icon={Music} label="Song" value={report.song} />
                  <OverviewRow icon={Music} label="Artist" value={report.artist} />
                  <OverviewRow icon={Activity} label="Genre" value={report.genre} />
                  <OverviewRow icon={Clock} label="Length" value={report.length} />
                  <OverviewRow icon={Activity} label="BPM estimate" value={report.bpm} />
                  <OverviewRow icon={KeyRound} label="Key estimate" value={report.key} />
                </div>
              </Card>
            </aside>
          </FadeIn>
        </>
      )}
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
