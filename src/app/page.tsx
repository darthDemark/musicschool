"use client";

import Link from "next/link";
import {
  Play,
  PlayCircle,
  ArrowRight,
  Headphones,
  GraduationCap,
  Flame,
  Users,
  Share2,
  Wrench,
  ChevronRight,
} from "lucide-react";
import { Card, SectionTitle } from "@/components/Card";
import { ProgressRing } from "@/components/ProgressRing";
import { DashboardWorkout } from "@/components/DashboardWorkout";
import { ImageBackdrop } from "@/components/ImageBackdrop";
import { useDashboard } from "@/lib/useDashboard";
import { IMG, exploreCards as exploreTiles } from "@/lib/disciplines";

const RECOMMENDED = [
  { cat: "Mixing", title: "Vocal Mixing Essentials", meta: "Beginner", href: "/mixing", img: `${IMG}/mixing.png` },
  { cat: "Beatmaking", title: "Melody & Chord Progressions", meta: "Intermediate", href: "/beatmaking", img: `${IMG}/beatmaking.png` },
  { cat: "Theory", title: "Music Theory for Producers", meta: "All Levels", href: "/theory", img: `${IMG}/music-theory.png` },
  { cat: "Arrangement", title: "Song Structure & Arrangement", meta: "Intermediate", href: "/arrangement", img: `${IMG}/arrangement.png` },
];

const VALUE_PROPS = [
  { icon: GraduationCap, title: "Learn From Industry Pros", desc: "Lessons grounded in how hit records are actually made." },
  { icon: Wrench, title: "Real-World Skills", desc: "Practical techniques you can apply to your music today." },
  { icon: Users, title: "Join a Community of Creators", desc: "Connect, share, and grow with creators worldwide." },
  { icon: Share2, title: "Create. Share. Get Feedback.", desc: "Get your tracks heard and improve faster." },
];

export default function HomePage() {
  const d = useDashboard();

  return (
    <div className="animate-page space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Left column */}
        <div className="space-y-8">
          {/* Hero */}
          <ImageBackdrop
            src={`${IMG}/header.png`}
            className="rounded-2xl border border-white/10"
            overlayClassName="bg-gradient-to-r from-studio via-studio/85 to-studio/30"
            zoom={false}
          >
            <div className="flex min-h-[300px] flex-col justify-center p-8 sm:p-10">
              <p className="label-caps mb-2 text-muted">Welcome back, Creator.</p>
              <h1 className="max-w-md text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
                Learn. Make Hit Records.
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
                Master the skills behind today&apos;s biggest records through real-world
                lessons and proven frameworks.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
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

          {/* Continue Your Path */}
          <section>
            <SectionTitle className="mb-4">Continue Your Path</SectionTitle>
            {d.continueLearning ? (
              <div className="card flex flex-col overflow-hidden sm:flex-row">
                <ImageBackdrop
                  src={`${IMG}/music-theory.png`}
                  className="relative h-40 sm:h-auto sm:w-52"
                  zoom={false}
                >
                  <div className="flex h-full items-center justify-center">
                    <ProgressRing
                      value={d.continueLearning.progress}
                      label={`${d.continueLearning.progress}%`}
                      size={92}
                      stroke={8}
                    />
                  </div>
                </ImageBackdrop>
                <div className="flex flex-1 flex-col gap-4 p-6 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <p className="label-caps text-brass">{d.continueLearning.unit}</p>
                    <h3 className="mt-1 text-xl font-semibold text-ink">
                      {d.continueLearning.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">
                      Pick up where you left off and keep your streak alive.
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-brass"
                          style={{ width: `${d.continueLearning.progress}%` }}
                        />
                      </div>
                      <span className="shrink-0 text-xs text-muted">
                        {d.continueLearning.lessonsDone}/{d.continueLearning.lessonsTotal} Lessons
                      </span>
                    </div>
                  </div>
                  <Link href="/theory" className="btn-brass shrink-0">
                    Resume Lesson <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <Card className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-brass/30 bg-brass/10 text-brass">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="label-caps text-brass">Music Theory</p>
                    <p className="font-semibold text-ink">Start your first lesson</p>
                  </div>
                </div>
                <Link href="/theory" className="btn-brass shrink-0">
                  Begin Learning
                </Link>
              </Card>
            )}
          </section>

          {/* Recommended */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <SectionTitle>Recommended For You</SectionTitle>
              <Link href="#disciplines" className="flex items-center gap-1 text-xs text-muted hover:text-ink">
                View all <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {RECOMMENDED.map((r) => (
                <Link key={r.title} href={r.href} className="block">
                  <ImageBackdrop
                    src={r.img}
                    className="h-44 rounded-xl2 border border-white/10 transition-transform duration-200 ease-out hover:-translate-y-1"
                  >
                    <div className="flex h-full flex-col justify-between p-4">
                      <div className="flex justify-end">
                        <PlayCircle className="h-7 w-7 text-white/80" />
                      </div>
                      <div>
                        <p className="label-caps text-brass">{r.cat}</p>
                        <p className="mt-0.5 font-semibold leading-snug text-ink">{r.title}</p>
                        <p className="mt-1 text-xs text-muted">{r.meta}</p>
                      </div>
                    </div>
                  </ImageBackdrop>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right rail — Your Progress */}
        <aside className="space-y-6">
          <Card>
            <p className="label-caps mb-3">Your Progress</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-semibold text-ink">Level {d.level}</p>
                <p className="text-xs text-muted">Hit Camp Creator</p>
              </div>
              <ProgressRing
                value={d.levelProgress}
                label={`${d.levelProgress}%`}
                size={68}
                stroke={7}
              />
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-brass"
                style={{ width: `${d.levelProgress}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-muted">
              {d.xpIntoLevel} / {d.xpForLevel} XP
            </p>

            <div className="my-4 h-px bg-white/10" />

            <p className="label-caps mb-2">Current Streak</p>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber" />
              <span className="text-lg font-semibold text-ink">
                {d.streak} {d.streak === 1 ? "day" : "days"}
              </span>
            </div>
          </Card>

          <Card>
            <p className="label-caps mb-3">Skills Mastered</p>
            {d.skills.length === 0 ? (
              <p className="text-sm text-muted">
                Complete lessons to start building your skills.
              </p>
            ) : (
              <div className="space-y-3">
                {d.skills.slice(0, 4).map((s) => (
                  <div key={s.name}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-ink">{s.name}</span>
                      <span className="text-xs text-muted">{s.level}</span>
                    </div>
                    <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-brass"
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link href="/theory" className="btn-ghost mt-4 w-full text-xs">
              View All Skills
            </Link>
          </Card>

          <Card>
            <p className="label-caps mb-2">Live Sessions</p>
            <p className="font-semibold text-ink">Inside The Studio</p>
            <p className="mt-0.5 text-sm text-muted">
              Live production masterclasses with working pros — coming soon.
            </p>
            <Link href="/listening" className="btn-ghost mt-4 w-full text-xs">
              Explore Listening
            </Link>
          </Card>
        </aside>
      </div>

      {/* Explore disciplines anchor target lives on the home grid below the fold */}
      <section id="disciplines" className="scroll-mt-24">
        <SectionTitle className="mb-1">Find Your Sound. Master Your Craft.</SectionTitle>
        <p className="mb-4 text-sm text-muted">
          Explore every discipline — theory, production, analysis, and the business of music.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {exploreTiles.map((c) => (
            <Link key={c.href} href={c.href} className="block">
              <ImageBackdrop
                src={c.image}
                className="h-40 rounded-xl2 border border-white/10 transition-transform duration-200 ease-out hover:-translate-y-1"
              >
                <div className="flex h-full flex-col justify-end p-4">
                  <p className="font-semibold text-ink">{c.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted">{c.blurb}</p>
                </div>
              </ImageBackdrop>
            </Link>
          ))}
        </div>
      </section>

      {/* Value props band */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((v) => (
            <div key={v.title} className="flex gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brass/30 bg-brass/10 text-brass">
                <v.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{v.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workout teaser uses real state but lives off-fold for quick access */}
      <section>
        <SectionTitle className="mb-4">Today&apos;s Workout</SectionTitle>
        <div className="lg:max-w-md">
          <DashboardWorkout />
        </div>
      </section>
    </div>
  );
}
