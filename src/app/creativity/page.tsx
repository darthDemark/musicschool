import { DisciplinePage } from "@/components/DisciplinePage";
import { ModuleList } from "@/components/ModuleList";
import { CreativityTools } from "@/components/CreativityTools";
import { disciplines } from "@/lib/disciplines";

export default function Page() {
  const d = disciplines.creativity;
  return (
    <DisciplinePage discipline={d} hideModules>
      <ModuleList section="creativity" modules={d.modules} />
      <CreativityTools />
    </DisciplinePage>
  );
}
