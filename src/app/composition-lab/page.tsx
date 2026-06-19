"use client";

import { useState } from "react";
import { Play, Pause, SkipBack, Music2, FileText } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { compositionAssignment, compositionCategories } from "@/lib/mockData";

const WHITE_KEYS = ["C", "D", "E", "F", "G", "A", "B", "C", "D", "E", "F", "G", "A", "B"];
// Index after which a black key follows (no black key after E and B).
const BLACK_AFTER = new Set([0, 1, 3, 4, 5, 7, 8, 10, 11, 12]);

function PianoKeyboard() {
  return (
    <div className="relative flex h-32 w-full select-none overflow-hidden rounded-lg border border-line bg-white">
      {WHITE_KEYS.map((key, i) => (
        <div
          key={`${key}-${i}`}
          className="relative flex flex-1 items-end justify-center border-r border-line pb-2 text-[10px] text-muted transition-colors last:border-r-0 hover:bg-sand"
        >
          {key}
          {BLACK_AFTER.has(i) && (
            <span className="absolute -right-[7px] top-0 z-10 h-20 w-[14px] rounded-b bg-charcoal" />
          )}
        </div>
      ))}
    </div>
  );
}

export default function CompositionLabPage() {
  const [category, setCategory] = useState(compositionCategories[0]);
  const [playing, setPlaying] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  return (
    <div>
      <PageHeader
        eyebrow="Composition Lab"
        title="Advanced Composer Training"
        subtitle="Counterpoint, fugue, reharmonization, and the deep craft of writing music."
      />

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Lab categories */}
        <aside className="space-y-2">
          <p className="label-caps mb-2">Labs</p>
          {compositionCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex w-full items-center gap-2 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                category === cat
                  ? "border-brass bg-brass/10 text-ink"
                  : "border-line bg-white/60 text-muted hover:text-ink"
              }`}
            >
              <Music2 className="h-4 w-4 text-brass" />
              {cat}
            </button>
          ))}
        </aside>

        {/* Workspace */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="label-caps text-brass">Current Assignment • {category}</p>
                <SectionTitle className="mt-1">
                  {compositionAssignment.title}
                </SectionTitle>
                <p className="mt-1 text-sm text-muted">
                  {compositionAssignment.description}
                </p>
              </div>
              <button
                onClick={() => setShowDetails((s) => !s)}
                className="btn-ghost"
              >
                <FileText className="h-4 w-4" />
                Assignment Details
              </button>
            </div>

            {showDetails && (
              <ol className="mt-4 space-y-2 rounded-lg border border-line bg-sand/40 p-5">
                {compositionAssignment.details.map((d, i) => (
                  <li key={i} className="flex gap-3 text-sm text-ink">
                    <span className="font-serif text-brass">{i + 1}.</span>
                    {d}
                  </li>
                ))}
              </ol>
            )}

            {/* Notation editor placeholder */}
            <div className="mt-6">
              <p className="label-caps mb-2">Notation Editor</p>
              <div className="rounded-lg border border-line bg-white">
                <div className="space-y-6 p-6">
                  {[0, 1].map((staff) => (
                    <div
                      key={staff}
                      className="h-20 w-full bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_15px,#D8CFC0_15px,#D8CFC0_16px)] bg-[length:100%_80px] bg-no-repeat"
                    />
                  ))}
                </div>
              </div>
              <p className="mt-1 text-xs text-muted">
                Notation editor placeholder — integrate a music notation library
                (e.g. VexFlow / OpenSheetMusicDisplay) here.
              </p>
            </div>

            {/* Piano keyboard */}
            <div className="mt-6">
              <p className="label-caps mb-2">Keyboard</p>
              <PianoKeyboard />
            </div>

            {/* Playback controls */}
            <div className="mt-6 flex items-center gap-3 rounded-lg border border-line bg-charcoal p-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-full text-ivory transition-colors hover:bg-white/10">
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                onClick={() => setPlaying((p) => !p)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-brass text-charcoal transition-transform hover:scale-105"
              >
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-1/3 rounded-full bg-brass" />
              </div>
              <span className="text-xs text-white/60">0:12 / 0:36</span>
            </div>
          </Card>

          {/* Topics */}
          <Card>
            <SectionTitle className="mb-3">Topics in this Curriculum</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {compositionAssignment.topics.map((topic) => (
                <span key={topic} className="chip">
                  {topic}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
