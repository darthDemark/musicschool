"use client";

import Link from "next/link";
import {
  BookOpen,
  Music,
  PenLine,
  Flame,
  Headphones,
  Play,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { ContinueLearningCard } from "@/components/LessonCard";
import { StatCard } from "@/components/StatCard";
import { Card, SectionTitle } from "@/components/Card";
import { DashboardWorkout } from "@/components/DashboardWorkout";
import { ImageBackdrop } from "@/components/ImageBackdrop";
import { useDashboard } from "@/lib/useDashboard";
import { exploreCards, recommendedCards, IMG, type DisciplineCard } from "@/lib/disciplines";

export default function HomePage() {
  const d = useDashboard();

  return (
    <div className="animate-page space-y-10">
      {/* Hero */}
      <ImageBackdrop
        src={`${IMG}/header.png`}
        className="rounded-2xl border border-white/10"
        overlayClassName="bg-gradient-to-tr from-studio via-studio/85 to-studio/40"
        zoom={false}
      >
        <div className="flex min-h-[340px] flex-col justify-center p-8 sm:p-12">
          <p className="label-caps mb-3 text-brass">Hit Camp · by HitLab</p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
            Learn. Make Hit Records.
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            A complete training platform for songwriters, producers, and artists — theory,
            production, analysis, and the tools to turn ideas into records.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/theory" className="btn-primary">
              <Play className="h-4 w-4" />
              Continue Learning
            </Link>
            <Link href="#disciplines" className="btn-ghost">
              Browse Lessons
            </Link>
          </div>
        </div>
      </ImageBackdrop>

      {/* Continue your path */}
      <section>
        <SectionTitle className="mb-4">Continue Your Path</SectionTitle>
        <div className="grid gap-6 lg:grid-cols-3">
          {d.continueLearning ? (
            <ContinueLearningCard
              unit={d.continueLearning.unit}
              title={d.continueLearning.title}
              lessonNumber={d.continueLearning.lessonNumber}
              progress={d.continueLearning.progress}
            />
          ) : (
            <Card className="flex flex-col">
              <div className="mb-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-brass" />
                <p className="label-caps">Music Theory</p>
              </div>
              <p className="mb-4 text-sm text-muted">
                You haven&apos;t started yet. Begin with the fundamentals.
              </p>
              <Link href="/theory" className="btn-brass mt-auto w-full">
                Start your first lesson
              </Link>
            </Card>
          )}

          <DashboardWorkout />

          <Card className="flex flex-col">
            <div className="mb-3 flex items-center gap-2">
              <Headphones className="h-4 w-4 text-brass" />
              <p className="label-caps">Guided Listening</p>
            </div>
            {d.listening ? (
              <>
                <p className="font-medium text-ink">{d.listening.title}</p>
                <p className="text-sm text-muted">{d.listening.artist}</p>
                <p className="mb-4 mt-1 text-sm text-muted">
                  Focus: <span className="text-ink">{d.listening.focus}</span>
                </p>
                <Link href="/listening" className="btn-primary mt-auto w-full">
                  Continue Listening
                </Link>
              </>
            ) : (
              <>
                <p className="mb-4 text-sm text-muted">
                  No assignment yet. Study a great record with intent.
                </p>
                <Link href="/listening" className="btn-primary mt-auto w-full">
                  Choose a listening assignment
                </Link>
              </>
            )}
          </Card>
        </div>

        {/* Real stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      </section>

      {/* Explore disciplines */}
      <section id="disciplines" className="scroll-mt-20">
        <SectionTitle className="mb-1">Explore Disciplines</SectionTitle>
        <p className="mb-4 text-sm text-muted">
          Everything from theory to production, analysis, and the business of music.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {exploreCards.map((c) => (
            <DisciplineTile key={c.href} card={c} />
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section>
        <SectionTitle className="mb-4">Recommended For You</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-3">
          {recommendedCards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-col rounded-xl2 border border-white/10 bg-white/[0.04] p-5 transition-transform duration-200 ease-out hover:-translate-y-1"
            >
              <p className="font-serif text-lg text-ink">{c.title}</p>
              <p className="mt-1 flex-1 text-sm text-muted">{c.blurb}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-brass">
                Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function DisciplineTile({ card }: { card: DisciplineCard }) {
  return (
    <Link href={card.href} className="block">
      <ImageBackdrop
        src={card.image}
        className="h-40 rounded-xl2 border border-white/10 transition-transform duration-200 ease-out hover:-translate-y-1"
      >
        <div className="flex h-full flex-col justify-end p-4">
          <p className="font-semibold text-ink">{card.title}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted">{card.blurb}</p>
        </div>
      </ImageBackdrop>
    </Link>
  );
}
