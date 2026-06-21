import { DisciplinePage } from "@/components/DisciplinePage";
import { ModuleList } from "@/components/ModuleList";
import { SynthPlayground } from "@/components/SynthPlayground";
import { disciplines } from "@/lib/disciplines";

export default function Page() {
  const d = disciplines["sound-design"];
  return (
    <DisciplinePage discipline={d} hideModules>
      <ModuleList section="sound-design" modules={d.modules} />
      <SynthPlayground />
    </DisciplinePage>
  );
}
