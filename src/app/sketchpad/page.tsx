"use client";

import { useEffect, useRef, useState } from "react";
import {
  Mic,
  Guitar,
  Piano,
  Grid3x3,
  StickyNote,
  Play,
  Pause,
  Trash2,
  Heart,
  Pencil,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { FadeIn } from "@/components/Motion";
import { Recorder, type SketchIdea } from "@/components/Recorder";
import { DrumPad } from "@/components/DrumPad";
import { KEYS, loadList, removeItem, updateItem } from "@/lib/hitcampStore";

const TABS = [
  { id: "voice", label: "Voice", icon: Mic },
  { id: "guitar", label: "Guitar", icon: Guitar },
  { id: "piano", label: "Piano", icon: Piano },
  { id: "beats", label: "Beats", icon: Grid3x3 },
  { id: "notes", label: "Notes", icon: StickyNote },
] as const;
type TabId = (typeof TABS)[number]["id"];

const NOTES_KEY = "hitcamp_sketchpad_notes";

export default function SketchpadPage() {
  const [tab, setTab] = useState<TabId>("voice");
  const [ideas, setIdeas] = useState<SketchIdea[]>([]);
  const [notes, setNotes] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const refresh = () => setIdeas(loadList<SketchIdea>(KEYS.sketchpadIdeas));

  useEffect(() => {
    refresh();
    if (typeof window !== "undefined") setNotes(window.localStorage.getItem(NOTES_KEY) ?? "");
  }, []);

  const play = (idea: SketchIdea) => {
    if (!audioRef.current) return;
    if (playingId === idea.id) {
      audioRef.current.pause();
      setPlayingId(null);
      return;
    }
    audioRef.current.src = idea.dataUrl;
    void audioRef.current.play();
    setPlayingId(idea.id);
  };

  const rename = (idea: SketchIdea) => {
    const name = window.prompt("Rename idea", idea.title);
    if (name && name.trim()) {
      updateItem<SketchIdea>(KEYS.sketchpadIdeas, idea.id, { title: name.trim() });
      refresh();
    }
  };

  const toggleFav = (idea: SketchIdea) => {
    updateItem<SketchIdea>(KEYS.sketchpadIdeas, idea.id, { favorite: !idea.favorite });
    refresh();
  };

  const del = (id: string) => {
    removeItem(KEYS.sketchpadIdeas, id);
    if (playingId === id) setPlayingId(null);
    refresh();
  };

  const isRecorder = tab === "voice" || tab === "guitar" || tab === "piano";
  const tabLabel = TABS.find((t) => t.id === tab)?.label ?? "";

  return (
    <div className="animate-page">
      <PageHeader
        eyebrow="Create"
        title="Sketchpad"
        subtitle="Capture ideas the moment they strike — record audio, play drums, and save everything to your vault."
      />

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
              <Recorder type={tab} onSaved={refresh} />
            </Card>
          )}

          {tab === "beats" && (
            <Card>
              <SectionTitle className="mb-4">Mini Drum Pad</SectionTitle>
              <DrumPad />
            </Card>
          )}

          {tab === "notes" && (
            <Card>
              <SectionTitle className="mb-4">Notes</SectionTitle>
              <textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  if (typeof window !== "undefined")
                    window.localStorage.setItem(NOTES_KEY, e.target.value);
                }}
                rows={12}
                placeholder="Lyric fragments, concepts, references — anything. Autosaves to this device."
                className="w-full resize-y rounded-lg border border-white/10 bg-white/[0.04] p-4 text-[15px] leading-relaxed text-ink outline-none placeholder:text-muted/60 focus:border-brass focus:ring-1 focus:ring-brass/30"
              />
            </Card>
          )}
        </FadeIn>

        <aside>
          <Card>
            <SectionTitle className="mb-3">Idea Vault</SectionTitle>
            {ideas.length === 0 ? (
              <p className="text-sm text-muted">
                No ideas yet. Record something and save it to build your vault.
              </p>
            ) : (
              <div className="space-y-2">
                {ideas.map((i) => (
                  <div
                    key={i.id}
                    className="rounded-lg border border-white/10 bg-white/[0.04] p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => play(i)}
                        className="flex min-w-0 items-center gap-2 text-left"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brass/15 text-brass">
                          {playingId === i.id ? (
                            <Pause className="h-3.5 w-3.5" />
                          ) : (
                            <Play className="h-3.5 w-3.5" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm text-ink">{i.title}</span>
                          <span className="block text-xs text-muted capitalize">{i.type}</span>
                        </span>
                      </button>
                      <div className="flex shrink-0 items-center gap-1">
                        <IconBtn onClick={() => toggleFav(i)} label="Favorite">
                          <Heart className={`h-3.5 w-3.5 ${i.favorite ? "fill-brass text-brass" : ""}`} />
                        </IconBtn>
                        <IconBtn onClick={() => rename(i)} label="Rename">
                          <Pencil className="h-3.5 w-3.5" />
                        </IconBtn>
                        <IconBtn onClick={() => del(i.id)} label="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </IconBtn>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </aside>
      </div>

      <audio ref={audioRef} onEnded={() => setPlayingId(null)} className="hidden" />
    </div>
  );
}

function IconBtn({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="p-1 text-muted transition-colors hover:text-ink"
    >
      {children}
    </button>
  );
}
