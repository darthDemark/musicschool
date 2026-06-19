import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: "brass" | "burgundy" | "success" | "amber";
}

const accentMap: Record<NonNullable<StatCardProps["accent"]>, string> = {
  brass: "text-brass bg-brass/10 border-brass/20",
  burgundy: "text-burgundy bg-burgundy/10 border-burgundy/20",
  success: "text-success bg-success/10 border-success/20",
  amber: "text-amber bg-amber/10 border-amber/20",
};

export function StatCard({ label, value, icon: Icon, accent = "brass" }: StatCardProps) {
  return (
    <div className="card flex items-center gap-4 p-5">
      {Icon && (
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-lg border ${accentMap[accent]}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      )}
      <div>
        <p className="font-serif text-2xl text-ink">{value}</p>
        <p className="label-caps mt-0.5">{label}</p>
      </div>
    </div>
  );
}
