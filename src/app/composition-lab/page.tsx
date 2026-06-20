"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  Square,
  Music2,
  FileText,
  Save,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { PianoKeyboard } from "@/components/PianoKeyboard";
import { playNote, playMelody } from "@/lib/audioEngine";
import { compositionAssignment, compositionCategories } from "@/lib/mockData";
import { getStorage, setStorage } from "@/lib/storage";

// ---------------------------------------------------------------------------
// Sequencer config
// ---------------------------------------------------------------------------

const STEPS = 16;
// Notes from top to bottom: C5 → C4 (descending, as on a piano roll)
const SEQUENCER_NOTES = [72, 71, 69, 67, 65, 64, 62, 60]; // C5 B4 A4 G4 F4 E4 D4 C4
const NOTE_LABELS = ["C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4"];
const BPM_OPTIONS = [60, 80, 100, 120, 140, 160];

type Grid = boolean[][]; // [row][col]

function emptyGrid(): Grid {
  return Array.from({ length: SEQUENCER_NOTES.length }, () =>
    Array(STEPS).fill(false)
  );
}

// ---------------------------------------------------------------------------
// Saved exercise shape
// ---------------------------------------------------------------------------

interface SavedExercise {
  id: string;
  name: string;
  grid: Grid;
  bpm: number;
  savedAt: string;
}

// ---------------------------------------------------------------------------
// Sequencer component
// ---------------------------------------------------------------------------

function Sequencer({
  grid,
  currentStep,
  onToggle,
}: {
  grid: Grid;
  currentStep: number;
  onToggle: (row: number, col: number) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white">
      <div className="flex" style={{ minWidth: 560 }}>
        {/* Row labels */}
        <div className="flex flex-col border-r border-line">
          <div className="flex h-7 items-center px-3 border-b border-line/60">
            <span className="label-caps text-[10px]">Note</span>
          </div>
          {NOTE_LABELS.map((label) => (
            <div
              key={label}
              className="flex h-9 items-center border-b border-line/40 px-3 last:border-b-0"
            >
              <span className="w-6 font-mono text-[11px] text-muted">{label}</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex flex-1 flex-col">
          {/* Column headers (beat numbers) */}
          <div className="flex h-7 border-b border-line/60">
            {Array.from({ length: STEPS }).map((_, col) => (
              <div
                key={col}
                className={`flex flex-1 items-center justify-center text-[10px] font-mono border-r border-line/30 last:border-r-0 ${
                  currentStep === col ? "bg-brass/20 text-brass font-bold" : "text-muted/50"
                }`}
              >
                {col % 4 === 0 ? col / 4 + 1 : "·"}
              </div>
            ))}
          </div>

          {/* Rows */}
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="flex border-b border-line/40 last:border-b-0">
              {row.map((active, col) => (
                <button
                  key={col}
                  onClick={() => onToggle(rowIdx, col)}
                  className={`flex h-9 flex-1 border-r border-line/20 last:border-r-0 transition-colors ${
                    col % 4 === 0 ? "border-l border-l-line/40" : ""
                  } ${
                    currentStep === col
                      ? active
                        ? "bg-brass"
                        : "bg-brass/15"
                      : active
                        ? "bg-brass/70 hover:bg-brass"
                        : "hover:bg-sand"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CompositionLabPage() {
  const [category, setCategory] = useState(compositionCategories[0]);
  const [showDetails, setShowDetails] = useState(true);
  const [grid, setGrid] = useState<Grid>(emptyGrid);
  const [bpm, setBpm] = useState(120);
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [savedExercises, setSavedExercises] = useState<SavedExercise[]>([]);
  const [saveName, setSaveName] = useState("");
  const [activeKeyNotes, setActiveKeyNotes] = useState<number[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef(0);
  const gridRef = useRef(grid);
  gridRef.current = grid;

  // Load persisted exercises
  useEffect(() => {
    const saved = getStorage<SavedExercise[]>("composition-lab");
    if (saved) setSavedExercises(saved);
  }, []);

  // Toggle a sequencer cell
  const toggleCell = (row: number, col: number) => {
    setGrid((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = !next[row][col];
      return next;
    });
  };

  // Playback engine
  const startPlayback = useCallback(() => {
    if (playing) return;
    setPlaying(true);
    stepRef.current = 0;

    const beatMs = (60 / bpm) * 1000;
    intervalRef.current = setInterval(() => {
      const step = stepRef.current % STEPS;
      setCurrentStep(step);

      // Play all active notes in this column
      const activeInStep = gridRef.current
        .map((row, rowIdx) => (row[step] ? SEQUENCER_NOTES[rowIdx] : null))
        .filter((m): m is number => m !== null);

      activeInStep.forEach((midi) => playNote(midi, beatMs / 1000 * 0.85));

      stepRef.current++;
    }, beatMs);
  }, [playing, bpm]);

  const stopPlayback = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPlaying(false);
    setCurrentStep(-1);
    stepRef.current = 0;
  }, []);

  const rewind = () => {
    stopPlayback();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const saveExercise = () => {
    const name = saveName.trim() || `Exercise ${savedExercises.length + 1}`;
    const newEx: SavedExercise = {
      id: `ex-${Date.now()}`,
      name,
      grid,
      bpm,
      savedAt: new Date().toLocaleDateString(),
    };
    const next = [newEx, ...savedExercises];
    setSavedExercises(next);
    setStorage("composition-lab", next);
    setSaveName("");
  };

  const loadExercise = (ex: SavedExercise) => {
    stopPlayback();
    setGrid(ex.grid);
    setBpm(ex.bpm);
  };

  const deleteExercise = (id: string) => {
    const next = savedExercises.filter((e) => e.id !== id);
    setSavedExercises(next);
    setStorage("composition-lab", next);
  };

  const clearGrid = () => {
    stopPlayback();
    setGrid(emptyGrid());
  };

  const handleKeyNoteOn = (midi: number) => {
    setActiveKeyNotes((prev) => [...new Set([...prev, midi])]);
  };
  const handleKeyNoteOff = (midi: number) => {
    setActiveKeyNotes((prev) => prev.filter((m) => m !== midi));
  };

  // Play a simple C major scale preview
  const playScalePreview = () => {
    playMelody([60, 62, 64, 65, 67, 69, 71, 72], bpm);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Composition Lab"
        title="Advanced Composer Training"
        subtitle="Counterpoint, fugue, reharmonization, and the deep craft of writing music."
      />

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Lab categories */}
        <aside className="space-y-2">
          <p className="label-caps mb-2">Labs</p>
          {compositionCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex w-full items-center gap-2 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                category === cat
                  ? "border-brass bg-brass/10 text-ink"
                  : "border-line bg-white/60 text-muted hover:text-ink"
              }`}
            >
              <Music2 className="h-4 w-4 text-brass" />
              {cat}
            </button>
          ))}

          {/* Saved exercises */}
          {savedExercises.length > 0 && (
            <div className="mt-4">
              <p className="label-caps mb-2">Saved</p>
              <div className="space-y-1.5">
                {savedExercises.map((ex) => (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between rounded-lg border border-line bg-white/60 px-3 py-2"
                  >
                    <button
                      onClick={() => loadExercise(ex)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="truncate text-xs font-medium text-ink">
                        {ex.name}
                      </p>
                      <p className="text-[10px] text-muted">
                        {ex.bpm} BPM · {ex.savedAt}
                      </p>
                    </button>
                    <button
                      onClick={() => deleteExercise(ex.id)}
                      className="ml-2 text-muted hover:text-burgundy"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Workspace */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="label-caps text-brass">
                  Current Assignment • {category}
                </p>
                <SectionTitle className="mt-1">
                  {compositionAssignment.title}
                </SectionTitle>
                <p className="mt-1 text-sm text-muted">
                  {compositionAssignment.description}
                </p>
              </div>
              <button
                onClick={() => setShowDetails((s) => !s)}
                className="btn-ghost"
              >
                <FileText className="h-4 w-4" />
                {showDetails ? "Hide" : "Details"}
              </button>
            </div>

            {showDetails && (
              <ol className="mt-4 space-y-2 rounded-lg border border-line bg-sand/40 p-5">
                {compositionAssignment.details.map((d, i) => (
                  <li key={i} className="flex gap-3 text-sm text-ink">
                    <span className="font-serif text-brass">{i + 1}.</span>
                    {d}
                  </li>
                ))}
              </ol>
            )}

            {/* Piano keyboard */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="label-caps">Keyboard</p>
                <button
                  onClick={playScalePreview}
                  className="rounded px-2 py-1 text-xs text-muted transition-colors hover:text-ink"
                >
                  Play scale
                </button>
              </div>
              <PianoKeyboard
                activeNotes={activeKeyNotes}
                onNoteOn={handleKeyNoteOn}
                onNoteOff={handleKeyNoteOff}
                startMidi={48}
                endMidi={72}
              />
            </div>

            {/* Sequencer (piano roll) */}
            <div className="mt-6">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="label-caps">Note Sequencer</p>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-muted">
                    BPM
                    <select
                      value={bpm}
                      onChange={(e) => setBpm(Number(e.target.value))}
                      className="rounded border border-line bg-white/60 px-1.5 py-0.5 text-xs text-ink"
                    >
                      {BPM_OPTIONS.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    onClick={clearGrid}
                    className="rounded px-2 py-1 text-xs text-muted transition-colors hover:text-burgundy"
                  >
                    <Trash2 className="inline h-3 w-3 mr-1" />
                    Clear
                  </button>
                </div>
              </div>

              <Sequencer
                grid={grid}
                currentStep={currentStep}
                onToggle={toggleCell}
              />

              <p className="mt-1.5 text-xs text-muted">
                Click cells to add / remove notes. Press play to hear your
                sequence loop.
              </p>
            </div>

            {/* Playback controls */}
            <div className="mt-5 flex items-center gap-3 rounded-lg border border-line bg-charcoal p-4">
              <button
                onClick={rewind}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ivory/70 transition-colors hover:bg-white/10 hover:text-ivory"
              >
                <SkipBack className="h-5 w-5" />
              </button>

              {playing ? (
                <button
                  onClick={stopPlayback}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-brass text-charcoal transition-transform hover:scale-105"
                >
                  <Pause className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={startPlayback}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-brass text-charcoal transition-transform hover:scale-105"
                >
                  <Play className="h-5 w-5" />
                </button>
              )}

              <button
                onClick={stopPlayback}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ivory/70 transition-colors hover:bg-white/10 hover:text-ivory"
              >
                <Square className="h-4 w-4" />
              </button>

              {/* Playhead bar */}
              <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                {Array.from({ length: STEPS }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 transition-colors ${
                      i === currentStep ? "bg-brass" : ""
                    } ${i % 4 === 0 && i !== currentStep ? "bg-white/10" : ""}`}
                  />
                ))}
              </div>

              <span className="min-w-[56px] text-right text-xs text-white/50">
                {currentStep >= 0
                  ? `${currentStep + 1} / ${STEPS}`
                  : `${bpm} BPM`}
              </span>
            </div>

            {/* Save exercise */}
            <div className="mt-4 flex gap-2">
              <input
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Exercise name (optional)"
                className="input flex-1 text-sm"
                onKeyDown={(e) => e.key === "Enter" && saveExercise()}
              />
              <button onClick={saveExercise} className="btn-ghost">
                <Save className="h-4 w-4" />
                Save
              </button>
            </div>
          </Card>

          {/* Topics */}
          <Card>
            <SectionTitle className="mb-3">Topics in this Curriculum</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {compositionAssignment.topics.map((topic) => (
                <span key={topic} className="chip">
                  {topic}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
