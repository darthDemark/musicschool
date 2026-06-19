// ---------------------------------------------------------------------------
// Supabase integration stub.
//
// The prototype runs entirely on local mock data (src/lib/mockData.ts), so
// Supabase is NOT required to run or deploy. This file documents the intended
// integration point and exposes a tiny helper that is safe to call even when
// no credentials are configured.
//
// To enable Supabase later:
//   1. npm install @supabase/supabase-js
//   2. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
//   3. Uncomment the createClient block below and replace mockData reads with
//      queries against the suggested schema (see README.md):
//        users, lessons, lesson_progress, listening_assignments,
//        hit_lab_reports, song_genomes, hook_entries, rhyme_entries,
//        song_vault, composer_profiles, ai_tutor_sessions
// ---------------------------------------------------------------------------

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// import { createClient } from "@supabase/supabase-js";
//
// export const supabase = isSupabaseConfigured
//   ? createClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//     )
//   : null;

export const supabase = null;
