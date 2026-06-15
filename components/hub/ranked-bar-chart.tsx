"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMediaQuery } from "@/lib/hooks/use-media-query";

interface RankedBarChartProps {
  data: { label: string; horas: number }[];
  emptyMessage?: string;
  height?: number;
}

function shortLabel(label: string, max = 22) {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { label: string; horas: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="chart-tooltip px-3 py-2 backdrop-blur-sm">
      <p className="max-w-[200px] text-[11px] font-medium text-muted-foreground sm:text-xs">
        {item.label}
      </p>
      <p className="mt-0.5 text-base font-bold text-primary sm:text-lg">{item.horas}h</p>
    </div>
  );
}

export function RankedBarChart({
  data,
  emptyMessage = "Sem dados no período selecionado",
  height = 280,
}: RankedBarChartProps) {
  const isCompact = useMediaQuery("(max-width: 639px)");

  if (data.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/30"
        style={{ height }}
      >
        <p className="text-sm font-medium text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    short: shortLabel(d.label, isCompact ? 14 : 22),
  }));
  const maxHoras = Math.max(...chartData.map((d) => d.horas));
  const chartHeight = Math.max(height, chartData.length * (isCompact ? 36 : 42) + 40);

  return (
    <div className="w-full" style={{ height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 4,
            right: isCompact ? 8 : 16,
            left: isCompact ? 4 : 8,
            bottom: 4,
          }}
        >
          <defs>
            <linearGradient id="rankedBarGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff7744" />
              <stop offset="100%" stopColor="#ff5500" />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            horizontal={false}
            stroke="rgba(15,23,42,0.06)"
          />
          <XAxis
            type="number"
            tick={{ fontSize: isCompact ? 9 : 11, fill: "var(--ftime-muted)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="short"
            width={isCompact ? 72 : 110}
            tick={{ fontSize: isCompact ? 9 : 11, fill: "var(--ftime-muted)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,85,0,0.06)" }} />
          <Bar dataKey="horas" radius={[0, 6, 6, 0]} maxBarSize={isCompact ? 18 : 24}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.horas === maxHoras ? "url(#rankedBarGradient)" : "rgba(255,85,0,0.35)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
