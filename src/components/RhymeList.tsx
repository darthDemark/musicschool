"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import clsx from "clsx";

export function RhymeList({ words }: { words: string[] }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggle = (word: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(word)) next.delete(word);
      else next.add(word);
      return next;
    });
  };

  if (words.length === 0) {
    return <p className="text-sm text-muted">No rhymes in this category.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {words.map((word) => {
        const fav = favorites.has(word);
        return (
          <div
            key={word}
            className="flex items-center justify-between rounded-lg border border-line bg-white/60 px-3 py-2.5"
          >
            <span className="text-sm text-ink">{word}</span>
            <button
              aria-label={fav ? "Remove favorite" : "Add favorite"}
              onClick={() => toggle(word)}
              className="text-muted transition-colors hover:text-burgundy"
            >
              <Heart
                className={clsx(
                  "h-4 w-4",
                  fav && "fill-burgundy text-burgundy"
                )}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
