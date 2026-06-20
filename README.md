# Music School — A Private Conservatory

A premium music education web app for songwriters, producers, composers, vocalists, and serious students of music. Think **Juilliard + Berklee + Hit Songs Deconstructed + Notion + MasterClass** — a private conservatory in your browser.

Built with **Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS**. Vercel-ready and Supabase-ready, but runs entirely on local data so you can click through the full experience with zero configuration.

---

## Features

A warm, scholarly conservatory aesthetic across 14 fully interactive sections:

| Section | What it does |
| --- | --- |
| **Dashboard** | Daily mission control — continue learning, today's listening & writing assignments, progress. |
| **Theory Academy** | A premium textbook/course from notation through fugue, with an interactive piano keyboard and audio examples (Web Audio API). |
| **Ear Training** | 12-interval identification drills with random question generation, scoring, streak tracking, visual piano keyboard, and localStorage persistence. |
| **Listening Curriculum** | Guided listening with embedded YouTube, listening questions, and notes/analysis tabs. |
| **Hit Lab** | Paste a YouTube link → educational deconstruction with localStorage report history (structure, hook map, energy curve, harmony, melody, genome). |
| **Song Genome** | Score & compare songs with a radar chart, score bars, and similar songs. |
| **Hook Lab** | Hook strength training — generate ideas, save to localStorage, star-rate hooks, delete hooks. |
| **Writer's Room** | Notebook with Lyrics / Themes / Rhymes / Melody / Chords / Notes tabs. |
| **Rhyme Vault** | 8-word local rhyme dictionary (fire, love, night, pain, desire, heart, soul, danger) with perfect / near / multi-syllable / slant tabs. |
| **Composition Lab** | Functional 16-step × 8-note piano roll sequencer with Web Audio playback, BPM control, save/load exercises, and interactive piano keyboard. |
| **Song Vault** | Full CRUD — create, edit, delete songs with title, genre, status, scores (hook/melody/lyrics/arrangement), and lyrics/notes. Persisted to localStorage. |
| **Composer's Library** | Study the harmonic/melodic/arrangement signatures of the masters. |
| **AI Tutor** | A private mentor chat with 7 lesson contexts (Theory, Counterpoint, Hit Lab, Hook Lab, Songwriting, Composition, Ear Training), suggested prompts, session history, and OpenAI/Anthropic/mock fallback. |
| **Settings** | Profile, notifications, and integration status. |

---

## Local Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+

### Install & run

```bash
git clone <repo-url>
cd music-school
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app works fully without any environment variables using local mock data and the browser Web Audio API.

### Optional: Connect AI

Copy `.env.example` to `.env.local` and add at least one AI key:

```bash
cp .env.example .env.local
# then edit .env.local
```

If no key is set, the AI Tutor returns rich mock responses — the app never breaks without API keys.

---

## Vercel Deployment

1. Push your repository to GitHub/GitLab/Bitbucket.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Vercel detects Next.js automatically — no framework config needed.
4. Add any optional environment variables in the Vercel dashboard (Project → Settings → Environment Variables).
5. Deploy.

**No environment variables are required.** The app deploys and runs fully without them. API keys only unlock live AI responses in the AI Tutor.

---

## AI API Keys

| Variable | Provider | Notes |
| --- | --- | --- |
| `OPENAI_API_KEY` | OpenAI | Uses `gpt-4o-mini`. Set this for live AI Tutor responses. |
| `ANTHROPIC_API_KEY` | Anthropic | Uses `claude-3-5-sonnet-latest`. Fallback if OpenAI key is absent or fails. |

**Fallback order:** OpenAI → Anthropic → Mock responses.

The mock tutor returns pedagogically correct, music-school-toned responses covering theory, counterpoint, hooks, listening, and songwriting — suitable for demos.

---

## Data Persistence

This prototype uses **localStorage** (namespaced under `music-school:`) for:

| Key | Data |
| --- | --- |
| `ear-training` | Score, streak, total questions answered |
| `song-vault` | Full song catalog (CRUD) |
| `hook-lab` | Saved hook ideas with ratings |
| `hit-lab-reports` | Last 10 song analysis reports |
| `composition-lab` | Saved sequencer exercises |
| `tutor-session` | Last 40 messages of AI Tutor chat |

All data is stored client-side only. Clear browser data to reset.

---

## Audio Engine

The Web Audio API synthesises all sounds dynamically — no MP3 files required. The engine (`src/lib/audioEngine.ts`) supports:

- Single notes (triangle oscillator with ADSR envelope)
- Intervals (melodic or harmonic)
- Major / minor triads
- Dominant 7th, major 7th, minor 7th chords
- Authentic and plagal cadences
- Melodies (note sequence at a given BPM)
- Rhythm patterns (noise-burst clicks)

AudioContext is lazily initialised on first user gesture to comply with browser autoplay policies.

---

## Future: Supabase Connection

To replace localStorage with a real database:

1. Install: `npm install @supabase/supabase-js`
2. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
3. The `src/lib/supabase.ts` stub is ready for the client.
4. Replace `src/lib/storage.ts` calls with Supabase queries following the types in `src/lib/types.ts`.

Suggested tables mirror the TypeScript interfaces in `types.ts`: `songs`, `hooks`, `hit_lab_reports`, `ear_training_sessions`, `composition_exercises`, `chat_sessions`.

---

## Future: YouTube Data API

The Hit Lab currently uses mock deconstruction metadata. To upgrade to real metadata:

1. Enable the YouTube Data API v3 in Google Cloud Console.
2. Add `YOUTUBE_API_KEY` to environment variables.
3. In `src/lib/youtube.ts`, call `https://www.googleapis.com/youtube/v3/videos?id={videoId}&part=snippet,contentDetails&key={key}` to fetch real title, artist, duration, and thumbnail.
4. Pass real metadata to the deconstruction engine (or an AI service) for analysis.

**Important:** The Hit Lab never downloads or stores audio. It stores only the video ID, URL, timestamps, and educational analysis text.

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages + API
│   ├── api/tutor/        # AI Tutor API route (OpenAI → Anthropic → mock)
│   ├── ai-tutor/         # AI Tutor page with context selector
│   ├── composition-lab/  # Piano sequencer + keyboard
│   ├── ear-training/     # Interval identification drills
│   ├── hit-lab/          # YouTube song deconstructor
│   ├── hook-lab/         # Hook generation + localStorage
│   ├── rhyme-vault/      # Rhyming dictionary
│   ├── song-vault/       # Song CRUD with localStorage
│   ├── theory/           # Theory Academy + interactive piano
│   └── ...               # Other pages
├── components/           # Reusable UI components
│   ├── PianoKeyboard.tsx # Interactive piano (C3–C5, Web Audio)
│   ├── TutorChat.tsx     # AI chat with context + session history
│   └── ...
└── lib/
    ├── audioEngine.ts    # Web Audio API synthesis engine
    ├── storage.ts        # localStorage utilities (namespaced)
    ├── mockData.ts       # All demo data
    ├── types.ts          # TypeScript domain types
    └── ...
```

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3 + custom design tokens |
| Icons | lucide-react |
| Charts | recharts |
| Audio | Browser Web Audio API (no external library) |
| Data | localStorage (prototype) → Supabase (production) |
| AI | OpenAI gpt-4o-mini / Anthropic claude-3-5-sonnet / mock |

---

## Legal Notes

- **YouTube embeds** only — no audio download or storage.
- **Hit Lab** stores video ID, URL, timestamps, and educational text analysis only.
- **AI Tutor** is instructed never to reproduce full copyrighted lyrics or sheet music — thematic and structural commentary only.
- Rhyme data and hook ideas are locally generated — no third-party API calls.
