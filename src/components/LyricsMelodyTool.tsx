"use client";

import { useState } from "react";
import { Wand2, Send, Check } from "lucide-react";
import { Card, SectionTitle } from "@/components/Card";
import { loadProjects, saveProjects, loadActiveId } from "@/lib/writerTools";

const SHAPES = [
  { id: "rising", label: "Rising", hint: "Build toward the title — land the highest note on the key word." },
  { id: "falling", label: "Falling", hint: "Descend for release — great for resolving a chorus line." },
  { id: "arch", label: "Arch", hint: "Rise then fall — tension and resolution in one phrase." },
  { id: "flat", label: "Flat / Chant", hint: "Stay on one or two notes — rhythm carries the hook." },
  { id: "leap", label: "Leap-based", hint: "A wide interval on the most important syllable grabs attention." },
];

function stressWords(line: string): string[] {
  const words = line.replace(/[^\w\s']/g, "").split(/\s+/).filter(Boolean);
  return [...words].sort((a, b) => b.length - a.length).slice(0, 2);
}

export function LyricsMelodyTool() {
  const [line, setLine] = useState("");
  const [shape, setShape] = useState(SHAPES[0].id);
  const [result, setResult] = useState<{ stress: string[]; hook: string; rewrite: string } | null>(null);
  const [flash, setFlash] = useState(false);

  const analyze = () => {
    const s = stressWords(line);
    const shapeDef = SHAPES.find((x) => x.id === shape)!;
    const words = line.trim().split(/\s+/).filter(Boolean);
    const rewrite =
      words.length > 7
        ? words.slice(0, 7).join(" ")
        : `${line.trim()}${/[.!?]$/.test(line.trim()) ? "" : "…"}`;
    setResult({ stress: s, hook: shapeDef.hint, rewrite });
  };

  const sendToWriters = () => {
    if (!result) return;
    try {
      const projects = loadProjects();
      const activeId = loadActiveId(projects[0]?.id ?? "");
      const idx = Math.max(0, projects.findIndex((p) => p.id === activeId));
      if (projects[idx]) {
        const note = `Top-line idea — "${line}" (${shape}); stress: ${result.stress.join(", ")}`;
        projects[idx] = {
          ...projects[idx],
          notes: projects[idx].notes ? `${projects[idx].notes}\n${note}` : note,
          updatedAt: Date.now(),
          isExample: false,
        };
        saveProjects(projects);
        setFlash(true);
        setTimeout(() => setFlash(false), 1500);
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <Card>
      <SectionTitle className="mb-1">Top-line Studio</SectionTitle>
      <p className="mb-4 text-sm text-muted">
        Enter a lyric line and choose a melodic shape — get prosody and hook suggestions.
      </p>

      <label className="block">
        <span className="label-caps mb-1.5 block">Lyric Line</span>
        <input
          value={line}
          onChange={(e) => setLine(e.target.value)}
          placeholder="e.g. I keep the light on just in case you come back"
          className="input"
        />
      </label>

      <p className="label-caps mb-2 mt-4">Melody Shape</p>
      <div className="flex flex-wrap gap-2">
        {SHAPES.map((s) => (
          <button
            key={s.id}
            onClick={() => setShape(s.id)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              shape === s.id
                ? "border-brass bg-brass/15 text-ink"
                : "border-white/10 bg-white/[0.04] text-muted hover:text-ink"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <button onClick={analyze} disabled={!line.trim()} className="btn-brass mt-4">
        <Wand2 className="h-4 w-4" />
        Get Suggestions
      </button>

      {result && (
        <div className="mt-5 space-y-3">
          <Row label="Where to stress">
            {result.stress.length ? result.stress.map((w) => (
              <span key={w} className="chip border-brass/30 bg-brass/10">{w}</span>
            )) : <span className="text-sm text-muted">Add a few words first.</span>}
          </Row>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="label-caps mb-1">Hook Shape</p>
            <p className="text-sm text-ink">{result.hook}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="label-caps mb-1">Rewrite Suggestion</p>
            <p className="text-sm text-ink">&ldquo;{result.rewrite}&rdquo;</p>
          </div>
          <button onClick={sendToWriters} className="btn-ghost">
            {flash ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            {flash ? "Sent" : "Send to Writer's Room"}
          </button>
        </div>
      )}
    </Card>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <p className="label-caps mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
