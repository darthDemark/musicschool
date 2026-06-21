import { DisciplinePage } from "@/components/DisciplinePage";
import { ModuleList } from "@/components/ModuleList";
import { ProductionPlan } from "@/components/ProductionPlan";
import { disciplines } from "@/lib/disciplines";

export default function Page() {
  const d = disciplines.production;
  return (
    <DisciplinePage discipline={d} hideModules>
      <ModuleList section="production" modules={d.modules} />
      <ProductionPlan />
    </DisciplinePage>
  );
}
