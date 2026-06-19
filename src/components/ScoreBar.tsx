interface ScoreBarProps {
  label: string;
  value: number; // 0-10
  max?: number;
}

export function ScoreBar({ label, value, max = 10 }: ScoreBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-sm text-ink">{label}</span>
        <span className="font-serif text-sm text-burgundy">{value.toFixed(1)}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-sand">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brass to-burgundy transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
