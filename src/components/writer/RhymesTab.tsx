"use client";

import { useState } from "react";
import { Search, CornerDownLeft, Heart } from "lucide-react";
import clsx from "clsx";
import {
  localThesaurus,
  LYRIC_FIELDS,
  type LyricSections,
  type WriterTabProps,
} from "@/lib/writerTools";
import { rhymeData } from "@/lib/mockData";
import { Pill } from "@/components/Tabs";

const CATS = ["Perfect", "Near", "Multi-Syllable", "Slant", "All"];

interface Props extends WriterTabProps {
  activeField: keyof LyricSections;
}

export function RhymesTab({ project, setProject, activeField }: Props) {
  const [query, setQuery] = useState("fire");
  const [word, setWord] = useState("fire");
  const [cat, setCat] = useState("Perfect");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const group = rhymeData[word.toLowerCase()];
  // Fall back to thesaurus-derived rhyme-ish words if not in the vault.
  const fallback = !group ? localThesaurus(word) : null;

  const words: string[] = group
    ? cat === "Perfect"
      ? group.perfect
      : cat === "Near"
        ? group.near
        : cat === "Multi-Syllable"
          ? group.multi
          : cat === "Slant"
            ? group.slant
            : [...group.perfect, ...group.near, ...group.multi, ...group.slant]
    : fallback
      ? [...fallback.synonyms, ...fallback.emotional]
      : [];

  const search = () => setWord(query.trim() || "fire");

  const insert = (rhyme: string) => {
    setProject((p) => {
      const current = p.lyrics[activeField];
      const next = current ? `${current} ${rhyme}` : rhyme;
      return { ...p, lyrics: { ...p.lyrics, [activeField]: next } };
    });
  };

  const toggleFav = (w: string) =>
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(w)) next.delete(w);
      else next.add(w);
      return next;
    });

  const activeLabel = LYRIC_FIELDS.find((f) => f.key === activeField)?.label ?? "";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="Search a word (fire, love, night, pain, desire, heart, soul, danger)"
            className="input pl-10"
          />
        </div>
        <button onClick={search} className="btn-primary">
          Search
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATS.map((c) => (
          <Pill key={c} active={cat === c} onClick={() => setCat(c)}>
            {c}
          </Pill>
        ))}
      </div>

      <p className="text-xs text-muted">
        Click a rhyme to append it to the <span className="text-ink">{activeLabel}</span>{" "}
        section (change the active section in the Lyrics tab).
      </p>

      {words.length === 0 ? (
        <p className="text-sm text-muted">No rhymes found for &ldquo;{word}&rdquo;.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {words.map((w) => (
            <div
              key={w}
              className="flex items-center justify-between rounded-lg border border-line bg-white/60 px-3 py-2"
            >
              <span className="truncate text-sm text-ink">{w}</span>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => toggleFav(w)}
                  aria-label="Favorite"
                  className="p-1 text-muted transition-colors hover:text-burgundy"
                >
                  <Heart
                    className={clsx("h-3.5 w-3.5", favorites.has(w) && "fill-burgundy text-burgundy")}
                  />
                </button>
                <button
                  onClick={() => insert(w)}
                  aria-label="Insert into lyrics"
                  className="p-1 text-muted transition-colors hover:text-brass"
                >
                  <CornerDownLeft className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
