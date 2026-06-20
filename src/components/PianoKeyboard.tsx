"use client";

import { useCallback } from "react";
import { playNote } from "@/lib/audioEngine";

interface PianoKeyboardProps {
  /** MIDI note numbers to highlight (active / playing). */
  activeNotes?: number[];
  /** Called when user presses a key. */
  onNoteOn?: (midi: number) => void;
  /** Called when user releases a key. */
  onNoteOff?: (midi: number) => void;
  /** First MIDI note to display (default C3 = 48). */
  startMidi?: number;
  /** Last MIDI note to display (default C5 = 72). */
  endMidi?: number;
  className?: string;
}

const PC_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const BLACK_PCS = new Set([1, 3, 6, 8, 10]); // C# D# F# G# A#

function isBlack(midi: number): boolean {
  return BLACK_PCS.has(midi % 12);
}

function noteName(midi: number): string {
  return `${PC_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;
}

export function PianoKeyboard({
  activeNotes = [],
  onNoteOn,
  onNoteOff,
  startMidi = 48,
  endMidi = 72,
  className = "",
}: PianoKeyboardProps) {
  // Collect all notes in range
  const allNotes: number[] = [];
  for (let m = startMidi; m <= endMidi; m++) allNotes.push(m);

  const whiteNotes = allNotes.filter((m) => !isBlack(m));
  const blackNotes = allNotes.filter((m) => isBlack(m));

  // Width of each white key as a percentage of total keyboard width
  const wkw = 100 / whiteNotes.length; // white key width %

  // Map white MIDI note → its sequential index (for positioning black keys)
  const whiteIdx = new Map<number, number>();
  whiteNotes.forEach((m, i) => whiteIdx.set(m, i));

  // Black key left offset: sit at ~70% of the preceding white key's right edge
  function blackLeft(midi: number): number {
    let prev = midi - 1;
    while (!whiteIdx.has(prev) && prev >= startMidi) prev--;
    const idx = whiteIdx.get(prev) ?? 0;
    return (idx + 0.65) * wkw;
  }

  const handleDown = useCallback(
    (midi: number) => {
      playNote(midi);
      onNoteOn?.(midi);
    },
    [onNoteOn]
  );

  const handleUp = useCallback(
    (midi: number) => {
      onNoteOff?.(midi);
    },
    [onNoteOff]
  );

  return (
    <div
      className={`relative select-none overflow-hidden rounded-lg border border-line bg-white ${className}`}
      style={{ height: 128 }}
    >
      {/* White keys */}
      <div className="flex h-full w-full">
        {whiteNotes.map((midi) => {
          const active = activeNotes.includes(midi);
          const isC = midi % 12 === 0;
          return (
            <button
              key={midi}
              onMouseDown={() => handleDown(midi)}
              onMouseUp={() => handleUp(midi)}
              onMouseLeave={() => handleUp(midi)}
              onTouchStart={(e) => {
                e.preventDefault();
                handleDown(midi);
              }}
              onTouchEnd={() => handleUp(midi)}
              className={`relative flex flex-1 flex-col items-center justify-end border-r border-line pb-1.5 text-[9px] transition-colors last:border-r-0 ${
                active
                  ? "bg-brass/40"
                  : "bg-white hover:bg-sand"
              }`}
            >
              {isC && (
                <span
                  className={`font-mono leading-none ${
                    active ? "font-bold text-brass" : "text-muted/60"
                  }`}
                >
                  {noteName(midi)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Black keys (absolutely positioned on top) */}
      {blackNotes.map((midi) => {
        const active = activeNotes.includes(midi);
        const left = blackLeft(midi);
        const width = wkw * 0.6;
        return (
          <button
            key={midi}
            onMouseDown={() => handleDown(midi)}
            onMouseUp={() => handleUp(midi)}
            onMouseLeave={() => handleUp(midi)}
            onTouchStart={(e) => {
              e.preventDefault();
              handleDown(midi);
            }}
            onTouchEnd={() => handleUp(midi)}
            className={`absolute top-0 z-10 rounded-b transition-colors ${
              active ? "bg-brass" : "bg-charcoal hover:bg-zinc-700"
            }`}
            style={{
              left: `${left}%`,
              width: `${width}%`,
              height: "62%",
            }}
          />
        );
      })}
    </div>
  );
}
