"use client";

import { Check } from "lucide-react";
import type { WriterTabProps } from "@/lib/writerTools";

export function NotesTab({ project, setProject }: WriterTabProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="label-caps">Notebook</p>
        <span className="flex items-center gap-1.5 text-xs text-success">
          <Check className="h-3.5 w-3.5" />
          Autosaving
        </span>
      </div>
      <textarea
        value={project.notes}
        onChange={(e) => setProject((p) => ({ ...p, notes: e.target.value }))}
        rows={16}
        placeholder="Freeform notes — concepts, story, references, anything. Everything autosaves to this device."
        className="w-full resize-y rounded-lg border border-line bg-white/60 p-4 text-[15px] leading-relaxed text-ink outline-none placeholder:text-muted/60 focus:border-brass focus:ring-1 focus:ring-brass/30"
      />
    </div>
  );
}
