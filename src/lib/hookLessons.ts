// ---------------------------------------------------------------------------
// Hook Lab teaching content. Each hook type loads unique training material:
// what it is, real-song examples (title/artist only — no copyrighted lyrics),
// why it works, and the mechanics of building one.
// ---------------------------------------------------------------------------

export interface HookLesson {
  type: string;
  whatItIs: string;
  whyItWorks: string;
  examples: string[];
  mechanics: string[];
}

export const hookLessons: Record<string, HookLesson> = {
  "Title Hook": {
    type: "Title Hook",
    whatItIs:
      "The song's title used as the central, repeated phrase — usually landing on the strongest beat of the chorus.",
    whyItWorks:
      "Naming the feeling makes the song instantly identifiable and easy to request, remember, and sing back.",
    examples: [
      "Billie Jean — Michael Jackson",
      "Rolling in the Deep — Adele",
      "Shake It Off — Taylor Swift",
    ],
    mechanics: [
      "Place the title on a downbeat so it feels inevitable.",
      "Keep it short — 2 to 5 words is ideal.",
      "Repeat it at the start or end of the chorus for maximum recall.",
      "Make the melody on the title phrase the song's highest-impact moment.",
    ],
  },
  "Melodic Hook": {
    type: "Melodic Hook",
    whatItIs:
      "A short, memorable melodic phrase — often wordless or on a single syllable — that sticks after one listen.",
    whyItWorks:
      "Melody bypasses language; a strong contour lodges in memory even when the lyric is forgotten.",
    examples: [
      "Seven Nation Army — The White Stripes",
      "Bad Romance ('oh-oh-oh') — Lady Gaga",
      "Sweet Child O' Mine — Guns N' Roses",
    ],
    mechanics: [
      "Use a small, singable range with one clear peak.",
      "Repeat the motif with slight variation to deepen familiarity.",
      "Contrast its rhythm against the verse so it lifts.",
      "Leave space — silence around the hook makes it pop.",
    ],
  },
  "Rhythmic Hook": {
    type: "Rhythmic Hook",
    whatItIs:
      "A memorable rhythmic pattern — vocal or instrumental — that drives the song physically.",
    whyItWorks:
      "Rhythm engages the body; a distinctive groove makes a song danceable and instantly recognizable.",
    examples: [
      "We Will Rock You — Queen",
      "Superstition — Stevie Wonder",
      "Hey Ya! — OutKast",
    ],
    mechanics: [
      "Build around a syncopation that pulls against the beat.",
      "Keep the pattern short enough to loop in the listener's head.",
      "Lock the vocal rhythm to a signature drum or bass figure.",
      "Use rests as part of the hook — the gaps create tension.",
    ],
  },
  "Lyrical Hook": {
    type: "Lyrical Hook",
    whatItIs:
      "A phrase, image, or line that carries the emotional weight of the song.",
    whyItWorks:
      "A vivid, specific line gives listeners something to feel and quote — the song's emotional thesis.",
    examples: [
      "I Will Always Love You — Whitney Houston / Dolly Parton",
      "Smells Like Teen Spirit — Nirvana",
      "Someone Like You — Adele",
    ],
    mechanics: [
      "Anchor it to one concrete image, not an abstraction.",
      "Use conversational, plainspoken language.",
      "Pay off the verse's setup with the hook's payoff line.",
      "Let prosody serve meaning — stress the important words.",
    ],
  },
  "Vocal Ad-lib": {
    type: "Vocal Ad-lib",
    whatItIs:
      "A repeated vocal sound, run, cry, shout, or signature ad-lib that adds identity to the record.",
    whyItWorks:
      "Ad-libs are personal fingerprints — they make a record feel alive and unmistakably someone's.",
    examples: [
      "Prince — signature cries and whoops",
      "Michael Jackson — 'hee-hee' and vocal hiccups",
      "James Brown — shouts and grunts",
    ],
    mechanics: [
      "Place ad-libs in the gaps between main phrases.",
      "Keep one or two signatures consistent across the song.",
      "Use them to raise energy into the chorus.",
      "Let them be imperfect and human — that's the charm.",
    ],
  },
  "Instrumental Hook": {
    type: "Instrumental Hook",
    whatItIs:
      "A riff, synth line, bassline, guitar figure, or piano motif that identifies the record before vocals enter.",
    whyItWorks:
      "An instrumental signature lets a song be recognized in two seconds — ideal for intros and radio.",
    examples: [
      "Smoke on the Water — Deep Purple",
      "Seven Nation Army — The White Stripes",
      "Superstition — Stevie Wonder",
    ],
    mechanics: [
      "Make it 1–2 bars and loopable.",
      "Give it a strong rhythmic identity, not just notes.",
      "Reintroduce it at structural seams (intro, post-chorus).",
      "Keep the timbre distinctive so it 'owns' a sound.",
    ],
  },
};
