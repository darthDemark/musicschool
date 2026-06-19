"use client";

import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { Tabs } from "@/components/Tabs";
import { NotebookPanel } from "@/components/NotebookPanel";
import { RhymeList } from "@/components/RhymeList";
import { rhymeData, writersRoomProject } from "@/lib/mockData";

const TABS = ["Lyrics", "Themes", "Rhymes", "Melody", "Chords", "Notes"];

export default function WritersRoomPage() {
  const p = writersRoomProject;

  return (
    <div>
      <PageHeader
        eyebrow="Writer's Room"
        title="Creative Notebook"
        subtitle="A focused space to develop a song from a feeling into a finished lyric."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main editor */}
        <Card>
          <div className="mb-4">
            <p className="label-caps text-brass">Current Project</p>
            <h2 className="font-serif text-3xl text-ink">{p.title}</h2>
            <p className="mt-1 text-sm text-muted">Theme: {p.theme}</p>
          </div>

          <Tabs tabs={TABS}>
            {(tab) => (
              <>
                {tab === "Lyrics" && (
                  <NotebookPanel
                    label="Lyrics"
                    initialValue={p.lyrics}
                    placeholder="Write your verses, pre-chorus, and chorus here..."
                  />
                )}
                {tab === "Themes" && (
                  <div className="space-y-6">
                    <div>
                      <p className="label-caps mb-2">Emotional Targets</p>
                      <div className="flex flex-wrap gap-2">
                        {p.emotionalTargets.map((t) => (
                          <span key={t} className="chip border-burgundy/30 bg-burgundy/10 text-burgundy">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="label-caps mb-2">Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {p.keywords.map((k) => (
                          <span key={k} className="chip">
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {tab === "Rhymes" && (
                  <div className="space-y-4">
                    <p className="label-caps">Perfect rhymes for &ldquo;fire&rdquo;</p>
                    <RhymeList words={rhymeData.fire.perfect} />
                  </div>
                )}
                {tab === "Melody" && (
                  <NotebookPanel
                    label="Melody Notes"
                    placeholder="Describe melodic contour, range, motifs, phrasing ideas..."
                  />
                )}
                {tab === "Chords" && (
                  <NotebookPanel
                    label="Chord Sketches"
                    initialValue={p.chords}
                    placeholder="Sketch progressions for verse, pre-chorus, and chorus..."
                  />
                )}
                {tab === "Notes" && (
                  <NotebookPanel
                    label="Notes"
                    initialValue={p.notes}
                    placeholder="Capture the concept, the story, the feeling..."
                  />
                )}
              </>
            )}
          </Tabs>
        </Card>

        {/* Sidebar summary */}
        <aside className="space-y-6">
          <Card>
            <SectionTitle className="mb-3">Concept</SectionTitle>
            <p className="text-[15px] italic leading-relaxed text-ink">
              &ldquo;{p.notes}&rdquo;
            </p>
          </Card>

          <Card>
            <p className="label-caps mb-2">Emotional Targets</p>
            <div className="flex flex-wrap gap-2">
              {p.emotionalTargets.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
            <p className="label-caps mb-2 mt-5">Keywords</p>
            <div className="flex flex-wrap gap-2">
              {p.keywords.map((k) => (
                <span key={k} className="chip border-brass/30 bg-brass/10">
                  {k}
                </span>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
