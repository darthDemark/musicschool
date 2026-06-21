"use client";

import { useEffect, useState } from "react";
import { Plus, ArrowUp, ArrowDown, Trash2, Save } from "lucide-react";
import { Card, SectionTitle } from "@/components/Card";
import { KEYS, addItem, loadList, makeItem, removeItem, uid } from "@/lib/hitcampStore";

interface Section {
  id: string;
  name: string;
  energy: number; // 1-10
  notes: string;
}

interface Arrangement {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  notes: string;
  sections: Section[];
}

const SECTION_TYPES = ["Intro", "Verse", "Pre-Chorus", "Chorus", "Bridge", "Outro"];

export function ArrangementCanvas() {
  const [sections, setSections] = useState<Section[]>([]);
  const [title, setTitle] = useState("");
  const [saved, setSaved] = useState<Arrangement[]>([]);

  useEffect(() => setSaved(loadList<Arrangement>(KEYS.arrangements)), []);

  const add = (name: string) =>
    setSections((s) => [...s, { id: uid(), name, energy: 5, notes: "" }]);

  const move = (i: number, dir: -1 | 1) => {
    setSections((s) => {
      const j = i + dir;
      if (j < 0 || j >= s.length) return s;
      const next = [...s];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const update = (id: string, patch: Partial<Section>) =>
    setSections((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const remove = (id: string) => setSections((s) => s.filter((x) => x.id !== id));

  const saveArrangement = () => {
    if (sections.length === 0) return;
    const arr: Arrangement = {
      ...makeItem({ type: "arrangement", title: title.trim() || `Arrangement ${saved.length + 1}` }),
      sections,
    };
    setSaved(addItem(KEYS.arrangements, arr));
    setTitle("");
    setSections([]);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <Card>
        <SectionTitle className="mb-1">Arrangement Canvas</SectionTitle>
        <p className="mb-4 text-sm text-muted">
          Add sections, set each one&apos;s energy, and shape the song&apos;s arc.
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {SECTION_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => add(t)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-ink transition-colors hover:border-brass hover:bg-brass/10"
            >
              <Plus className="h-3 w-3 text-brass" />
              {t}
            </button>
          ))}
        </div>

        {/* Energy curve */}
        {sections.length > 0 && (
          <div className="mb-4 flex h-24 items-end gap-1.5 rounded-lg border border-white/10 bg-studio2 p-3">
            {sections.map((s) => (
              <div key={s.id} className="flex flex-1 flex-col items-center justify-end">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-brass/40 to-brass"
                  style={{ height: `${s.energy * 10}%` }}
                />
                <span className="mt-1 truncate text-[9px] text-faint">{s.name}</span>
              </div>
            ))}
          </div>
        )}

        {sections.length === 0 ? (
          <p className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-6 text-center text-sm text-muted">
            Add a section above to start building your arrangement.
          </p>
        ) : (
          <div className="space-y-2">
            {sections.map((s, i) => (
              <div key={s.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-ink">{s.name}</span>
                  <div className="flex items-center gap-1">
                    <IconBtn onClick={() => move(i, -1)}><ArrowUp className="h-3.5 w-3.5" /></IconBtn>
                    <IconBtn onClick={() => move(i, 1)}><ArrowDown className="h-3.5 w-3.5" /></IconBtn>
                    <IconBtn onClick={() => remove(s.id)}><Trash2 className="h-3.5 w-3.5" /></IconBtn>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-xs text-muted">Energy</span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={s.energy}
                    onChange={(e) => update(s.id, { energy: Number(e.target.value) })}
                    className="flex-1 accent-[#D4AF37]"
                  />
                  <span className="w-5 text-right font-serif text-sm text-brass">{s.energy}</span>
                </div>
                <input
                  value={s.notes}
                  onChange={(e) => update(s.id, { notes: e.target.value })}
                  placeholder="Notes for this section…"
                  className="input mt-2 text-sm"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Arrangement name…"
            className="input flex-1"
          />
          <button onClick={saveArrangement} disabled={sections.length === 0} className="btn-brass shrink-0">
            <Save className="h-4 w-4" />
            Save Arrangement
          </button>
        </div>
      </Card>

      <Card>
        <SectionTitle className="mb-3">Saved Arrangements</SectionTitle>
        {saved.length === 0 ? (
          <p className="text-sm text-muted">No arrangements yet.</p>
        ) : (
          <div className="space-y-2">
            {saved.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink">{a.title}</p>
                  <p className="text-xs text-muted">{a.sections.length} sections</p>
                </div>
                <button onClick={() => setSaved(removeItem(KEYS.arrangements, a.id))} className="text-muted hover:text-[#E08079]">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function IconBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="p-1 text-muted transition-colors hover:text-ink">
      {children}
    </button>
  );
}
