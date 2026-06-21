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
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { FadeIn } from "@/components/Motion";
import { PianoKeyboard } from "@/components/PianoKeyboard";
import { curriculumUnits } from "@/lib/mockData";
import { theoryCurriculum, theorySectionOrder } from "@/lib/theoryCurriculum";
import { getStorage, setStorage } from "@/lib/storage";
import {
  categoryProgress,
  getCompletedSubtopics,
  markSubtopicVisited,
  subtopicKey,
  toggleSubtopicComplete,
} from "@/lib/theoryProgress";
import { logActivity } from "@/lib/activity";

const CATEGORY_KEY = "theory-active-category";
const SUBTOPIC_KEY = "theory-active-subtopic";
const DEFAULT_CATEGORY = "counterpoint";

export default function TheoryPage() {
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY);
  const [activeSubtopic, setActiveSubtopic] = useState(
    theoryCurriculum[DEFAULT_CATEGORY].subtopics[0].id
  );
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  // Real learning progress (persisted): which subtopics are completed/visited.
  const [completed, setCompleted] = useState<string[]>([]);
  const [visited, setVisited] = useState<string[]>([]);

  // Restore the last-selected category + subtopic, plus progress.
  useEffect(() => {
    const savedCat = getStorage<string>(CATEGORY_KEY);
    const cat = savedCat && theoryCurriculum[savedCat] ? savedCat : DEFAULT_CATEGORY;
    const savedSub = getStorage<string>(SUBTOPIC_KEY);
    const sub =
      savedSub && theoryCurriculum[cat].subtopics.some((s) => s.id === savedSub)
        ? savedSub
        : theoryCurriculum[cat].subtopics[0].id;
    setActiveCategory(cat);
    setActiveSubtopic(sub);
    setCompleted(getCompletedSubtopics());
    setVisited(markSubtopicVisited(cat, sub));
  }, []);

  const resetQuiz = () => {
    setShowQuiz(false);
    setAnswers({});
  };

  // Clicking a category resets the subtopic to that category's first subtopic.
  const selectCategory = (id: string) => {
    const first = theoryCurriculum[id].subtopics[0].id;
    setActiveCategory(id);
    setActiveSubtopic(first);
    setStorage(CATEGORY_KEY, id);
    setStorage(SUBTOPIC_KEY, first);
    setVisited(markSubtopicVisited(id, first));
    resetQuiz();
  };

  const selectSubtopic = (id: string) => {
    setActiveSubtopic(id);
    setStorage(SUBTOPIC_KEY, id);
    setVisited(markSubtopicVisited(activeCategory, id));
    resetQuiz();
  };

  const category = theoryCurriculum[activeCategory] ?? theoryCurriculum[DEFAULT_CATEGORY];
  const subtopic =
    category.subtopics.find((s) => s.id === activeSubtopic) ?? category.subtopics[0];
  const unitMeta = curriculumUnits.find((u) => u.id === activeCategory);

  const activeKey = subtopicKey(activeCategory, activeSubtopic);
  const isComplete = completed.includes(activeKey);

  const toggleComplete = () => {
    const next = toggleSubtopicComplete(activeCategory, activeSubtopic);
    setCompleted(next);
    if (next.includes(activeKey)) logActivity();
  };

  return (
    <div>
      <PageHeader
        eyebrow="Learn"
        title="Music Theory"
        subtitle="From the fundamentals to advanced harmony and counterpoint — one subtopic at a time."
      />

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Curriculum spine */}
        <aside className="space-y-2">
          <p className="label-caps mb-2">Curriculum</p>
          {theorySectionOrder.map((id) => {
            const unit = curriculumUnits.find((u) => u.id === id);
            const cat = theoryCurriculum[id];
            if (!unit || !cat) return null;
            const active = id === activeCategory;
            const pct = categoryProgress(id, completed);
            return (
              <button
                key={id}
                onClick={() => selectCategory(id)}
                className={`card w-full p-4 text-left transition-all hover:shadow-card-hover ${
                  active ? "ring-2 ring-brass/50" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-base text-ink">{unit.title}</span>
                  <span className="text-xs text-brass">{pct}%</span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-sand">
                  <div
                    className="h-full rounded-full bg-brass transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </aside>

        {/* Lesson view */}
        <div className="space-y-6">
          {/* Category header + clickable subtopic pills */}
          <Card>
            <SectionTitle>{category.unit}</SectionTitle>
            {unitMeta && <p className="mt-1 text-sm text-muted">{unitMeta.description}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {category.subtopics.map((s) => {
                const active = s.id === activeSubtopic;
                const done = completed.includes(subtopicKey(activeCategory, s.id));
                const seen = visited.includes(subtopicKey(activeCategory, s.id));
                return (
                  <button
                    key={s.id}
                    onClick={() => selectSubtopic(s.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                      active
                        ? "border-brass bg-brass/15 font-medium text-ink"
                        : done
                          ? "border-success/40 bg-success/10 text-ink"
                          : seen
                            ? "border-line bg-white/60 text-ink hover:border-brass/50"
                            : "border-line bg-white/60 text-muted hover:border-brass/50 hover:text-ink"
                    }`}
                  >
                    {done && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                    {s.title}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Lesson — fully driven by the selected subtopic (animated on change) */}
          <Card>
            <FadeIn motionKey={`${activeCategory}-${activeSubtopic}`}>
              <div className="flex items-center gap-2 text-brass">
                <BookOpen className="h-4 w-4" />
                <p className="label-caps text-brass">
                  {category.unit} • {subtopic.title}
                </p>
              </div>
              <h2 className="mt-2 font-serif text-3xl text-ink">{subtopic.title}</h2>
              <p className="mt-1 text-sm italic text-muted">{subtopic.subtitle}</p>

              <div className="mt-5">
                <p className="label-caps mb-2">Lesson Overview</p>
                <p className="text-[15px] leading-relaxed text-ink">{subtopic.overview}</p>
              </div>

              <div className="mt-6">
                <p className="label-caps mb-2">Explanation</p>
                <div className="space-y-3">
                  {subtopic.explanation.map((para, i) => (
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
                  <p className="label-caps">Notation Example — {subtopic.notation.title}</p>
                </div>
                <div className="overflow-hidden rounded-lg border border-line bg-sand/50">
                  <div className="relative h-24 border-b border-line bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_15px,#D8CFC0_15px,#D8CFC0_16px)] bg-[length:100%_80px] bg-center bg-no-repeat" />
                  <div className="grid grid-cols-2 divide-x divide-line text-sm">
                    <div className="p-3">
                      <p className="label-caps mb-2">{subtopic.notation.leftLabel}</p>
                      <ul className="space-y-1 text-ink">
                        {subtopic.notation.rows.map((row, i) => (
                          <li key={i}>{row.left}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3">
                      <p className="label-caps mb-2">{subtopic.notation.rightLabel}</p>
                      <ul className="space-y-1 text-ink">
                        {subtopic.notation.rows.map((row, i) => (
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
                  key={`${activeCategory}-${activeSubtopic}-kbd`}
                  startMidi={subtopic.keyboard.startMidi}
                  endMidi={subtopic.keyboard.endMidi}
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {subtopic.audio.map((ex) => (
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
                <p className="mt-1 text-xs text-muted">{subtopic.keyboard.caption}</p>
              </div>

              {/* Practice assignment */}
              <div className="mt-6 rounded-lg border border-burgundy/20 bg-burgundy/5 p-5">
                <p className="label-caps mb-2 text-burgundy">{subtopic.practice.title}</p>
                <p className="text-[15px] leading-relaxed text-ink">{subtopic.practice.body}</p>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => setShowQuiz((s) => !s)} className="btn-primary">
                  <ClipboardCheck className="h-4 w-4" />
                  {showQuiz ? "Hide Quiz" : "Take the Quiz"}
                </button>
                <button className="btn-ghost">
                  <NotebookPen className="h-4 w-4" />
                  Add to Notebook
                </button>
                <button
                  onClick={toggleComplete}
                  className={
                    isComplete
                      ? "inline-flex items-center justify-center gap-2 rounded-lg border border-success/40 bg-success/10 px-4 py-2.5 text-sm font-medium text-success transition-colors hover:bg-success/15"
                      : "btn-brass"
                  }
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isComplete ? "Completed" : "Mark Complete"}
                </button>
              </div>

              {/* Quiz */}
              {showQuiz && (
                <div className="mt-6 space-y-5 rounded-lg border border-line bg-sand/40 p-5">
                  <p className="label-caps">Quiz • {subtopic.title}</p>
                  {subtopic.quiz.map((q, qi) => {
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
                            let cls = "border-line bg-white/60 text-ink hover:border-brass";
                            if (answered && isCorrect) {
                              cls = "border-success bg-success/10 text-ink";
                            } else if (answered && isChosen && !isCorrect) {
                              cls = "border-burgundy bg-burgundy/10 text-burgundy";
                            }
                            return (
                              <button
                                key={oi}
                                disabled={answered}
                                onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
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
            </FadeIn>
          </Card>
        </div>
      </div>
    </div>
  );
}
