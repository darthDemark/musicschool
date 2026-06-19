"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { RhymeList } from "@/components/RhymeList";
import { Tabs } from "@/components/Tabs";
import { rhymeData } from "@/lib/mockData";
import type { RhymeGroup } from "@/lib/types";

const TABS = ["Perfect", "Near", "Multi-Syllable", "Slant", "All"];

export default function RhymeVaultPage() {
  const [query, setQuery] = useState("fire");
  const [active, setActive] = useState("fire");

  const group: RhymeGroup | undefined = rhymeData[active.toLowerCase()];

  const search = () => {
    const key = query.trim().toLowerCase();
    if (rhymeData[key]) setActive(key);
    else setActive(key); // will show empty state if not found
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
              placeholder="Search a word (try 'fire')"
              className="w-full rounded-lg border border-line bg-white/60 py-2.5 pl-10 pr-4 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-brass focus:ring-1 focus:ring-brass/30"
            />
          </div>
          <button onClick={search} className="btn-primary">
            Search
          </button>
        </div>
      </Card>

      <Card>
        <p className="label-caps mb-4">
          Rhymes for <span className="text-burgundy">&ldquo;{active}&rdquo;</span>
        </p>
        {!group ? (
          <p className="text-sm text-muted">
            No entries for &ldquo;{active}&rdquo; in the prototype dataset. Try
            &ldquo;fire&rdquo;. (In production this queries a rhyming API or the
            rhyme_entries table.)
          </p>
        ) : (
          <Tabs tabs={TABS}>
            {(tab) => (
              <>
                {tab === "Perfect" && <RhymeList words={group.perfect} />}
                {tab === "Near" && <RhymeList words={group.near} />}
                {tab === "Multi-Syllable" && <RhymeList words={group.multi} />}
                {tab === "Slant" && <RhymeList words={group.slant} />}
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
