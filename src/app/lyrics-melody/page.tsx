import { DisciplinePage } from "@/components/DisciplinePage";
import { ModuleList } from "@/components/ModuleList";
import { LyricsMelodyTool } from "@/components/LyricsMelodyTool";
import { disciplines } from "@/lib/disciplines";

export default function Page() {
  const d = disciplines["lyrics-melody"];
  return (
    <DisciplinePage discipline={d} hideModules>
      <ModuleList section="lyrics-melody" modules={d.modules} />
      <LyricsMelodyTool />
    </DisciplinePage>
  );
}
