"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Save,
  Copy,
  Download,
  Check,
  PenLine,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Tabs } from "@/components/Tabs";
import {
  blankProject,
  loadActiveId,
  loadProjects,
  projectToMarkdown,
  saveActiveId,
  saveProjects,
  type LyricSections,
  type WriterProject,
} from "@/lib/writerTools";
import { LyricsTab } from "@/components/writer/LyricsTab";
import { ThemesTab } from "@/components/writer/ThemesTab";
import { ThesaurusTab } from "@/components/writer/ThesaurusTab";
import { CreativeSpinTab } from "@/components/writer/CreativeSpinTab";
import { RhymesTab } from "@/components/writer/RhymesTab";
import { MelodyTab } from "@/components/writer/MelodyTab";
import { ChordsTab } from "@/components/writer/ChordsTab";
import { NotesTab } from "@/components/writer/NotesTab";

const TABS = [
  "Lyrics",
  "Themes",
  "Thesaurus",
  "Creative Spin",
  "Rhymes",
  "Melody",
  "Chords",
  "Notes",
];

export default function WritersRoomPage() {
  const [projects, setProjects] = useState<WriterProject[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [hydrated, setHydrated] = useState(false);
  const [activeField, setActiveField] = useState<keyof LyricSections>("chorus");
  const [savedFlash, setSavedFlash] = useState(false);
  const firstRun = useRef(true);

  // Load from localStorage on mount.
  useEffect(() => {
    const loaded = loadProjects();
    setProjects(loaded);
    setActiveId(loadActiveId(loaded[0].id));
    setHydrated(true);
  }, []);

  // Autosave whenever projects change (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    saveProjects(projects);
  }, [projects, hydrated]);

  useEffect(() => {
    if (hydrated && activeId) saveActiveId(activeId);
  }, [activeId, hydrated]);

  const active = useMemo(
    () => projects.find((p) => p.id === activeId) ?? projects[0],
    [projects, activeId]
  );

  const setProject = (updater: (p: WriterProject) => WriterProject) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeId ? { ...updater(p), updatedAt: Date.now() } : p
      )
    );
  };

  const newProject = () => {
    const np = blankProject(`Untitled ${projects.length + 1}`);
    setProjects((prev) => [...prev, np]);
    setActiveId(np.id);
  };

  const duplicateProject = () => {
    if (!active) return;
    const copy: WriterProject = {
      ...structuredClone(active),
      id: Math.random().toString(36).slice(2, 10),
      name: `${active.name} (copy)`,
      updatedAt: Date.now(),
    };
    setProjects((prev) => [...prev, copy]);
    setActiveId(copy.id);
  };

  const saveNow = () => {
    saveProjects(projects);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  };

  const exportNotes = () => {
    if (!active) return;
    const md = projectToMarkdown(active);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(active.lyrics.title || active.name).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!hydrated || !active) {
    return (
      <div>
        <PageHeader
          eyebrow="Writer's Room"
          title="Songwriting Studio"
          subtitle="Loading your projects…"
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="Writer's Room"
        title="Songwriting Studio"
        subtitle="A complete ideation instrument — themes, thesaurus, creative spin, rhymes, melody, chords, and lyrics in one place."
        action={
          <div className="flex flex-wrap gap-2">
            <button onClick={newProject} className="btn-ghost">
              <Plus className="h-4 w-4" />
              New Project
            </button>
            <button onClick={saveNow} className="btn-primary">
              {savedFlash ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {savedFlash ? "Saved" : "Save Project"}
            </button>
            <button onClick={duplicateProject} className="btn-ghost">
              <Copy className="h-4 w-4" />
              Duplicate
            </button>
            <button onClick={exportNotes} className="btn-ghost">
              <Download className="h-4 w-4" />
              Export Notes
            </button>
          </div>
        }
      />

      {/* Project bar */}
      <Card className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-brass/30 bg-brass/10 text-brass">
            <PenLine className="h-5 w-5" />
          </span>
          <div>
            <p className="label-caps text-brass">Current Project</p>
            <input
              value={active.name}
              onChange={(e) =>
                setProject((p) => ({ ...p, name: e.target.value }))
              }
              className="w-full max-w-xs border-none bg-transparent font-serif text-2xl text-ink outline-none focus:underline"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="label-caps">Switch</span>
          <select
            value={activeId}
            onChange={(e) => setActiveId(e.target.value)}
            className="input max-w-[220px]"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <Card>
        <Tabs tabs={TABS}>
          {(tab) => (
            <>
              {tab === "Lyrics" && (
                <LyricsTab
                  project={active}
                  setProject={setProject}
                  activeField={activeField}
                  setActiveField={setActiveField}
                />
              )}
              {tab === "Themes" && <ThemesTab project={active} setProject={setProject} />}
              {tab === "Thesaurus" && (
                <ThesaurusTab project={active} setProject={setProject} />
              )}
              {tab === "Creative Spin" && (
                <CreativeSpinTab project={active} setProject={setProject} />
              )}
              {tab === "Rhymes" && (
                <RhymesTab
                  project={active}
                  setProject={setProject}
                  activeField={activeField}
                />
              )}
              {tab === "Melody" && <MelodyTab project={active} setProject={setProject} />}
              {tab === "Chords" && <ChordsTab project={active} setProject={setProject} />}
              {tab === "Notes" && <NotesTab project={active} setProject={setProject} />}
            </>
          )}
        </Tabs>
      </Card>
    </div>
  );
}
