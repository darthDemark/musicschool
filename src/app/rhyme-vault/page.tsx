"use client";

import { useState } from "react";
import { Search, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { RhymeList } from "@/components/RhymeList";
import { Tabs } from "@/components/Tabs";
import { rhymeData } from "@/lib/mockData";
import type { RhymeGroup } from "@/lib/types";

const TABS = ["Perfect", "Near", "Multi-Syllable", "Slant", "All"];

const DEMO_WORDS = ["fire", "love", "night", "pain", "desire", "heart", "soul", "danger"];

export default function RhymeVaultPage() {
  const [query, setQuery] = useState("fire");
  const [active, setActive] = useState("fire");

  const group: RhymeGroup | undefined = rhymeData[active.toLowerCase()];

  const totalRhymes = group
    ? group.perfect.length +
      group.near.length +
      group.multi.length +
      group.slant.length
    : 0;

  const search = () => {
    const key = query.trim().toLowerCase();
    setActive(key);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Rhyme Vault"
        title="Rhyming Dictionary"
        subtitle="Expand your lyric vocabulary — perfect, near, multisyllabic, and slant rhymes."
      />

      <Card className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Search a word…"
              className="w-full rounded-lg border border-line bg-white/60 py-2.5 pl-10 pr-4 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-brass focus:ring-1 focus:ring-brass/30"
            />
          </div>
          <button onClick={search} className="btn-primary">
            Search
          </button>
        </div>

        {/* Demo word chips */}
        <div className="mt-4">
          <p className="label-caps mb-2">Demo words</p>
          <div className="flex flex-wrap gap-2">
            {DEMO_WORDS.map((w) => (
              <button
                key={w}
                onClick={() => {
                  setQuery(w);
                  setActive(w);
                }}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  active === w
                    ? "border-brass bg-brass/15 text-ink"
                    : "border-line bg-white/60 text-muted hover:border-brass/50 hover:text-ink"
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-brass" />
            <p className="label-caps">
              Rhymes for{" "}
              <span className="text-burgundy">&ldquo;{active}&rdquo;</span>
            </p>
          </div>
          {group && (
            <span className="rounded-full bg-sand px-2.5 py-0.5 font-mono text-xs text-muted">
              {totalRhymes} words
            </span>
          )}
        </div>

        {!group ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted">
              No entries for &ldquo;{active}&rdquo; in the local dictionary.
            </p>
            <p className="mt-2 text-xs text-muted/70">
              Try one of the demo words above. In production this queries a
              rhyming API or the rhyme_entries database table.
            </p>
          </div>
        ) : (
          <Tabs tabs={TABS}>
            {(tab) => (
              <>
                {tab === "Perfect" && (
                  <>
                    <p className="mb-3 text-xs text-muted">
                      Perfect rhymes share the same vowel-consonant ending.
                    </p>
                    <RhymeList words={group.perfect} />
                  </>
                )}
                {tab === "Near" && (
                  <>
                    <p className="mb-3 text-xs text-muted">
                      Near rhymes share a similar but not identical sound —
                      modern and conversational.
                    </p>
                    <RhymeList words={group.near} />
                  </>
                )}
                {tab === "Multi-Syllable" && (
                  <>
                    <p className="mb-3 text-xs text-muted">
                      Phrases that end with a rhyming sound — add rhythmic
                      density to lyrics.
                    </p>
                    <RhymeList words={group.multi} />
                  </>
                )}
                {tab === "Slant" && (
                  <>
                    <p className="mb-3 text-xs text-muted">
                      Slant rhymes share some sounds but not all — keep
                      listeners slightly off-balance.
                    </p>
                    <RhymeList words={group.slant} />
                  </>
                )}
                {tab === "All" && (
                  <RhymeList
                    words={[
                      ...group.perfect,
                      ...group.near,
                      ...group.multi,
                      ...group.slant,
                    ]}
                  />
                )}
              </>
            )}
          </Tabs>
        )}
      </Card>
    </div>
  );
}
