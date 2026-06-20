"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Music2,
  Volume2,
  ClipboardCheck,
  NotebookPen,
  Check,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { PianoKeyboard } from "@/components/PianoKeyboard";
import { curriculumUnits } from "@/lib/mockData";
import { theoryCurriculum, theorySectionOrder } from "@/lib/theoryCurriculum";
import { getStorage, setStorage } from "@/lib/storage";

const STORAGE_KEY = "theory-active-section";
const DEFAULT_SECTION = "counterpoint";

export default function TheoryPage() {
  const [activeUnit, setActiveUnit] = useState(DEFAULT_SECTION);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Restore the last-selected curriculum section.
  useEffect(() => {
    const saved = getStorage<string>(STORAGE_KEY);
    if (saved && theoryCurriculum[saved]) setActiveUnit(saved);
  }, []);

  const selectSection = (id: string) => {
    setActiveUnit(id);
    setStorage(STORAGE_KEY, id);
    // Reset the quiz whenever the section changes so content never leaks across.
    setShowQuiz(false);
    setAnswers({});
  };

  const section = theoryCurriculum[activeUnit] ?? theoryCurriculum[DEFAULT_SECTION];

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
          {theorySectionOrder.map((id) => {
            const unit = curriculumUnits.find((u) => u.id === id);
            if (!unit) return null;
            const active = unit.id === activeUnit;
            return (
              <button
                key={unit.id}
                onClick={() => selectSection(unit.id)}
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

          {/* Current lesson — fully driven by the selected section */}
          <Card>
            <div className="flex items-center gap-2 text-brass">
              <BookOpen className="h-4 w-4" />
              <p className="label-caps text-brass">Current Lesson • {section.unit}</p>
            </div>
            <h2 className="mt-2 font-serif text-3xl text-ink">{section.title}</h2>
            <p className="mt-1 text-sm italic text-muted">{section.subtitle}</p>

            <div className="mt-5">
              <p className="label-caps mb-2">Lesson Overview</p>
              <p className="text-[15px] leading-relaxed text-ink">{section.overview}</p>
            </div>

            <div className="mt-6">
              <p className="label-caps mb-2">Explanation</p>
              <div className="space-y-3">
                {section.explanation.map((para, i) => (
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
                <p className="label-caps">Notation Example — {section.notation.title}</p>
              </div>
              <div className="overflow-hidden rounded-lg border border-line bg-sand/50">
                {/* Faux staff */}
                <div className="relative h-24 border-b border-line bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_15px,#D8CFC0_15px,#D8CFC0_16px)] bg-[length:100%_80px] bg-center bg-no-repeat" />
                <div className="grid grid-cols-2 divide-x divide-line text-sm">
                  <div className="p-3">
                    <p className="label-caps mb-2">{section.notation.leftLabel}</p>
                    <ul className="space-y-1 text-ink">
                      {section.notation.rows.map((row, i) => (
                        <li key={i}>{row.left}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3">
                    <p className="label-caps mb-2">{section.notation.rightLabel}</p>
                    <ul className="space-y-1 text-ink">
                      {section.notation.rows.map((row, i) => (
                        <li key={i}>{row.right}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive keyboard + audio examples */}
            <div className="mt-6">
              <p className="label-caps mb-2">Keyboard & Audio Examples</p>
              <PianoKeyboard
                key={section.id}
                startMidi={section.keyboard.startMidi}
                endMidi={section.keyboard.endMidi}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {section.audio.map((ex) => (
                  <button
                    key={ex.label}
                    onClick={ex.play}
                    className="flex items-center gap-1.5 rounded-lg border border-line bg-white/60 px-3 py-2 text-xs text-ink transition-colors hover:border-brass hover:bg-brass/5"
                  >
                    <Volume2 className="h-3.5 w-3.5 text-brass" />
                    {ex.label}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-muted">{section.keyboard.caption}</p>
            </div>

            {/* Practice assignment */}
            <div className="mt-6 rounded-lg border border-burgundy/20 bg-burgundy/5 p-5">
              <p className="label-caps mb-2 text-burgundy">{section.practice.title}</p>
              <p className="text-[15px] leading-relaxed text-ink">{section.practice.body}</p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setShowQuiz((s) => !s)}
                className="btn-primary"
              >
                <ClipboardCheck className="h-4 w-4" />
                {showQuiz ? "Hide Quiz" : "Take the Quiz"}
              </button>
              <button className="btn-ghost">
                <NotebookPen className="h-4 w-4" />
                Add to Notebook
              </button>
            </div>

            {/* Quiz */}
            {showQuiz && (
              <div className="mt-6 space-y-5 rounded-lg border border-line bg-sand/40 p-5">
                <p className="label-caps">Quiz • {section.unit}</p>
                {section.quiz.map((q, qi) => {
                  const chosen = answers[qi];
                  const answered = chosen !== undefined;
                  return (
                    <div key={qi}>
                      <p className="mb-2 text-[15px] text-ink">
                        {qi + 1}. {q.question}
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {q.options.map((opt, oi) => {
                          const isChosen = chosen === oi;
                          const isCorrect = oi === q.answerIndex;
                          let cls =
                            "border-line bg-white/60 text-ink hover:border-brass";
                          if (answered && isCorrect) {
                            cls = "border-success bg-success/10 text-ink";
                          } else if (answered && isChosen && !isCorrect) {
                            cls = "border-burgundy bg-burgundy/10 text-burgundy";
                          }
                          return (
                            <button
                              key={oi}
                              disabled={answered}
                              onClick={() =>
                                setAnswers((a) => ({ ...a, [qi]: oi }))
                              }
                              className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-default ${cls}`}
                            >
                              {opt}
                              {answered && isCorrect && (
                                <Check className="h-4 w-4 text-success" />
                              )}
                              {answered && isChosen && !isCorrect && (
                                <X className="h-4 w-4 text-burgundy" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
