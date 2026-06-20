"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { vaultSongs } from "@/lib/mockData";
import { getStorage, setStorage } from "@/lib/storage";
import type { VaultSong } from "@/lib/types";

const TABS = ["All Songs", "Drafts", "In Progress", "Complete", "Archived"] as const;
type Tab = (typeof TABS)[number];

const tabToStatus: Record<Tab, string | null> = {
  "All Songs": null,
  Drafts: "Draft",
  "In Progress": "In Progress",
  Complete: "Complete",
  Archived: "Archived",
};

const STATUS_OPTIONS: VaultSong["status"][] = [
  "Draft",
  "In Progress",
  "Complete",
  "Archived",
];

const GENRE_OPTIONS = [
  "Pop",
  "Pop / R&B",
  "R&B",
  "Hip-Hop",
  "Alternative",
  "Rock",
  "Ballad",
  "Electronic",
  "Jazz",
  "Country",
  "Folk",
  "Film Score",
  "Other",
];

const statusStyle: Record<VaultSong["status"], string> = {
  Draft: "bg-line/60 text-ink",
  "In Progress": "bg-amber/15 text-amber",
  Complete: "bg-success/15 text-success",
  Archived: "bg-muted/15 text-muted",
};

// ---------------------------------------------------------------------------
// Modal for creating / editing a song
// ---------------------------------------------------------------------------

interface SongFormData {
  title: string;
  genre: string;
  status: VaultSong["status"];
  hook: number;
  melody: number;
  lyrics: number;
  arrangement: number;
  notes: string;
}

const emptyForm = (): SongFormData => ({
  title: "",
  genre: "Pop",
  status: "Draft",
  hook: 7.0,
  melody: 7.0,
  lyrics: 7.0,
  arrangement: 7.0,
  notes: "",
});

function songToForm(s: VaultSong & { notes?: string }): SongFormData {
  return {
    title: s.title,
    genre: s.genre,
    status: s.status,
    hook: s.hook,
    melody: s.melody,
    lyrics: s.lyrics,
    arrangement: s.arrangement,
    notes: s.notes ?? "",
  };
}

interface SongModalProps {
  initial: SongFormData;
  onSave: (data: SongFormData) => void;
  onClose: () => void;
  mode: "create" | "edit";
}

function SongModal({ initial, onSave, onClose, mode }: SongModalProps) {
  const [form, setForm] = useState(initial);

  const set = (key: keyof SongFormData, val: string | number) =>
    setForm((f) => ({ ...f, [key]: val }));

  const ScoreField = ({
    label,
    field,
  }: {
    label: string;
    field: "hook" | "melody" | "lyrics" | "arrangement";
  }) => (
    <label className="block">
      <span className="label-caps mb-1 block">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={10}
          step={0.1}
          value={form[field]}
          onChange={(e) => set(field, parseFloat(e.target.value))}
          className="flex-1 accent-brass"
        />
        <span className="w-8 font-serif text-sm text-brass">
          {(form[field] as number).toFixed(1)}
        </span>
      </div>
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4">
      <div className="w-full max-w-lg rounded-xl2 bg-ivory shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-serif text-xl text-ink">
            {mode === "create" ? "New Song" : "Edit Song"}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto p-6" style={{ maxHeight: "75vh" }}>
          {/* Title */}
          <label className="block">
            <span className="label-caps mb-1 block">Title</span>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Song title"
              className="input w-full"
              autoFocus
            />
          </label>

          {/* Genre + Status */}
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="label-caps mb-1 block">Genre</span>
              <select
                value={form.genre}
                onChange={(e) => set("genre", e.target.value)}
                className="input w-full"
              >
                {GENRE_OPTIONS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="label-caps mb-1 block">Status</span>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as VaultSong["status"])}
                className="input w-full"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Scores */}
          <div className="space-y-3 rounded-lg border border-line bg-sand/40 p-4">
            <p className="label-caps">Scores (0 – 10)</p>
            <ScoreField label="Hook" field="hook" />
            <ScoreField label="Melody" field="melody" />
            <ScoreField label="Lyrics" field="lyrics" />
            <ScoreField label="Arrangement" field="arrangement" />
          </div>

          {/* Notes */}
          <label className="block">
            <span className="label-caps mb-1 block">Lyrics / Notes</span>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Paste lyrics, ideas, or notes here…"
              rows={5}
              className="input w-full resize-y font-mono text-xs"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-line px-6 py-4">
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            onClick={() => {
              if (!form.title.trim()) return;
              onSave(form);
            }}
            className="btn-brass"
          >
            <Check className="h-4 w-4" />
            {mode === "create" ? "Create Song" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Extended VaultSong with optional notes field
// ---------------------------------------------------------------------------

type StoredSong = VaultSong & { notes?: string };

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SongVaultPage() {
  const [songs, setSongs] = useState<StoredSong[]>(() =>
    vaultSongs.map((s) => ({ ...s, notes: "" }))
  );
  const [tab, setTab] = useState<Tab>("All Songs");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<
    | { mode: "create" }
    | { mode: "edit"; song: StoredSong }
    | null
  >(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = getStorage<StoredSong[]>("song-vault");
    if (saved && saved.length > 0) setSongs(saved);
  }, []);

  const persist = (next: StoredSong[]) => {
    setSongs(next);
    setStorage("song-vault", next);
  };

  const filtered = useMemo(() => {
    const status = tabToStatus[tab];
    return songs.filter((s) => {
      const matchStatus = !status || s.status === status;
      const matchQuery =
        !query ||
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.genre.toLowerCase().includes(query.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [songs, tab, query]);

  const handleCreate = (data: SongFormData) => {
    const newSong: StoredSong = {
      id: `song-${Date.now()}`,
      title: data.title,
      genre: data.genre,
      status: data.status,
      hook: data.hook,
      melody: data.melody,
      lyrics: data.lyrics,
      arrangement: data.arrangement,
      notes: data.notes,
    };
    persist([newSong, ...songs]);
    setModal(null);
  };

  const handleEdit = (data: SongFormData) => {
    if (modal?.mode !== "edit") return;
    const updated = songs.map((s) =>
      s.id === modal.song.id
        ? {
            ...s,
            title: data.title,
            genre: data.genre,
            status: data.status,
            hook: data.hook,
            melody: data.melody,
            lyrics: data.lyrics,
            arrangement: data.arrangement,
            notes: data.notes,
          }
        : s
    );
    persist(updated);
    setModal(null);
  };

  const handleDelete = (id: string) => {
    persist(songs.filter((s) => s.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Song Vault"
        title="Your Catalog"
        subtitle="Store, score, and strengthen your own songs over time."
        action={
          <button
            onClick={() => setModal({ mode: "create" })}
            className="btn-brass"
          >
            <Plus className="h-4 w-4" />
            New Song
          </button>
        }
      />

      {/* Search */}
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
        <p className="text-sm text-muted">
          {songs.length} song{songs.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {/* Tabs */}
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

      {/* Song list */}
      {filtered.length === 0 ? (
        <div className="card-pad text-center">
          <FileText className="mx-auto mb-3 h-8 w-8 text-muted/50" />
          <p className="text-sm text-muted">No songs in this category yet.</p>
          <button
            onClick={() => setModal({ mode: "create" })}
            className="btn-brass mt-4"
          >
            <Plus className="h-4 w-4" />
            New Song
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((song) => (
            <Card key={song.id} className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-lg text-ink">{song.title}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusStyle[song.status]}`}
                    >
                      {song.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] text-muted">{song.genre}</p>
                  {song.notes && (
                    <p className="mt-1 line-clamp-1 text-xs text-muted/70">
                      {song.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-5">
                  {/* Mini scores */}
                  <div className="grid grid-cols-4 gap-4">
                    {(
                      [
                        ["Hook", song.hook],
                        ["Melody", song.melody],
                        ["Lyrics", song.lyrics],
                        ["Arr.", song.arrangement],
                      ] as [string, number][]
                    ).map(([label, val]) => (
                      <div key={label} className="flex flex-col">
                        <span className="label-caps text-[10px]">{label}</span>
                        <span className="font-serif text-sm text-ink">
                          {val.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setModal({ mode: "edit", song })}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-brass hover:text-ink"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    {deleteConfirm === song.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(song.id)}
                          className="rounded-lg bg-burgundy/10 px-2 py-1 text-xs font-medium text-burgundy hover:bg-burgundy/20"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="rounded-lg px-2 py-1 text-xs text-muted hover:text-ink"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(song.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-burgundy hover:text-burgundy"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal?.mode === "create" && (
        <SongModal
          mode="create"
          initial={emptyForm()}
          onSave={handleCreate}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.mode === "edit" && (
        <SongModal
          mode="edit"
          initial={songToForm(modal.song)}
          onSave={handleEdit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
