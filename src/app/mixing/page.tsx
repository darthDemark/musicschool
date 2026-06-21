import { DisciplinePage } from "@/components/DisciplinePage";
import { MixerConsole } from "@/components/MixerConsole";
import { SectionTitle } from "@/components/Card";
import { disciplines } from "@/lib/disciplines";

export default function Page() {
  return (
    <div className="space-y-8">
      <DisciplinePage discipline={disciplines.mixing} />
      <section className="animate-page">
        <SectionTitle className="mb-4">Mixing Console</SectionTitle>
        <MixerConsole />
      </section>
    </div>
  );
}
