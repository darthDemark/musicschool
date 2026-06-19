import type { VaultSong } from "@/lib/types";

const statusStyle: Record<VaultSong["status"], string> = {
  Draft: "bg-line/60 text-ink",
  "In Progress": "bg-amber/15 text-amber",
  Complete: "bg-success/15 text-success",
  Archived: "bg-muted/15 text-muted",
};

function MiniScore({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <span className="label-caps text-[10px]">{label}</span>
      <span className="font-serif text-sm text-ink">{value.toFixed(1)}</span>
    </div>
  );
}

export function SongVaultTable({ songs }: { songs: VaultSong[] }) {
  if (songs.length === 0) {
    return (
      <div className="card-pad text-center text-sm text-muted">
        No songs in this category yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {songs.map((song) => (
        <div
          key={song.id}
          className="card flex flex-col gap-4 p-5 transition-shadow hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
        >
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
          </div>
          <div className="grid grid-cols-4 gap-5 sm:gap-7">
            <MiniScore label="Hook" value={song.hook} />
            <MiniScore label="Melody" value={song.melody} />
            <MiniScore label="Lyrics" value={song.lyrics} />
            <MiniScore label="Arr." value={song.arrangement} />
          </div>
        </div>
      ))}
    </div>
  );
}
