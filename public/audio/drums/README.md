# Drum samples (optional)

The drum pad works with **no files** — it synthesizes each hit via the Web Audio
API as a fallback. Drop real one-shot samples here to upgrade the sound; the
engine prefers a sample when present.

Expected file names (either `.wav` or `.mp3`):

```
kick      snare     hat       open-hat
clap      perc-1    perc-2    808
```

e.g. `public/audio/drums/kick.wav`. No file = synth fallback, so nothing breaks.
