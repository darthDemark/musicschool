import { ImageBackdrop } from "@/components/ImageBackdrop";
import type { Discipline } from "@/lib/disciplines";

export function SectionHero({ discipline: d }: { discipline: Discipline }) {
  return (
    <ImageBackdrop
      src={d.image}
      className="rounded-xl2 border border-white/10"
      overlayClassName="bg-gradient-to-tr from-studio via-studio/80 to-studio/40"
      zoom={false}
    >
      <div className="flex min-h-[240px] flex-col justify-end p-8">
        <p className="label-caps mb-2 text-brass">{d.eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">{d.title}</h1>
        <p className="mt-3 max-w-xl text-[15px] text-muted">{d.tagline}</p>
      </div>
    </ImageBackdrop>
  );
}
