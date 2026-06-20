"use client";

import { useState, type ReactNode } from "react";
import { Bot, X } from "lucide-react";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-caps mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </Field>
  );
}

/** Renders a live AI response (used when /api/tutor returns a real provider). */
export function AITextBlock({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-brass/30 bg-brass/5 p-4">
      <p className="label-caps mb-2 flex items-center gap-1.5 text-brass">
        <Bot className="h-3.5 w-3.5" />
        AI Tutor
      </p>
      <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink">{text}</p>
    </div>
  );
}

export function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white/60 p-4">
      <p className="label-caps mb-1">{label}</p>
      <p className="text-[15px] leading-relaxed text-ink">{value}</p>
    </div>
  );
}

/** Add/remove tags with a text input. */
export function TagInput({
  values,
  onAdd,
  onRemove,
  placeholder,
  accent = "brass",
}: {
  values: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
  placeholder: string;
  accent?: "brass" | "burgundy";
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (v) onAdd(v);
    setDraft("");
  };
  const chipClass =
    accent === "burgundy"
      ? "chip border-burgundy/30 bg-burgundy/10 text-burgundy"
      : "chip border-brass/30 bg-brass/10";

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="input flex-1"
        />
        <button onClick={add} className="btn-ghost shrink-0">
          Add
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((v) => (
            <span key={v} className={chipClass}>
              {v}
              <button
                onClick={() => onRemove(v)}
                aria-label={`Remove ${v}`}
                className="transition-colors hover:text-ink"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
