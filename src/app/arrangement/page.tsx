import { DisciplinePage } from "@/components/DisciplinePage";
import { ModuleList } from "@/components/ModuleList";
import { ArrangementCanvas } from "@/components/ArrangementCanvas";
import { disciplines } from "@/lib/disciplines";

export default function Page() {
  const d = disciplines.arrangement;
  return (
    <DisciplinePage discipline={d} hideModules>
      <ModuleList section="arrangement" modules={d.modules} />
      <ArrangementCanvas />
    </DisciplinePage>
  );
}
