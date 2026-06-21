"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Card, SectionTitle } from "@/components/Card";
import { ProgressRing } from "@/components/ProgressRing";

interface ChannelState {
  name: string;
  level: number; // 0-100
  pan: number; // -50..50
  mute: boolean;
  solo: boolean;
}

const INIT: ChannelState[] = [
  { name: "Kick", level: 78, pan: 0, mute: false, solo: false },
  { name: "Snare", level: 70, pan: 0, mute: false, solo: false },
  { name: "Bass", level: 74, pan: 0, mute: false, solo: false },
  { name: "Vox", level: 82, pan: 0, mute: false, solo: false },
  { name: "Keys", level: 64, pan: -18, mute: false, solo: false },
  { name: "Guitar", level: 60, pan: 22, mute: false, solo: false },
  { name: "Pad", level: 52, pan: -28, mute: false, solo: false },
  { name: "Master", level: 88, pan: 0, mute: false, solo: false },
];

/** CSS-only mixing console preview (no real audio yet). */
export function MixerConsole() {
  const [channels, setChannels] = useState<ChannelState[]>(INIT);

  const update = (i: number, patch: Partial<ChannelState>) =>
    setChannels((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));

  const cyclePan = (i: number) => {
    const cur = channels[i].pan;
    const next = cur === 0 ? -35 : cur < 0 ? 35 : 0;
    update(i, { pan: next });
  };

  const mixScore = Math.round(
    channels.filter((c) => c.name !== "Master").reduce((a, c) => a + c.level, 0) /
      (channels.length - 1)
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      <Card>
        <div className="mb-1 flex items-center justify-between">
          <SectionTitle>Console</SectionTitle>
          <button
            onClick={() => setChannels(INIT.map((c) => ({ ...c })))}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-muted transition-colors hover:text-ink"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
        <p className="mb-5 text-sm text-muted">
          A preview of the mixing workspace — faders, pan, mute/solo, and meters.
        </p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {channels.map((c, i) => {
            const isMaster = c.name === "Master";
            return (
              <div
                key={c.name}
                className={`flex w-[72px] shrink-0 flex-col items-center gap-2 rounded-lg border p-3 ${
                  isMaster ? "border-brass/40 bg-brass/[0.06]" : "border-white/10 bg-white/[0.03]"
                }`}
              >
                {/* Pan knob */}
                <button
                  onClick={() => cyclePan(i)}
                  title="Pan"
                  className="relative h-8 w-8 rounded-full border border-white/15 bg-studio2"
                >
                  <span
                    className="absolute left-1/2 top-1 h-2.5 w-[2px] -translate-x-1/2 rounded-full bg-brass"
                    style={{ transformOrigin: "50% 14px", transform: `rotate(${c.pan * 2.4}deg)` }}
                  />
                </button>
                <span className="text-[9px] text-faint">
                  {c.pan === 0 ? "C" : c.pan < 0 ? `L${Math.abs(c.pan)}` : `R${c.pan}`}
                </span>

                {/* Meter + fader */}
                <div className="flex items-end gap-1.5">
                  <div className="flex h-36 w-1.5 items-end overflow-hidden rounded-full bg-white/10">
                    <div
                      className="w-full rounded-full bg-gradient-to-t from-success via-brass to-[#E08079]"
                      style={{ height: `${c.mute ? 0 : c.level}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={c.level}
                    onChange={(e) => update(i, { level: Number(e.target.value) })}
                    aria-label={`${c.name} level`}
                    className="h-36 cursor-pointer accent-[#D4AF37]"
                    style={{ writingMode: "vertical-lr", direction: "rtl", width: 18 }}
                  />
                </div>

                <span className="text-xs font-medium text-ink">{c.name}</span>

                {/* Mute / Solo */}
                <div className="flex gap-1">
                  <button
                    onClick={() => update(i, { mute: !c.mute })}
                    className={`h-6 w-6 rounded text-[10px] font-bold transition-colors ${
                      c.mute ? "bg-[#C2453B] text-ivory" : "bg-white/[0.06] text-muted hover:text-ink"
                    }`}
                  >
                    M
                  </button>
                  <button
                    onClick={() => update(i, { solo: !c.solo })}
                    className={`h-6 w-6 rounded text-[10px] font-bold transition-colors ${
                      c.solo ? "bg-brass text-charcoal" : "bg-white/[0.06] text-muted hover:text-ink"
                    }`}
                  >
                    S
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Mix score */}
      <Card className="flex flex-col items-center text-center">
        <SectionTitle className="mb-1 self-start">Mix Score</SectionTitle>
        <p className="mb-4 self-start text-sm text-muted">Live preview metric</p>
        <ProgressRing value={mixScore} label={`${mixScore}`} sublabel="Balance" size={130} />
        <div className="mt-6 w-full space-y-2 text-left">
          {[
            { k: "Balance", v: mixScore },
            { k: "Clarity", v: Math.min(100, mixScore + 6) },
            { k: "Loudness", v: channels[channels.length - 1].level },
          ].map((r) => (
            <div key={r.k}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-muted">{r.k}</span>
                <span className="text-brass">{r.v}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-brass" style={{ width: `${r.v}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
