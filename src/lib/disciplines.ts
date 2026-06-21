// ---------------------------------------------------------------------------
// Hit Camp discipline content. New discipline sections are curriculum landing
// pages; several link out to the existing interactive tools. Real songs are
// referenced by title/artist only.
// ---------------------------------------------------------------------------

export const IMG = "/images/hitcamp";

export interface DisciplineModule {
  title: string;
  desc: string;
}

export interface RelatedTool {
  label: string;
  href: string;
}

export interface Discipline {
  slug: string;
  title: string;
  eyebrow: string;
  image: string | null;
  tagline: string;
  intro: string[];
  learn: string[];
  modules: DisciplineModule[];
  related: RelatedTool[];
}

export const disciplines: Record<string, Discipline> = {
  production: {
    slug: "production",
    title: "Production",
    eyebrow: "Produce",
    image: `${IMG}/production.png`,
    tagline: "Turn an idea into a finished, professional-sounding record.",
    intro: [
      "Production is the craft of capturing and shaping sound into a record people want to play again. It connects songwriting, arrangement, sound design, and mixing into one workflow.",
      "You'll learn to build a track from a blank session: choosing sounds, laying a groove, arranging sections, and committing to decisions that serve the song.",
    ],
    learn: [
      "Set up an efficient session and signal flow",
      "Choose sounds that fit the song's emotion",
      "Build energy with additive arrangement",
      "Commit early and avoid endless tweaking",
    ],
    modules: [
      { title: "The Producer's Mindset", desc: "Serving the song over showing off; taste and restraint." },
      { title: "Session Architecture", desc: "Templates, gain staging, and a clean signal chain." },
      { title: "Groove & Pocket", desc: "Drums and bass locking into a feel that moves people." },
      { title: "From Demo to Master", desc: "The path from rough idea to release-ready record." },
    ],
    related: [
      { label: "Open Beatmaking", href: "/beatmaking" },
      { label: "Open Mixing", href: "/mixing" },
      { label: "Composition Lab", href: "/composition-lab" },
    ],
  },
  beatmaking: {
    slug: "beatmaking",
    title: "Beatmaking",
    eyebrow: "Produce",
    image: `${IMG}/beatmaking.png`,
    tagline: "Program drums and grooves that hit hard and stay in your head.",
    intro: [
      "Beatmaking is rhythm-first production: drums, bass, and loops that create an irresistible groove before a single melody is written.",
      "You'll study pocket, swing, and layering, then build patterns on the step sequencer in the Composition Lab.",
    ],
    learn: [
      "Program kick/snare/hat patterns with pocket",
      "Use swing and velocity for a human feel",
      "Layer drums for punch and width",
      "Build tension with fills and drops",
    ],
    modules: [
      { title: "Drum Anatomy", desc: "Kick, snare, hats, percussion — roles and frequencies." },
      { title: "Pocket & Swing", desc: "Why micro-timing makes a beat feel alive." },
      { title: "Layering & Punch", desc: "Stacking samples without mud." },
      { title: "Arrangement of a Beat", desc: "Intro, drop, breakdown, and the final lift." },
    ],
    related: [
      { label: "Open Composition Lab (sequencer)", href: "/composition-lab" },
      { label: "Open Production", href: "/production" },
    ],
  },
  arrangement: {
    slug: "arrangement",
    title: "Arrangement",
    eyebrow: "Produce",
    image: `${IMG}/arrangement.png`,
    tagline: "Stage sections and instruments so the song builds and pays off.",
    intro: [
      "Arrangement is the architecture of energy: what plays, when it enters, and how contrast between sections creates momentum and release.",
      "You'll learn additive arranging, transitions, and how to make a chorus feel like an arrival.",
    ],
    learn: [
      "Map sections and their energy levels",
      "Add and remove layers for contrast",
      "Write transitions that pull the listener forward",
      "Reserve your biggest moment for maximum impact",
    ],
    modules: [
      { title: "Energy Mapping", desc: "Charting the song's rise and fall section by section." },
      { title: "Additive Arrangement", desc: "Entering instruments in stages to build escalation." },
      { title: "Transitions", desc: "Fills, drops, risers, and silence as tools." },
      { title: "The Final Chorus", desc: "Techniques that make the last chorus hit hardest." },
    ],
    related: [
      { label: "Analyze structure in Hit Lab", href: "/hit-lab" },
      { label: "Composition Lab", href: "/composition-lab" },
    ],
  },
  "sound-design": {
    slug: "sound-design",
    title: "Sound Design",
    eyebrow: "Produce",
    image: `${IMG}/sound-design.png`,
    tagline: "Craft signature sounds and sonic moments that define a record.",
    intro: [
      "Sound design is creating and shaping timbres — from synth patches to textures and effects — that give a record its identity.",
      "You'll learn synthesis fundamentals and how a single sonic signature can become a hook in itself.",
    ],
    learn: [
      "Subtractive & FM synthesis basics",
      "Design a signature lead, pad, or bass",
      "Use effects as creative instruments",
      "Build a production hook from texture",
    ],
    modules: [
      { title: "Synthesis Foundations", desc: "Oscillators, filters, envelopes, and LFOs." },
      { title: "Designing a Signature", desc: "Patches that become the song's fingerprint." },
      { title: "Effects as Instruments", desc: "Reverb, delay, distortion, and modulation for character." },
      { title: "The Production Hook", desc: "Turning a sound into something listeners remember." },
    ],
    related: [
      { label: "Open Production", href: "/production" },
      { label: "Open Mixing", href: "/mixing" },
    ],
  },
  recording: {
    slug: "recording",
    title: "Recording",
    eyebrow: "Produce",
    image: `${IMG}/recording.png`,
    tagline: "Capture vocals and instruments with clarity and emotion.",
    intro: [
      "Recording is the art of capturing a performance — the right mic, the right room, and the right take that carries the feeling.",
      "You'll learn mic technique, gain staging, comping, and how to coach a great vocal performance.",
    ],
    learn: [
      "Choose and place a microphone",
      "Set levels without clipping",
      "Track and comp the best vocal take",
      "Capture emotion, not just notes",
    ],
    modules: [
      { title: "Microphones & Placement", desc: "Condenser vs. dynamic, distance, and the proximity effect." },
      { title: "Clean Capture", desc: "Gain staging, headroom, and a quiet signal path." },
      { title: "The Vocal Take", desc: "Comping, punch-ins, and performance direction." },
      { title: "Editing & Tuning", desc: "Timing, pitch, and keeping it natural." },
    ],
    related: [
      { label: "Open Mixing", href: "/mixing" },
      { label: "Open Production", href: "/production" },
    ],
  },
  mixing: {
    slug: "mixing",
    title: "Mixing",
    eyebrow: "Produce",
    image: `${IMG}/mixing.png`,
    tagline: "Balance, shape, and glue a record so every element has its place.",
    intro: [
      "Mixing is balance and clarity: levels, EQ, compression, and space that let every part be heard and felt.",
      "You'll learn a repeatable mix workflow and how to make decisions that serve the emotion of the song.",
    ],
    learn: [
      "Build a balance from the most important element",
      "Carve space with EQ",
      "Control dynamics with compression",
      "Create depth with reverb and panning",
    ],
    modules: [
      { title: "Gain Staging & Balance", desc: "Starting from the vocal or the kick." },
      { title: "EQ & Frequency Space", desc: "Subtractive carving so parts don't fight." },
      { title: "Compression & Dynamics", desc: "Glue, control, and groove enhancement." },
      { title: "Depth & Width", desc: "Reverb, delay, and the stereo field." },
    ],
    related: [
      { label: "Open Recording", href: "/recording" },
      { label: "Open Sound Design", href: "/sound-design" },
    ],
  },
  "lyrics-melody": {
    slug: "lyrics-melody",
    title: "Lyrics & Melody",
    eyebrow: "Create",
    image: `${IMG}/lyrics_melody.png`,
    tagline: "Marry words and melody so the hook means something.",
    intro: [
      "Lyrics and melody are inseparable: prosody is how a melody's stresses land on the right words to make a line unforgettable.",
      "You'll develop top-lines, shape memorable melodies, and write lyrics with imagery and emotional truth — then take ideas into the Writer's Room.",
    ],
    learn: [
      "Match melodic stress to lyrical meaning (prosody)",
      "Shape contour and a clear melodic climax",
      "Write concrete, emotional imagery",
      "Build a hook where words and melody fuse",
    ],
    modules: [
      { title: "Prosody", desc: "Aligning melodic accents with the words that matter." },
      { title: "Top-line Writing", desc: "Developing a memorable melody over changes." },
      { title: "Lyrical Imagery", desc: "Concrete detail, point of view, and emotional truth." },
      { title: "The Married Hook", desc: "When melody and lyric become one idea." },
    ],
    related: [
      { label: "Open Writer's Room", href: "/writers-room" },
      { label: "Open Rhyme Vault", href: "/rhyme-vault" },
      { label: "Open Hook Lab", href: "/hook-lab" },
    ],
  },
  "music-business": {
    slug: "music-business",
    title: "Music Business",
    eyebrow: "Library",
    image: `${IMG}/music-business.png`,
    tagline: "Understand how music makes money and how careers are built.",
    intro: [
      "The business side turns songs into a sustainable career: rights, royalties, releases, and audience.",
      "You'll learn how publishing and masters work, how streaming pays, and how to plan a release that finds listeners.",
    ],
    learn: [
      "Publishing vs. masters and who gets paid",
      "How streaming royalties actually flow",
      "Splits, metadata, and registration",
      "Planning a release and building an audience",
    ],
    modules: [
      { title: "Rights & Royalties", desc: "Composition vs. recording; the income streams." },
      { title: "Splits & Metadata", desc: "Getting credited and paid correctly." },
      { title: "Release Strategy", desc: "Timing, rollout, and platforms." },
      { title: "Audience & Brand", desc: "Turning listeners into a fanbase." },
    ],
    related: [{ label: "Ask the AI Mentor", href: "/ai-tutor" }],
  },
  creativity: {
    slug: "creativity",
    title: "Creativity",
    eyebrow: "Create",
    image: `${IMG}/songwriting.png`,
    tagline: "Build a reliable practice for generating and finishing ideas.",
    intro: [
      "Creativity is a skill you can train — not a mood you wait for. The goal is a steady flow of ideas and the discipline to finish them.",
      "You'll learn idea-generation methods, how to beat the blank page, and how to turn raw sparks into finished songs. For advanced contrapuntal and formal work, the Composition Lab remains available as a deep tool.",
    ],
    learn: [
      "Generate ideas on demand with constraints",
      "Use prompts and combinations to spark concepts",
      "Beat perfectionism and finish songs",
      "Develop a daily creative practice",
    ],
    modules: [
      { title: "Idea Generation", desc: "Constraints, prompts, and forced connections." },
      { title: "The Blank Page", desc: "Rituals and warm-ups that start the flow." },
      { title: "From Spark to Song", desc: "Developing a fragment into a finished idea." },
      { title: "Finishing", desc: "Beating perfectionism and shipping work." },
    ],
    related: [
      { label: "Open Writer's Room", href: "/writers-room" },
      { label: "Open Hook Lab", href: "/hook-lab" },
      { label: "Composition Lab (advanced)", href: "/composition-lab" },
    ],
  },
};

export const disciplineList = Object.values(disciplines);

/* --------------------------- Homepage discipline grid ---------------------- */

export interface DisciplineCard {
  title: string;
  href: string;
  image: string | null;
  blurb: string;
}

export const exploreCards: DisciplineCard[] = [
  { title: "Music Theory", href: "/theory", image: `${IMG}/music-theory.png`, blurb: "The language of music, from notation to fugue." },
  { title: "Production", href: "/production", image: `${IMG}/production.png`, blurb: "Build a finished, professional record." },
  { title: "Beatmaking", href: "/beatmaking", image: `${IMG}/beatmaking.png`, blurb: "Program grooves that hit hard." },
  { title: "Mixing", href: "/mixing", image: `${IMG}/mixing.png`, blurb: "Balance and glue your record." },
  { title: "Arrangement", href: "/arrangement", image: `${IMG}/arrangement.png`, blurb: "Stage sections so the song builds." },
  { title: "Sound Design", href: "/sound-design", image: `${IMG}/sound-design.png`, blurb: "Craft signature sounds." },
  { title: "Recording", href: "/recording", image: `${IMG}/recording.png`, blurb: "Capture vocals with emotion." },
  { title: "Lyrics & Melody", href: "/lyrics-melody", image: `${IMG}/lyrics_melody.png`, blurb: "Marry words and melody." },
  { title: "Ear Training", href: "/ear-training", image: `${IMG}/ear-training.png`, blurb: "Sharpen your musical ear." },
  { title: "Creativity", href: "/creativity", image: `${IMG}/songwriting.png`, blurb: "Generate and finish ideas." },
  { title: "Music Business", href: "/music-business", image: `${IMG}/music-business.png`, blurb: "Turn songs into a career." },
  { title: "Guided Listening", href: "/listening", image: null, blurb: "Study great records with intent." },
];

export const recommendedCards: DisciplineCard[] = [
  { title: "Hook Lab", href: "/hook-lab", image: null, blurb: "Train the most important muscle in songwriting." },
  { title: "Hit Lab", href: "/hit-lab", image: null, blurb: "Deconstruct any song from a YouTube link." },
  { title: "AI Mentor", href: "/ai-tutor", image: null, blurb: "Ask anything — theory, harmony, songwriting." },
];
