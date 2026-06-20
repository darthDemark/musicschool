"use client";

import { useEffect, useState } from "react";
import { Music2, FileText } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { CompositionStudio } from "@/components/CompositionStudio";
import { compositionLabs } from "@/lib/mockData";

const STORAGE_KEY = "music-school:composition-active-lab";

export default function CompositionLabPage() {
  const [activeLab, setActiveLab] = useState<string>(compositionLabs[0].id);

  // Restore the last-selected lab from localStorage.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && compositionLabs.some((lab) => lab.id === saved)) {
      setActiveLab(saved);
    }
  }, []);

  const selectLab = (id: string) => {
    setActiveLab(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  };

  const selectedLab =
    compositionLabs.find((lab) => lab.id === activeLab) ?? compositionLabs[0];

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
          {compositionLabs.map((lab) => (
            <button
              key={lab.id}
              onClick={() => selectLab(lab.id)}
              className={`flex w-full items-center gap-2 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                activeLab === lab.id
                  ? "border-brass bg-brass/10 text-ink"
                  : "border-line bg-white/60 text-muted hover:text-ink"
              }`}
            >
              <Music2 className="h-4 w-4 text-brass" />
              {lab.category}
            </button>
          ))}
        </aside>

        {/* Workspace */}
        <div className="space-y-6">
          {/* Assignment — driven by selectedLab */}
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="label-caps text-brass">
                  Current Assignment • {selectedLab.category}
                </p>
                <SectionTitle className="mt-1">{selectedLab.title}</SectionTitle>
                <p className="mt-1 text-sm text-muted">{selectedLab.subtitle}</p>
              </div>
              <span className="hidden shrink-0 items-center gap-2 rounded-lg border border-line bg-sand px-3 py-2 text-xs text-muted sm:inline-flex">
                <FileText className="h-4 w-4 text-brass" />
                Assignment
              </span>
            </div>

            <p className="mt-4 text-[15px] leading-relaxed text-ink">
              {selectedLab.explanation}
            </p>

            <div className="mt-5">
              <p className="label-caps mb-2">Assignment Steps</p>
              <ol className="space-y-2 rounded-lg border border-line bg-sand/40 p-5">
                {selectedLab.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-ink">
                    <span className="font-serif text-brass">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-5">
              <p className="label-caps mb-2">Topics in this Lab</p>
              <div className="flex flex-wrap gap-2">
                {selectedLab.topics.map((topic) => (
                  <span key={topic} className="chip">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Studio stays mounted across lab switches so its state persists */}
          <Card>
            <SectionTitle className="mb-4">Studio</SectionTitle>
            <CompositionStudio />
            <p className="mt-3 text-xs text-muted">
              Interactive prototype studio (Web Audio). Integrate a notation
              library (e.g. VexFlow / OpenSheetMusicDisplay) for full scoring.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
