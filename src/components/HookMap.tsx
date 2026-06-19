import { Anchor } from "lucide-react";
import type { HookMapEntry } from "@/lib/types";

export function HookMap({ hooks }: { hooks: HookMapEntry[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {hooks.map((hook) => (
        <div
          key={hook.type}
          className="flex gap-3 rounded-lg border border-line bg-sand/50 p-4"
        >
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brass/30 bg-brass/10 text-brass">
            <Anchor className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-ink">{hook.type}</p>
              <span className="font-serif text-xs tabular-nums text-burgundy">
                {hook.timestamp}
              </span>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">
              {hook.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
