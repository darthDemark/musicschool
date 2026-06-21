import { DisciplinePage } from "@/components/DisciplinePage";
import { ModuleList } from "@/components/ModuleList";
import { MixerConsole } from "@/components/MixerConsole";
import { Checklist } from "@/components/Checklist";
import { disciplines } from "@/lib/disciplines";

const MIX_CHECK = [
  "Vocals audible and up front",
  "Kick and bass balanced",
  "No clipping on the master",
  "Stereo width controlled",
  "Reverb not overwhelming",
];

export default function Page() {
  const d = disciplines.mixing;
  return (
    <DisciplinePage discipline={d} hideModules>
      <ModuleList section="mixing" modules={d.modules} />
      <MixerConsole />
      <Checklist
        title="Mix Checklist"
        items={MIX_CHECK}
        storageKey="hitcamp_mix_notes"
        notesLabel="Mix Notes"
      />
    </DisciplinePage>
  );
}
