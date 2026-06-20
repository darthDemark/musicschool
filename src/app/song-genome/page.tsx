"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Music,
  Dna,
  Search,
  Calendar,
  Tag,
  Trophy,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  Lightbulb,
  Check,
  ChevronDown,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { ProgressRing } from "@/components/ProgressRing";
import { FadeIn } from "@/components/Motion";
import { EmptyState, ExampleBadge } from "@/components/EmptyState";
import { purpleRainReport } from "@/lib/mockData";
import { getStorage } from "@/lib/storage";
import {
  dimensionEducation,
  observationsFor,
  whyItWorks,
  takeaways,
  stealTechnique,
  songRelatives,
} from "@/lib/songGenome";
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
  const [expandedDim, setExpandedDim] = useState<string | null>(null);

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
  const why = whyItWorks(r.genome);
  const lessons = takeaways(r.genome);
  const tech = stealTechnique(r.genome);
  const relatives = songRelatives(r.genome, `${r.artist} ${r.song}`);

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

          {/* WHY THIS SONG WORKS */}
          {why && (
            <Card>
              <SectionTitle className="mb-4">Why This Song Works</SectionTitle>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-success/30 bg-success/10 p-4">
                  <p className="label-caps mb-1 flex items-center gap-1.5 text-success">
                    <Trophy className="h-3.5 w-3.5" /> Primary Strength
                  </p>
                  <p className="font-serif text-lg text-ink">
                    {why.strength.label} ({why.strength.value.toFixed(1)})
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink">{why.strengthText}</p>
                </div>
                <div className="rounded-lg border border-amber/30 bg-amber/10 p-4">
                  <p className="label-caps mb-1 flex items-center gap-1.5 text-amber">
                    <AlertTriangle className="h-3.5 w-3.5" /> Weakest Area
                  </p>
                  <p className="font-serif text-lg text-ink">
                    {why.weakest.label} ({why.weakest.value.toFixed(1)})
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink">{why.weaknessText}</p>
                </div>
              </div>
            </Card>
          )}

          {/* SONG DNA — clickable strands */}
          <Card>
            <SectionTitle className="mb-1">Song DNA</SectionTitle>
            <p className="mb-4 text-sm text-muted">
              Tap any strand to learn what it means, why it scored, and how to improve it.
            </p>
            <div className="space-y-2">
              {r.genome.map((g) => {
                const edu = dimensionEducation[g.label];
                const pct = Math.round(g.value * 10);
                const open = expandedDim === g.label;
                const obs = observationsFor(g.label, g.value);
                return (
                  <div key={g.label} className="overflow-hidden rounded-lg border border-line bg-white/60">
                    <button
                      onClick={() => setExpandedDim(open ? null : g.label)}
                      className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-sand/40"
                    >
                      <span className="w-24 shrink-0 text-[11px] font-medium uppercase tracking-wider text-ink">
                        {edu?.short ?? g.label}
                      </span>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-sand">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brass to-burgundy transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-9 shrink-0 text-right font-serif text-sm text-burgundy">
                        {g.value.toFixed(1)}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    {open && edu && (
                      <FadeIn className="space-y-4 border-t border-line px-4 py-4">
                        <div>
                          <p className="label-caps mb-1">What It Means</p>
                          <p className="text-sm leading-relaxed text-ink">{edu.meaning}</p>
                        </div>
                        {obs.good.length > 0 && (
                          <div>
                            <p className="label-caps mb-1.5">Why It Scored</p>
                            <ul className="space-y-1">
                              {obs.good.map((o) => (
                                <li key={o} className="flex items-center gap-2 text-sm text-ink">
                                  <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                                  {o}
                                </li>
                              ))}
                              {obs.warn.map((o) => (
                                <li key={o} className="flex items-center gap-2 text-sm text-muted">
                                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber" />
                                  {o}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div>
                          <p className="label-caps mb-1.5">Similar Songs</p>
                          <div className="flex flex-wrap gap-2">
                            {edu.exemplars.map((e) => (
                              <span key={e} className="chip">
                                {e}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-lg border border-burgundy/20 bg-burgundy/5 p-3">
                          <p className="label-caps mb-1.5 text-burgundy">How To Improve This Area</p>
                          <ul className="space-y-1">
                            {edu.improvements.map((imp) => (
                              <li key={imp} className="flex gap-2 text-sm text-ink">
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                                {imp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </FadeIn>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* SONGWRITER TAKEAWAYS */}
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-brass" />
              <SectionTitle>What a Songwriter Should Learn</SectionTitle>
            </div>
            <ol className="space-y-2.5">
              {lessons.map((l, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brass/15 font-serif text-sm text-brass">
                    {i + 1}
                  </span>
                  <span className="self-center">{l}</span>
                </li>
              ))}
            </ol>
          </Card>

          {/* STEAL THIS TECHNIQUE */}
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brass" />
              <SectionTitle>Technique to Borrow</SectionTitle>
            </div>
            <h3 className="font-serif text-2xl text-ink">{tech.name}</h3>
            <div className="mt-3">
              <p className="label-caps mb-1">Effect</p>
              <p className="text-sm leading-relaxed text-ink">{tech.effect}</p>
            </div>
            <div className="mt-3">
              <p className="label-caps mb-1.5">Artists Using It</p>
              <div className="flex flex-wrap gap-2">
                {tech.artists.map((a) => (
                  <span key={a} className="chip">
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-2.5 rounded-lg border border-brass/30 bg-brass/5 p-4">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
              <div>
                <p className="label-caps mb-0.5 text-brass">Practice Exercise</p>
                <p className="text-sm text-ink">{tech.exercise}</p>
              </div>
            </div>
          </Card>

          {/* SONG RELATIVES — songwriting DNA */}
          <Card>
            <div className="mb-1 flex items-center gap-2">
              <Dna className="h-4 w-4 text-brass" />
              <SectionTitle>Similar Song DNA</SectionTitle>
            </div>
            <p className="mb-4 text-sm text-muted">
              Not by genre — by songwriting structure. Here&apos;s what this song shares with the
              greats.
            </p>
            <div className="space-y-3">
              {relatives.map((rel) => (
                <div key={rel.title} className="rounded-lg border border-line bg-white/60 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="font-serif text-lg text-ink">{rel.title}</p>
                    <span className="shrink-0 rounded-full bg-brass/15 px-2.5 py-0.5 font-serif text-sm text-brass">
                      {rel.similarity}%
                    </span>
                  </div>
                  <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-sand">
                    <div
                      className="h-full rounded-full bg-brass"
                      style={{ width: `${rel.similarity}%` }}
                    />
                  </div>
                  <p className="label-caps mb-1.5">Shared Traits</p>
                  <div className="flex flex-wrap gap-2">
                    {rel.traits.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
