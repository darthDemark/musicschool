"use client";

import { useState } from "react";
import { BookOpen, Music2, Volume2, ClipboardCheck, NotebookPen } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { PianoKeyboard } from "@/components/PianoKeyboard";
import {
  curriculumUnits,
  currentLesson,
  intervalInversionTable,
  lessonExplanation,
  practiceAssignment,
} from "@/lib/mockData";
import { playMajorTriad, playMinorTriad, playAuthenticCadence } from "@/lib/audioEngine";

export default function TheoryPage() {
  const [activeUnit, setActiveUnit] = useState(
    curriculumUnits.find((u) => u.id === "counterpoint")?.id ?? curriculumUnits[0].id
  );

  return (
    <div>
      <PageHeader
        eyebrow="Theory Academy"
        title="The Conservatory Textbook"
        subtitle="A complete course of study, from the grammar of notation to the architecture of fugue."
      />

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Curriculum spine */}
        <aside className="space-y-2">
          <p className="label-caps mb-2">Curriculum</p>
          {curriculumUnits.map((unit) => {
            const active = unit.id === activeUnit;
            return (
              <button
                key={unit.id}
                onClick={() => setActiveUnit(unit.id)}
                className={`card w-full p-4 text-left transition-all hover:shadow-card-hover ${
                  active ? "ring-2 ring-brass/50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-base text-ink">{unit.title}</span>
                  <span className="text-xs text-brass">{unit.progress}%</span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-sand">
                  <div
                    className="h-full rounded-full bg-brass"
                    style={{ width: `${unit.progress}%` }}
                  />
                </div>
              </button>
            );
          })}
        </aside>

        {/* Lesson view */}
        <div className="space-y-6">
          {/* Active unit topics */}
          {curriculumUnits
            .filter((u) => u.id === activeUnit)
            .map((unit) => (
              <Card key={unit.id}>
                <SectionTitle>{unit.title}</SectionTitle>
                <p className="mt-1 text-sm text-muted">{unit.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {unit.topics.map((topic) => (
                    <span key={topic} className="chip">
                      {topic}
                    </span>
                  ))}
                </div>
              </Card>
            ))}

          {/* Current lesson */}
          <Card>
            <div className="flex items-center gap-2 text-brass">
              <BookOpen className="h-4 w-4" />
              <p className="label-caps text-brass">
                Current Lesson • {currentLesson.unit}
              </p>
            </div>
            <h2 className="mt-2 font-serif text-3xl text-ink">{currentLesson.title}</h2>

            <div className="mt-5">
              <p className="label-caps mb-2">Lesson Overview</p>
              <p className="text-[15px] leading-relaxed text-ink">
                {currentLesson.summary}
              </p>
            </div>

            <div className="mt-6">
              <p className="label-caps mb-2">Explanation</p>
              <div className="space-y-3">
                {lessonExplanation.map((para, i) => (
                  <p key={i} className="text-[15px] leading-relaxed text-ink">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Notation-style example */}
            <div className="mt-6">
              <div className="mb-2 flex items-center gap-2">
                <Music2 className="h-4 w-4 text-brass" />
                <p className="label-caps">Notation Example — Interval Inversion at the Octave</p>
              </div>
              <div className="overflow-hidden rounded-lg border border-line bg-sand/50">
                {/* Faux staff */}
                <div className="relative h-24 border-b border-line bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_15px,#D8CFC0_15px,#D8CFC0_16px)] bg-[length:100%_80px] bg-center bg-no-repeat" />
                <div className="grid grid-cols-2 divide-x divide-line text-sm">
                  <div className="p-3">
                    <p className="label-caps mb-2">Original</p>
                    <ul className="space-y-1 text-ink">
                      {intervalInversionTable.map((row) => (
                        <li key={row.original}>{row.original}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3">
                    <p className="label-caps mb-2">Inverted</p>
                    <ul className="space-y-1 text-ink">
                      {intervalInversionTable.map((row) => (
                        <li key={row.inverted}>{row.inverted}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive keyboard + audio examples */}
            <div className="mt-6">
              <p className="label-caps mb-2">Keyboard & Audio Examples</p>
              <PianoKeyboard startMidi={48} endMidi={72} />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => playMajorTriad(60)}
                  className="flex items-center gap-1.5 rounded-lg border border-line bg-white/60 px-3 py-2 text-xs text-ink transition-colors hover:border-brass hover:bg-brass/5"
                >
                  <Volume2 className="h-3.5 w-3.5 text-brass" />
                  C Major Triad
                </button>
                <button
                  onClick={() => playMinorTriad(60)}
                  className="flex items-center gap-1.5 rounded-lg border border-line bg-white/60 px-3 py-2 text-xs text-ink transition-colors hover:border-brass hover:bg-brass/5"
                >
                  <Volume2 className="h-3.5 w-3.5 text-brass" />
                  C Minor Triad
                </button>
                <button
                  onClick={() => playAuthenticCadence(60)}
                  className="flex items-center gap-1.5 rounded-lg border border-line bg-white/60 px-3 py-2 text-xs text-ink transition-colors hover:border-brass hover:bg-brass/5"
                >
                  <Volume2 className="h-3.5 w-3.5 text-brass" />
                  Authentic Cadence (V7→I)
                </button>
              </div>
              <p className="mt-1 text-xs text-muted">
                Click keys to play notes or use the example buttons above.
              </p>
            </div>

            {/* Practice assignment */}
            <div className="mt-6 rounded-lg border border-burgundy/20 bg-burgundy/5 p-5">
              <p className="label-caps mb-2 text-burgundy">{practiceAssignment.title}</p>
              <p className="text-[15px] leading-relaxed text-ink">
                {practiceAssignment.body}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="btn-primary">
                <ClipboardCheck className="h-4 w-4" />
                Take the Quiz
              </button>
              <button className="btn-ghost">
                <NotebookPen className="h-4 w-4" />
                Add to Notebook
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
