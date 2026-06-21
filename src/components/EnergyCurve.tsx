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
              <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.10)" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: "#A8A8A8", fontSize: 12 }}
            stroke="rgba(255,255,255,0.15)"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#A8A8A8", fontSize: 12 }}
            stroke="rgba(255,255,255,0.15)"
          />
          <Tooltip
            contentStyle={{
              background: "#0D0D0D",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 10,
              fontSize: 13,
            }}
            labelStyle={{ color: "#F5F5F0", fontWeight: 600 }}
            itemStyle={{ color: "#F5F5F0" }}
            formatter={(value: number) => [`${value}`, "Energy"]}
          />
          <Area
            type="monotone"
            dataKey="energy"
            stroke="#F0C36A"
            strokeWidth={2.5}
            fill="url(#energyFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
