import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CurriculumUnit } from "@/lib/types";

export function LessonCard({
  unit,
  active,
  onSelect,
}: {
  unit: CurriculumUnit;
  active?: boolean;
  onSelect?: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`card w-full p-5 text-left transition-all hover:shadow-card-hover ${
        active ? "ring-2 ring-brass/50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif text-lg text-ink">{unit.title}</h3>
        <span className="font-serif text-sm text-brass">{unit.progress}%</span>
      </div>
      <p className="mt-1 line-clamp-2 text-[13px] text-muted">{unit.description}</p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-sand">
        <div
          className="h-full rounded-full bg-brass"
          style={{ width: `${unit.progress}%` }}
        />
      </div>
    </button>
  );
}

export function ContinueLearningCard({
  unit,
  title,
  lessonNumber,
  progress,
  href = "/theory",
}: {
  unit: string;
  title: string;
  lessonNumber: number;
  progress: number;
  href?: string;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="bg-charcoal p-6 text-ivory">
        <p className="label-caps text-brass">Continue Learning</p>
        <h3 className="mt-2 font-serif text-2xl">{unit}</h3>
        <p className="mt-1 text-sm text-white/70">
          Lesson {lessonNumber}: {title}
        </p>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-brass"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between p-5">
        <span className="text-sm text-muted">{progress}% complete</span>
        <Link href={href} className="btn-brass">
          Continue
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
