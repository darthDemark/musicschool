# AGENTS.md

## Cursor Cloud specific instructions

This is a self-contained **Next.js 14 (App Router) + React 18 + TypeScript + Tailwind** app ("Music School"). It is a single frontend product with no backend services or databases — all data persists client-side in `localStorage` and audio is synthesized via the browser Web Audio API.

### Services

There is one service: the Next.js dev server.

- Run: `npm run dev` (serves http://localhost:3000)
- Lint: `npm run lint`
- Build (production check): `npm run build`

### Non-obvious notes

- **No environment variables are required.** The app runs fully offline using mock data (`src/lib/mockData.ts`). The API routes under `src/app/api/*` (e.g. `/api/tutor`) gracefully fall back to rich mock responses when `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` are absent. Add keys to `.env.local` only to exercise live AI responses.
- Most feature state (Song Vault, Ear Training, Hook Lab, Hit Lab, Composition Lab, AI Tutor history) lives in `localStorage` namespaced under `music-school:`. To reset a feature, clear browser storage rather than touching server state.
- Audio (`src/lib/audioEngine.ts`) requires a user gesture before the `AudioContext` initializes (browser autoplay policy), so audio won't play during purely programmatic/headless checks.
