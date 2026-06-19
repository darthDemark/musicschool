"use client";

import { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { SongVaultTable } from "@/components/SongVaultTable";
import { vaultSongs } from "@/lib/mockData";

const TABS = ["All Songs", "Drafts", "In Progress", "Complete", "Archived"] as const;
type Tab = (typeof TABS)[number];

const tabToStatus: Record<Tab, string | null> = {
  "All Songs": null,
  Drafts: "Draft",
  "In Progress": "In Progress",
  Complete: "Complete",
  Archived: "Archived",
};

export default function SongVaultPage() {
  const [tab, setTab] = useState<Tab>("All Songs");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const status = tabToStatus[tab];
    return vaultSongs.filter((song) => {
      const matchesStatus = !status || song.status === status;
      const matchesQuery =
        !query ||
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.genre.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [tab, query]);

  return (
    <div>
      <PageHeader
        eyebrow="Song Vault"
        title="Your Catalog"
        subtitle="Store, score, and strengthen your own songs over time."
        action={
          <button className="btn-brass">
            <Plus className="h-4 w-4" />
            New Song
          </button>
        }
      />

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs"
            className="w-full rounded-lg border border-line bg-white/60 py-2.5 pl-10 pr-4 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-brass focus:ring-1 focus:ring-brass/30"
          />
        </div>
      </div>

      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm transition-colors ${
              tab === t
                ? "border-brass font-medium text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <SongVaultTable songs={filtered} />
    </div>
  );
}
