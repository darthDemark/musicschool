"use client";

import { useEffect, useState } from "react";
import {
  Mic,
  Play,
  Square,
  Rewind,
  Repeat,
  Save,
  Trash2,
  Guitar,
  Piano,
  AudioLines,
  Grid3x3,
  StickyNote,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { FadeIn } from "@/components/Motion";
import { getStorage, setStorage } from "@/lib/storage";

const TABS = [
  { id: "voice", label: "Voice", icon: Mic },
  { id: "guitar", label: "Guitar", icon: Guitar },
  { id: "piano", label: "Piano", icon: Piano },
  { id: "beats", label: "Beats", icon: Grid3x3 },
  { id: "notes", label: "Notes", icon: StickyNote },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface Idea {
  id: string;
  name: string;
  kind: string;
  at: string;
}

const PADS = ["Kick", "Snare", "Hat", "Open Hat", "Clap", "Perc 1", "Perc 2", "808"];

export default function SketchpadPage() {
  const [tab, setTab] = useState<TabId>("voice");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loop, setLoop] = useState(false);
  const [activePads, setActivePads] = useState<Set<string>>(new Set());
  const [tempo, setTempo] = useState(96);
  const [swing, setSwing] = useState(20);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setIdeas(getStorage<Idea[]>("sketchpad-ideas") ?? []);
    setNotes(getStorage<string>("sketchpad-notes") ?? "");
  }, []);

  const saveIdea = (kind: string) => {
    const idea: Idea = {
      id: `i-${Date.now()}`,
      name: `${kind} idea ${ideas.length + 1}`,
      kind,
      at: new Date().toLocaleDateString(),
    };
    const next = [idea, ...ideas];
    setIdeas(next);
    setStorage("sketchpad-ideas", next);
  };

  const deleteIdea = (id: string) => {
    const next = ideas.filter((i) => i.id !== id);
    setIdeas(next);
    setStorage("sketchpad-ideas", next);
  };

  const togglePad = (p: string) =>
    setActivePads((prev) => {
      const n = new Set(prev);
      if (n.has(p)) n.delete(p);
      else n.add(p);
      return n;
    });

  const isRecorder = tab === "voice" || tab === "guitar" || tab === "piano";
  const tabLabel = TABS.find((t) => t.id === tab)?.label ?? "";

  return (
    <div className="animate-page">
      <PageHeader
        eyebrow="Create"
        title="Sketchpad"
        subtitle="Capture ideas the moment they strike — voice, guitar, piano, beats, and notes. (Visual prototype.)"
      />

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "border-brass bg-brass/15 text-ink"
                  : "border-white/10 bg-white/[0.04] text-muted hover:border-brass/50 hover:text-ink"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <FadeIn motionKey={tab} className="space-y-6">
          {isRecorder && (
            <Card>
              <SectionTitle className="mb-4">{tabLabel} Recorder</SectionTitle>

              {/* Waveform area */}
              <div className="flex h-40 items-center justify-center gap-[3px] rounded-lg border border-white/10 bg-studio2 px-4">
                {Array.from({ length: 80 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-[3px] rounded-full bg-brass/30"
                    style={{ height: `${10 + Math.abs(Math.sin(i * 0.4)) * 80}%` }}
                  />
                ))}
              </div>

              {/* Transport */}
              <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-charcoal p-4">
                <TransportBtn label="Rewind" icon={Rewind} />
                <button
                  title="Recording coming soon"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C2453B] text-ivory transition-transform hover:scale-105"
                >
                  <Mic className="h-5 w-5" />
                </button>
                <TransportBtn label="Play" icon={Play} />
                <TransportBtn label="Stop" icon={Square} />
                <button
                  onClick={() => setLoop((l) => !l)}
                  title="Loop"
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                    loop ? "bg-brass text-charcoal" : "text-white/70 hover:bg-white/10 hover:text-ivory"
                  }`}
                >
                  <Repeat className="h-4 w-4" />
                </button>
                <button onClick={() => saveIdea(tabLabel)} className="btn-brass ml-auto">
                  <Save className="h-4 w-4" />
                  Save Idea
                </button>
              </div>
              <p className="mt-2 text-xs text-muted">
                Audio capture is a visual prototype for now — Save Idea stores a placeholder entry.
              </p>
            </Card>
          )}

          {tab === "beats" && (
            <Card>
              <SectionTitle className="mb-4">Mini Drum Pad</SectionTitle>
              <div className="grid grid-cols-4 gap-3">
                {PADS.map((p) => {
                  const active = activePads.has(p);
                  return (
                    <button
                      key={p}
                      onClick={() => togglePad(p)}
                      className={`aspect-square rounded-xl2 border text-xs font-medium transition-all duration-100 ${
                        active
                          ? "border-brass bg-brass/30 text-ink shadow-[0_0_18px_rgba(212,175,55,0.35)]"
                          : "border-white/10 bg-white/[0.04] text-muted hover:border-brass/40 hover:text-ink"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Slider label="Tempo" value={tempo} min={60} max={180} unit=" BPM" onChange={setTempo} />
                <Slider label="Swing" value={swing} min={0} max={60} unit="%" onChange={setSwing} />
              </div>

              <button onClick={() => saveIdea("Beat")} className="btn-brass mt-6">
                <Save className="h-4 w-4" />
                Save Pattern
              </button>
            </Card>
          )}

          {tab === "notes" && (
            <Card>
              <SectionTitle className="mb-4">Notes</SectionTitle>
              <textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setStorage("sketchpad-notes", e.target.value);
                }}
                rows={12}
                placeholder="Lyric fragments, concepts, references — anything. Autosaves to this device."
                className="w-full resize-y rounded-lg border border-white/10 bg-white/[0.04] p-4 text-[15px] leading-relaxed text-ink outline-none placeholder:text-muted/60 focus:border-brass focus:ring-1 focus:ring-brass/30"
              />
            </Card>
          )}
        </FadeIn>

        {/* Idea list */}
        <aside>
          <Card>
            <SectionTitle className="mb-3">Your Ideas</SectionTitle>
            {ideas.length === 0 ? (
              <p className="text-sm text-muted">
                No ideas captured yet. Save one to start your vault.
              </p>
            ) : (
              <div className="space-y-2">
                {ideas.map((i) => (
                  <div
                    key={i.id}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-ink">{i.name}</p>
                      <p className="text-xs text-muted">{i.kind} · {i.at}</p>
                    </div>
                    <button
                      onClick={() => deleteIdea(i.id)}
                      className="text-muted transition-colors hover:text-[#E08079]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}

function TransportBtn({ label, icon: Icon }: { label: string; icon: typeof Play }) {
  return (
    <button
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-ivory"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="label-caps">{label}</span>
        <span className="font-serif text-sm text-brass">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#D4AF37]"
      />
    </div>
  );
}
