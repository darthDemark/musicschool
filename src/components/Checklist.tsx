"use client";

import { useEffect, useState } from "react";
import { Check, Save } from "lucide-react";
import { Card, SectionTitle } from "@/components/Card";

interface Stored {
  checked: Record<string, boolean>;
  notes: string;
}

export function Checklist({
  title,
  items,
  storageKey,
  notesLabel = "Notes",
}: {
  title: string;
  items: string[];
  storageKey: string;
  notesLabel?: string;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Stored;
        setChecked(parsed.checked ?? {});
        setNotes(parsed.notes ?? "");
      }
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const persist = (next: Stored) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const toggle = (item: string) => {
    const next = { ...checked, [item]: !checked[item] };
    setChecked(next);
    persist({ checked: next, notes });
  };

  const save = () => {
    persist({ checked, notes });
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const done = items.filter((i) => checked[i]).length;

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle>{title}</SectionTitle>
        <span className="text-xs text-muted">
          {done}/{items.length}
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const on = !!checked[item];
          return (
            <button
              key={item}
              onClick={() => toggle(item)}
              className="flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-left text-sm transition-colors hover:border-brass/40"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                  on ? "border-success bg-success/20 text-success" : "border-white/20 text-transparent"
                }`}
              >
                <Check className="h-3.5 w-3.5" />
              </span>
              <span className={on ? "text-ink" : "text-muted"}>{item}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        <p className="label-caps mb-1.5">{notesLabel}</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Add notes…"
          className="input min-h-[80px] resize-y"
        />
      </div>
      <button onClick={save} className="btn-brass mt-3">
        {savedFlash ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
        {savedFlash ? "Saved" : "Save"}
      </button>
    </Card>
  );
}
