"use client";

import Link from "next/link";
import {
  BookOpen,
  Music,
  PenLine,
  Flame,
  Headphones,
  ChevronRight,
  Play,
  GraduationCap,
} from "lucide-react";
import { ContinueLearningCard } from "@/components/LessonCard";
import { ProgressRing } from "@/components/ProgressRing";
import { StatCard } from "@/components/StatCard";
import { Card, SectionTitle } from "@/components/Card";
import { DashboardWorkout } from "@/components/DashboardWorkout";
import { useDashboard } from "@/lib/useDashboard";

export default function DashboardPage() {
  const d = useDashboard();

  return (
    <div>
      <div className="mb-8">
        <p className="label-caps mb-2 text-brass">Mission Control</p>
        <h1 className="font-serif text-[34px] leading-tight text-ink sm:text-[40px]">
          Welcome back
        </h1>
        <p className="mt-2 text-[15px] italic text-muted">
          The pursuit of mastery never ends.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — assignments */}
        <div className="space-y-6 lg:col-span-2">
          {d.continueLearning ? (
            <ContinueLearningCard
              unit={d.continueLearning.unit}
              title={d.continueLearning.title}
              lessonNumber={d.continueLearning.lessonNumber}
              progress={d.continueLearning.progress}
            />
          ) : (
            <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-brass/30 bg-brass/10 text-brass">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div>
                  <p className="label-caps text-brass">Theory Academy</p>
                  <p className="font-serif text-lg text-ink">Start your first lesson</p>
                </div>
              </div>
              <Link href="/theory" className="btn-brass shrink-0">
                Begin Learning
              </Link>
            </Card>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Listening assignment */}
            <Card className="flex flex-col">
              <div className="mb-3 flex items-center gap-2">
                <Headphones className="h-4 w-4 text-brass" />
                <p className="label-caps">Today&apos;s Listening</p>
              </div>
              {d.listening ? (
                <>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-burgundy/25 to-brass/25">
                      <Play className="h-5 w-5 text-charcoal/60" />
                    </div>
                    <div>
                      <p className="font-serif text-lg text-ink">{d.listening.title}</p>
                      <p className="text-sm text-muted">{d.listening.artist}</p>
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-muted">
                    Focus: <span className="text-ink">{d.listening.focus}</span>
                  </p>
                  <Link href="/listening" className="btn-primary mt-auto w-full">
                    Continue Listening
                  </Link>
                </>
              ) : (
                <>
                  <p className="mb-4 text-sm text-muted">
                    No assignment yet. Choose a track to begin a guided session.
                  </p>
                  <Link href="/listening" className="btn-primary mt-auto w-full">
                    Choose a listening assignment
                  </Link>
                </>
              )}
            </Card>

            {/* Writing workout — live from Hook Lab */}
            <DashboardWorkout />
          </div>

          {/* Stat strip — all from real activity */}
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              label="Lessons Completed"
              value={d.lessonsCompleted}
              icon={BookOpen}
              accent="brass"
            />
            <StatCard
              label="Songs Analyzed"
              value={d.songsAnalyzed}
              icon={Music}
              accent="burgundy"
            />
            <StatCard
              label="Hooks Written"
              value={d.hooksWritten}
              icon={PenLine}
              accent="success"
            />
            <StatCard
              label="Current Streak"
              value={`${d.streak} ${d.streak === 1 ? "day" : "days"}`}
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
            <ProgressRing value={d.overallProgress} sublabel="Overall" size={160} />
            <div className="mt-8 w-full space-y-3">
              <ProgressRow label="Lessons completed" value={d.lessonsCompleted} />
              <ProgressRow label="Songs analyzed" value={d.songsAnalyzed} />
              <ProgressRow label="Hooks written" value={d.hooksWritten} />
              <ProgressRow
                label="Current streak"
                value={`${d.streak} ${d.streak === 1 ? "day" : "days"}`}
              />
            </div>
          </Card>

          <Card>
            <SectionTitle className="mb-3">Quick Access</SectionTitle>
            <div className="flex flex-col gap-1">
              <QuickLink href="/theory" label="Continue Theory Academy" />
              <QuickLink href="/hit-lab" label="Analyze a song in Hit Lab" />
              <QuickLink href="/ai-tutor" label="Ask the AI Tutor" />
              <QuickLink href="/ear-training" label="Train your ear" />
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
