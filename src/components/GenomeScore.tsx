"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { GenomeScore as GenomeScoreType } from "@/lib/types";

export function GenomeRadar({ scores }: { scores: GenomeScoreType[] }) {
  const data = scores.map((s) => ({
    subject: s.label,
    value: s.value,
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="rgba(255,255,255,0.12)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#A8A8A8", fontSize: 11 }}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#F0C36A"
            strokeWidth={2}
            fill="#D4AF37"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
