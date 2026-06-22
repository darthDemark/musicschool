# AGENTS.md

## Cursor Cloud specific instructions

This is a single-service **Next.js 14 (App Router) + React 18 + TypeScript + Tailwind** app named `music-school`. It uses **npm** (lockfile: `package-lock.json`). The update script runs `npm install`, so dependencies are already installed when a session starts.

### Services
- **Next.js app** (UI + API routes in one process). Standard scripts in `package.json`:
  - Dev: `npm run dev` → http://localhost:3000
  - Build: `npm run build` · Start prod: `npm run start`
  - Lint: `npm run lint`
- API routes live under `src/app/api/` (`tutor`, `hooks`, `rhymes`, `song-analysis`, `song-genome`) and run in-process.

### Non-obvious notes
- **No env vars, database, or Docker are required.** The app runs fully offline: persistence uses browser `localStorage` (namespaced `music-school:`) and audio uses the Web Audio API.
- All external integrations are optional and gracefully fall back to deterministic mock data when keys are absent: `OPENAI_API_KEY`/`ANTHROPIC_API_KEY` (AI Tutor), `YOUTUBE_API_KEY` (Hit Lab), and Supabase vars (unused stub). Copy `.env.example` to `.env.local` only if you want live integrations.
- Because state is client-side `localStorage`, features like Song Vault / Hook Lab / Ear Training persist per-browser; clear browser data to reset.
