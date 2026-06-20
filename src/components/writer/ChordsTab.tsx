"use client";

import { useState } from "react";
import { Loader2, Music4, Plus } from "lucide-react";
import {
  generate,
  localChords,
  type ChordResult,
  type WriterTabProps,
} from "@/lib/writerTools";
import { AITextBlock, SelectField } from "./shared";

const KEYS = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
const MODES = ["Major", "Minor", "Dorian", "Mixolydian", "Phrygian"];
const GENRES = ["Pop", "Rock", "R&B", "Soul", "Gospel", "Jazz", "Film"];
const COLORS = ["dangerous romance", "bright", "melancholy", "tense", "warm", "epic"];
const COMPLEXITY = ["Simple", "Moderate", "Advanced"];

const VARIANTS: { key: keyof ChordResult; label: string }[] = [
  { key: "basic", label: "Basic" },
  { key: "darker", label: "Darker" },
  { key: "jazzier", label: "Jazzier" },
  { key: "gospel", label: "Gospel / R&B" },
  { key: "bridge", label: "Bridge" },
];

export function ChordsTab({ project, setProject }: WriterTabProps) {
  const [key, setKey] = useState("C");
  const [mode, setMode] = useState("Minor");
  const [genre, setGenre] = useState("R&B");
  const [color, setColor] = useState(COLORS[0]);
  const [complexity, setComplexity] = useState(COMPLEXITY[1]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ChordResult | null>(null);
  const [aiText, setAiText] = useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    setAiText(null);
    setResult(null);
    const input = { key, mode, genre, color, complexity };
    const out = await generate(
      `Generate chord progressions in ${key} ${mode}, genre ${genre}, emotional color "${color}", complexity ${complexity}. Provide a basic, darker, jazzier, gospel/R&B, and bridge progression using chord symbols.`,
      () => localChords(input)
    );
    if (out.kind === "local") setResult(out.data);
    else setAiText(out.text);
    setBusy(false);
  };

  const insert = (label: string, prog: string) =>
    setProject((p) => {
      const line = `${label} (${key} ${mode}): ${prog}`;
      return { ...p, chords: p.chords ? `${p.chords}\n${line}` : line };
    });

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SelectField label="Key" value={key} onChange={setKey} options={KEYS} />
        <SelectField label="Mode" value={mode} onChange={setMode} options={MODES} />
        <SelectField label="Genre" value={genre} onChange={setGenre} options={GENRES} />
        <SelectField label="Emotional Color" value={color} onChange={setColor} options={COLORS} />
        <SelectField
          label="Complexity"
          value={complexity}
          onChange={setComplexity}
          options={COMPLEXITY}
        />
        <div className="flex items-end">
          <button onClick={run} disabled={busy} className="btn-brass w-full">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Music4 className="h-4 w-4" />}
            Generate Progressions
          </button>
        </div>
      </div>

      {aiText && <AITextBlock text={aiText} />}

      {result && (
        <div className="space-y-3">
          {VARIANTS.map(({ key: vk, label }) => (
            <div
              key={vk}
              className="flex flex-col gap-2 rounded-lg border border-line bg-white/60 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="label-caps mb-1">{label}</p>
                <p className="font-serif text-lg tracking-wide text-ink">{result[vk]}</p>
              </div>
              <button
                onClick={() => insert(label, result[vk])}
                className="btn-ghost shrink-0 px-3 py-1.5 text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Insert
              </button>
            </div>
          ))}
        </div>
      )}

      {project.chords && (
        <div className="rounded-lg border border-line bg-sand/40 p-4">
          <p className="label-caps mb-2">Project Chord Sketches</p>
          <pre className="whitespace-pre-wrap font-sans text-sm text-ink">
            {project.chords}
          </pre>
        </div>
      )}
    </div>
  );
}
