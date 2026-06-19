import { BookOpen, TrendingUp, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/Card";
import { TutorChat } from "@/components/TutorChat";
import { ProgressRing } from "@/components/ProgressRing";
import {
  continueLearning,
  dashboardStats,
  tutorSuggestedPrompts,
} from "@/lib/mockData";

export default function AITutorPage() {
  return (
    <div>
      <PageHeader
        eyebrow="AI Tutor"
        title="Your Private Mentor"
        subtitle="A serious music tutor that can teach, quiz, analyze, and coach — across theory, ear, and craft."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Chat */}
        <TutorChat />

        {/* Side panels */}
        <aside className="space-y-6">
          {/* Suggested prompts */}
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brass" />
              <SectionTitle>Suggested Prompts</SectionTitle>
            </div>
            <div className="flex flex-col gap-2">
              {tutorSuggestedPrompts.map((p) => (
                <div
                  key={p}
                  className="rounded-lg border border-line bg-sand/40 px-3.5 py-2.5 text-sm text-ink"
                >
                  {p}
                </div>
              ))}
            </div>
          </Card>

          {/* Lesson context */}
          <Card>
            <div className="mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-brass" />
              <SectionTitle>Lesson Context</SectionTitle>
            </div>
            <p className="label-caps">Currently Studying</p>
            <p className="mt-1 font-serif text-lg text-ink">{continueLearning.unit}</p>
            <p className="text-sm text-muted">
              Lesson {continueLearning.lessonNumber}: {continueLearning.title}
            </p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-brass"
                style={{ width: `${continueLearning.progress}%` }}
              />
            </div>
          </Card>

          {/* Student progress */}
          <Card className="flex flex-col items-center text-center">
            <div className="mb-3 flex items-center gap-2 self-start">
              <TrendingUp className="h-4 w-4 text-brass" />
              <SectionTitle>Student Progress</SectionTitle>
            </div>
            <ProgressRing value={dashboardStats.overallProgress} size={120} sublabel="Overall" />
            <div className="mt-5 grid w-full grid-cols-2 gap-3 text-left">
              <Stat label="Lessons" value={dashboardStats.lessonsCompleted} />
              <Stat label="Analyzed" value={dashboardStats.songsAnalyzed} />
              <Stat label="Hooks" value={dashboardStats.hooksWritten} />
              <Stat label="Streak" value={`${dashboardStats.currentStreak}d`} />
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-line bg-sand/40 p-3">
      <p className="font-serif text-xl text-ink">{value}</p>
      <p className="label-caps">{label}</p>
    </div>
  );
}
