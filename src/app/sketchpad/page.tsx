"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Play,
  Square,
  Rewind,
  Repeat,
  Circle,
  Save,
  Plus,
  Drum,
  AudioWaveform,
  Mic,
  Search,
  Star,
  Trash2,
  Pencil,
  Download,
  AlertTriangle,
  Volume2,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DRUMS, playDrum, preloadDrums } from "@/lib/drumKit";
import {
  DEFAULT_SYNTH,
  metronomeClick,
  playSynthNote,
  type SynthSettings,
  type Wave,
} from "@/lib/synthEngine";
import { loadList, saveList, uid, nowISO } from "@/lib/hitcampStore";

/* ------------------------------- model ---------------------------------- */

type TrackType = "drums" | "synth" | "audio";

interface Clip {
  id: string;
  trackId: string;
  type: "audio" | "drum-pattern" | "synth-pattern";
  name: string;
  createdAt: string;
  startTime: number;
  dataUrl?: string;
  duration?: number;
  steps?: Record<string, boolean[]>;
  notes?: { note: string; step: number; length: number }[];
  instrumentSettings?: SynthSettings;
  favorite?: boolean;
}

interface Track {
  id: string;
  name: string;
  type: TrackType;
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  armed: boolean;
  clips: Clip[];
}

interface Project {
  id: string;
  title: string;
  bpm: number;
  createdAt: string;
  updatedAt: string;
  tracks: Track[];
}

const KEY = "hitcamp_sketchpad_projects";
const STEPS = 16;

const TRACK_DEFS: { id: string; name: string; type: TrackType }[] = [
  { id: "drums", name: "Drums", type: "drums" },
  { id: "synth1", name: "Synth 1", type: "synth" },
  { id: "synth2", name: "Synth 2", type: "synth" },
  { id: "audio1", name: "Audio 1", type: "audio" },
  { id: "audio2", name: "Audio 2", type: "audio" },
  { id: "audio3", name: "Audio 3", type: "audio" },
  { id: "audio4", name: "Audio 4", type: "audio" },
  { id: "audio5", name: "Audio 5", type: "audio" },
];

function newProject(title = "Untitled Project"): Project {
  return {
    id: uid(),
    title,
    bpm: 120,
    createdAt: nowISO(),
    updatedAt: nowISO(),
    tracks: TRACK_DEFS.map((t) => ({
      ...t,
      volume: 0.8,
      pan: 0,
      muted: false,
      solo: false,
      armed: false,
      clips: [],
    })),
  };
}

// Piano-roll note range C3 → C5
const ROLL_NOTES = (() => {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const out: string[] = [];
  for (let oct = 5; oct >= 3; oct--) {
    for (let i = 11; i >= 0; i--) {
      out.push(`${names[i]}${oct}`);
      if (`${names[i]}${oct}` === "C3") break;
    }
  }
  return out;
})();

const TYPE_ICON: Record<TrackType, typeof Drum> = {
  drums: Drum,
  synth: AudioWaveform,
  audio: Mic,
};

const EDITOR_TABS = ["Drum Pad", "Sequencer", "Synth", "Mixer", "Clip Editor"] as const;
type EditorTab = (typeof EDITOR_TABS)[number];

export default function SketchpadPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [selectedTrack, setSelectedTrack] = useState("drums");
  const [editorTab, setEditorTab] = useState<EditorTab>("Sequencer");
  const [hydrated, setHydrated] = useState(false);

  // transport
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [loop, setLoop] = useState(true);
  const [metro, setMetro] = useState(true);
  const [master, setMaster] = useState(0.9);
  const [step, setStep] = useState(-1);
  const [toast, setToast] = useState<string | null>(null);

  const stepRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playAudiosRef = useRef<HTMLAudioElement[]>([]);
  const mrRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recTrackRef = useRef<string | null>(null);
  const recStartRef = useRef(0);

  const project = projects.find((p) => p.id === activeId) ?? projects[0] ?? null;

  // load / hydrate
  useEffect(() => {
    preloadDrums();
    const loaded = loadList<Project>(KEY);
    if (loaded.length > 0) {
      setProjects(loaded);
      setActiveId(loaded[0].id);
    } else {
      const p = newProject();
      setProjects([p]);
      setActiveId(p.id);
      saveList(KEY, [p]);
    }
    setHydrated(true);
  }, []);

  // autosave
  const firstRun = useRef(true);
  useEffect(() => {
    if (!hydrated) return;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    saveList(KEY, projects);
  }, [projects, hydrated]);

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 1800);
  };

  const updateProject = useCallback(
    (updater: (p: Project) => Project) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === activeId ? { ...updater(p), updatedAt: nowISO() } : p))
      );
    },
    [activeId]
  );

  const updateTrack = (trackId: string, patch: Partial<Track>) =>
    updateProject((p) => ({
      ...p,
      tracks: p.tracks.map((t) => (t.id === trackId ? { ...t, ...patch } : t)),
    }));

  const addClip = (trackId: string, clip: Clip) =>
    updateProject((p) => ({
      ...p,
      tracks: p.tracks.map((t) =>
        t.id === trackId ? { ...t, clips: [...t.clips, clip] } : t
      ),
    }));

  const removeClip = (trackId: string, clipId: string) =>
    updateProject((p) => ({
      ...p,
      tracks: p.tracks.map((t) =>
        t.id === trackId ? { ...t, clips: t.clips.filter((c) => c.id !== clipId) } : t
      ),
    }));

  /* --------------------------- transport ------------------------------- */

  const anySolo = project?.tracks.some((t) => t.solo) ?? false;
  const audible = (t: Track) => (anySolo ? t.solo : !t.muted);

  const tick = useCallback(() => {
    if (!project) return;
    const s = stepRef.current;
    setStep(s);
    if (metro && s % 4 === 0) metronomeClick(s === 0, 0.4 * master);

    project.tracks.forEach((t) => {
      if (!audible(t)) return;
      t.clips.forEach((clip) => {
        if (clip.type === "drum-pattern" && clip.steps) {
          DRUMS.forEach((d) => {
            if (clip.steps?.[d.id]?.[s]) playDrum(d.id, t.volume * master);
          });
        }
        if (clip.type === "synth-pattern" && clip.notes) {
          clip.notes
            .filter((n) => n.step === s)
            .forEach((n) =>
              playSynthNote(n.note, { ...DEFAULT_SYNTH, volume: DEFAULT_SYNTH.volume * t.volume * master })
            );
        }
      });
    });

    stepRef.current = (s + 1) % STEPS;
    if (stepRef.current === 0 && !loop) stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, metro, master, loop, anySolo]);

  const startClock = useCallback(() => {
    if (!project) return;
    const interval = (60 / project.bpm / 4) * 1000;
    stepRef.current = 0;
    timerRef.current = setInterval(tick, interval);
  }, [project, tick]);

  const play = () => {
    if (!project || playing) return;
    setPlaying(true);
    startClock();
    // start audio clips from 0
    playAudiosRef.current = [];
    project.tracks.forEach((t) => {
      if (!audible(t)) return;
      t.clips.forEach((c) => {
        if (c.type === "audio" && c.dataUrl) {
          const a = new Audio(c.dataUrl);
          a.volume = Math.min(1, t.volume * master);
          void a.play();
          playAudiosRef.current.push(a);
        }
      });
    });
  };

  const stop = useCallback(() => {
    setPlaying(false);
    setStep(-1);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    playAudiosRef.current.forEach((a) => a.pause());
    playAudiosRef.current = [];
    if (recording) stopRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording]);

  const rewind = () => {
    stepRef.current = 0;
    setStep(playing ? 0 : -1);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  /* --------------------------- recording ------------------------------- */

  const startRecording = async () => {
    if (!project) return;
    let target = project.tracks.find((t) => t.type === "audio" && t.armed);
    if (!target) {
      const sel = project.tracks.find((t) => t.id === selectedTrack);
      if (sel?.type === "audio") {
        updateTrack(sel.id, { armed: true });
        target = sel;
      }
    }
    if (!target) {
      flash("Arm an audio track (4–8) to record.");
      return;
    }
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      flash("Recording isn't supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      recTrackRef.current = target.id;
      recStartRef.current = Date.now();
      mr.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const dur = (Date.now() - recStartRef.current) / 1000;
        const reader = new FileReader();
        reader.onload = () => {
          const tid = recTrackRef.current!;
          const clip: Clip = {
            id: uid(),
            trackId: tid,
            type: "audio",
            name: "Take",
            createdAt: nowISO(),
            startTime: 0,
            dataUrl: String(reader.result),
            duration: dur,
          };
          addClip(tid, clip);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      mrRef.current = mr;
      setRecording(true);
      if (!playing) play();
    } catch {
      flash("Microphone permission denied.");
    }
  };

  const stopRecording = () => {
    mrRef.current?.stop();
    mrRef.current = null;
    setRecording(false);
  };

  const toggleRecord = () => (recording ? stopRecording() : startRecording());

  if (!hydrated || !project) {
    return (
      <div>
        <PageHeader eyebrow="Create" title="Sketchpad" subtitle="Loading your studio…" />
      </div>
    );
  }

  const sel = project.tracks.find((t) => t.id === selectedTrack) ?? project.tracks[0];

  return (
    <div className="animate-page">
      <PageHeader
        eyebrow="Create"
        title="Sketchpad"
        subtitle="An 8-track idea recorder — capture a groove, two synth ideas, and five audio takes."
      />

      {toast && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber/30 bg-amber/10 px-4 py-2.5 text-sm text-ink">
          <AlertTriangle className="h-4 w-4 text-amber" />
          {toast}
        </div>
      )}

      {/* Transport */}
      <Transport
        project={project}
        playing={playing}
        recording={recording}
        loop={loop}
        metro={metro}
        master={master}
        onTitle={(title) => updateProject((p) => ({ ...p, title }))}
        onBpm={(bpm) => updateProject((p) => ({ ...p, bpm }))}
        onPlay={play}
        onStop={stop}
        onRewind={rewind}
        onLoop={() => setLoop((l) => !l)}
        onMetro={() => setMetro((m) => !m)}
        onMaster={setMaster}
        onRecord={toggleRecord}
        onSave={() => {
          saveList(KEY, projects);
          flash("Project saved");
        }}
        onNew={() => {
          const p = newProject(`Project ${projects.length + 1}`);
          setProjects((prev) => [p, ...prev]);
          setActiveId(p.id);
        }}
        projects={projects}
        onSwitch={setActiveId}
        activeId={activeId}
      />

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Timeline */}
        <div className="overflow-x-auto rounded-xl2 border border-white/10 bg-surface">
          <div className="min-w-[680px]">
            {/* ruler */}
            <div className="flex border-b border-white/10">
              <div className="w-[258px] shrink-0 border-r border-white/10 px-3 py-2">
                <span className="label-caps">Tracks</span>
              </div>
              <div className="beat-grid flex-1 px-0 py-2">
                <div className="flex">
                  {Array.from({ length: 4 }).map((_, b) => (
                    <span key={b} className="flex-1 pl-2 text-xs text-faint">
                      {b + 1}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {project.tracks.map((t) => (
              <TrackRow
                key={t.id}
                track={t}
                selected={t.id === selectedTrack}
                step={step}
                onSelect={() => {
                  setSelectedTrack(t.id);
                  setEditorTab(t.type === "drums" ? "Sequencer" : t.type === "synth" ? "Synth" : "Clip Editor");
                }}
                onPatch={(patch) => updateTrack(t.id, patch)}
              />
            ))}
          </div>
        </div>

        {/* Idea Vault */}
        <IdeaVault
          project={project}
          onRemoveClip={removeClip}
          onRenameClip={(tid, cid, name) =>
            updateProject((p) => ({
              ...p,
              tracks: p.tracks.map((t) =>
                t.id === tid ? { ...t, clips: t.clips.map((c) => (c.id === cid ? { ...c, name } : c)) } : t
              ),
            }))
          }
          onFavClip={(tid, cid) =>
            updateProject((p) => ({
              ...p,
              tracks: p.tracks.map((t) =>
                t.id === tid
                  ? { ...t, clips: t.clips.map((c) => (c.id === cid ? { ...c, favorite: !c.favorite } : c)) }
                  : t
              ),
            }))
          }
        />
      </div>

      {/* Editor */}
      <div className="mt-4 rounded-xl2 border border-white/10 bg-surface p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          {EDITOR_TABS.map((tb) => (
            <button
              key={tb}
              onClick={() => setEditorTab(tb)}
              className={`rounded-lg border px-3.5 py-1.5 text-sm transition-colors ${
                editorTab === tb
                  ? "border-brass bg-brass/15 text-ink"
                  : "border-white/10 bg-white/[0.04] text-muted hover:text-ink"
              }`}
            >
              {tb}
            </button>
          ))}
        </div>

        {editorTab === "Drum Pad" && <DrumPadPanel master={master} />}
        {editorTab === "Sequencer" && (
          <DrumSequencer
            onSave={(steps) =>
              addClip("drums", {
                id: uid(),
                trackId: "drums",
                type: "drum-pattern",
                name: "Drum pattern",
                createdAt: nowISO(),
                startTime: 0,
                steps,
              })
            }
            bpm={project.bpm}
            master={master}
          />
        )}
        {editorTab === "Synth" && (
          <SynthEditor
            targetTrack={sel.type === "synth" ? sel.id : "synth1"}
            bpm={project.bpm}
            master={master}
            onSave={(notes, settings, trackId) =>
              addClip(trackId, {
                id: uid(),
                trackId,
                type: "synth-pattern",
                name: "Synth pattern",
                createdAt: nowISO(),
                startTime: 0,
                notes,
                instrumentSettings: settings ?? undefined,
              })
            }
          />
        )}
        {editorTab === "Mixer" && (
          <MixerStrip tracks={project.tracks} onPatch={updateTrack} />
        )}
        {editorTab === "Clip Editor" && (
          <ClipEditor
            track={sel}
            onRemove={(cid) => removeClip(sel.id, cid)}
            onRename={(cid, name) =>
              updateProject((p) => ({
                ...p,
                tracks: p.tracks.map((t) =>
                  t.id === sel.id ? { ...t, clips: t.clips.map((c) => (c.id === cid ? { ...c, name } : c)) } : t
                ),
              }))
            }
          />
        )}
      </div>

      {/* Status bar */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-studio2 px-4 py-2 text-xs text-faint">
        <span>{project.title}</span>
        <span>
          {project.bpm} BPM · {playing ? `Step ${step + 1}/${STEPS}` : "Stopped"} ·{" "}
          {project.tracks.reduce((a, t) => a + t.clips.length, 0)} clips
        </span>
      </div>
    </div>
  );
}

/* ------------------------------ Transport ------------------------------- */

function Transport(props: {
  project: Project;
  playing: boolean;
  recording: boolean;
  loop: boolean;
  metro: boolean;
  master: number;
  onTitle: (v: string) => void;
  onBpm: (v: number) => void;
  onPlay: () => void;
  onStop: () => void;
  onRewind: () => void;
  onLoop: () => void;
  onMetro: () => void;
  onMaster: (v: number) => void;
  onRecord: () => void;
  onSave: () => void;
  onNew: () => void;
  projects: Project[];
  onSwitch: (id: string) => void;
  activeId: string;
}) {
  const p = props.project;
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl2 border border-white/10 bg-surface px-4 py-3">
      <input
        value={p.title}
        onChange={(e) => props.onTitle(e.target.value)}
        className="w-40 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-ink outline-none focus:border-brass/50"
      />
      <div className="flex items-center gap-1">
        <TBtn label="Rewind" onClick={props.onRewind}><Rewind className="h-4 w-4" /></TBtn>
        <button
          onClick={props.onPlay}
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            props.playing ? "bg-brass text-charcoal" : "bg-brass text-charcoal hover:brightness-105"
          }`}
        >
          <Play className="h-5 w-5" />
        </button>
        <TBtn label="Stop" onClick={props.onStop}><Square className="h-4 w-4" /></TBtn>
        <button
          onClick={props.onRecord}
          title="Record (arm an audio track first)"
          className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
            props.recording ? "animate-pulse bg-[#D94A44] text-ivory" : "bg-[#D94A44]/90 text-ivory hover:bg-[#D94A44]"
          }`}
        >
          <Circle className="h-4 w-4 fill-current" />
        </button>
      </div>

      <ToggleBtn active={props.loop} onClick={props.onLoop} label="Loop"><Repeat className="h-4 w-4" /></ToggleBtn>
      <ToggleBtn active={props.metro} onClick={props.onMetro} label="Metronome">
        <span className="text-sm font-semibold">M</span>
      </ToggleBtn>

      <label className="flex items-center gap-2 text-xs text-muted">
        <span className="label-caps">BPM</span>
        <input
          type="number"
          min={40}
          max={220}
          value={p.bpm}
          onChange={(e) => props.onBpm(Math.min(220, Math.max(40, Number(e.target.value) || 120)))}
          className="w-16 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-ink outline-none focus:border-brass/50"
        />
      </label>

      <label className="flex items-center gap-2 text-xs text-muted">
        <Volume2 className="h-3.5 w-3.5 text-brass" />
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(props.master * 100)}
          onChange={(e) => props.onMaster(Number(e.target.value) / 100)}
          className="w-20 accent-[#D4AF37]"
        />
      </label>

      <div className="ml-auto flex items-center gap-2">
        <select
          value={props.activeId}
          onChange={(e) => props.onSwitch(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-xs text-ink outline-none"
        >
          {props.projects.map((pr) => (
            <option key={pr.id} value={pr.id}>{pr.title}</option>
          ))}
        </select>
        <TBtn label="Save" onClick={props.onSave}><Save className="h-4 w-4" /></TBtn>
        <TBtn label="New Project" onClick={props.onNew}><Plus className="h-4 w-4" /></TBtn>
      </div>
    </div>
  );
}

function TBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} title={label} aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white/10 hover:text-ink">
      {children}
    </button>
  );
}
function ToggleBtn({ active, onClick, label, children }: { active: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} title={label} className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${active ? "bg-brass/20 text-brass" : "text-muted hover:bg-white/10 hover:text-ink"}`}>
      {children}
    </button>
  );
}

/* ------------------------------ Track row ------------------------------- */

function TrackRow({
  track,
  selected,
  step,
  onSelect,
  onPatch,
}: {
  track: Track;
  selected: boolean;
  step: number;
  onSelect: () => void;
  onPatch: (patch: Partial<Track>) => void;
}) {
  const Icon = TYPE_ICON[track.type];
  const clipColor =
    track.type === "drums" ? "bg-brass/30 border-brass/50" : track.type === "synth" ? "bg-[#A855F7]/30 border-[#A855F7]/50" : "bg-[#4B8DFF]/30 border-[#4B8DFF]/50";
  return (
    <div className={`flex h-16 border-b border-white/[0.06] ${selected ? "bg-white/[0.03]" : ""}`}>
      {/* controls */}
      <button onClick={onSelect} className="flex w-[258px] shrink-0 items-center gap-2 border-r border-white/10 px-3 text-left">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-brass/20 text-brass" : "bg-white/[0.05] text-muted"}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-ink">{track.name}</p>
          <div className="mt-1 flex items-center gap-1">
            <Pill on={track.armed} color="#D94A44" onClick={(e) => { e.stopPropagation(); onPatch({ armed: !track.armed }); }}>R</Pill>
            <Pill on={track.muted} color="#A8A8A8" onClick={(e) => { e.stopPropagation(); onPatch({ muted: !track.muted }); }}>M</Pill>
            <Pill on={track.solo} color="#D4AF37" onClick={(e) => { e.stopPropagation(); onPatch({ solo: !track.solo }); }}>S</Pill>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(track.volume * 100)}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onPatch({ volume: Number(e.target.value) / 100 })}
              className="ml-1 w-14 accent-[#D4AF37]"
            />
            <Knob value={track.pan} onClick={(e) => { e.stopPropagation(); onPatch({ pan: track.pan === 0 ? -40 : track.pan < 0 ? 40 : 0 }); }} />
          </div>
        </div>
      </button>

      {/* lane */}
      <div className="lane-grid relative flex-1">
        {track.clips.map((c, i) => (
          <div
            key={c.id}
            className={`absolute top-2 bottom-2 rounded-md border ${clipColor} px-2 py-1 text-[10px] text-ink shadow-[0_0_12px_rgba(212,175,55,0.15)]`}
            style={{ left: `${2 + i * 26}%`, width: "24%" }}
          >
            <span className="truncate">{c.name}</span>
          </div>
        ))}
        {step >= 0 && (
          <div
            className="pointer-events-none absolute top-0 bottom-0 w-[2px] bg-brass"
            style={{ left: `${(step / STEPS) * 100}%` }}
          >
            <span className="absolute -top-0 -left-[4px] h-0 w-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-brass" />
          </div>
        )}
      </div>
    </div>
  );
}

function Pill({ on, color, onClick, children }: { on: boolean; color: string; onClick: (e: React.MouseEvent) => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold transition-colors"
      style={on ? { background: color, color: "#0D0D0D" } : { background: "rgba(255,255,255,0.06)", color: "#A8A8A8" }}
    >
      {children}
    </button>
  );
}

function Knob({ value, onClick }: { value: number; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button onClick={onClick} title="Pan" className="relative ml-1 h-6 w-6 shrink-0 rounded-full border border-white/15 bg-studio2">
      <span
        className="absolute left-1/2 top-0.5 h-2 w-[2px] -translate-x-1/2 rounded-full bg-brass"
        style={{ transformOrigin: "50% 11px", transform: `rotate(${value * 2.4}deg)` }}
      />
    </button>
  );
}

/* ----------------------------- Drum Pad --------------------------------- */

function DrumPadPanel({ master }: { master: number }) {
  const [active, setActive] = useState<string | null>(null);
  const hit = useCallback(
    (id: string) => {
      playDrum(id, master);
      setActive(id);
      setTimeout(() => setActive((a) => (a === id ? null : a)), 130);
    },
    [master]
  );
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const d = DRUMS.find((x) => x.key === e.key.toLowerCase());
      if (d) hit(d.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hit]);

  return (
    <div className="grid grid-cols-4 gap-3">
      {DRUMS.map((d) => (
        <button
          key={d.id}
          onMouseDown={() => hit(d.id)}
          className={`relative aspect-square rounded-xl2 border text-sm font-medium transition-all ${
            active === d.id
              ? "pad-press border-brass bg-brass/30 text-ink shadow-[0_0_22px_rgba(212,175,55,0.4)]"
              : "border-white/[0.12] bg-white/[0.04] text-muted hover:border-brass/40 hover:text-ink"
          }`}
        >
          {d.label}
          <span className="absolute right-2 top-2 rounded bg-white/5 px-1 text-[9px] uppercase text-faint">{d.key}</span>
        </button>
      ))}
    </div>
  );
}

/* --------------------------- Drum Sequencer ----------------------------- */

function emptySteps(): Record<string, boolean[]> {
  return Object.fromEntries(DRUMS.map((d) => [d.id, Array(STEPS).fill(false)]));
}

function DrumSequencer({
  onSave,
  bpm,
  master,
}: {
  onSave: (steps: Record<string, boolean[]>) => void;
  bpm: number;
  master: number;
}) {
  const [grid, setGrid] = useState<Record<string, boolean[]>>(emptySteps);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(-1);
  const gridRef = useRef(grid);
  gridRef.current = grid;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const sRef = useRef(0);

  const toggle = (id: string, i: number) =>
    setGrid((g) => {
      const next = { ...g, [id]: [...g[id]] };
      next[id][i] = !next[id][i];
      if (next[id][i]) playDrum(id, master);
      return next;
    });

  const start = () => {
    if (playing) {
      setPlaying(false);
      if (timer.current) clearInterval(timer.current);
      setCur(-1);
      return;
    }
    setPlaying(true);
    sRef.current = 0;
    timer.current = setInterval(() => {
      const s = sRef.current;
      setCur(s);
      DRUMS.forEach((d) => gridRef.current[d.id][s] && playDrum(d.id, master));
      sRef.current = (s + 1) % STEPS;
    }, (60 / bpm / 4) * 1000);
  };

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="min-w-[640px] space-y-1">
          {DRUMS.map((d) => (
            <div key={d.id} className="flex items-center gap-1">
              <span className="w-16 shrink-0 text-right text-[11px] text-muted">{d.label}</span>
              <div className="flex flex-1 gap-1">
                {grid[d.id].map((on, i) => (
                  <button
                    key={i}
                    onClick={() => toggle(d.id, i)}
                    className={`h-7 flex-1 rounded-sm border transition-colors ${
                      on ? "border-brass bg-brass" : i % 4 === 0 ? "border-white/10 bg-white/[0.06]" : "border-white/[0.06] bg-white/[0.02]"
                    } ${cur === i ? "ring-1 ring-brass/70" : ""}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={start} className="btn-ghost">
          {playing ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? "Stop" : "Preview"}
        </button>
        <button onClick={() => onSave(grid)} className="btn-brass">
          <Save className="h-4 w-4" /> Save to Drums Track
        </button>
        <button onClick={() => setGrid(emptySteps())} className="btn-ghost">Clear</button>
      </div>
    </div>
  );
}

/* ----------------------------- Synth Editor ----------------------------- */

function SynthEditor({
  targetTrack,
  bpm,
  master,
  onSave,
}: {
  targetTrack: string;
  bpm: number;
  master: number;
  onSave: (notes: { note: string; step: number; length: number }[], settings: SynthSettings | null, trackId: string) => void;
}) {
  const [settings, setSettings] = useState<SynthSettings>(DEFAULT_SYNTH);
  const [cells, setCells] = useState<Set<string>>(new Set());
  const [cur, setCur] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const cellsRef = useRef(cells);
  cellsRef.current = cells;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const sRef = useRef(0);

  const key = (n: string, s: number) => `${n}:${s}`;
  const toggle = (n: string, s: number) =>
    setCells((c) => {
      const next = new Set(c);
      const k = key(n, s);
      if (next.has(k)) next.delete(k);
      else {
        next.add(k);
        playSynthNote(n, { ...settings, volume: settings.volume * master });
      }
      return next;
    });

  const start = () => {
    if (playing) {
      setPlaying(false);
      if (timer.current) clearInterval(timer.current);
      setCur(-1);
      return;
    }
    setPlaying(true);
    sRef.current = 0;
    timer.current = setInterval(() => {
      const s = sRef.current;
      setCur(s);
      ROLL_NOTES.forEach((n) => {
        if (cellsRef.current.has(key(n, s))) playSynthNote(n, { ...settings, volume: settings.volume * master });
      });
      sRef.current = (s + 1) % STEPS;
    }, (60 / bpm / 4) * 1000);
  };
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const save = () => {
    const notes = Array.from(cells).map((k) => {
      const [note, s] = k.split(":");
      return { note, step: Number(s), length: 1 };
    });
    if (notes.length === 0) return;
    onSave(notes, settings, targetTrack);
    setCells(new Set());
  };

  return (
    <div>
      <div className="mb-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <SynthControl label="Wave">
          <select
            value={settings.waveform}
            onChange={(e) => setSettings((s) => ({ ...s, waveform: e.target.value as Wave }))}
            className="input py-1.5 text-xs"
          >
            {["sine", "square", "sawtooth", "triangle"].map((w) => <option key={w}>{w}</option>)}
          </select>
        </SynthControl>
        <Range label="Octave" value={settings.octave} min={-2} max={2} onChange={(v) => setSettings((s) => ({ ...s, octave: v }))} />
        <Range label="Cutoff" value={settings.cutoff} min={200} max={8000} step={50} onChange={(v) => setSettings((s) => ({ ...s, cutoff: v }))} />
        <Range label="Attack" value={settings.attack} min={0} max={1} step={0.01} onChange={(v) => setSettings((s) => ({ ...s, attack: v }))} />
        <Range label="Release" value={settings.release} min={0.05} max={2} step={0.05} onChange={(v) => setSettings((s) => ({ ...s, release: v }))} />
        <Range label="Volume" value={Math.round(settings.volume * 100)} min={0} max={100} onChange={(v) => setSettings((s) => ({ ...s, volume: v / 100 }))} />
      </div>

      <div className="max-h-[300px] overflow-auto rounded-lg border border-white/10">
        <div className="min-w-[640px]">
          {ROLL_NOTES.map((n) => (
            <div key={n} className={`flex items-center gap-1 ${n.includes("#") ? "bg-white/[0.02]" : ""}`}>
              <span className="w-12 shrink-0 py-1 pl-2 text-[10px] text-faint">{n}</span>
              <div className="flex flex-1 gap-px py-0.5 pr-1">
                {Array.from({ length: STEPS }).map((_, s) => {
                  const on = cells.has(key(n, s));
                  return (
                    <button
                      key={s}
                      onClick={() => toggle(n, s)}
                      className={`h-4 flex-1 rounded-[2px] transition-colors ${
                        on ? "bg-[#A855F7]" : s % 4 === 0 ? "bg-white/[0.06]" : "bg-white/[0.02]"
                      } ${cur === s ? "ring-1 ring-brass/60" : ""}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={start} className="btn-ghost">
          {playing ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? "Stop" : "Preview"}
        </button>
        <button onClick={save} className="btn-brass">
          <Save className="h-4 w-4" /> Save to {targetTrack === "synth2" ? "Synth 2" : "Synth 1"}
        </button>
        <button onClick={() => setCells(new Set())} className="btn-ghost">Clear</button>
      </div>
    </div>
  );
}

function SynthControl({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label-caps mb-1 block">{label}</span>
      {children}
    </label>
  );
}
function Range({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="label-caps mb-1 flex items-center justify-between">
        {label} <span className="text-brass">{value}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[#D4AF37]" />
    </label>
  );
}

/* ------------------------------- Mixer ---------------------------------- */

function MixerStrip({ tracks, onPatch }: { tracks: Track[]; onPatch: (id: string, patch: Partial<Track>) => void }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {tracks.map((t) => (
        <div key={t.id} className="flex w-[80px] shrink-0 flex-col items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3">
          <span className="truncate text-xs text-ink">{t.name}</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(t.volume * 100)}
            onChange={(e) => onPatch(t.id, { volume: Number(e.target.value) / 100 })}
            className="h-32 accent-[#D4AF37]"
            style={{ writingMode: "vertical-lr", direction: "rtl", width: 18 }}
          />
          <div className="flex gap-1">
            <Pill on={t.muted} color="#A8A8A8" onClick={() => onPatch(t.id, { muted: !t.muted })}>M</Pill>
            <Pill on={t.solo} color="#D4AF37" onClick={() => onPatch(t.id, { solo: !t.solo })}>S</Pill>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------- Clip Editor ------------------------------ */

function ClipEditor({ track, onRemove, onRename }: { track: Track; onRemove: (cid: string) => void; onRename: (cid: string, name: string) => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  return (
    <div>
      <p className="label-caps mb-3">{track.name} — Clips</p>
      {track.clips.length === 0 ? (
        <p className="text-sm text-muted">
          {track.type === "audio"
            ? "Arm this track (R) and press Record to capture a take."
            : "No clips yet. Use the editor above and save to this track."}
        </p>
      ) : (
        <div className="space-y-2">
          {track.clips.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-2">
                {c.type === "audio" && c.dataUrl && (
                  <button
                    onClick={() => {
                      if (!audioRef.current) return;
                      audioRef.current.src = c.dataUrl!;
                      void audioRef.current.play();
                    }}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brass/15 text-brass"
                  >
                    <Play className="h-3.5 w-3.5" />
                  </button>
                )}
                <span className="truncate text-sm text-ink">
                  {c.name}{" "}
                  <span className="text-xs text-muted">
                    ({c.type === "audio" ? `${(c.duration ?? 0).toFixed(1)}s` : c.type.replace("-", " ")})
                  </span>
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <IB onClick={() => { const n = window.prompt("Rename clip", c.name); if (n) onRename(c.id, n); }}><Pencil className="h-3.5 w-3.5" /></IB>
                <IB onClick={() => onRemove(c.id)}><Trash2 className="h-3.5 w-3.5" /></IB>
              </div>
            </div>
          ))}
        </div>
      )}
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}

function IB({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className="p-1 text-muted transition-colors hover:text-ink">{children}</button>;
}

/* ----------------------------- Idea Vault ------------------------------- */

function IdeaVault({
  project,
  onRemoveClip,
  onRenameClip,
  onFavClip,
}: {
  project: Project;
  onRemoveClip: (tid: string, cid: string) => void;
  onRenameClip: (tid: string, cid: string, name: string) => void;
  onFavClip: (tid: string, cid: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"All" | "Clips" | "Patterns" | "Projects">("All");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const all = project.tracks.flatMap((t) => t.clips.map((c) => ({ ...c, trackName: t.name })));
  const filtered = all.filter((c) => {
    if (query && !c.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (tab === "Clips") return c.type === "audio";
    if (tab === "Patterns") return c.type !== "audio";
    if (tab === "Projects") return false;
    return true;
  });

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside className="rounded-xl2 border border-white/10 bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="font-semibold text-ink">Idea Vault</p>
        <button onClick={exportJson} title="Export JSON" className="text-muted hover:text-ink">
          <Download className="h-4 w-4" />
        </button>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ideas…"
          className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2 pl-9 pr-3 text-sm text-ink outline-none focus:border-brass/50"
        />
      </div>

      <div className="mb-3 rounded-lg border border-brass/25 bg-brass/[0.06] p-3">
        <p className="label-caps text-brass">Current Project</p>
        <p className="truncate text-sm text-ink">{project.title}</p>
        <p className="text-xs text-muted">{all.length} ideas · {project.bpm} BPM</p>
      </div>

      <div className="mb-3 flex gap-1">
        {(["All", "Clips", "Patterns", "Projects"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs transition-colors ${
              tab === t ? "bg-white/10 text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Projects" ? (
        <p className="py-6 text-center text-sm text-muted">Switch projects from the transport bar.</p>
      ) : filtered.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted">No ideas yet. Record or sequence something.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <div key={c.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-2.5">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    if (c.type === "audio" && c.dataUrl && audioRef.current) {
                      audioRef.current.src = c.dataUrl;
                      void audioRef.current.play();
                    }
                  }}
                  className="min-w-0 text-left"
                >
                  <span className="block truncate text-sm text-ink">{c.name}</span>
                  <span className="block text-xs text-muted">{c.trackName}</span>
                </button>
                <div className="flex shrink-0 items-center gap-0.5">
                  <IB onClick={() => onFavClip(c.trackId, c.id)}>
                    <Star className={`h-3.5 w-3.5 ${c.favorite ? "fill-brass text-brass" : ""}`} />
                  </IB>
                  <IB onClick={() => { const n = window.prompt("Rename", c.name); if (n) onRenameClip(c.trackId, c.id, n); }}>
                    <Pencil className="h-3.5 w-3.5" />
                  </IB>
                  <IB onClick={() => onRemoveClip(c.trackId, c.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </IB>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <audio ref={audioRef} className="hidden" />
    </aside>
  );
}
