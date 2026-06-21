// ---------------------------------------------------------------------------
// Drum kit audio. Tries to load samples from /public/audio/drums; if a file
// is missing it falls back to a synthesized hit via Web Audio, so the pads are
// always playable (no missing-asset crashes).
// ---------------------------------------------------------------------------

export interface DrumDef {
  id: string;
  label: string;
  key: string; // keyboard shortcut
  file: string;
}

export const DRUMS: DrumDef[] = [
  { id: "kick", label: "Kick", key: "a", file: "kick" },
  { id: "snare", label: "Snare", key: "s", file: "snare" },
  { id: "hat", label: "Hat", key: "d", file: "hat" },
  { id: "open-hat", label: "Open Hat", key: "f", file: "open-hat" },
  { id: "clap", label: "Clap", key: "z", file: "clap" },
  { id: "perc-1", label: "Perc 1", key: "x", file: "perc-1" },
  { id: "perc-2", label: "Perc 2", key: "c", file: "perc-2" },
  { id: "808", label: "808", key: "v", file: "808" },
];

let ctx: AudioContext | null = null;
const buffers: Record<string, AudioBuffer | null> = {};

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new Ctx();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

async function loadSample(def: DrumDef): Promise<void> {
  if (def.id in buffers) return;
  const c = getCtx();
  if (!c) return;
  for (const ext of ["wav", "mp3"]) {
    try {
      const res = await fetch(`/audio/drums/${def.file}.${ext}`);
      if (!res.ok) continue;
      const arr = await res.arrayBuffer();
      buffers[def.id] = await c.decodeAudioData(arr);
      return;
    } catch {
      /* try next ext / fall back to synth */
    }
  }
  buffers[def.id] = null; // mark "no sample → synth"
}

export function preloadDrums(): void {
  DRUMS.forEach((d) => void loadSample(d));
}

function synth(id: string, volume: number) {
  const c = getCtx();
  if (!c) return;
  const now = c.currentTime;
  const out = c.createGain();
  out.gain.value = volume;
  out.connect(c.destination);

  const noise = (dur: number, hp = 0, lp = 20000, vol = 1) => {
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const g = c.createGain();
    g.gain.setValueAtTime(vol, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    let node: AudioNode = src;
    if (hp) {
      const f = c.createBiquadFilter();
      f.type = "highpass";
      f.frequency.value = hp;
      node.connect(f);
      node = f;
    }
    if (lp < 20000) {
      const f = c.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = lp;
      node.connect(f);
      node = f;
    }
    node.connect(g);
    g.connect(out);
    src.start(now);
    src.stop(now + dur);
  };

  const tone = (freq: number, end: number, dur: number, type: OscillatorType = "sine") => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, end), now + dur);
    g.gain.setValueAtTime(1, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(g);
    g.connect(out);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  };

  switch (id) {
    case "kick":
      tone(150, 45, 0.4);
      break;
    case "808":
      tone(110, 50, 0.8, "sine");
      break;
    case "snare":
      tone(190, 120, 0.18, "triangle");
      noise(0.2, 1500, 20000, 0.7);
      break;
    case "clap":
      noise(0.18, 1200, 9000, 0.8);
      break;
    case "hat":
      noise(0.05, 7000, 20000, 0.5);
      break;
    case "open-hat":
      noise(0.3, 7000, 20000, 0.4);
      break;
    case "perc-1":
      tone(420, 180, 0.15, "square");
      break;
    case "perc-2":
      tone(620, 240, 0.15, "triangle");
      break;
    default:
      tone(300, 120, 0.2);
  }
}

export function playDrum(id: string, volume = 0.9): void {
  const c = getCtx();
  if (!c) return;
  const buf = buffers[id];
  if (buf) {
    const src = c.createBufferSource();
    const g = c.createGain();
    g.gain.value = volume;
    src.buffer = buf;
    src.connect(g);
    g.connect(c.destination);
    src.start();
  } else {
    synth(id, volume);
  }
}
