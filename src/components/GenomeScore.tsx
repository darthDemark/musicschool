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
          <PolarGrid stroke="#D8CFC0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#666666", fontSize: 11 }}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#6D1F2A"
            strokeWidth={2}
            fill="#C49B3D"
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
