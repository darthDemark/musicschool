import Link from "next/link";
import {
  BookOpen,
  Music,
  PenLine,
  Flame,
  Headphones,
  ChevronRight,
  Play,
} from "lucide-react";
import { ContinueLearningCard } from "@/components/LessonCard";
import { ProgressRing } from "@/components/ProgressRing";
import { StatCard } from "@/components/StatCard";
import { Card, SectionTitle } from "@/components/Card";
import {
  continueLearning,
  currentUser,
  dashboardStats,
  todaysListening,
  todaysWriting,
} from "@/lib/mockData";

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="label-caps mb-2 text-brass">Mission Control</p>
        <h1 className="font-serif text-[34px] leading-tight text-ink sm:text-[40px]">
          Good Morning, {currentUser.name}
        </h1>
        <p className="mt-2 text-[15px] italic text-muted">
          The pursuit of mastery never ends.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — assignments */}
        <div className="space-y-6 lg:col-span-2">
          <ContinueLearningCard
            unit={continueLearning.unit}
            title={continueLearning.title}
            lessonNumber={continueLearning.lessonNumber}
            progress={continueLearning.progress}
          />

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Listening assignment */}
            <Card className="flex flex-col">
              <div className="mb-3 flex items-center gap-2">
                <Headphones className="h-4 w-4 text-brass" />
                <p className="label-caps">Today&apos;s Listening</p>
              </div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-burgundy/25 to-brass/25">
                  <Play className="h-5 w-5 text-charcoal/60" />
                </div>
                <div>
                  <p className="font-serif text-lg text-ink">{todaysListening.song}</p>
                  <p className="text-sm text-muted">{todaysListening.artist}</p>
                </div>
              </div>
              <p className="mb-4 text-sm text-muted">
                Focus:{" "}
                <span className="text-ink">{todaysListening.focus}</span>
              </p>
              <Link href="/listening" className="btn-primary mt-auto w-full">
                Start Listening
              </Link>
            </Card>

            {/* Writing assignment */}
            <Card className="flex flex-col">
              <div className="mb-3 flex items-center gap-2">
                <PenLine className="h-4 w-4 text-brass" />
                <p className="label-caps">Today&apos;s Writing</p>
              </div>
              <div className="mb-4">
                <p className="font-serif text-lg text-ink">{todaysWriting.task}</p>
                <p className="mt-1 text-sm text-muted">
                  Focus:{" "}
                  <span className="text-ink">{todaysWriting.focus}</span>
                </p>
              </div>
              <Link href="/hook-lab" className="btn-brass mt-auto w-full">
                Open Hook Lab
              </Link>
            </Card>
          </div>

          {/* Stat strip */}
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Lessons Completed"
              value={dashboardStats.lessonsCompleted}
              icon={BookOpen}
              accent="brass"
            />
            <StatCard
              label="Songs Analyzed"
              value={dashboardStats.songsAnalyzed}
              icon={Music}
              accent="burgundy"
            />
            <StatCard
              label="Hooks Written"
              value={dashboardStats.hooksWritten}
              icon={PenLine}
              accent="success"
            />
            <StatCard
              label="Current Streak"
              value={`${dashboardStats.currentStreak} days`}
              icon={Flame}
              accent="amber"
            />
          </div>
        </div>

        {/* Right column — progress */}
        <div className="space-y-6">
          <Card className="flex flex-col items-center text-center">
            <SectionTitle className="mb-1 self-start">Progress</SectionTitle>
            <p className="mb-6 self-start text-sm text-muted">Overall mastery</p>
            <ProgressRing
              value={dashboardStats.overallProgress}
              sublabel="Overall"
              size={160}
            />
            <div className="mt-8 w-full space-y-3">
              <ProgressRow label="Lessons completed" value={dashboardStats.lessonsCompleted} />
              <ProgressRow label="Songs analyzed" value={dashboardStats.songsAnalyzed} />
              <ProgressRow label="Hooks written" value={dashboardStats.hooksWritten} />
              <ProgressRow label="Current streak" value={`${dashboardStats.currentStreak} days`} />
            </div>
          </Card>

          <Card>
            <SectionTitle className="mb-3">Quick Access</SectionTitle>
            <div className="flex flex-col gap-1">
              <QuickLink href="/hit-lab" label="Analyze a song in Hit Lab" />
              <QuickLink href="/ai-tutor" label="Ask the AI Tutor" />
              <QuickLink href="/ear-training" label="Train your ear" />
              <QuickLink href="/song-vault" label="Open Song Vault" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProgressRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between border-b border-line/70 pb-2 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="font-serif text-base text-ink">{value}</span>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-ink transition-colors hover:bg-sand"
    >
      {label}
      <ChevronRight className="h-4 w-4 text-muted" />
    </Link>
  );
}
