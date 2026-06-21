"use client";

import { useState } from "react";
import { Shuffle, Repeat, Send, Check } from "lucide-react";
import { Card, SectionTitle } from "@/components/Card";
import { localCreativeSpin, loadProjects, saveProjects, loadActiveId } from "@/lib/writerTools";
import { KEYS, addItem, makeItem } from "@/lib/hitcampStore";

const PERSPECTIVES = ["Lover", "Ex", "Villain", "Future Self", "Younger Self"];

function shiftPerspective(idea: string, who: string): string {
  const base = idea.trim() || "this moment";
  switch (who) {
    case "Lover":
      return `As the lover: "${base}" — written in the heat of wanting, every detail glows.`;
    case "Ex":
      return `As the ex: "${base}" — the same scene, now sharpened by regret and distance.`;
    case "Villain":
      return `As the villain: "${base}" — reframed as a justification; they believe they're right.`;
    case "Future Self":
      return `As your future self: "${base}" — looking back with the calm of someone who survived it.`;
    case "Younger Self":
      return `As your younger self: "${base}" — naïve, hopeful, before the lesson was learned.`;
    default:
      return base;
  }
}

export function CreativityTools() {
  return (
    <div className="space-y-6">
      <CreativeSpin />
      <PerspectiveShifter />
    </div>
  );
}

function saveOutput(title: string, body: string) {
  addItem(KEYS.creativityOutputs, { ...makeItem({ type: "creativity", title }), notes: body });
}

function sendToWriters(body: string) {
  try {
    const projects = loadProjects();
    const activeId = loadActiveId(projects[0]?.id ?? "");
    const idx = Math.max(0, projects.findIndex((p) => p.id === activeId));
    if (projects[idx]) {
      projects[idx] = {
        ...projects[idx],
        notes: projects[idx].notes ? `${projects[idx].notes}\n\n${body}` : body,
        updatedAt: Date.now(),
        isExample: false,
      };
      saveProjects(projects);
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

function CreativeSpin() {
  const [a, setA] = useState("chair");
  const [b, setB] = useState("rose");
  const [emotion, setEmotion] = useState("love lost");
  const [out, setOut] = useState<ReturnType<typeof localCreativeSpin> | null>(null);
  const [flash, setFlash] = useState("");

  const spin = () => setOut(localCreativeSpin({ obj1: a, obj2: b, emotion, genre: "Pop" }));

  const doFlash = (m: string) => {
    setFlash(m);
    setTimeout(() => setFlash(""), 1500);
  };

  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <Shuffle className="h-4 w-4 text-brass" />
        <SectionTitle>Creative Spin</SectionTitle>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Input label="Object A" value={a} onChange={setA} />
        <Input label="Object B" value={b} onChange={setB} />
        <Input label="Emotion" value={emotion} onChange={setEmotion} />
      </div>
      <button onClick={spin} className="btn-brass mt-4">
        <Shuffle className="h-4 w-4" /> Spin Concept
      </button>

      {out && (
        <div className="mt-5 space-y-3">
          <div className="rounded-lg border border-brass/25 bg-brass/[0.06] p-4">
            <p className="label-caps mb-1 text-brass">Title</p>
            <p className="font-serif text-xl text-ink">{out.title}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {out.titleIdeas.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </div>
          <Block label="Concept" text={out.concept} />
          <Block label="Emotional Thesis" text={out.thesis} />
          <Block label="Chorus Angle" text={out.chorusAngle} />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                saveOutput(out.title, `${out.concept}\nThesis: ${out.thesis}`);
                doFlash("saved");
              }}
              className="btn-ghost"
            >
              {flash === "saved" ? <Check className="h-4 w-4" /> : null}
              Save Output
            </button>
            <button
              onClick={() => {
                sendToWriters(`Creative Spin — ${out.title}\n${out.concept}\nThesis: ${out.thesis}`);
                doFlash("sent");
              }}
              className="btn-ghost"
            >
              {flash === "sent" ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              Send to Writer&apos;s Room
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

function PerspectiveShifter() {
  const [idea, setIdea] = useState("");
  const [who, setWho] = useState(PERSPECTIVES[0]);
  const [out, setOut] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <Repeat className="h-4 w-4 text-brass" />
        <SectionTitle>Perspective Shifter</SectionTitle>
      </div>
      <Input label="Your idea" value={idea} onChange={setIdea} placeholder="A line, scene, or concept" />
      <p className="label-caps mb-2 mt-4">Rewrite from</p>
      <div className="flex flex-wrap gap-2">
        {PERSPECTIVES.map((p) => (
          <button
            key={p}
            onClick={() => setWho(p)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              who === p
                ? "border-brass bg-brass/15 text-ink"
                : "border-white/10 bg-white/[0.04] text-muted hover:text-ink"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <button onClick={() => setOut(shiftPerspective(idea, who))} className="btn-brass mt-4">
        <Repeat className="h-4 w-4" /> Shift Perspective
      </button>
      {out && (
        <div className="mt-4 space-y-3">
          <Block label={who} text={out} />
          <button
            onClick={() => {
              sendToWriters(out);
              setFlash(true);
              setTimeout(() => setFlash(false), 1500);
            }}
            className="btn-ghost"
          >
            {flash ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            Send to Writer&apos;s Room
          </button>
        </div>
      )}
    </Card>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="label-caps mb-1.5 block">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input" />
    </label>
  );
}

function Block({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <p className="label-caps mb-1">{label}</p>
      <p className="text-[15px] leading-relaxed text-ink">{text}</p>
    </div>
  );
}
