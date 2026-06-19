import { Music } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { GenomeRadar } from "@/components/GenomeScore";
import { ScoreBar } from "@/components/ScoreBar";
import { ProgressRing } from "@/components/ProgressRing";
import {
  purpleRainOverallScore,
  purpleRainReport,
  similarSongs,
} from "@/lib/mockData";

export default function SongGenomePage() {
  return (
    <div>
      <PageHeader
        eyebrow="Song Genome"
        title="Score & Compare"
        subtitle="A structured fingerprint of what makes a song work — and which songs share its DNA."
      />

      {/* Subject header */}
      <Card className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl2 bg-gradient-to-br from-burgundy/25 to-brass/25">
            <Music className="h-7 w-7 text-charcoal/60" />
          </div>
          <div>
            <p className="label-caps text-brass">Now Scoring</p>
            <h2 className="font-serif text-2xl text-ink">{purpleRainReport.song}</h2>
            <p className="text-sm text-muted">{purpleRainReport.artist}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ProgressRing
            value={purpleRainOverallScore * 10}
            label={purpleRainOverallScore.toFixed(1)}
            sublabel="Overall"
            size={120}
          />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar */}
        <Card>
          <SectionTitle className="mb-2">Genome Radar</SectionTitle>
          <p className="mb-2 text-sm text-muted">Eight dimensions of song craft</p>
          <GenomeRadar scores={purpleRainReport.genome} />
        </Card>

        {/* Score bars */}
        <Card>
          <SectionTitle className="mb-5">Dimension Scores</SectionTitle>
          <div className="space-y-4">
            {purpleRainReport.genome.map((g) => (
              <ScoreBar key={g.label} label={g.label} value={g.value} />
            ))}
          </div>
        </Card>
      </div>

      {/* Similar songs */}
      <div className="mt-6">
        <SectionTitle className="mb-4">Similar Songs</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {similarSongs.map((song) => (
            <Card key={song.title} className="flex flex-col">
              <div className="mb-3 flex h-28 items-center justify-center rounded-lg bg-gradient-to-br from-burgundy/20 to-brass/20">
                <Music className="h-7 w-7 text-charcoal/50" />
              </div>
              <p className="font-serif text-base text-ink">{song.title}</p>
              <p className="text-[13px] text-muted">{song.artist}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand">
                  <div
                    className="h-full rounded-full bg-brass"
                    style={{ width: `${song.match}%` }}
                  />
                </div>
                <span className="font-serif text-sm text-burgundy">{song.match}%</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
