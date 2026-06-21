# AGENTS.md

## Cursor Cloud specific instructions

This is a single Next.js 14 (App Router) web app — "Music School / Hit Camp". There is one service.

- Standard commands live in `package.json` scripts: `npm run dev` (development server on http://localhost:3000), `npm run build`, `npm run start`, `npm run lint`. There is no automated test suite in this repo.
- The app runs fully with **no environment variables** — all data is mocked (`src/lib/mockData.ts`) and persisted client-side via `localStorage` (namespaced `music-school:`). API keys are optional.
- AI features (e.g. `/api/tutor`) use a fallback chain: `OPENAI_API_KEY` → `ANTHROPIC_API_KEY` → built-in mock. Without keys, the AI Tutor returns a generic mock reply (this is expected, not a bug). Set keys in `.env.local` to get live responses.
- Use `npm run dev` for development (not `npm run start`, which requires a prior `npm run build`).
