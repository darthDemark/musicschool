"use client";

import { useEffect, useState } from "react";
import { Save, Trash2, FileText } from "lucide-react";
import { Card, SectionTitle } from "@/components/Card";
import { KEYS, addItem, loadList, makeItem, removeItem } from "@/lib/hitcampStore";

interface Plan {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  notes: string;
  genre: string;
  tempo: string;
  key: string;
  references: string;
  instrumentation: string;
  nextAction: string;
}

const empty = { genre: "", tempo: "", key: "", references: "", instrumentation: "", nextAction: "" };

export function ProductionPlan() {
  const [title, setTitle] = useState("");
  const [form, setForm] = useState(empty);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => setPlans(loadList<Plan>(KEYS.productionPlans)), []);

  const set = (k: keyof typeof empty, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    if (!title.trim()) return;
    const plan: Plan = { ...makeItem({ type: "production-plan", title: title.trim() }), ...form };
    setPlans(addItem(KEYS.productionPlans, plan));
    setTitle("");
    setForm(empty);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <Card>
        <SectionTitle className="mb-4">Create Production Plan</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Song Title" value={title} onChange={setTitle} placeholder="Working title" full />
          <Field label="Genre" value={form.genre} onChange={(v) => set("genre", v)} placeholder="Pop / R&B…" />
          <Field label="Tempo" value={form.tempo} onChange={(v) => set("tempo", v)} placeholder="e.g. 96 BPM" />
          <Field label="Key" value={form.key} onChange={(v) => set("key", v)} placeholder="e.g. C minor" />
          <Field label="Reference Songs" value={form.references} onChange={(v) => set("references", v)} placeholder="2–3 references" full />
          <Field label="Instrumentation" value={form.instrumentation} onChange={(v) => set("instrumentation", v)} placeholder="Drums, bass, keys…" full />
          <Field label="Next Action" value={form.nextAction} onChange={(v) => set("nextAction", v)} placeholder="The very next step" full />
        </div>
        <button onClick={save} disabled={!title.trim()} className="btn-brass mt-4">
          <Save className="h-4 w-4" />
          Save Plan
        </button>
      </Card>

      <Card>
        <SectionTitle className="mb-3">Your Plans</SectionTitle>
        {plans.length === 0 ? (
          <p className="text-sm text-muted">No plans yet. Map out your next record.</p>
        ) : (
          <div className="space-y-2">
            {plans.map((p) => (
              <div key={p.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate text-sm text-ink">
                      <FileText className="h-3.5 w-3.5 shrink-0 text-brass" />
                      {p.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {[p.genre, p.tempo, p.key].filter(Boolean).join(" · ") || "Draft"}
                    </p>
                  </div>
                  <button
                    onClick={() => setPlans(removeItem(KEYS.productionPlans, p.id))}
                    className="text-muted hover:text-[#E08079]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  full,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="label-caps mb-1.5 block">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input" />
    </label>
  );
}
