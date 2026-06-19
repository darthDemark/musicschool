"use client";

import { useState } from "react";
import { User2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { ComposerProfile } from "@/components/ComposerProfile";
import { composerProfiles } from "@/lib/mockData";

export default function ComposersPage() {
  const [activeId, setActiveId] = useState("prince");
  const active =
    composerProfiles.find((c) => c.id === activeId) ?? composerProfiles[0];

  return (
    <div>
      <PageHeader
        eyebrow="Composer's Library"
        title="The Masters"
        subtitle="Study the harmonic, melodic, and arrangement signatures of the greatest composers and songwriters."
      />

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* List */}
        <aside className="space-y-2">
          <p className="label-caps mb-2">Composers</p>
          {composerProfiles.map((composer) => (
            <button
              key={composer.id}
              onClick={() => setActiveId(composer.id)}
              className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                composer.id === activeId
                  ? "border-brass bg-brass/10"
                  : "border-line bg-white/60 hover:border-brass/40"
              }`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-burgundy/25 to-brass/25">
                <User2 className="h-4 w-4 text-charcoal/50" />
              </span>
              <span>
                <span className="block text-sm font-medium text-ink">
                  {composer.name}
                </span>
                <span className="block text-xs text-muted">{composer.era}</span>
              </span>
            </button>
          ))}
        </aside>

        {/* Profile */}
        <div>
          <ComposerProfile composer={active} />
        </div>
      </div>
    </div>
  );
}
