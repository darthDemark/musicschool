"use client";

import { useState } from "react";
import { Loader2, Music, Save } from "lucide-react";
import {
  generate,
  localMelody,
  type MelodyResult,
  type WriterTabProps,
} from "@/lib/writerTools";
import { AITextBlock, ResultRow, SelectField } from "./shared";

const KEYS = [
  "C major",
  "C minor",
  "G major",
  "A minor",
  "D minor",
  "E minor",
  "F major",
  "Bb major",
  "Eb minor",
];
const MOODS = ["dangerous romance", "hopeful", "melancholy", "triumphant", "tense", "dreamy"];
const RANGES = ["low to mid", "mid", "mid to high", "wide"];
const PHRASES = ["2 bars", "4 bars", "8 bars"];
const STYLES = ["R&B", "Pop", "Soul", "Ballad", "Anthem", "Cinematic"];

export function MelodyTab({ project, setProject }: WriterTabProps) {
  const [key, setKey] = useState(KEYS[1]);
  const [mood, setMood] = useState(MOODS[0]);
  const [range, setRange] = useState(RANGES[0]);
  const [phrase, setPhrase] = useState(PHRASES[1]);
  const [style, setStyle] = useState(STYLES[0]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<MelodyResult | null>(null);
  const [aiText, setAiText] = useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    setAiText(null);
    setResult(null);
    const input = { key, mood, range, phraseLength: phrase, style };
    const out = await generate(
      `Suggest an original top-line melody concept in ${key}, mood "${mood}", range ${range}, phrase length ${phrase}, style ${style}. Describe contour with scale degrees, a pre-chorus lift, chorus arrival, call-and-response, and a repetition strategy. Do not reproduce any existing copyrighted melody.`,
      () => localMelody(input)
    );
    if (out.kind === "local") setResult(out.data);
    else setAiText(out.text);
    setBusy(false);
  };

  const saveToProject = () => {
    if (!result) return;
    const block = `Melody (${key}, ${mood}):\n  Verse: ${result.verseContour}\n  Pre-chorus: ${result.preChorusLift}\n  Chorus: ${result.chorusArrival}`;
    setProject((p) => ({
      ...p,
      melody: p.melody ? `${p.melody}\n\n${block}` : block,
    }));
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SelectField label="Key" value={key} onChange={setKey} options={KEYS} />
        <SelectField label="Mood" value={mood} onChange={setMood} options={MOODS} />
        <SelectField label="Range" value={range} onChange={setRange} options={RANGES} />
        <SelectField label="Phrase Length" value={phrase} onChange={setPhrase} options={PHRASES} />
        <SelectField label="Style" value={style} onChange={setStyle} options={STYLES} />
        <div className="flex items-end">
          <button onClick={run} disabled={busy} className="btn-brass w-full">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Music className="h-4 w-4" />}
            Generate Top-Line
          </button>
        </div>
      </div>

      <p className="text-xs text-muted">
        Outputs are scale-degree patterns, not notated pitches — original by
        construction and safe to develop into your own melody.
      </p>

      {aiText && <AITextBlock text={aiText} />}

      {result && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <DegreeCard label="Verse Contour" value={result.verseContour} />
            <DegreeCard label="Pre-Chorus Lift" value={result.preChorusLift} />
            <DegreeCard label="Chorus Arrival" value={result.chorusArrival} />
          </div>
          <ResultRow label="Note Pattern (scale degrees)" value={result.notePattern} />
          <ResultRow label="Call & Response" value={result.callResponse} />
          <ResultRow label="Repetition Strategy" value={result.repetition} />
          <button onClick={saveToProject} className="btn-ghost">
            <Save className="h-4 w-4" />
            Save to Melody Notes
          </button>
        </div>
      )}
    </div>
  );
}

function DegreeCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-charcoal p-4 text-center">
      <p className="label-caps mb-2 text-white/50">{label}</p>
      <p className="font-serif text-xl tracking-wide text-brass">{value}</p>
    </div>
  );
}
