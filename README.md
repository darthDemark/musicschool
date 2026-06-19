# Music School — A Private Conservatory

A premium music education web app for songwriters, producers, composers, vocalists, and serious students of music. Think **Juilliard + Berklee + Hit Songs Deconstructed + Notion + MasterClass** — a private conservatory in your browser.

Built with **Next.js (App Router) · React · TypeScript · Tailwind CSS**. Vercel-ready and Supabase-ready, but runs entirely on local mock data so you can click through the full experience with zero configuration.

---

## Features

A warm, scholarly conservatory aesthetic across 14 sections:

| Section | What it does |
| --- | --- |
| **Dashboard** | Daily mission control — continue learning, today's listening & writing assignments, progress. |
| **Theory Academy** | A premium textbook/course from notation through fugue, with a full "Invertible Counterpoint" lesson. |
| **Ear Training** | Interactive interval/chord/cadence drills with a waveform visual and streaks. |
| **Listening Curriculum** | Guided listening with embedded YouTube, listening questions, and notes/analysis tabs. |
| **Hit Lab** | Paste a YouTube link → educational deconstruction (structure, hook map, energy curve, harmony, melody, genome). |
| **Song Genome** | Score & compare songs with a radar chart, score bars, and similar songs. |
| **Hook Lab** | Hook strength training — daily workout, hook builder, recent hooks with scores. |
| **Writer's Room** | Notebook with Lyrics / Themes / Rhymes / Melody / Chords / Notes tabs. |
| **Rhyme Vault** | Perfect / near / multisyllabic / slant rhymes with favorites. |
| **Composition Lab** | Counterpoint, fugue, reharmonization labs with notation editor & piano placeholders. |
| **Song Vault** | Store, filter, and score your own catalog. |
| **Composer's Library** | Study the harmonic/melodic/arrangement signatures of the masters. |
| **AI Tutor** | A private mentor chat with suggested prompts, lesson context, and progress panels. |
| **Settings** | Profile, notifications, and integration status. |

### Legal / product guarantees

This app **references** real songs for education but **never downloads, rips, or stores** copyrighted audio, full lyrics, full sheet music, or transcriptions. The Hit Lab stores only: the YouTube URL / video ID, public metadata, your notes, timestamps, and the educational analysis report. Videos are shown via the standard YouTube embed served by YouTube.

---

## 1. Install dependencies

```bash
npm install
```

Requires Node.js 18.18+ (Node 20+ recommended).

## 2. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app works fully with mock data — no env vars required.

Other scripts:

```bash
npm run build   # production build (must pass for Vercel)
npm run start   # serve the production build
npm run lint    # eslint
```

## 3. Add environment variables

Copy the example file and fill in only what you need:

```bash
cp .env.example .env.local
```

```env
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
YOUTUBE_API_KEY=
```

Every variable is optional. Missing keys never break the app — the relevant feature gracefully falls back to mock data.

## 4. Deploy to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import the project at [vercel.com/new](https://vercel.com/new). Vercel auto-detects Next.js.
3. (Optional) Add the environment variables above under **Project → Settings → Environment Variables**.
4. Deploy. The build (`npm run build`) succeeds with no env vars set.

## 5. Future: Supabase setup

The prototype uses `src/lib/mockData.ts`. To go live:

1. `npm install @supabase/supabase-js`
2. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
3. Enable the client in `src/lib/supabase.ts` (the `createClient` block is stubbed and commented).
4. Create the suggested tables and replace mock reads with queries:

```
users
lessons
lesson_progress
listening_assignments
hit_lab_reports
song_genomes
hook_entries
rhyme_entries
song_vault
composer_profiles
ai_tutor_sessions
```

The TypeScript types in `src/lib/types.ts` mirror these tables to make the swap straightforward.

## 6. Future: AI API setup

The AI Tutor talks to `POST /api/tutor` (`src/app/api/tutor/route.ts`). The route is ready for either provider:

- Set `OPENAI_API_KEY` to use OpenAI Chat Completions, **or**
- Set `ANTHROPIC_API_KEY` to use the Anthropic Messages API.

If neither key is present, the route returns rich, on-brand **mock** tutor responses (`src/lib/tutorMock.ts`) so the chat always works. A scholarly system prompt is already defined; the tutor is instructed to teach with real references but never reproduce full copyrighted lyrics or sheet music.

## 7. Future: YouTube Data API setup

Hit Lab parses a pasted YouTube link with `extractYouTubeId()` and embeds the video. To enrich it with real metadata:

1. Set `YOUTUBE_API_KEY`.
2. Wire the YouTube Data API call where indicated in `src/lib/youtube.ts` (`analyzeSong` documents the exact integration points for metadata, AI analysis, and optional user-owned audio analysis).

The app will **never** download or store audio — only the video ID, metadata, and your own analysis.

---

## Project structure

```
src/
  app/
    layout.tsx            # Root layout: fonts, sidebar shell
    globals.css           # Theme tokens + component classes
    page.tsx              # Dashboard
    theory/               # Theory Academy
    ear-training/
    listening/
    hit-lab/
    song-genome/
    hook-lab/
    writers-room/
    rhyme-vault/
    composition-lab/
    song-vault/
    composers/
    ai-tutor/
    settings/
    api/tutor/route.ts    # AI Tutor endpoint (OpenAI / Anthropic / mock)
  components/             # Sidebar, PageHeader, StatCard, ProgressRing,
                         # LessonCard, SongCard, GenomeScore, ScoreBar,
                         # Timeline, HookMap, EnergyCurve, NotebookPanel,
                         # YouTubeEmbed, TutorChat, RhymeList,
                         # ComposerProfile, SongVaultTable, Tabs, Card
  lib/
    mockData.ts           # All demo data
    types.ts              # Domain types (mirror Supabase schema)
    nav.ts                # Sidebar navigation config
    youtube.ts            # YouTube ID parsing + mock analyzer
    tutorMock.ts          # Offline AI tutor brain
    supabase.ts           # Supabase integration stub
```

## Design system

Defined in `tailwind.config.ts` and `globals.css`:

- **Ivory** `#F7F4EE` · **Sand** `#EFE8DC` · **Charcoal** `#111111`
- **Ink** `#1F1F1F` · **Muted** `#666666` · **Line** `#D8CFC0`
- **Brass** `#C49B3D` · **Burgundy** `#6D1F2A` · **Success** `#7A9B76` · **Amber** `#B8860B`
- Serif headlines (Playfair Display) · sans body (Inter)

---

This is a prototype intended to demonstrate the full experience and architecture. It is not a kids' app — it's a private conservatory for becoming a stronger songwriter, producer, vocalist, and composer.
