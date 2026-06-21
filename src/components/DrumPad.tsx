"use client";

import { useCallback, useEffect, useState } from "react";
import { Save, Volume2 } from "lucide-react";
import { DRUMS, playDrum, preloadDrums } from "@/lib/drumKit";
import { KEYS, addItem, makeItem, loadList } from "@/lib/hitcampStore";

interface DrumPattern {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  notes: string;
  tempo: number;
  swing: number;
  steps: Record<string, boolean[]>; // future 16-step sequencer
}

export function DrumPad() {
  const [active, setActive] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.9);
  const [tempo, setTempo] = useState(96);
  const [swing, setSwing] = useState(20);
  const [saved, setSaved] = useState(0);

  useEffect(() => {
    preloadDrums();
    setSaved(loadList<DrumPattern>(KEYS.drumPatterns).length);
  }, []);

  const hit = useCallback(
    (id: string) => {
      playDrum(id, volume);
      setActive(id);
      setTimeout(() => setActive((a) => (a === id ? null : a)), 130);
    },
    [volume]
  );

  // Keyboard shortcuts (A S D F Z X C V).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const drum = DRUMS.find((d) => d.key === e.key.toLowerCase());
      if (drum) hit(drum.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hit]);

  const savePattern = () => {
    const pattern: DrumPattern = {
      ...makeItem({ type: "drum-pattern", title: `Pattern ${saved + 1}` }),
      tempo,
      swing,
      steps: Object.fromEntries(DRUMS.map((d) => [d.id, Array(16).fill(false)])),
    };
    addItem(KEYS.drumPatterns, pattern);
    setSaved((n) => n + 1);
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        {DRUMS.map((d) => {
          const on = active === d.id;
          return (
            <button
              key={d.id}
              onMouseDown={() => hit(d.id)}
              className={`relative aspect-square rounded-xl2 border text-xs font-medium transition-all duration-100 ${
                on
                  ? "border-brass bg-brass/30 text-ink shadow-[0_0_22px_rgba(212,175,55,0.4)]"
                  : "border-white/10 bg-white/[0.04] text-muted hover:border-brass/40 hover:text-ink"
              }`}
            >
              {d.label}
              <span className="absolute right-1.5 top-1.5 rounded bg-white/5 px-1 text-[9px] uppercase text-faint">
                {d.key}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <Slider label="Volume" value={Math.round(volume * 100)} min={0} max={100} unit="%" onChange={(v) => setVolume(v / 100)} icon />
        <Slider label="Tempo" value={tempo} min={60} max={180} unit=" BPM" onChange={setTempo} />
        <Slider label="Swing" value={swing} min={0} max={60} unit="%" onChange={setSwing} />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-xs text-muted">
          Click pads or use your keyboard. {saved > 0 ? `${saved} saved.` : ""}
        </p>
        <button onClick={savePattern} className="btn-brass">
          <Save className="h-4 w-4" />
          Save Pattern
        </button>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
  icon,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
  icon?: boolean;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="label-caps flex items-center gap-1">
          {icon && <Volume2 className="h-3 w-3 text-brass" />}
          {label}
        </span>
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
