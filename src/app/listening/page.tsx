"use client";

import { useEffect, useState } from "react";
import { HelpCircle, Target, Headphones } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { SongCard } from "@/components/SongCard";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { NotebookPanel } from "@/components/NotebookPanel";
import { Tabs } from "@/components/Tabs";
import { EmptyState } from "@/components/EmptyState";
import { featuredListening, listeningCollections } from "@/lib/mockData";
import { getStorage, setStorage } from "@/lib/storage";
import { logActivity } from "@/lib/activity";

export default function ListeningPage() {
  // No assignment is chosen by default — the user picks one.
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const saved = getStorage<string>("listening-current-id");
    if (saved && listeningCollections.some((t) => t.id === saved)) setActiveId(saved);
  }, []);

  const active = listeningCollections.find((t) => t.id === activeId) ?? null;

  const selectTrack = (id: string) => {
    setActiveId(id);
    const track = listeningCollections.find((t) => t.id === id);
    if (track) {
      setStorage("listening-current-id", id);
      setStorage("listening-current", {
        title: track.title,
        artist: track.artist,
        focus: track.focus,
        youtubeId: track.youtubeId,
      });
      logActivity();
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Listening Curriculum"
        title="Guided Listening"
        subtitle="A curated path through great music — listen with intent, not just for pleasure."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Featured / player */}
        <div className="space-y-6">
          {!active ? (
            <EmptyState
              icon={Headphones}
              title="Choose a listening assignment"
              description="Pick a track from the collections to start a guided listening session — with a mission, focus, and notes."
            />
          ) : (
            <>
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">
                <Target className="h-3.5 w-3.5 text-burgundy" />
                Featured Assignment
              </span>
            </div>
            <h2 className="mt-3 font-serif text-3xl text-ink">{active.title}</h2>
            <p className="mt-1 text-sm text-muted">{active.artist}</p>

            <div className="mt-4">
              <YouTubeEmbed videoId={active.youtubeId} title={active.title} />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-line bg-sand/50 p-4">
                <p className="label-caps mb-1">Mission</p>
                <p className="text-sm text-ink">{featuredListening.mission}</p>
              </div>
              <div className="rounded-lg border border-line bg-sand/50 p-4">
                <p className="label-caps mb-1">Focus</p>
                <p className="text-sm text-ink">{active.focus}</p>
              </div>
            </div>
          </Card>

          <Card>
            <Tabs tabs={["Questions", "Notes", "Analysis"]}>
              {(tab) => (
                <>
                  {tab === "Questions" && (
                    <div className="space-y-3">
                      <p className="label-caps">Listening Questions</p>
                      {featuredListening.questions.map((q, i) => (
                        <div
                          key={q}
                          className="flex gap-3 rounded-lg border border-line bg-white/60 p-4"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brass/15 font-serif text-sm text-brass">
                            {i + 1}
                          </span>
                          <p className="self-center text-sm text-ink">{q}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {tab === "Notes" && (
                    <NotebookPanel
                      label="Listening Notes"
                      placeholder="Capture what you hear — moments of tension, release, instrumentation changes..."
                    />
                  )}
                  {tab === "Analysis" && (
                    <div className="space-y-3 text-[15px] leading-relaxed text-ink">
                      <p className="label-caps">Guided Analysis</p>
                      <p>
                        Track the emotional arc across the form. Note where the
                        arrangement adds or removes layers, and how those choices
                        steer the listener&apos;s attention.
                      </p>
                      <p>
                        Pay special attention to dynamic contrast — the deliberate
                        restraint early in a song is what makes its climax land.
                      </p>
                    </div>
                  )}
                </>
              )}
            </Tabs>
          </Card>
            </>
          )}
        </div>

        {/* Collection list */}
        <aside className="space-y-3">
          <p className="label-caps">Collections</p>
          {listeningCollections.map((track) => (
            <SongCard
              key={track.id}
              track={track}
              active={track.id === activeId}
              onSelect={() => selectTrack(track.id)}
            />
          ))}
          <div className="flex items-start gap-2 rounded-lg border border-line bg-sand/40 p-4 text-xs text-muted">
            <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
            Videos are embedded from YouTube. This app never downloads or stores
            audio — only the link, your notes, and timestamps.
          </div>
        </aside>
      </div>
    </div>
  );
}
