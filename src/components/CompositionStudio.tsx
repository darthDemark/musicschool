"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Square, Trash2, Music, Volume2 } from "lucide-react";

// C major scale, two octaves used for the keyboard; the sequencer rows use the
// lower octave plus the high tonic (8 notes) for a clean one-octave grid.
const SCALE = [
  { name: "C", freq: 261.63 },
  { name: "D", freq: 293.66 },
  { name: "E", freq: 329.63 },
  { name: "F", freq: 349.23 },
  { name: "G", freq: 392.0 },
  { name: "A", freq: 440.0 },
  { name: "B", freq: 493.88 },
  { name: "C5", freq: 523.25 },
];

const KEYBOARD = [
  ...SCALE.slice(0, 7),
  ...SCALE.map((n) => ({ name: n.name, freq: n.freq * 2 })),
];
// No black key follows E (idx 2) or B (idx 6) within each octave.
const BLACK_AFTER = new Set([0, 1, 3, 4, 5, 7, 8, 10, 11, 12]);

const STEPS = 16;
const SEQ_NOTES = [...SCALE].reverse(); // top row = highest pitch

function emptyGrid() {
  return SEQ_NOTES.map(() => Array<boolean>(STEPS).fill(false));
}

/**
 * Self-contained playback studio: interactive piano keyboard, a step sequencer,
 * BPM control, "Play Scale", and "Clear". Uses the Web Audio API so it makes
 * sound with no external assets. This component is intentionally kept mounted
 * by the page across lab switches so its state and audio context survive.
 */
export function CompositionStudio() {
  const [bpm, setBpm] = useState(96);
  const [grid, setGrid] = useState<boolean[][]>(emptyGrid);
  const [playing, setPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);

  const ctxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepRef = useRef(0);
  const gridRef = useRef(grid);
  const bpmRef = useRef(bpm);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);
  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

  const getCtx = () => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctxRef.current = new Ctx();
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  };

  const playTone = (freq: number, duration = 0.32) => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  };

  const stop = () => {
    setPlaying(false);
    setActiveStep(-1);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const start = () => {
    if (playing) {
      stop();
      return;
    }
    getCtx();
    setPlaying(true);
    stepRef.current = 0;

    const tick = () => {
      const step = stepRef.current;
      setActiveStep(step);
      gridRef.current.forEach((row, r) => {
        if (row[step]) playTone(SEQ_NOTES[r].freq);
      });
      stepRef.current = (step + 1) % STEPS;
      const interval = (60 / bpmRef.current / 4) * 1000; // 16th notes
      timerRef.current = setTimeout(tick, interval);
    };
    tick();
  };

  const playScale = () => {
    getCtx();
    const interval = (60 / bpm / 2) * 1000;
    SCALE.forEach((note, i) => {
      setTimeout(() => playTone(note.freq, 0.4), i * interval);
    });
  };

  const clearGrid = () => setGrid(emptyGrid());

  const toggleCell = (r: number, c: number) => {
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = !next[r][c];
      if (next[r][c]) playTone(SEQ_NOTES[r].freq);
      return next;
    });
  };

  // Clean up timer on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Piano keyboard */}
      <div>
        <p className="label-caps mb-2">Keyboard</p>
        <div className="relative flex h-32 w-full select-none overflow-hidden rounded-lg border border-line bg-white">
          {KEYBOARD.map((key, i) => (
            <button
              key={`${key.name}-${i}`}
              onMouseDown={() => playTone(key.freq)}
              className="relative flex flex-1 items-end justify-center border-r border-line pb-2 text-[10px] text-muted transition-colors last:border-r-0 hover:bg-sand active:bg-brass/20"
            >
              {key.name.replace("5", "")}
              {BLACK_AFTER.has(i) && (
                <span
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    playTone(key.freq * 1.0595);
                  }}
                  className="absolute -right-[7px] top-0 z-10 h-20 w-[14px] rounded-b bg-charcoal transition-colors hover:bg-ink"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Step sequencer */}
      <div>
        <p className="label-caps mb-2">Note Sequencer</p>
        <div className="overflow-x-auto rounded-lg border border-line bg-white p-3">
          <div className="min-w-[520px]">
            {SEQ_NOTES.map((note, r) => (
              <div key={note.name} className="mb-1 flex items-center gap-1 last:mb-0">
                <span className="w-7 shrink-0 text-right text-[10px] text-muted">
                  {note.name.replace("5", "")}
                </span>
                <div className="flex flex-1 gap-1">
                  {Array.from({ length: STEPS }).map((_, c) => {
                    const on = grid[r][c];
                    const isBeat = c % 4 === 0;
                    return (
                      <button
                        key={c}
                        onClick={() => toggleCell(r, c)}
                        className={`h-6 flex-1 rounded-sm border transition-colors ${
                          on
                            ? "border-brass bg-brass"
                            : isBeat
                              ? "border-line bg-sand"
                              : "border-line/60 bg-white"
                        } ${activeStep === c ? "ring-2 ring-burgundy/60" : ""}`}
                        aria-label={`${note.name} step ${c + 1}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transport */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-charcoal p-4">
        <button
          onClick={start}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-brass text-charcoal transition-transform hover:scale-105"
          aria-label={playing ? "Stop" : "Play sequence"}
        >
          {playing ? <Square className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>

        <button
          onClick={playScale}
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm text-ivory transition-colors hover:bg-white/10"
        >
          <Music className="h-4 w-4 text-brass" />
          Play Scale
        </button>

        <button
          onClick={clearGrid}
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm text-ivory transition-colors hover:bg-white/10"
        >
          <Trash2 className="h-4 w-4 text-brass" />
          Clear
        </button>

        <div className="ml-auto flex items-center gap-3">
          <Volume2 className="h-4 w-4 text-white/50" />
          <label className="flex items-center gap-2 text-sm text-white/70">
            <span className="label-caps text-white/50">BPM</span>
            <input
              type="range"
              min={60}
              max={180}
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-28 accent-[#C49B3D]"
            />
            <span className="w-8 font-serif text-ivory">{bpm}</span>
          </label>
        </div>
      </div>
    </div>
  );
}
