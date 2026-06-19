"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EnergyPoint } from "@/lib/types";

export function EnergyCurve({ data }: { data: EnergyPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="energyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C49B3D" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#C49B3D" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#D8CFC0" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: "#666666", fontSize: 12 }}
            stroke="#D8CFC0"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#666666", fontSize: 12 }}
            stroke="#D8CFC0"
          />
          <Tooltip
            contentStyle={{
              background: "#FFFFFF",
              border: "1px solid #D8CFC0",
              borderRadius: 10,
              fontSize: 13,
            }}
            labelStyle={{ color: "#1F1F1F", fontWeight: 600 }}
            formatter={(value: number) => [`${value}`, "Energy"]}
          />
          <Area
            type="monotone"
            dataKey="energy"
            stroke="#6D1F2A"
            strokeWidth={2.5}
            fill="url(#energyFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
