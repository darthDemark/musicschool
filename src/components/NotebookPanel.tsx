"use client";

import { useState } from "react";
import { Plus, Save } from "lucide-react";

export function NotebookPanel({
  initialValue = "",
  placeholder = "Write your notes here...",
  label = "Notes",
}: {
  initialValue?: string;
  placeholder?: string;
  label?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In production this would persist to Supabase (notes / lesson_progress).
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="label-caps">{label}</p>
        <button onClick={handleSave} className="btn-ghost px-3 py-1.5 text-xs">
          {saved ? (
            "Saved"
          ) : (
            <>
              <Save className="h-3.5 w-3.5" /> Save
            </>
          )}
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={6}
        className="w-full resize-y rounded-lg border border-line bg-white/60 p-4 text-sm leading-relaxed text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-brass focus:ring-1 focus:ring-brass/30"
      />
    </div>
  );
}

export function AddButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="btn-ghost">
      <Plus className="h-4 w-4" />
      {children}
    </button>
  );
}
