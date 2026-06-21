import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Card, SectionTitle } from "@/components/Card";
import { ImageBackdrop } from "@/components/ImageBackdrop";
import type { Discipline } from "@/lib/disciplines";

export function DisciplinePage({ discipline: d }: { discipline: Discipline }) {
  return (
    <div className="animate-page space-y-8">
      {/* Hero */}
      <ImageBackdrop
        src={d.image}
        className="rounded-xl2 border border-white/10"
        overlayClassName="bg-gradient-to-tr from-studio via-studio/80 to-studio/40"
        zoom={false}
      >
        <div className="flex min-h-[260px] flex-col justify-end p-8">
          <p className="label-caps mb-2 text-brass">{d.eyebrow}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-ink">{d.title}</h1>
          <p className="mt-3 max-w-xl text-[15px] text-muted">{d.tagline}</p>
        </div>
      </ImageBackdrop>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card>
            <SectionTitle className="mb-3">Overview</SectionTitle>
            <div className="space-y-3">
              {d.intro.map((p, i) => (
                <p key={i} className="text-[15px] leading-relaxed text-ink">
                  {p}
                </p>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle className="mb-4">Modules</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2">
              {d.modules.map((m) => (
                <div
                  key={m.title}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-transform duration-200 ease-out hover:-translate-y-0.5"
                >
                  <p className="font-medium text-ink">{m.title}</p>
                  <p className="mt-1 text-sm text-muted">{m.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <SectionTitle className="mb-3">What You&apos;ll Learn</SectionTitle>
            <ul className="space-y-2.5">
              {d.learn.map((l) => (
                <li key={l} className="flex gap-2.5 text-sm text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
                  {l}
                </li>
              ))}
            </ul>
          </Card>

          {d.related.length > 0 && (
            <Card>
              <SectionTitle className="mb-3">Jump Into the Tools</SectionTitle>
              <div className="flex flex-col gap-1">
                {d.related.map((r) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-ink transition-colors hover:bg-white/5"
                  >
                    {r.label}
                    <ArrowRight className="h-4 w-4 text-brass" />
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
