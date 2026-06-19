import type { StructureSegment } from "@/lib/types";

const sectionColor: Record<string, string> = {
  Intro: "bg-line text-ink",
  Verse: "bg-success/20 text-ink border-success/30",
  Chorus: "bg-burgundy/15 text-burgundy border-burgundy/30",
  "Guitar Solo": "bg-brass/20 text-ink border-brass/40",
  "Final Chorus": "bg-burgundy/25 text-burgundy border-burgundy/40",
};

export function Timeline({ segments }: { segments: StructureSegment[] }) {
  const total = segments[segments.length - 1]?.seconds || 1;

  return (
    <div>
      {/* Proportional bar */}
      <div className="mb-5 flex h-10 w-full overflow-hidden rounded-lg border border-line">
        {segments.map((seg, i) => {
          const next = segments[i + 1]?.seconds ?? total + 40;
          const widthPct = ((next - seg.seconds) / (total + 40)) * 100;
          return (
            <div
              key={`${seg.time}-${seg.section}`}
              className={`flex items-center justify-center border-r border-white/40 text-[10px] font-medium uppercase tracking-wider last:border-r-0 ${
                sectionColor[seg.section] ?? "bg-sand text-ink"
              }`}
              style={{ width: `${Math.max(widthPct, 6)}%` }}
              title={`${seg.time} — ${seg.section}`}
            >
              <span className="hidden truncate px-1 sm:block">{seg.section}</span>
            </div>
          );
        })}
      </div>

      {/* Detailed list */}
      <ol className="relative ml-2 border-l border-line">
        {segments.map((seg) => (
          <li key={`${seg.time}-list`} className="mb-4 ml-5 last:mb-0">
            <span className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border-2 border-ivory bg-brass" />
            <div className="flex items-center gap-3">
              <span className="font-serif text-sm tabular-nums text-burgundy">
                {seg.time}
              </span>
              <span className="text-sm text-ink">{seg.section}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
