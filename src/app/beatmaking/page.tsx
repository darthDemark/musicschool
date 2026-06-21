import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DisciplinePage } from "@/components/DisciplinePage";
import { ModuleList } from "@/components/ModuleList";
import { DrumPad } from "@/components/DrumPad";
import { Card, SectionTitle } from "@/components/Card";
import { disciplines } from "@/lib/disciplines";

export default function Page() {
  const d = disciplines.beatmaking;
  return (
    <DisciplinePage discipline={d} hideModules>
      <ModuleList section="beatmaking" modules={d.modules} />
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <SectionTitle>Drum Pad Exercise</SectionTitle>
          <Link href="/sketchpad" className="flex items-center gap-1 text-xs text-brass hover:underline">
            Open in Sketchpad <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <DrumPad />
      </Card>
    </DisciplinePage>
  );
}
