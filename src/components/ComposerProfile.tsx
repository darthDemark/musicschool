"use client";

import { useState } from "react";
import { User2 } from "lucide-react";
import type { ComposerProfileData } from "@/lib/types";

const tabs = ["Overview", "Harmony", "Melody", "Rhythm", "Arrangement", "Themes"] as const;
type Tab = (typeof tabs)[number];

function TagRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="label-caps mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="chip">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ComposerProfile({ composer }: { composer: ComposerProfileData }) {
  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-5 border-b border-line bg-sand/60 p-6 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl2 border border-line bg-gradient-to-br from-burgundy/25 to-brass/25">
          <User2 className="h-10 w-10 text-charcoal/50" />
        </div>
        <div>
          <p className="label-caps text-brass">{composer.era}</p>
          <h2 className="font-serif text-3xl text-ink">{composer.name}</h2>
          <p className="mt-1 text-sm text-muted">{composer.subtitle}</p>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-line px-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm transition-colors ${
              tab === t
                ? "border-brass text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-6 p-6">
        {tab === "Overview" && (
          <>
            <p className="text-[15px] leading-relaxed text-ink">{composer.bio}</p>
            <TagRow label="Signature Traits" items={composer.signatureTraits} />
          </>
        )}
        {tab === "Harmony" && (
          <div className="space-y-6">
            <TagRow label="Common Keys" items={composer.commonKeys} />
            <TagRow label="Common Chord Colors" items={composer.chordColors} />
          </div>
        )}
        {tab === "Melody" && (
          <p className="text-[15px] leading-relaxed text-ink">
            {composer.name}&apos;s melodic writing is defined by{" "}
            {composer.signatureTraits[0].toLowerCase()}. Study how phrases are
            shaped against the underlying harmony and where melodic peaks align
            with emotional peaks.
          </p>
        )}
        {tab === "Rhythm" && (
          <p className="text-[15px] leading-relaxed text-ink">
            Examine the rhythmic vocabulary — phrasing, syncopation, and groove —
            that gives {composer.name}&apos;s music its characteristic motion.
          </p>
        )}
        {tab === "Arrangement" && (
          <TagRow label="Signature Traits" items={composer.signatureTraits} />
        )}
        {tab === "Themes" && <TagRow label="Common Themes" items={composer.themes} />}
      </div>
    </div>
  );
}
