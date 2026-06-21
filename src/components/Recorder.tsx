"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square, Play, Pause, Trash2, Save, AlertTriangle } from "lucide-react";
import { KEYS, addItem, makeItem } from "@/lib/hitcampStore";

export interface SketchIdea {
  id: string;
  title: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  notes: string;
  dataUrl: string;
  duration: number;
  favorite: boolean;
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function Recorder({
  type,
  onSaved,
}: {
  type: string;
  onSaved: () => void;
}) {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [clipUrl, setClipUrl] = useState<string | null>(null);
  const [clipDur, setClipDur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const mrRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (clipUrl) URL.revokeObjectURL(clipUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = async () => {
    setError(null);
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Recording isn't supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        blobRef.current = blob;
        if (clipUrl) URL.revokeObjectURL(clipUrl);
        setClipUrl(URL.createObjectURL(blob));
        setClipDur(elapsed);
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      mrRef.current = mr;
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } catch {
      setError("Microphone permission was denied. Enable mic access to record.");
    }
  };

  const stop = () => {
    mrRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      void audioRef.current.play();
      setPlaying(true);
    }
  };

  const discard = () => {
    if (clipUrl) URL.revokeObjectURL(clipUrl);
    setClipUrl(null);
    blobRef.current = null;
    setClipDur(0);
    setTitle("");
  };

  const save = () => {
    const blob = blobRef.current;
    if (!blob) return;
    const reader = new FileReader();
    reader.onload = () => {
      const idea: SketchIdea = {
        ...makeItem({ type, title: title.trim() || `${type} idea` }),
        dataUrl: String(reader.result),
        duration: clipDur,
        favorite: false,
      };
      const ok = addItem(KEYS.sketchpadIdeas, idea);
      if (!ok) {
        setError("Saved, but the clip was too large to store locally.");
      }
      discard();
      onSaved();
    };
    reader.readAsDataURL(blob);
  };

  return (
    <div>
      {/* Waveform / status */}
      <div className="flex h-40 items-center justify-center gap-[3px] rounded-lg border border-white/10 bg-studio2 px-4">
        {Array.from({ length: 80 }).map((_, i) => (
          <span
            key={i}
            className={`w-[3px] rounded-full ${recording ? "bg-[#E08079]" : "bg-brass/30"}`}
            style={{
              height: `${10 + Math.abs(Math.sin(i * 0.4 + (recording ? Date.now() / 300 : 0))) * 80}%`,
            }}
          />
        ))}
      </div>

      {error && (
        <p className="mt-3 flex items-center gap-2 text-sm text-[#E08079]">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </p>
      )}

      {/* Transport */}
      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-charcoal p-4">
        {!recording ? (
          <button
            onClick={start}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C2453B] text-ivory transition-transform hover:scale-105"
          >
            <Mic className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={stop}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C2453B] text-ivory"
          >
            <Square className="h-5 w-5" />
          </button>
        )}

        {clipUrl && !recording && (
          <button
            onClick={togglePlay}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10"
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
        )}

        <span className="font-serif text-lg tabular-nums text-ivory">
          {fmt(recording ? elapsed : clipDur)}
        </span>

        {clipUrl && !recording && (
          <button onClick={discard} className="ml-auto flex items-center gap-1.5 text-sm text-muted hover:text-[#E08079]">
            <Trash2 className="h-4 w-4" /> Discard
          </button>
        )}
      </div>

      {clipUrl && (
        <audio ref={audioRef} src={clipUrl} onEnded={() => setPlaying(false)} className="hidden" />
      )}

      {/* Save */}
      {clipUrl && !recording && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`Name this ${type} idea…`}
            className="input flex-1"
          />
          <button onClick={save} className="btn-brass shrink-0">
            <Save className="h-4 w-4" />
            Save Idea
          </button>
        </div>
      )}

      <p className="mt-2 text-xs text-muted">
        Recordings are stored on this device (localStorage). Keep clips short.
      </p>
    </div>
  );
}
