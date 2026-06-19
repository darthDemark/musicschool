// ---------------------------------------------------------------------------
// Mock AI Tutor brain.
//
// Used by /api/tutor whenever no AI provider key is configured. Produces
// serious, music-school-toned responses keyed off the user's message. Keeps
// the prototype fully functional offline and demonstrates the intended
// pedagogical voice: concepts, references, and practice — never reproducing
// full copyrighted lyrics or sheet music.
// ---------------------------------------------------------------------------

interface Rule {
  test: (msg: string) => boolean;
  reply: string;
}

const rules: Rule[] = [
  {
    test: (m) => m.includes("modal interchange") || m.includes("borrowed chord"),
    reply: `Modal interchange is borrowing chords from a parallel mode — most often pulling chords from the parallel minor while you're in a major key.

Think of it this way: C major and C minor share the same tonic but a different palette of colors. When you're in C major and you reach for an Ab, Bb, or Fm chord, you're borrowing from C minor for emotional shading.

The three most useful borrowed chords to start with:
• iv (Fm in C) — instant bittersweet warmth, classic on the "amen" move
• bVII (Bb in C) — rock/anthemic lift
• bVI (Ab in C) — dramatic, cinematic weight

Practice: Take a plain C–Am–F–G loop and swap the F for Fm on the repeat. Listen to how the mood drops. That single substitution is modal interchange in action.`,
  },
  {
    test: (m) => m.includes("secondary dominant"),
    reply: `Let's quiz you on secondary dominants. A secondary dominant is a dominant 7th chord that tonicizes a chord other than the I — written V7/x ("five-seven of x").

Question 1: In the key of C major, what chord is V7/V?
Question 2: What note must you raise to build V7/ii in C, and why?
Question 3: A secondary dominant almost always resolves where?

Answer in your own words and I'll grade each one and push you further. Hint for #1: find the V of the chord you're targeting, then make it a dominant 7th.`,
  },
  {
    test: (m) => m.includes("hook") && (m.includes("exercise") || m.includes("5")),
    reply: `Five hook exercises — do them in one sitting:

1. Title-first: Write 10 song titles in 5 minutes. No editing. Quantity forces instinct.
2. One-note hook: Write a chorus phrase that lands hard on a single repeated pitch. Rhythm carries it, not melody.
3. Contrast drill: Write a busy, wordy verse line, then a chorus hook with half the syllables. Feel the release.
4. Object hook: Build a hook around one concrete image (a phone, a door, rain) instead of an abstraction.
5. Rewrite: Take an existing hook of yours and write three rhythmic variations of the same words.

Bring me your best two from #2 and #5 and I'll score them on memorability, prosody, and emotional payload.`,
  },
  {
    test: (m) => m.includes("chorus") && m.includes("analyz"),
    reply: `Send me the chorus idea and I'll analyze it across five axes:

• Prosody — do stressed syllables land on strong beats?
• Memorability — is there a repeated melodic or rhythmic anchor?
• Contrast — does it lift away from the verse in range, rhythm, or density?
• Emotional payload — does the title phrase carry the central feeling?
• Singability — can a stranger sing it back after one listen?

Paste the lyric and, if you can, describe the melody's contour (rising? falling? repeated note?). I'll give you a score and one concrete rewrite.`,
  },
  {
    test: (m) => m.includes("listening") || m.includes("prince"),
    reply: `Here's a Prince-style listening mission. Listen to "Purple Rain" once straight through, then again with these tasks:

1. Map the build: note the timestamp each new instrument enters (guitar, drums, organ, strings, choir). Prince withholds the full band deliberately.
2. Mark dynamics: where does the energy dip so the next lift hits harder?
3. The solo as melody: the guitar solo is the emotional peak — track how its register climbs.
4. Harmony: it leans on a I–vi–V–IV gospel loop. Notice how the slow harmonic rhythm lets the melody breathe.

Write three sentences on how the arrangement, not the lyrics, creates the emotional arc. Bring them back and we'll connect it to your own song.`,
  },
  {
    test: (m) => m.includes("pre-chorus") || m.includes("prechorus"),
    reply: `A strong pre-chorus does one job: build tension so the chorus feels inevitable. Tools:

• Harmonic lift — move toward the dominant or sit on an unresolved chord (e.g., end on V or a sus that wants to resolve).
• Rhythmic acceleration — shorten phrases or add a pickup that pushes into the chorus.
• Melodic climb — step the melody upward so the chorus can release.
• Lyrical funnel — narrow from the verse's storytelling to a single feeling or question.

Common pitfall: a pre-chorus that's just another verse. It must feel transitional, not stable.

Send me your verse-into-chorus section and I'll write you a pre-chorus that bridges them.`,
  },
  {
    test: (m) => m.includes("counterpoint") || m.includes("invertible"),
    reply: `Counterpoint is the craft of combining independent melodic lines that are each satisfying alone yet coherent together.

Core species-counterpoint rules to internalize first:
• Prefer contrary and oblique motion; use parallel motion sparingly.
• Forbid parallel fifths and octaves — they collapse two voices into one.
• Treat dissonance as decoration: prepare and resolve it (suspensions are your friend).
• Aim for a single melodic climax per line.

For invertible counterpoint, remember interval complements: at the octave, a 3rd becomes a 6th and a 5th becomes a 4th — so beware fifths on strong beats, since the resulting fourth reads as dissonant after inversion.

Want a short exercise? I'll give you a cantus firmus and you write a first-species line above it.`,
  },
  {
    test: (m) => m.includes("rhyme"),
    reply: `Rhyme is a tool for emphasis and memorability — don't let it steer your meaning. Types worth using deliberately:

• Perfect rhyme (fire/desire) — strong closure, can feel predictable.
• Slant/near rhyme (fire/tired) — modern, conversational, keeps surprise.
• Multisyllabic (burning desire / hearts on fire) — rhythmic density, hip-hop and clever pop.
• Internal rhyme — propulsion inside a line.

Give me your keyword and the feeling you're after, and I'll generate perfect, near, and multisyllabic options — then suggest which serves your line best.`,
  },
  {
    test: (m) => m.includes("compare") && m.includes("song"),
    reply: `I can compare songs across the Song Genome axes: hook density, melody strength, emotional impact, arrangement, lyrics/theme, replay value, commercial appeal, and originality.

Name two songs and tell me what you're trying to learn — e.g., "Why does one chorus hit harder?" — and I'll contrast their structure, harmonic language, and arrangement choices, then translate the lesson into something you can apply to your own writing.`,
  },
  {
    test: (m) => m.includes("feedback") || m.includes("draft") || m.includes("my song"),
    reply: `Happy to give feedback on a draft. Paste what you have — even a verse and a hook — and tell me the intended emotion and genre.

I'll respond with: one thing that's working, two specific issues (prosody, structure, or harmony), and a concrete next action. I won't rewrite your whole song; the goal is to make you a stronger writer, not to write it for you.`,
  },
];

const fallback = `That's a solid place to dig in. Tell me a bit more about your goal — are we working on theory, ear training, a hook, harmony, counterpoint, or a song you're drafting?

If you want a starting point, try one of the suggested prompts. I can explain a concept from the ground up, quiz you, build a practice assignment, or analyze an idea you bring me. I'll keep it concrete and reference real music where it helps — but I'll teach the craft rather than hand you finished work.`;

export function getMockTutorReply(message: string): string {
  const msg = message.toLowerCase();
  const matched = rules.find((rule) => rule.test(msg));
  return matched ? matched.reply : fallback;
}
