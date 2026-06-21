import { DisciplinePage } from "@/components/DisciplinePage";
import { disciplines } from "@/lib/disciplines";

export default function Page() {
  return <DisciplinePage discipline={disciplines["music-business"]} />;
}
