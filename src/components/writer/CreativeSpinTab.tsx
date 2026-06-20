"use client";

import { useState } from "react";
import { Loader2, Shuffle, Save } from "lucide-react";
import {
  generate,
  localCreativeSpin,
  type CreativeSpinResult,
  type WriterTabProps,
} from "@/lib/writerTools";
import { AITextBlock, Field, ResultRow, SelectField } from "./shared";

const genres = ["Pop", "Rock", "R&B", "Soul", "Blues", "Funk", "Hip-Hop", "Jazz", "Film"];

export function CreativeSpinTab({ project, setProject }: WriterTabProps) {
  const [obj1, setObj1] = useState("chair");
  const [obj2, setObj2] = useState("rose");
  const [emotion, setEmotion] = useState("love lost");
  const [genre, setGenre] = useState(genres[0] ?? "Pop");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<CreativeSpinResult | null>(null);
  const [aiText, setAiText] = useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    setAiText(null);
    setResult(null);
    const input = { obj1, obj2, emotion, genre };
    const out = await generate(
      `Create a song concept connecting two unrelated images: "${obj1}" and "${obj2}". Emotion: ${emotion}. Genre: ${genre}. Provide a title, concept, visual story, title ideas, chorus angle, verse 1 scene, verse 2 development, bridge twist, and emotional thesis.`,
      () => localCreativeSpin(input)
    );
    if (out.kind === "local") setResult(out.data);
    else setAiText(out.text);
    setBusy(false);
  };

  const saveToNotes = () => {
    if (!result) return;
    const block = `— Creative Spin: ${result.title} —\n${result.concept}\nThesis: ${result.thesis}`;
    setProject((p) => ({
      ...p,
      notes: p.notes ? `${p.notes}\n\n${block}` : block,
    }));
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Object / Image 1">
          <input value={obj1} onChange={(e) => setObj1(e.target.value)} className="input" />
        </Field>
        <Field label="Object / Image 2">
          <input value={obj2} onChange={(e) => setObj2(e.target.value)} className="input" />
        </Field>
        <Field label="Emotion">
          <input
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            className="input"
          />
        </Field>
        <SelectField label="Genre" value={genre} onChange={setGenre} options={genres} />
      </div>

      <button onClick={run} disabled={busy} className="btn-brass">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shuffle className="h-4 w-4" />}
        Spin Concept
      </button>

      {aiText && <AITextBlock text={aiText} />}

      {result && (
        <div className="space-y-4">
          <div className="rounded-lg border border-burgundy/20 bg-burgundy/5 p-5">
            <p className="label-caps mb-1 text-burgundy">Title</p>
            <h3 className="font-serif text-2xl text-ink">{result.title}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.titleIdeas.map((ti) => (
                <span key={ti} className="chip">
                  {ti}
                </span>
              ))}
            </div>
          </div>

          <ResultRow label="Concept" value={result.concept} />
          <ResultRow label="Visual Story" value={result.visualStory} />
          <div className="grid gap-4 sm:grid-cols-2">
            <ResultRow label="Chorus Angle" value={result.chorusAngle} />
            <ResultRow label="Verse 1 Scene" value={result.verse1} />
            <ResultRow label="Verse 2 Development" value={result.verse2} />
            <ResultRow label="Bridge Twist" value={result.bridge} />
          </div>
          <div className="rounded-lg border border-brass/30 bg-brass/5 p-4">
            <p className="label-caps mb-1 text-brass">Emotional Thesis</p>
            <p className="font-serif text-lg italic text-ink">{result.thesis}</p>
          </div>

          <button onClick={saveToNotes} className="btn-ghost">
            <Save className="h-4 w-4" />
            Save to Notes
          </button>
        </div>
      )}
    </div>
  );
}
