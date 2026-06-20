"use client";

import { useEffect, useRef, useState } from "react";
import { Search, BookOpen, Loader2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { RhymeList } from "@/components/RhymeList";
import { Tabs } from "@/components/Tabs";
import { FadeIn } from "@/components/Motion";
import { ExampleBadge } from "@/components/EmptyState";
import { getRhymes } from "@/lib/rhymeProvider";
import { getStorage, setStorage } from "@/lib/storage";
import type { RhymeGroup } from "@/lib/types";

const TABS = ["Perfect", "Near", "Multi-Syllable", "Slant", "All"];
const EXAMPLE_WORDS = ["fire", "love", "night", "pain", "desire", "heart", "soul", "danger"];

type Source = "dictionary" | "generated";

export default function RhymeVaultPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("");
  const [group, setGroup] = useState<RhymeGroup | null>(null);
  const [source, setSource] = useState<Source>("dictionary");
  const [generating, setGenerating] = useState(false);
  const cache = useRef<Record<string, { source: Source; rhymes: RhymeGroup }>>({});

  // Restore previously looked-up rhymes (persistent user workspace).
  useEffect(() => {
    const saved = getStorage<Record<string, { source: Source; rhymes: RhymeGroup }>>(
      "rhyme-vault-cache"
    );
    if (saved) cache.current = saved;
  }, []);

  // All lookups go through the getRhymes() provider → /api/rhymes.
  const lookup = async (raw: string) => {
    const word = raw.trim().toLowerCase();
    if (!word) return;
    setActive(word);

    if (cache.current[word]) {
      setGroup(cache.current[word].rhymes);
      setSource(cache.current[word].source);
      return;
    }

    setGroup(null);
    setGenerating(true);
    const result = await getRhymes(word);
    cache.current = {
      ...cache.current,
      [word]: { source: result.source, rhymes: result.rhymes },
    };
    setStorage("rhyme-vault-cache", cache.current);
    setGroup(result.rhymes);
    setSource(result.source);
    setGenerating(false);
  };

  const totalRhymes = group
    ? group.perfect.length + group.near.length + group.multi.length + group.slant.length
    : 0;

  return (
    <div>
      <PageHeader
        eyebrow="Rhyme Vault"
        title="Rhyming Dictionary"
        subtitle="Expand your lyric vocabulary — perfect, near, multisyllabic, and slant rhymes for any word."
      />

      <Card className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup(query)}
              placeholder="Search any word…"
              className="w-full rounded-lg border border-line bg-white/60 py-2.5 pl-10 pr-4 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-brass focus:ring-1 focus:ring-brass/30"
            />
          </div>
          <button onClick={() => lookup(query)} className="btn-primary">
            Search
          </button>
        </div>

        {/* Example words */}
        <div className="mt-4">
          <p className="label-caps mb-2 flex items-center gap-2">
            Example words <ExampleBadge />
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_WORDS.map((w) => (
              <button
                key={w}
                onClick={() => {
                  setQuery(w);
                  lookup(w);
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
        {!active ? (
          <div className="py-10 text-center">
            <BookOpen className="mx-auto mb-3 h-8 w-8 text-line" />
            <p className="font-serif text-lg text-ink">Search a word to begin</p>
            <p className="mt-1 text-sm text-muted">
              Type any word above — if it isn&apos;t in the dictionary, we&apos;ll
              generate rhyme suggestions for it.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-brass" />
                <p className="label-caps">
                  Rhymes for{" "}
                  <span className="text-burgundy">&ldquo;{active}&rdquo;</span>
                </p>
                {source === "generated" && !generating && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-brass/30 bg-brass/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brass">
                    <Sparkles className="h-3 w-3" />
                    Generated
                  </span>
                )}
              </div>
              {group && !generating && (
                <span className="rounded-full bg-sand px-2.5 py-0.5 font-mono text-xs text-muted">
                  {totalRhymes} words
                </span>
              )}
            </div>

            {generating ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin text-brass" />
                No local results found. Generating suggestions…
              </div>
            ) : group ? (
              <FadeIn motionKey={active}>
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
              </FadeIn>
            ) : null}
          </>
        )}
      </Card>
    </div>
  );
}
