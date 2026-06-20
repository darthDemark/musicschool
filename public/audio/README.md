# Audio assets (Ear Training)

The Ear Training module currently synthesizes all sound with the Web Audio API
(`src/lib/audioEngine.ts`), so **no audio files are required**.

This folder is the drop-in location for future high-quality sampled audio
(e.g. real instrument recordings). The Ear Training engine reads from
`src/lib/earTraining.ts` → `getSampleUrl()`, which returns a path here when a
file exists and otherwise falls back to Web Audio synthesis.

## Suggested layout

```
public/audio/
  intervals/        # interval_<rootMidi>_<semitones>.mp3  e.g. interval_60_7.mp3
  chords/           # chord_<rootMidi>_<quality>.mp3       e.g. chord_60_maj7.mp3
  cadences/         # cadence_<type>.mp3                    e.g. cadence_authentic.mp3
  melodies/         # melody_<id>.mp3
  rhythms/          # rhythm_<id>.mp3
```

To enable sampled playback, add files following this naming and the engine will
prefer them automatically.
