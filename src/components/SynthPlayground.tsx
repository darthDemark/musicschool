"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Save, Trash2 } from "lucide-react";
import { Card, SectionTitle } from "@/components/Card";
import { KEYS, addItem, loadList, makeItem, removeItem } from "@/lib/hitcampStore";

type Wave = "sine" | "square" | "sawtooth" | "triangle";

interface Patch {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  notes: string;
  waveform: Wave;
  cutoff: number;
  attack: number;
  release: number;
  volume: number;
}

const NOTES = [
  { n: "C", f: 261.63 },
  { n: "D", f: 293.66 },
  { n: "E", f: 329.63 },
  { n: "F", f: 349.23 },
  { n: "G", f: 392.0 },
  { n: "A", f: 440.0 },
  { n: "B", f: 493.88 },
];

export function SynthPlayground() {
  const [waveform, setWaveform] = useState<Wave>("sawtooth");
  const [cutoff, setCutoff] = useState(2200);
  const [attack, setAttack] = useState(0.05);
  const [release, setRelease] = useState(0.4);
  const [volume, setVolume] = useState(0.3);
  const [name, setName] = useState("");
  const [patches, setPatches] = useState<Patch[]>([]);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setPatches(loadList<Patch>(KEYS.soundPatches));
  }, []);

  const getCtx = () => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new Ctx();
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  };

  const playNote = (freq: number) => {
    const c = getCtx();
    if (!c) return;
    const now = c.currentTime;
    const osc = c.createOscillator();
    const filter = c.createBiquadFilter();
    const gain = c.createGain();
    osc.type = waveform;
    osc.frequency.value = freq;
    filter.type = "lowpass";
    filter.frequency.value = cutoff;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.01, volume), now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + release);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + attack + release + 0.05);
  };

  const savePatch = () => {
    const patch: Patch = {
      ...makeItem({ type: "patch", title: name.trim() || `Patch ${patches.length + 1}` }),
      waveform,
      cutoff,
      attack,
      release,
      volume,
    };
    setPatches(addItem(KEYS.soundPatches, patch));
    setName("");
  };

  const loadPatch = (p: Patch) => {
    setWaveform(p.waveform);
    setCutoff(p.cutoff);
    setAttack(p.attack);
    setRelease(p.release);
    setVolume(p.volume);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <Card>
        <SectionTitle className="mb-4">Synth Playground</SectionTitle>

        {/* Waveform */}
        <p className="label-caps mb-2">Waveform</p>
        <div className="mb-5 flex flex-wrap gap-2">
          {(["sine", "square", "sawtooth", "triangle"] as Wave[]).map((w) => (
            <button
              key={w}
              onClick={() => setWaveform(w)}
              className={`rounded-full border px-3.5 py-1.5 text-sm capitalize transition-colors ${
                waveform === w
                  ? "border-brass bg-brass/15 text-ink"
                  : "border-white/10 bg-white/[0.04] text-muted hover:text-ink"
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Knob label="Cutoff" value={cutoff} min={200} max={8000} step={50} unit=" Hz" onChange={setCutoff} />
          <Knob label="Volume" value={Math.round(volume * 100)} min={0} max={100} unit="%" onChange={(v) => setVolume(v / 100)} />
          <Knob label="Attack" value={attack} min={0} max={1} step={0.01} unit="s" onChange={setAttack} />
          <Knob label="Release" value={release} min={0.05} max={2} step={0.05} unit="s" onChange={setRelease} />
        </div>

        {/* Keys */}
        <div className="mt-6">
          <p className="label-caps mb-2">Play</p>
          <div className="flex gap-2">
            {NOTES.map((nt) => (
              <button
                key={nt.n}
                onMouseDown={() => playNote(nt.f)}
                className="flex-1 rounded-lg border border-white/10 bg-white/[0.05] py-4 text-sm text-ink transition-colors hover:border-brass hover:bg-brass/10"
              >
                {nt.n}
              </button>
            ))}
          </div>
          <button onClick={() => playNote(440)} className="btn-primary mt-4">
            <Play className="h-4 w-4" />
            Play Note
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Patch name…"
            className="input flex-1"
          />
          <button onClick={savePatch} className="btn-brass shrink-0">
            <Save className="h-4 w-4" />
            Save Patch
          </button>
        </div>
      </Card>

      <Card>
        <SectionTitle className="mb-3">Saved Patches</SectionTitle>
        {patches.length === 0 ? (
          <p className="text-sm text-muted">No patches yet. Design a sound and save it.</p>
        ) : (
          <div className="space-y-2">
            {patches.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5"
              >
                <button onClick={() => loadPatch(p)} className="min-w-0 text-left">
                  <span className="block truncate text-sm text-ink">{p.title}</span>
                  <span className="block text-xs capitalize text-muted">{p.waveform}</span>
                </button>
                <button
                  onClick={() => setPatches(removeItem(KEYS.soundPatches, p.id))}
                  className="text-muted hover:text-[#E08079]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function Knob({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
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
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#D4AF37]"
      />
    </div>
  );
}
