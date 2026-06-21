import Link from "next/link";
import { ArrowRight, Mic } from "lucide-react";
import { DisciplinePage } from "@/components/DisciplinePage";
import { ModuleList } from "@/components/ModuleList";
import { Checklist } from "@/components/Checklist";
import { Card, SectionTitle } from "@/components/Card";
import { disciplines } from "@/lib/disciplines";

const REC_CHECK = [
  "Input not clipping",
  "Room is quiet",
  "Take is named",
  "Performance notes added",
  "Best take selected",
];

export default function Page() {
  const d = disciplines.recording;
  return (
    <DisciplinePage discipline={d} hideModules>
      <ModuleList section="recording" modules={d.modules} />
      <Card>
        <div className="mb-3 flex items-center gap-2">
          <Mic className="h-4 w-4 text-brass" />
          <SectionTitle>Capture a Take</SectionTitle>
        </div>
        <p className="mb-4 text-sm text-muted">
          Record vocals, guitar, or piano in the Sketchpad — saved takes can be tagged
          (vocal, guitar, piano, idea, final take) in your Idea Vault.
        </p>
        <Link href="/sketchpad" className="btn-brass">
          Open Recorder <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>
      <Checklist
        title="Recording Checklist"
        items={REC_CHECK}
        storageKey="hitcamp_recording_checklists"
        notesLabel="Performance Notes"
      />
    </DisciplinePage>
  );
}
