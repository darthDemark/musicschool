import { Play, CheckCircle2 } from "lucide-react";
import type { ListeningTrack } from "@/lib/types";

export function SongCard({
  track,
  onSelect,
  active,
}: {
  track: ListeningTrack;
  onSelect?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onSelect}
      className={`card group flex w-full items-center gap-4 p-4 text-left transition-all hover:shadow-card-hover ${
        active ? "ring-2 ring-brass/50" : ""
      }`}
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-line bg-sand">
        {/* Album art placeholder */}
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-burgundy/20 to-brass/20">
          <Play className="h-5 w-5 text-charcoal/60 transition-transform group-hover:scale-110" />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="label-caps text-brass">{track.collection}</p>
        <p className="truncate font-serif text-base text-ink">{track.title}</p>
        <p className="truncate text-[13px] text-muted">
          {track.artist} • {track.focus}
        </p>
      </div>
      <div className="shrink-0 text-right">
        {track.completed ? (
          <CheckCircle2 className="h-5 w-5 text-success" />
        ) : (
          <span className="text-xs text-muted">{track.durationLabel}</span>
        )}
      </div>
    </button>
  );
}
