"use client";

import { useEffect, useState } from "react";
import { Check, Circle } from "lucide-react";
import { Card, SectionTitle } from "@/components/Card";
import { loadProgress, setModuleComplete, progressKey } from "@/lib/hitcampStore";
import { logActivity } from "@/lib/activity";
import type { DisciplineModule } from "@/lib/disciplines";

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function ModuleList({
  section,
  modules,
}: {
  section: string;
  modules: DisciplineModule[];
}) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setDone(loadProgress());
  }, []);

  const toggle = (moduleId: string) => {
    const key = progressKey(section, moduleId);
    const next = !done[key];
    setModuleComplete(section, moduleId, next);
    setDone((d) => ({ ...d, [key]: next }));
    if (next) logActivity();
  };

  const completed = modules.filter((m) => done[progressKey(section, slug(m.title))]).length;

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle>Modules</SectionTitle>
        <span className="text-xs text-muted">
          {completed}/{modules.length} complete
        </span>
      </div>
      <div className="space-y-3">
        {modules.map((m) => {
          const id = slug(m.title);
          const isDone = !!done[progressKey(section, id)];
          return (
            <div
              key={m.title}
              className="flex items-start justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4"
            >
              <div>
                <p className="font-medium text-ink">{m.title}</p>
                <p className="mt-1 text-sm text-muted">{m.desc}</p>
              </div>
              <button
                onClick={() => toggle(id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isDone
                    ? "border-success/40 bg-success/10 text-success"
                    : "border-white/15 text-muted hover:border-brass hover:text-ink"
                }`}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5" />}
                {isDone ? "Completed" : "Mark Complete"}
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
