"use client";

import Link from "next/link";
import { BookOpen, Music, PenLine, Flame, Compass, ArrowRight } from "lucide-react";
import { Card, SectionTitle } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { ProgressRing } from "@/components/ProgressRing";
import { DashboardWorkout } from "@/components/DashboardWorkout";
import { useDashboard } from "@/lib/useDashboard";

export default function MyPathPage() {
  const d = useDashboard();

  return (
    <div className="animate-page">
      <div className="mb-8">
        <p className="label-caps mb-2 flex items-center gap-2 text-brass">
          <Compass className="h-3.5 w-3.5" /> My Path
        </p>
        <h1 className="text-[32px] font-semibold tracking-tight text-ink sm:text-[38px]">
          Your Journey
        </h1>
        <p className="mt-2 text-[15px] text-muted">
          Everything here reflects your real activity — nothing is pre-filled.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center text-center lg:col-span-1">
          <SectionTitle className="mb-1 self-start">Overall Mastery</SectionTitle>
          <p className="mb-6 self-start text-sm text-muted">Across the theory curriculum</p>
          <ProgressRing value={d.overallProgress} sublabel="Complete" size={160} />
          <Link href="/theory" className="btn-ghost mt-8 w-full">
            Continue Theory <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Lessons Completed" value={d.lessonsCompleted} icon={BookOpen} accent="brass" />
            <StatCard label="Songs Analyzed" value={d.songsAnalyzed} icon={Music} accent="burgundy" />
            <StatCard label="Hooks Written" value={d.hooksWritten} icon={PenLine} accent="success" />
            <StatCard
              label="Current Streak"
              value={`${d.streak} ${d.streak === 1 ? "day" : "days"}`}
              icon={Flame}
              accent="amber"
            />
          </div>
          <DashboardWorkout />
        </div>
      </div>

      <div className="mt-8">
        <SectionTitle className="mb-4">Pick Up Where You Left Off</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/theory", label: "Music Theory" },
            { href: "/hook-lab", label: "Hook Lab" },
            { href: "/hit-lab", label: "Hit Lab" },
            { href: "/writers-room", label: "Writer's Room" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center justify-between rounded-xl2 border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5"
            >
              {l.label}
              <ArrowRight className="h-4 w-4 text-brass" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
